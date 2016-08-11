sucrose.models.baseChart = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = null,
      height = null,
      showLegend = true,
      showControls = false,
      showTitle = false,
      tooltip = null,
      tooltips = true,
      tooltipContent = function(d) { return ''; },
      dispatch = d3.dispatch('tooltipShow', 'tooltipMove', 'tooltipHide');

  var base = sucrose.models.base();
  var controls = sucrose.models.legend().color(['#444']);
  var legend = sucrose.models.legend();

  var showTooltip = function(eo, offsetElement) {
    var content = tooltipContent(eo, chart);
    tooltip = sucrose.tooltip.show(eo.e, content, null, null, offsetElement);
  };


  //============================================================

  function chart(selection) {

    selection.each(function(chartData) {

      var data = chartData.data,
          properties = chartData.properties,
          container = d3.select(this),
          that = this;

      var availableWidth = (width || parseInt(container.style('width'), 10) || 960) - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height'), 10) || 400) - margin.top - margin.bottom;

      var wrap = container.select('.sc-wrap').data([data]);
      var gEnter = wrap.enter();

      // Header variables
      var titleWrap,
          titleBBox,
          controlsWrap,
          controlsLinkBBox,
          legendWrap,
          legendLinkBBox,
          widthRatio = 0,
          maxControlsWidth = 0,
          maxLegendWidth = 0,
          headerHeight = 0,
          titleBBox = {width: 0, height: 0},
          controlsHeight = 0,
          legendHeight = 0,
          trans = '';

      //------------------------------------------------------------
      // Backgrond

      chart.renderBackground = function(gEnter, wrap) {
        var backgrond;

        gEnter.append('rect').attr('class', 'sc-background')
          .attr('x', -margin.left)
          .attr('y', 0)
          .attr('fill', '#9df');

        background = wrap.select('.sc-background')
          .attr('width', availableWidth + margin.left + margin.right)
          .attr('height', availableHeight + margin.bottom);

        return background;
      };

      chart.arrangeHeader = function() {
        var xpos, ypos;
        // calculate proportional available space
        widthRatio = availableWidth / (maxControlsWidth + maxLegendWidth);
        maxControlsWidth = Math.floor(maxControlsWidth * widthRatio);
        maxLegendWidth = Math.floor(maxLegendWidth * widthRatio);

        if (showTitle) {
          var titleText = titleWrap.select('.sc-title').text();
          var titleOffset = sucrose.utils.getFontMetrics(titleText, wrap, 'sc-title').hanging;
          titleWrap
            .attr('transform', 'translate(0,' + titleOffset + ')');
        }

        if (showControls) {
          controls
            .arrange(maxControlsWidth);
          maxLegendWidth = availableWidth - controls.width();
        }
        if (showLegend) {
          legend
            .arrange(maxLegendWidth);
          maxControlsWidth = availableWidth - legend.width();
        }

        if (showControls) {
          xpos = chart.direction() === 'rtl' ? availableWidth - controls.width() : 0;
          ypos = showTitle ? titleBBox.height : - controls.margin().top;
          controlsWrap
            .attr('transform', 'translate(' + xpos + ',' + ypos + ')');
          controlsHeight = controls.height() - (showTitle ? 0 : controls.margin().top);
        }

        if (showLegend) {
          var legendLinkBBox = sucrose.utils.getTextBBox(legendWrap.select('.sc-legend-link')),
              legendSpace = availableWidth - titleBBox.width - 6,
              legendTop = showTitle && !showControls && legend.collapsed() && legendSpace > legendLinkBBox.width ? true : false;
          xpos = legend.align() === 'center' || chart.direction() === 'rtl' ? 0 : availableWidth - legend.width();
          if (legendTop) {
            var legendLinkText = legendWrap.select('.sc-legend-link').text(),
                legendLinkOffset = sucrose.utils.getFontMetrics(legendLinkText, container, '.sc-legend-link').central;
            ypos = titleOffset - legend.height() / 2 + legendLinkOffset;
          } else if (!showTitle) {
            ypos = titleBBox.height - legend.margin().top;
          } else {
            ypos = titleBBox.height;
          }

          legendWrap
            .attr('transform', 'translate(' + xpos + ',' + ypos + ')');
          legendHeight = legendTop ? 12 : legend.height() - (showTitle ? 0 : legend.margin().top);
        }

        // Recalc inner margins based on legend and control height
        headerHeight = titleBBox.height + Math.max(controlsHeight, legendHeight);

        // innerHeight = availableHeight - headerHeight - innerMargin.top - innerMargin.bottom;
        return headerHeight;
      };

      //------------------------------------------------------------
      // Title

      chart.renderTitle = function(enter, wrap) {
        enter.append('g').attr('class', 'sc-titleWrap');
        titleWrap = wrap.select('.sc-titleWrap');

        var title = titleWrap.selectAll('.sc-title').data([properties.title]);
        title.enter().append('text').attr('class', 'sc-title');
        title.exit().select('.sc-title').remove();

        if (showTitle && properties.title) {
          title
            .attr('x', chart.direction() === 'rtl' ? availableWidth : 0)
            .attr('y', 0)
            .attr('text-anchor', 'start')
            .text(sucrose.identity)
            .attr('stroke', 'none')
            .attr('fill', 'black');
        }

        titleBBox = sucrose.utils.getTextBBox(title);
        // innerMargin.top += titleBBox.height + 12;
        innerHeight -= titleBBox.height;
        return titleWrap;
      };

      chart.bboxTitle = function() {
        return titleBBox;
      };

      //------------------------------------------------------------
      // Controls

      chart.renderControls = function(enter, wrap, data, align, width, height) {
        if (!chart.showControls()) {
          return null;
        }

        // if (multibar.barColor()) {
        //   data.forEach(function(series, i) {
        //     series.color = d3.rgb('#ccc').darker(i * 1.5).toString();
        //   });
        // }

        enter.append('g').attr('class', 'sc-controlsWrap');
        controlsWrap = wrap.select('.sc-controlsWrap');

        controls
          .id('controls_' + chart.id())
          .align(align || 'left')
          .strings(chart.strings().controls)
          .height(height);
        controlsWrap
          .datum(data)
          .call(controls);
        controls
          .arrange(width);

        controlsLinkBBox = sucrose.utils.getTextBBox(wrap.selectAll('.sc-legend-link'));
        maxControlsWidth = controls.calculateWidth();

        return controlsWrap;
      };

      //------------------------------------------------------------
      // Legend

      chart.renderLegend = function(enter, wrap, data, align, width, height) {
        if (!chart.showLegend()) {
          return;
        }

        // if (multibar.barColor()) {
        //   data.forEach(function(series, i) {
        //     series.color = d3.rgb('#ccc').darker(i * 1.5).toString();
        //   });
        // }

        enter.append('g').attr('class', 'sc-legendWrap');
        legendWrap = wrap.select('.sc-legendWrap');

        legend
          .id('legend_' + chart.id())
          .align(align || 'right')
          .strings(chart.strings().legend)
          .height(height);
        legendWrap
          .datum(data)
          .call(legend);
        legend
          .arrange(width);

        legendLinkBBox = sucrose.utils.getTextBBox(wrap.selectAll('.sc-legend-link'));
        maxLegendWidth = legend.calculateWidth();

        return legendWrap;
      };

      //------------------------------------------------------------
      // Display No Data message if there's nothing to show.

      chart.displayNoData = function(d, container) {
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


      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      dispatch.on('tooltipShow', function(eo, parent) {
        if (chart.tooltips()) {
          chart.showTooltip(eo, parent);
        }
      });

      dispatch.on('tooltipMove', function(e, parent) {
        if (tooltip) {
          sucrose.tooltip.position(parent, tooltip, e);
        }
      });

      dispatch.on('tooltipHide', function() {
        if (chart.tooltips()) {
          sucrose.tooltip.cleanup();
        }
      });

    });

    return chart;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  chart.dispatch = dispatch;
  chart.legend = legend;
  chart.controls = controls;
  chart.showTooltip = showTooltip;
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

  chart.showControls = function(_) {
    if (!arguments.length) {
      return showControls;
    }
    showControls = _;
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) {
      return tooltips;
    }
    tooltips = _;
    return chart;
  };

  chart.tooltipContent = function(_) {
    if (!arguments.length) {
      return tooltipContent;
    }
    tooltipContent = _;
    return chart;
  };

  //============================================================

  return chart;
};
