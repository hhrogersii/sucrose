var tape = require("tape"),
    sucrose = require("../build/sucrose.node.js"),
    d3 = require("../build/d3");

// --------------------
// Grouped Data Transform Tests

// CSV

tape("transform discrete year datetime csv returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_csv_datetime.json');
  var target = require('./fixtures/spec.json').discrete.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete string datetime csv returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_csv_datetime_string.json');
  var target = require('./fixtures/spec.json').discrete.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete numeric csv returns numeric objects", function(test) {
  var source = require('./fixtures/discrete_csv_numeric.json');
  var target = require('./fixtures/spec.json').discrete.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete ordinal csv returns ordinal objects", function(test) {
  var source = require('./fixtures/discrete_csv_ordinal.json');
  var target = require('./fixtures/spec.json').discrete.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

// Arrays

tape("transform discrete year datetime arrays returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_arrays_datetime.json');
  var target = require('./fixtures/spec.json').discrete.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete string datetime arrays returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_arrays_datetime_string.json');
  var target = require('./fixtures/spec.json').discrete.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete numeric arrays returns numeric objects", function(test) {
  var source = require('./fixtures/discrete_arrays_numeric.json');
  var target = require('./fixtures/spec.json').discrete.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete ordinal arrays returns ordinal objects", function(test) {
  var source = require('./fixtures/discrete_arrays_ordinal.json');
  var target = require('./fixtures/spec.json').discrete.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

// Objects

tape("transform discrete year datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_objects_datetime.json');
  var target = require('./fixtures/spec.json').discrete.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete string datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/discrete_objects_datetime_string.json');
  var target = require('./fixtures/spec.json').discrete.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete numeric objects returns numeric objects", function(test) {
  var source = require('./fixtures/discrete_objects_numeric.json');
  var target = require('./fixtures/spec.json').discrete.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

tape("transform discrete ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/discrete_objects_ordinal.json');
  var target = require('./fixtures/spec.json').discrete.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
  test.end();
});

// tape("transform multiple discrete ordinal objects returns ordinal objects", function(test) {
//   var source = require('./fixtures/discrete_objects_ordinal_multiple.json');
//   var target = require('./fixtures/spec.json').discrete.ordinal;
//   test.deepEqual(sucrose.transform(source, 'multibar', 'discrete'), target);
//   test.end();
// });
