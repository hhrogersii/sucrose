
function transformDataToD3(json, chartType, barType) {

  var data = [],
      seriesData,
      properties = json.properties ? Array.isArray(json.properties) ? json.properties[0] : json.properties : {},
      value = 0,
      strNoLabel = 'undefined',
      valuesExist = true,
      valuesAreArrays = false,
      valuesAreDiscrete = false,
      seriesKeys = [],
      groupLabels = json.label || properties.labels || properties.label || [],
      groups = [];

  function pickLabel(d) {
    // d can be [d] or 'd'
    var l = [].concat(d.label || d)[0];
    return l ? l : strNoLabel;
  }

  function getGroup(d, i) {
    return {
      group: i + 1,
      label: pickLabel(d),
      total: sumValues(d.values)
    };
  }

  function getKey(d) {
    return d.key || pickLabel(d);
  }

  function sumValues(values) {
    return values ? values.reduce(function(a, b) { return parseFloat(a) + parseFloat(b); }, 0) : 0; // 0 is default value if reducing an empty list
  }

  function hasValues(d) {
    return d.values && d.values.filter(function(d) { return d.values && d.values.length; }).length > 0;
  }

  function dataHasValues(type, d) {
      var valueTypes = ['bar', 'line', 'area', 'pie', 'funnel', 'gauge'];
      return valueTypes.indexOf(type) !== -1 && hasValues(d);
  }

  function isArrayOfArrays(d) {
    return Array.isArray(d.values) && d.values.length && Array.isArray(d.values[0]);
  }

  function areDiscreteValues(d) {
    return d3.max(d, function(d1) { return d1.values.length; }) === 1;
  }

  valuesAreArrays = isArrayOfArrays(json);
  console.log('valuesAreArrays: ', valuesAreArrays);

  // process CSV values
  if (valuesAreArrays) {
    // json.values => [
    //   ["Year", "A", "B", "C"],
    //   [1970, 0.3, 2, 0.1],
    //   [1971, 0.5, 2, 0.1],
    //   [1972, 0.7, 3, 0.2]
    // ]

    // the first row is a row of strings
    // then extract first row header labels as series keys
    seriesKeys = properties.keys || json.values.splice(0, 1)[0].splice(1);
    // keys => ["A", "B", "C"]

    // reset groupLabels because it will be rebuilt from values
    groups = [];
    // label => ["June", "July", "August"]

    // json.values => [
    //   [1970, 0.3, 2, 0.1],
    //   [1971, 0.5, 2, 0.1],
    //   [1972, 0.7, 3, 0.2]
    // ]
    seriesData = d3.transpose(
        json.values
          .map(function(row, i) {
            // this is a row => [1970, 0.7, 3, 0.2]
            // this is a row => ["One", 0.7, 3, 0.2]
            // extract first column as x value
            var x = row.splice(0, 1)[0];
            // x => 1970
            // x => "One"
            // extract the first column into the properties category label array
            groups.push(getGroup({label: x, values: row}, i));

            return row.map(function(value, j) {
                // row => [0.7, 3, 0.2]]
                // first column is integer
                if (!isNaN(x))
                {
                  // if x is an integer date then treating as integer
                  // is ok because xDataType will force formatting on render
                  return [parseFloat(x), value];
                }
                // ... or datetime
                else if (sucrose.utility.isValidDate(x))
                {
                  // then use the first column as x value
                  // what about "June 1970"
                  return [x, value];
                }
                // the first column is a string so use ordinal indexing
                else if (typeof x === 'string')
                {
                  // use index as the x value
                  return [i + 1, value];
                }
              });
          })
      );

    // console.log('seriesData: ', JSON.stringify(seriesData, null, '  '));

    json.values = seriesKeys.map(function(key, i) {
        return {
          key: key,
          values: seriesData[i]
        }
      });
  }

  console.log('seriesKeys: ', seriesKeys);
  console.log('groupLabels: ', groupLabels);

  valuesExist = dataHasValues(chartType, json);
  console.log('valuesExist: ', valuesExist);

  valuesAreDiscrete = areDiscreteValues(json);
  console.log('valuesAreDiscrete: ', valuesAreDiscrete);

  // if (typeWithValues.indexOf(chartType) !== -1) {
  //   if (isArrayOfArrays(json.values)) {

  if (valuesExist) {
    // json.values => [[],[]] or [{},{}]

    switch (chartType) {

      case 'bar':
        var formatSeries = (barType === 'stacked' || barType === 'grouped') ?
              function(e, i, j) {
                return parseFloat(e.values[i]) || 0;
              } :
              function(e, i, j) {
                return i === j ? sumValues(e.values) : 0;
              };

        data = barType === 'stacked' || barType === 'grouped' ?
          json.label.map(function(d, i) {
            return {
              key: getKey(d),
              type: 'bar',
              disabled: d.disabled || false,
              values: json.values.map(function(e, j) {
                  return {
                    series: i,
                    x: j + 1,
                    y: formatSeries(e, i, j),
                    y0: 0
                  };
                })
            };
          }) :
          json.values.map(function(d, i) {
            return {
              key: d.values.length > 1 ? d.label : pickLabel(d), //TODO: replace with getKey
              type: 'bar',
              disabled: d.disabled || false,
              values: json.values.map(function(e, j) {
                  return {
                    series: i,
                    x: j + 1,
                    y: formatSeries(e, i, j),
                    y0: 0
                  };
                })
            };
          });
        break;

      case 'pie':
        data = json.values.map(function(d, i) {
            var data = {
                key: pickLabel(d),
                disabled: d.disabled || false,
                value: sumValues(d.values)
            };
            if (d.color !== undefined) {
              data.color = d.color;
            }
            if (d.classes !== undefined) {
              data.classes = d.classes;
            }
            return data;
          });
        break;

      case 'funnel':
        data = json.values.reverse().map(function(d, i) {
            return {
                key: pickLabel(d),
                disabled: d.disabled || false,
                values: [{
                  series: i,
                  label: d.valuelabels[0] ? d.valuelabels[0] : d.values[0],
                  x: 0,
                  y: sumValues(d.values),
                  y0: 0
                }]
            };
        });
        break;

      case 'area':
      case 'line':
        data = json.values
          .map(function(d, i) {
              return {
                  key: getKey(d),
                  values: valuesAreArrays ?
                      d.values :
                        valuesAreDiscrete ?
                          d.values.map(function(e, j) {
                              return [i, parseFloat(e)];
                          }) :
                          d.values.map(function(e, j) {
                              return [j, parseFloat(e)];
                          })
              };
          });
        break;

      case 'gauge':
        value = json.values.shift().gvalue;
        var y0 = 0;
        data = json.values.map(function(d, i) {
            var values = {
                key: pickLabel(d),
                y: parseFloat(d.values[0]) + y0
            };
            y0 += parseFloat(d.values[0]);
            return values;
        });
        groups = [{group: 1, label: 'Sum', total: value}];
        break;
    }

    if (!groups.length) {
      groups = (groupLabels.length ? groupLabels : valuesExist ? json.values : []).map(getGroup);
    }

    properties = {
        title: properties.title,

        yDataType: properties.yDataType,
        xDataType: properties.xDataType,

        groups: groups,

        colorLength: data.length
      };

    return {
      properties: properties,
      data: data
    };

  } else {

    switch (chartType) {

      case 'bubble':
        if (!json.data) {
          var salesStageMap = {
                  'Negotiation/Review': 'Negotiat./Review',
                  'Perception Analysis': 'Percept. Analysis',
                  'Proposal/Price Quote': 'Proposal/Quote',
                  'Id. Decision Makers': 'Id. Deciders'
                };
          // var seriesLength = d3.nest()
          //       .key(function(d){return d.probability;})
          //       .entries(chartData.data).length;
          chartData = {
            data: json.records.map(function (d) {
              return {
                id: d.id,
                x: d.date_closed,
                y: Math.round(parseInt(d.likely_case, 10) / parseFloat(d.base_rate)),
                shape: 'circle',
                account_name: d.account_name,
                assigned_user_name: d.assigned_user_name,
                sales_stage: d.sales_stage,
                sales_stage_short: salesStageMap[d.sales_stage] || d.sales_stage,
                probability: parseInt(d.probability, 10),
                base_amount: parseInt(d.likely_case, 10),
                currency_symbol: '$'
              };
            }),
            properties: {
              title: 'Bubble Chart Data',
              yDataType: 'string',
              xDataType: 'datetime',
              colorLength: json.records.length
            }
          };
        }
        break;

    }

    return chartData;

  }
}


function transformTableData(chartData, chartType, Chart) {
  var data = [],
      properties = chartData.properties || {};

  switch (chartType) {
    case 'multibar':
      data = chartData.data.map(function(d, i) {
        var series = {
          key: d.key || strNoLabel,
          count: d.count || null,
          disabled: d.disabled || false,
          series: d.series || i,
          values: (d._values || d.values).map(function(k) {
              return {x: k.x, y: (isNaN(k.value) ? k.y : k.value)};
            })
        };
        if (d.type) {
          series.type = d.type;
        }
        if (d.color) {
          series.color = d.color;
        }
        if (d.classes) {
          series.classes = d.classes;
        }
        return series;
      });
      break;
    case 'funnel':
      data = chartData.data.map(function(d, i) {
        return {
          key: d.key || strNoLabel,
          count: d.count || null,
          disabled: d.disabled || false,
          series: d.series || i,
          values: d.values.map(function(k) {
              return {x: k.x, y: (isNaN(k.value) ? k.y : k.value)};
            })
        };
      });
      break;
    case 'pie':
      data = chartData.data.map(function(d, i) {
        return {
          key: d.key || strNoLabel,
          count: d.count || null,
          disabled: d.disabled || false,
          series: d.series || i,
          values: [{x: i + 1, y: Chart.y()(d)}]
        };
      });
      break;
    case 'area':
    case 'line':
      data = chartData.data.map(function(d, i) {
        return {
          key: d.key || strNoLabel,
          disabled: d.disabled || false,
          series: d.series || i,
          values: d.values
        };
      });
      properties.groups = properties.groups || d3.merge(chartData.data.map(function(d) {
          return d.values.map(function(d, i) {
            return Chart.lines.x()(d, i);
          });
        }))
        .reduce(function(p, c) {
          if (p.indexOf(c) < 0) p.push(c);
          return p;
        }, [])
        .sort(function(a, b) {
          return a - b;
        })
        .map(function(d, i) {
          return {group: i + 1, l: Chart.xAxis.tickFormat()(d)};
        });
      break;

    case 'tree':
    case 'treemap':
    case 'globe':
    case 'bubble':
      data = [];
      break;

    default:
      data = chartData.data;
  }

  return {
    properties: properties,
    data: data
  };
}

// var xTickLabels;

function postProcessData(chartData, chartType, Chart) {

  if (chartData.properties) {
    yIsCurrency = chartData.properties.yDataType === 'currency';
    xIsDatetime = chartData.properties.xDataType === 'datetime';
  }

  switch (chartType) {

    case 'line':
      // xTickLabels = chartData.properties.labels ?
      //   chartData.properties.labels.map(function (d) { return d.l || d; }) :
      //   [];
      if (chartData.data && chartData.data.length) {
        if (chartData.data[0].values.length && Array.isArray(chartData.data[0].values[0])) {
          Chart
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; });

          // if (sucrose.isValidDate(chartData.data[0].values[0][0])) {
          //   Chart.xAxis
          //     .tickFormat(function (d) {
          //       return d3.time.format('%x')(new Date(d));
          //     });
          // } else if (xTickLabels.length > 0) {
          //   Chart.xAxis
          //     .tickFormat(function (d) {
          //       return xTickLabels[d] || ' ';
          //     });
          // }
        } else {
          Chart
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });

          // if (xTickLabels.length > 0) {
          //   Chart.xAxis
          //     .tickFormat(function (d) {
          //       return xTickLabels[d - 1] || ' ';
          //     });
          // }
        }
      }
      break;

    case 'multibar':
      Chart.stacked(chartData.properties.stacked === false ? false : true);
      break;

    case 'pareto':
      Chart.stacked(chartData.properties.stacked);
      break;
  }
}

function parseTreemapData(data) {
  var root = {
        name: 'Opportunities',
        children: [],
        x: 0,
        y: 0,
        dx: parseInt(document.getElementById('chart1').offsetWidth, 10),
        dy: parseInt(document.getElementById('chart1').offsetHeight, 10),
        depth: 0,
        colorIndex: '0root_Opportunities'
      },
      colorIndices = ['0root_Opportunities'],
      colors = d3.scale.category20().range();

  var today = new Date();
      today.setUTCHours(0, 0, 0, 0);

  var day_ms = 1000 * 60 * 60 * 24,
      d1 = new Date(today.getTime() + 31 * day_ms);

  var data1 = data0.filter(function(model) {
    // Filter for 30 days from now.
    var d2 = new Date(model.date_closed || '1970-01-01');
    return (d2 - d1) / day_ms <= 30;
  }).map(function(d) {
    // Include properties to be included in leaves
    return {
      id: d.id,
      assigned_user_name: d.assigned_user_name,
      sales_stage: d.sales_stage,
      name: d.name,
      amount_usdollar: d.amount_usdollar,
      color: d.color
    };
  });

  var data2 = d3.nest()
    .key(function(d) {
      return d.assigned_user_name;
    })
    .entries(data1);

  data2.forEach(function(value, key, list) {
    list[key].values = d3.nest()
      .key(function(m) {
        return m.sales_stage;
      })
      .entries(value.values);
  });

  data2.forEach(function(value1) {
    var child = [];
    var key1 = value1.key;
    value1.values.forEach(function(value2) {
      var key2 = value2.key;
      if (colorIndices.indexOf('2oppgroup_' + key2) === -1) {
        colorIndices.push('2oppgroup_' + key2);
      }
      value2.values.forEach(function(record) {
        record.className = 'stage_' + record.sales_stage.toLowerCase().replace(' ', '');
        record.value = parseInt(record.amount_usdollar, 10);
        record.colorIndex = '2oppgroup_' + key2;
      });
      child.push({
        name: key2,
        className: 'stage_' + key2.toLowerCase().replace(' ', ''),
        children: value2.values,
        colorIndex: '2oppgroup_' + key2
      });
    });
    if (colorIndices.indexOf('1rep_' + key1) === -1) {
      colorIndices.push('1rep_' + key1);
    }
    root.children.push({
      name: key1,
      children: child,
      colorIndex: '1rep_' + key1
    });
  });

  function accumulate(d) {
    if (d.children) {
      return d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0);
    }
    return d.value;
  }

  accumulate(root);

  colorIndices.sort(d3.ascending());

  //build color indexes
  function setColorIndex(d) {
    var i, l;
    d.colorIndex = colorIndices.indexOf(d.colorIndex);
    if (d.children) {
      l = d.children.length;
      for (i = 0; i < l; i += 1) {
        setColorIndex(d.children[i]);
      }
    }
  }

  setColorIndex(root);

  return root;
}
