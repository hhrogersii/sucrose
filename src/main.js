const dev = ENV_DEV; //set false when in production
const build = 'ENV_BUILD'; //set false when in production

export {dev as development};
export {build as build};
export {version} from "../build/package";
export {default as utility} from './utility.js';
export {default as utils} from './utility.js';
export {default as tooltip} from './tooltip.js';
/*-------------------
       MODELS
-------------------*/
export {default as models} from './models/models_ENV_BUILD.js';
/*-------------------
       CHARTS
-------------------*/
export {default as charts} from './charts/charts_ENV_BUILD.js';
