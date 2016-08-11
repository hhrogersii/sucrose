sucrose.models.gaugeChart = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var x,
      y, //can be accessed via chart.yScale()
      dispatch = d3.dispatch('chartClick');

  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var base = sucrose.models.baseChart();
  var gauge = sucrose.models.gauge();

  base.tooltipContent(function(eo, graph) {
    var y = gauge.valueFormat()((eo.point.y1 - eo.point.y0)),
        x = eo.point.key;
    return '<h3>' + x + '</h3>' +
           '<p>' + y + '</p>';
  });

  //============================================================

  function chart(selection) {

    selection.each(function(chartData) {

      var that = this,
          container = d3.select(this);

      var properties = chartData ? chartData.properties : {},
          data = chartData ? chartData.data : null;

      var margin = chart.margin(),
          renderWidth = chart.width() || parseInt(container.style('width'), 10) || 960,
          renderHeight = chart.height() || parseInt(container.style('height'), 10) || 400,
          availableWidth = renderWidth - margin.left - margin.right,
          availableHeight = renderHeight - margin.top - margin.bottom,
          innerWidth = availableWidth,
          innerHeight = availableHeight,
          innerMargin = {top: 0, right: 0, bottom: 0, left: 0};

      chart.update = function() {
        container.transition().call(chart);
      };

      chart.container = this;

      //------------------------------------------------------------
      // Process data
      // add series index to each data point for reference

      data.map(function(d, i) {
        d.series = i;
      });

      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('.sc-wrap.sc-gaugeChart').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'sc-wrap sc-gaugeChart');
      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      container.call(base);

      // Check to see if there's nothing to show.
      if (base.displayNoData(data, container)) {
        return chart;
      }

      var background = base.renderBackground(gEnter, wrap);
      var titleWrap = base.renderTitle(gEnter, wrap);

      gEnter.append('g').attr('class', 'sc-gaugeWrap');
      var gaugeWrap = wrap.select('.sc-gaugeWrap');

      var legendWrap = base.renderLegend(gEnter, wrap, data, 'center', innerWidth, innerHeight);

      // recalculate top inner margin based on header elements
      innerMargin.top = base.arrangeHeader();
      innerHeight = availableHeight - innerMargin.top - innerMargin.bottom;

      //------------------------------------------------------------
      // Main Chart Component(s)

      gauge
        .width(innerWidth)
        .height(innerHeight);

      gaugeWrap
        .datum(chartData)
        .attr('transform', 'translate(' + innerMargin.left + ',' + innerMargin.top + ')')
        .transition()
          .call(gauge);

      //gauge.setPointer(properties.value);

      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      dispatch.on('chartClick', function() {
        if (base.legend.enabled()) {
          base.legend.dispatch.closeMenu();
        }
      });

      gauge.dispatch.on('elementMouseover.tooltip', function(eo) {
        base.dispatch.tooltipShow(eo, that.parentNode);
      });

      gauge.dispatch.on('elementMousemove.tooltip', function(e) {
        base.dispatch.tooltipMove(e, that.parentNode);
      });

      gauge.dispatch.on('elementMouseout.tooltip', function() {
        base.dispatch.tooltipHide();
      });

    });

    return chart;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.gauge = gauge;
  chart.legend = base.legend;

  d3.rebind(chart, base, 'showTitle', 'showLegend', 'tooltips', 'tooltipContent', 'id', 'direction', 'locality', 'strings', 'classes', 'color', 'fill', 'gradient', 'margin', 'width', 'height');
  d3.rebind(chart, gauge, 'x', 'y', 'valueFormat', 'values', 'showLabels', 'showPointer', 'setPointer', 'ringWidth', 'labelThreshold', 'maxValue', 'minValue', 'transitionMs');

  chart.colorData = function(_) {
    var type = arguments[0],
        params = arguments[1] || {};
    var color = function(d, i) {
          return sucrose.utils.defaultColor()(d, d.series);
        };
    var classes = function(d, i) {
          return 'sc-arc-path sc-series-' + d.series;
        };

    switch (type) {
      case 'graduated':
        color = function(d, i) {
          return d3.interpolateHsl(d3.rgb(params.c1), d3.rgb(params.c2))(d.series / params.l);
        };
        break;
      case 'class':
        color = function() {
          return 'inherit';
        };
        classes = function(d, i) {
          var iClass = (d.series * (params.step || 1)) % 14;
          iClass = (iClass > 9 ? '' : '0') + iClass;
          return 'sc-arc-path sc-series-' + d.series + ' sc-fill' + iClass;
        };
        break;
      case 'data':
        color = function(d, i) {
          return d.classes ? 'inherit' : d.color || sucrose.utils.defaultColor()(d, d.series);
        };
        classes = function(d, i) {
          return 'sc-arc-path sc-series-' + d.series + (d.classes ? ' ' + d.classes : '');
        };
        break;
    }

    var fill = (!params.gradient) ? color : function(d, i) {
      return chart.gradient(d, d.series);
    };

    chart.color(color);
    chart.fill(fill);
    chart.classes(classes);

    chart.legend.color(color);
    chart.legend.classes(classes);

    return chart;
  };

  //============================================================

  return chart;
};
