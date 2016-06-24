sucrose.models.baseChart = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = null,
      height = null,
      showLegend = true,
      showTitle = false;

  var base = sucrose.models.base();

  //============================================================

  function chart(selection) {

    selection.each(function(chartData) {

      var data = chartData.data,
          properties = chartData.properties,
          container = d3.select(this),
          that = this,
          availableWidth = (width || parseInt(container.style('width'), 10) || 960) - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height'), 10) || 400) - margin.top - margin.bottom;

      //------------------------------------------------------------
      // Title

      chart.renderTitle = function(properties) {

        var titleBBox = {width: 0, height: 0};
        var titleWrap = container.selectAll('.sc-titleWrap').data([properties.title]);
        titleWrap.enter()
          .append('g').attr('class', 'sc-titleWrap')
          .append('text').attr('class', 'sc-title');

        titleWrap.exit().select('.sc-title').remove();

        if (showTitle && properties.title) {
          titleWrap
            .select('.sc-title')
              .attr('x', chart.direction() === 'rtl' ? availableWidth : 0)
              .attr('y', 0)
              .attr('dy', '.75em')
              .attr('text-anchor', 'start')
              .text(sucrose.identity)
              .attr('stroke', 'none')
              .attr('fill', 'black');

          titleBBox = sucrose.utils.getTextBBox(titleWrap.select('.sc-title'));
        }

        return titleBBox;
      };


      //------------------------------------------------------------
      // Display No Data message if there's nothing to show.

      chart.displayNoData = function(d) {
        if (d && d.length && d.filter(function(d) { return d.values ? d.values.length : true; }).length) {
          container.selectAll('.sc-noData').remove();
          return false;
        }

        container.select('.sucrose.sc-wrap').remove();

        var w = width || parseInt(container.style('width'), 10) || 960,
            h = height || parseInt(container.style('height'), 10) || 400,
            noDataText = container.selectAll('.sc-noData').data([chart.strings().noData]);

        noDataText.enter().append('text')
          .attr('class', 'sucrose sc-noData')
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle');

        noDataText
          .attr('x', margin.left + w / 2)
          .attr('y', margin.top + h / 2)
          .text(function(d) {
            return d;
          });

        return true;
      }


    });

    return chart;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  d3.rebind(chart, base, 'direction', 'id', 'locality', 'strings', 'classes', 'color', 'fill', 'gradient');

  chart.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) {
      return margin;
    }
    for (var prop in _) {
      if (_.hasOwnProperty(prop)) {
        margin[prop] = _[prop];
      }
    }
    return chart;
  };

  chart.showTitle = function(_) {
    if (!arguments.length) {
      return showTitle;
    }
    showTitle = _;
    return chart;
  };

  chart.showLegend = function(_) {
    if (!arguments.length) {
      return showLegend;
    }
    showLegend = _;
    return chart;
  };

  //============================================================

  return chart;
};
