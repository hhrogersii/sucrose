
sucrose.models.gauge = function() {
  /* original inspiration for this chart type is at http://bl.ocks.org/3202712 */
  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var clipEdge = true
    , getValues = function(d) { return d.values; }
    , getX = function(d) { return d.key; }
    , getY = function(d) { return d.y; }
    , labelFormat = d3.format(',g')
    , valueFormat = d3.format(',.f')
    , showLabels = true
    , showPointer = true
    , dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout', 'elementMousemove')
  ;

  var ringWidth = 50
    , pointerWidth = 5
    , pointerTailLength = 5
    , pointerHeadLength = 90
    , minValue = 0
    , maxValue = 10
    , minAngle = -90
    , maxAngle = 90
    , transitionMs = 750
    , labelInset = 10
  ;

  var base = sucrose.models.base();


  //============================================================

  //colorScale = d3.scale.linear().domain([0, .5, 1].map(d3.interpolate(min, max))).range(["green", "yellow", "red"]);

  function chart(selection)
  {
    selection.each(

    function(chartData) {

      var properties = chartData.properties
        , data = chartData.data;

        var availableWidth = chart.width() - chart.margin().left - chart.margin().right
          , availableHeight = chart.height() - chart.margin().top - chart.margin().bottom
          , radius =  Math.min( (availableWidth/2), availableHeight ) / (  (100+labelInset)/100  )
          , container = d3.select(this)
          , range = maxAngle - minAngle
          , scale = d3.scale.linear().range([0,1]).domain([minValue, maxValue])
          , previousTick = 0
          , arcData = data.map( function(d,i){
              var rtn = {
                  key:d.key
                , series:d.series
                , y0:previousTick
                , y1:d.y
                , color:d.color
                , classes:d.classes
              };
              previousTick = d.y;
              return rtn;
            })
          , labelData = [0].concat( data.map( function(d){ return d.y; } ) )
          , prop = function(d){ return d*radius/100; }
          , pointerValue = properties.values[0].t
          ;

        //------------------------------------------------------------
        // Setup containers and skeleton of chart

        var wrap = container.selectAll('g.sc-wrap.sc-gauge').data([data]);
        var wrapEnter = wrap.enter().append('g').attr('class','sucrose sc-wrap sc-gauge');
        var defsEnter = wrapEnter.append('defs');
        var gEnter = wrapEnter.append('g');
        var g = wrap.select('g');

        //set up the color and gradient constructor functions
        base
          .color(function (d, i) { return sucrose.utils.defaultColor()(d, d.series); })
          .classes(function (d,i) { return 'sc-arc-path sc-series-' + d.series; })
          .gradient(function(d,i) {
            return sucrose.utils.colorRadialGradient( d, id+'-'+i, {x:0, y:0, r:radius, s:ringWidth/100, u:'userSpaceOnUse'}, color(d,i), wrap.select('defs') );
          });

        gEnter.append('g').attr('class', 'sc-arc-group');
        gEnter.append('g').attr('class', 'sc-labels');
        gEnter.append('g').attr('class', 'sc-pointer');
        gEnter.append('g').attr('class', 'sc-odometer');

        wrap.attr('transform', 'translate('+ (chart.margin().left/2 + chart.margin().right/2 + prop(labelInset)) +','+ (chart.margin().top + prop(labelInset)) +')');
        //g.select('.sc-arc-gauge').attr('transform', 'translate('+ availableWidth/2 +','+ availableHeight/2 +')');

        //------------------------------------------------------------

        // defsEnter.append('clipPath')
        //     .attr('id', 'sc-edge-clip-' + id)
        //   .append('rect');
        // wrap.select('#sc-edge-clip-' + id + ' rect')
        //     .attr('width', availableWidth)
        //     .attr('height', availableHeight);
        // g.attr('clip-path', clipEdge ? 'url(#sc-edge-clip-' + id + ')' : '');

        //------------------------------------------------------------
        // Gauge arcs
        var arc = d3.svg.arc()
          .innerRadius( prop(ringWidth) )
          .outerRadius( radius )
          .startAngle(function(d, i) {
            return deg2rad( newAngle(d.y0) );
          })
          .endAngle(function(d, i) {
            return deg2rad( newAngle(d.y1) );
          });

        var ag = g.select('.sc-arc-group')
            .attr('transform', centerTx);

        ag.selectAll('.sc-arc-path')
            .data(arcData)
          .enter().append('path')
            .attr('class', 'sc-arc-path')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 3)
            .attr('d', arc)
            .on('mouseover', function(d, i) {
              d3.select(this).classed('hover', true);
              dispatch.elementMouseover({
                  point: d,
                  pointIndex: i,
                  e: d3.event,
                  id: chart.id()
              });
            })
            .on('mouseout', function(d, i) {
              d3.select(this).classed('hover', false);
              dispatch.elementMouseout({
                  point: d,
                  index: i,
                  id: chart.id()
              });
            })
            .on('mousemove', function(d, i) {
              dispatch.elementMousemove(d3.event);
            })
            .on('click', function(d, i) {
              dispatch.elementClick({
                  point: d,
                  index: i,
                  e: d3.event,
                  id: chart.id()
              });
              d3.event.stopPropagation();
            })
            .on('dblclick', function(d, i) {
              dispatch.elementDblClick({
                  point: d,
                  index: i,
                  e: d3.event,
                  id: chart.id()
              });
              d3.event.stopPropagation();
            });

        ag.selectAll('.sc-arc-path').transition().duration(10)
            .attr('class', chart.classes())
            .attr('fill', chart.fill())
            .attr('d', arc);

        //------------------------------------------------------------
        // Gauge labels
        var lg = g.select('.sc-labels')
            .attr('transform', centerTx);

        lg.selectAll('text').transition().duration(0)
            .attr('transform', function(d) {
              return 'rotate('+ newAngle(d) +') translate(0,'+ (-radius-prop(1.5)) +')';
            })
            .style('font-size', prop(0.6)+'em');

        lg.selectAll('text')
            .data(labelData)
          .enter().append('text')
            .attr('transform', function(d) {
              return 'rotate('+ newAngle(d) +') translate(0,'+ (-radius-prop(1.5)) +')';
            })
            .text(labelFormat)
            .style('text-anchor', 'middle')
            .style('font-size', prop(0.6)+'em');

        if (showPointer) {
          //------------------------------------------------------------
          // Gauge pointer
          var pointerData = [
                [ Math.round(prop(pointerWidth)/2),    0 ],
                [ 0, -Math.round(prop(pointerHeadLength))],
                [ -(Math.round(prop(pointerWidth)/2)), 0 ],
                [ 0, Math.round(prop(pointerWidth)) ],
                [ Math.round(prop(pointerWidth)/2),    0 ]
              ];

          var pg = g.select('.sc-pointer')
              .attr('transform', centerTx);

          pg.selectAll('path').transition().duration(120)
            .attr('d', d3.svg.line().interpolate('monotone'));

          var pointer = pg.selectAll('path')
              .data([pointerData])
            .enter().append('path')
              .attr('d', d3.svg.line().interpolate('monotone')/*function(d) { return pointerLine(d) +'Z';}*/ )
              .attr('transform', 'rotate('+ minAngle +')');

          setGaugePointer(pointerValue);

          //------------------------------------------------------------
          // Odometer readout
          g.selectAll('.sc-odom').remove();

          g.select('.sc-odomText').transition().duration(0)
              .style('font-size', prop(0.7)+'em');

          g.select('.sc-odometer')
            .append('text')
              .attr('class', 'sc-odom sc-odomText')
              .attr('x', 0)
              .attr('y', 0 )
              .attr('text-anchor', 'middle')
              .text( valueFormat(pointerValue) )
              .style('stroke', 'none')
              .style('fill', 'black')
              .style('font-size', prop(0.7)+'em')
            ;

          var bbox = g.select('.sc-odomText').node().getBoundingClientRect();

          g.select('.sc-odometer')
            .insert('path','.sc-odomText')
            .attr('class', 'sc-odom sc-odomBox')
            .attr("d",
              sucrose.utils.roundedRectangle(
                -bbox.width/2, -bbox.height+prop(1.5), bbox.width+prop(4), bbox.height+prop(2), prop(2)
              )
            )
            .attr('fill', '#eeffff')
            .attr('stroke','black')
            .attr('stroke-width','2px')
            .attr('opacity',0.8)
          ;

          g.select('.sc-odometer')
              .attr('transform', 'translate('+ radius +','+ ( chart.margin().top + prop(70) + bbox.width ) +')');

        } else {
          g.select('.sc-odometer').select('.sc-odomText').remove();
          g.select('.sc-odometer').select('.sc-odomBox').remove();
          g.select('.sc-pointer').selectAll('path').remove();
        }

        //------------------------------------------------------------
        // private functions
        function setGaugePointer(d) {
          pointer.transition()
            .duration(transitionMs)
            .ease('elastic')
            .attr('transform', 'rotate('+ newAngle(d) +')');
        }

        function deg2rad(deg) {
          return deg * Math.PI/180;
        }

        function newAngle(d) {
          return minAngle + ( scale(d) * range );
        }

        // Center translation
        function centerTx() {
          return 'translate('+ radius +','+ radius +')';
        }

        chart.setGaugePointer = setGaugePointer;

      }

    );

    return chart;
  }


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = dispatch;

  d3.rebind(chart, base, 'direction', 'id', 'locality', 'strings', 'classes', 'color', 'fill', 'gradient', 'margin', 'width', 'height');

  chart.values = function(_) {
    if (!arguments.length) return getValues;
    getValues = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return getX;
    getX = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return getY;
    getY = d3.functor(_);
    return chart;
  };

  chart.showLabels = function(_) {
    if (!arguments.length) return showLabels;
    showLabels = _;
    return chart;
  };

  chart.valueFormat = function(_) {
    if (!arguments.length) return valueFormat;
    valueFormat = _;
    return chart;
  };

  chart.labelThreshold = function(_) {
    if (!arguments.length) return labelThreshold;
    labelThreshold = _;
    return chart;
  };

  // GAUGE
  chart.ringWidth = function(_) {
    if (!arguments.length) return ringWidth;
    ringWidth = _;
    return chart;
  };
  chart.pointerWidth = function(_) {
    if (!arguments.length) return pointerWidth;
    pointerWidth = _;
    return chart;
  };
  chart.pointerTailLength = function(_) {
    if (!arguments.length) return pointerTailLength;
    pointerTailLength = _;
    return chart;
  };
  chart.pointerHeadLength = function(_) {
    if (!arguments.length) return pointerHeadLength;
    pointerHeadLength = _;
    return chart;
  };
  chart.minValue = function(_) {
    if (!arguments.length) return minValue;
    minValue = _;
    return chart;
  };
  chart.maxValue = function(_) {
    if (!arguments.length) return maxValue;
    maxValue = _;
    return chart;
  };
  chart.minAngle = function(_) {
    if (!arguments.length) return minAngle;
    minAngle = _;
    return chart;
  };
  chart.maxAngle = function(_) {
    if (!arguments.length) return maxAngle;
    maxAngle = _;
    return chart;
  };
  chart.transitionMs = function(_) {
    if (!arguments.length) return transitionMs;
    transitionMs = _;
    return chart;
  };
  chart.labelFormat = function(_) {
    if (!arguments.length) return labelFormat;
    labelFormat = _;
    return chart;
  };
  chart.labelInset = function(_) {
    if (!arguments.length) return labelInset;
    labelInset = _;
    return chart;
  };
  chart.setPointer = function(_) {
    if (!arguments.length) return chart.setGaugePointer;
    chart.setGaugePointer(_);
    return chart;
  };
  chart.isRendered = function(_) {
    return (svg !== undefined);
  };
  chart.showPointer = function(_) {
    if (!arguments.length) return showPointer;
    showPointer = _;
    return chart;
  };

  //============================================================

  return chart;
}
