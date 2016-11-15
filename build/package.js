export var name = "sucrose";
export var version = "0.5.0";
export var description = "Interactive Charts for Business Applications";
export var keywords = ["charts","d3","visualization","svg","mobile","canvas"];
export var homepage = "http://sucrose.io/";
export var license = "Apache-2.0";
export var author = {"name":"Henry Rogers","url":"https://github.com/hhrogersii"};
export var contributors = [{"name":"Travis Hubbard","url":"https://github.com/tshubbard"}];
export var main = "build/sucrose.node.js";
export var browser = "build/sucrose.js";
export var module = "index";
export var repository = {"type":"git","url":"https://github.com/sugarcrm/sucrose.git"};
export var scripts = {"test":"tape 'test/**/*-test.js'"};
export var devDependencies = {"clean-css":"^3.4.8","less":"^2.6.0","less-plugin-clean-css":"^1.5.1","tape":"^4.6.2","uglify-js":"2.6.1"};
export var dependencies = {"d3":"^4.2.1","d3fc-rebind":"^4.0.1","topojson":"^1.6.26"}