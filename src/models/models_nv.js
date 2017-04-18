/*-------------------
       MODELS
-------------------*/

import axis from './axis.js';
import funnel from './funnel.js';
import gauge from './gauge.js';
import menu from './menu.js';
import line from './line.js';
import multibar from './multibar.js';
import pie from './pie.js';
import scatter from './scatter.js';
import scroller from './scroller.js';

import bubbleChart from '../charts/bubbleChart.js';
import funnelChart from '../charts/funnelChart.js';
import gaugeChart from '../charts/gaugeChart.js';
import lineChart from '../charts/lineChart.js';
import multibarChart from '../charts/multibarChart.js';
import paretoChart from '../charts/paretoChart.js';
import pieChart from '../charts/pieChart.js';
import stackedareaChart from '../charts/stackedareaChart.js';
import treeChart from '../charts/treeChart.js';

const models = {
    axis: axis,
    funnel: funnel,
    gauge: gauge,
    legend: menu,
    line: line,
    multibar: multibar,
    pie: pie,
    scatter: scatter,
    scroll: scroller,
    bubbleChart: bubbleChart,
    funnelChart: funnelChart,
    gaugeChart: gaugeChart,
    lineChart: lineChart,
    multibarChart: multibarChart,
    paretoChart: paretoChart,
    pieChart: pieChart,
    stackedareaChart: stackedareaChart,
    treeChart: treeChart,
};

export default models;
