var tape = require("tape"),
    sucrose = require("../build/sucrose.node.js"),
    testExports = require("./test-exports"),
    d3 = require("../build/d3");

tape("version matches package.json", function(test) {
  test.equal(sucrose.version, require("../package.json").version);
  test.end();
});

// for (var dependency in require("../package.json").dependencies) {
//   testExports(dependency);
// }

// -------------
// Utility Tests

tape("sucrose.strip(string+padding) returns string", function(test) {
  test.equal(sucrose.utility.strip("d "), "d");
  test.equal(sucrose.utility.strip("d&"), "d");
  test.end();
});

tape("sucrose.identity(d) returns d", function(test) {
  test.equal(sucrose.utility.identity("d"), "d");
  test.end();
});

// --------------------
// Null Data Transform Tests

tape("transform null_data returns null_data", function(test) {
  var null_data = require('../examples/data/data_null.json');
  test.deepEqual(sucrose.transform(null_data, 'multibar', 'grouped'), null_data);
  test.end();
});
