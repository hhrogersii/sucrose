sucrose.models.base = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = null,
      height = null,
      direction = 'ltr',
      locality = sucrose.utils.buildLocality(),
      id = Math.floor(Math.random() * 10000), //Create semi-unique ID in case user doesn't select one
      strings = {
        legend: {close: 'Hide legend', open: 'Show legend'},
        controls: {close: 'Hide controls', open: 'Show controls'},
        noData: 'No Data Available.',
        noLabel: 'undefined'
      };

  var color = function (d, i) {
    return sucrose.utils.defaultColor()(d, d.series);
  };
  var classes = function (d,i) {
    return 'sc-arc-path sc-series-' + d.series;
  };
  var gradient = function(d,i) {
    return sucrose.utils.colorRadialGradient( d, id+'-'+i, {x:0, y:0, r:radius, s:ringWidth/100, u:'userSpaceOnUse'}, color(d,i), wrap.select('defs') );
  };
  var fill = color;

  //============================================================

  function base() {
    return base;
  }

  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  base.direction = function(_) {
    if (!arguments.length) {
      return direction;
    }
    direction = _;
    return base;
  };
  base.id = function(_) {
    if (!arguments.length) {
      return id;
    }
    id = _;
    return chart;
  };
  base.locality = function(_) {
    if (!arguments.length) {
      return locality;
    }
    locality = sucrose.utils.buildLocality(_);
    return chart;
  };
  base.strings = function(_) {
    if (!arguments.length) {
      return strings;
    }
    for (var prop in _) {
      if (_.hasOwnProperty(prop)) {
        strings[prop] = _[prop];
      }
    }
    return chart;
  };

  base.classes = function(_) {
    if (!arguments.length) return classes;
    classes = _;
    return chart;
  };
  base.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  base.fill = function(_) {
    if (!arguments.length) return fill;
    fill = _;
    return chart;
  };
  base.gradient = function(_) {
    if (!arguments.length) return gradient;
    gradient = _;
    return chart;
  };

  base.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  base.width = function(_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return base;
  };
  base.height = function(_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return base;
  };

  //============================================================

  return base;
};
