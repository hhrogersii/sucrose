import d3 from 'd3v4';
import fc from 'd3fc-rebind';
import utility from '../utility.js';
import scatter from './scatter.js';

export default function line() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var model = scatter();

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 960,
      height = 500,
      getX = function(d) { return d.x; }, // accessor to get the x value from a data point
      getY = function(d) { return d.y; }, // accessor to get the y value from a data point
      x, //can be accessed via chart.xScale()
      y, //can be accessed via chart.yScale()
      defined = function(d, i) { return !isNaN(getY(d, i)) && getY(d, i) !== null; }, // allows a line to be not continuous when it is not defined
      isArea = function(d) { return (d && d.area) || false; }, // decides if a line is an area or just a line
      interpolate = 'linear', // controls the line interpolation
      clipEdge = false, // if true, masks lines within x and y scale
      delay = 0, // transition
      duration = 300, // transition
      color = function(d, i) { return utility.defaultColor()(d, d.seriesIndex); },
      gradient = null,
      fill = color,
      classes = function(d, i) { return 'sc-series sc-series-' + d.seriesIndex; };


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  // var x0, y0; //used to store previous scales

  //============================================================

  function chart(selection) {
    selection.each(function(data) {

      var container = d3.select(this);

      var availableWidth = width - margin.left - margin.right,
          availableHeight = height - margin.top - margin.bottom;

      var curve =
            interpolate === 'linear' ? d3.curveLinear :
            interpolate === 'cardinal' ? d3.curveCardinal :
            interpolate === 'monotone' ? d3.curveMonotoneX :
            interpolate === 'basis' ? d3.curveBasis : d3.curveNatural;

      var area = d3.area()
            .curve(curve)
            .defined(defined)
            .x(function(d, i) { return x(getX(d, i)); })
            .y0(function(d, i) { return y(getY(d, i)); })
            .y1(function(d, i) { return y(y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0]); });

      var zero = d3.area()
            .curve(curve)
            .defined(defined)
            .x(function(d, i) { return x(getX(d, i)); })
            .y0(function(d, i) { return y(0); })
            .y1(function(d, i) { return y(y.domain()[0] <= 0 ? y.domain()[1] >= 0 ? 0 : y.domain()[1] : y.domain()[0]); });

      var tran = d3.transition('scatter')
            .duration(duration)
            .ease(d3.easeLinear);

      var id = model.id();

      //set up the gradient constructor function
      gradient = function(d, i, p) {
        return utility.colorLinearGradient(d, chart.id() + '-' + i, p, color(d, i), wrap.select('defs'));
      };

      //------------------------------------------------------------
      // Setup Scales

      x = model.xScale();
      y = model.yScale();
      // x0 = x.copy();
      // y0 = y.copy();

      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap_bind = container.selectAll('g.sc-wrap.sc-line').data([data]);
      var wrap_entr = wrap_bind.enter().append('g').attr('class', 'sc-wrap sc-line');
      var wrap = container.select('.sc-wrap.sc-line').merge(wrap_entr);

      var defs_entr = wrap_entr.append('defs');

      wrap_entr.append('g').attr('class', 'sc-group');
      var group_wrap = wrap.select('.sc-group');

      wrap_entr.append('g').attr('class', 'sc-scatter-wrap');
      var scatter_wrap = wrap.select('.sc-scatter-wrap');

      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      //------------------------------------------------------------

      defs_entr.append('clipPath').attr('id', 'sc-edge-clip-' + id)
        .append('rect');

      wrap.select('#sc-edge-clip-' + id + ' rect')
        .attr('width', availableWidth)
        .attr('height', availableHeight);

      wrap.attr('clip-path', clipEdge ? 'url(#sc-edge-clip-' + id + ')' : '');
      scatter_wrap.attr('clip-path', clipEdge ? 'url(#sc-edge-clip-' + id + ')' : '');

      //------------------------------------------------------------
      // Series

      var series_bind = group_wrap.selectAll('g.sc-series').data(data, function(d) { return d.seriesIndex; });
      var series_entr = series_bind.enter().append('g')
            .attr('class', 'sc-series')
            .style('stroke-opacity', 1e-6)
            .style('fill-opacity', 1e-6);
      var series = group_wrap.selectAll('.sc-series').merge(series_entr);

      series
        .classed('hover', function(d) { return d.hover; })
        .attr('class', classes)
        .attr('fill', color)
        .attr('stroke', color);
      series
        .transition(tran)
          .style('stroke-opacity', 1)
          .style('fill-opacity', 0.5);
      series_bind.exit()
        .transition(tran)
          .style('stroke-opacity', 1e-6)
          .style('fill-opacity', 1e-6)
          .remove();

      //------------------------------------------------------------
      // Points

      model
        .clipEdge(clipEdge)
        .width(availableWidth)
        .height(availableHeight);
      scatter_wrap.call(model);

      //------------------------------------------------------------
      // Areas

      var areas_bind = series.selectAll('path.sc-area').data(function(d) { return isArea(d) ? [d] : []; }); // this is done differently than lines because I need to check if series is an area
      var areas_entr = areas_bind.enter().append('path').attr('class', 'sc-area sc-enter');
      var areas = series.selectAll('.sc-area').merge(areas_entr);

      areas
        .filter(function(d) {
          return d3.select(this).classed('sc-enter');
        })
        .attr('d', function(d) {
          return zero.apply(this, [d.values]);
        });

      areas
        .transition(tran)
          .attr('d', function(d) {
            return area.apply(this, [d.values]);
          })
          .on('end', function(d) {
            d3.select(this).classed('sc-enter', false);
          });

      // we need this exit remove call here to support
      // toggle between lines and areas
      areas_bind.exit().remove();

      series_bind.exit()
        .transition(tran).selectAll('.sc-area')
          .attr('d', function(d) {
            return zero.apply(this, [d.values]);
          })
          .remove();

      //------------------------------------------------------------
      // Lines

      function lineData(d) {
        // if there are no values, return null
        if (!d.values || !d.values.length) {
          return [null];
        }
        // if there is more than one point, return all values
        if (d.values.length > 1) {
          return [d.values];
        }
        // if there is only one single point in data array
        // extend it horizontally in both directions
        var values = x.domain().map(function(x, i) {
            // if data point is array, then it should be returned as an array
            // the getX and getY methods handle the internal mechanics of positioning
            if (Array.isArray(d.values[0])) {
              return [x, d.values[0][1]];
            } else {
              // sometimes the line data point is an object
              // so the values should be returned as an array of objects
              var newValue = JSON.parse(JSON.stringify(d.values[0]));
              newValue.x = x;
              return newValue;
            }
          });
        return [values];
      }

      var lines_bind = series.selectAll('path.sc-line')
            .data(lineData, function(d) { return d.seriesIndex; });
      var lines_entr = lines_bind.enter().append('path')
            .attr('class', 'sc-line sc-enter');
      var lines = series.selectAll('.sc-line').merge(lines_entr);

      lines
        .filter(function(d) {
          return d3.select(this).classed('sc-enter');
        })
        .attr('d',
          d3.line()
            .curve(curve)
            .defined(defined)
            .x(function(d, i) { return x(getX(d, i)); })
            .y(function(d, i) { return y(0); })
        );
      lines
        .transition(tran)
          .attr('d',
            d3.line()
              .curve(curve)
              .defined(defined)
              .x(function(d, i) { return x(getX(d, i)); })
              .y(function(d, i) { return y(getY(d, i)); })
          )
          .on('end', function(d) {
            d3.select(this).classed('sc-enter', false);
          });
      series_bind.exit()
        .transition(tran).selectAll('.sc-line')
          .attr('d',
            d3.line()
              .curve(curve)
              .defined(defined)
              .x(function(d, i) { return x(getX(d, i)); })
              .y(function(d, i) { return y(0); })
          )
          .remove();

      //store old scales for use in transitions on update
      // x0 = x.copy();
      // y0 = y.copy();
    });

    return chart;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = model.dispatch;
  chart.scatter = model;

  fc.rebind(chart, model, 'id', 'interactive', 'size', 'xScale', 'yScale', 'zScale', 'xDomain', 'yDomain', 'sizeDomain', 'sizeRange', 'forceX', 'forceY', 'forceSize', 'useVoronoi', 'clipVoronoi', 'clipRadius', 'padData', 'padDataOuter', 'singlePoint', 'nice', 'locality');

  chart.color = function(_) {
    if (!arguments.length) { return color; }
    color = _;
    model.color(color);
    return chart;
  };
  chart.fill = function(_) {
    if (!arguments.length) { return fill; }
    fill = _;
    model.fill(fill);
    return chart;
  };
  chart.classes = function(_) {
    if (!arguments.length) { return classes; }
    classes = _;
    model.classes(classes);
    return chart;
  };
  chart.gradient = function(_) {
    if (!arguments.length) { return gradient; }
    gradient = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) { return margin; }
    for (var prop in _) {
      if (_.hasOwnProperty(prop)) {
        margin[prop] = _[prop];
      }
    }
    return chart;
  };
  chart.width = function(_) {
    if (!arguments.length) { return width; }
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) { return height; }
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) { return getX; }
    getX = _;
    model.x(_);
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) { return getY; }
    getY = _;
    model.y(_);
    return chart;
  };

  chart.delay = function(_) {
    if (!arguments.length) { return delay; }
    delay = _;
    return chart;
  };
  chart.duration = function(_) {
    if (!arguments.length) { return duration; }
    duration = _;
    model.duration(_);
    return chart;
  };

  chart.clipEdge = function(_) {
    if (!arguments.length) { return clipEdge; }
    clipEdge = _;
    return chart;
  };

  chart.interpolate = function(_) {
    if (!arguments.length) { return interpolate; }
    interpolate = _;
    return chart;
  };

  chart.defined = function(_) {
    if (!arguments.length) { return defined; }
    defined = _;
    return chart;
  };

  chart.isArea = function(_) {
    if (!arguments.length) { return isArea; }
    isArea = utility.functor(_);
    return chart;
  };

  //============================================================

  return chart;
}
