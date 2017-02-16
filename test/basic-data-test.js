var tape = require("tape"),
    sucrose = require("../build/sucrose.node.js"),
    d3 = require("../build/d3");

// --------------------
// Grouped Data Transform Tests

// CSV

tape("transform basic year datetime csv returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_csv_datetime.json');
  var target = require('./fixtures/spec.json').basic.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic string datetime csv returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_csv_datetime_string.json');
  var target = require('./fixtures/spec.json').basic.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic numeric csv returns numeric objects", function(test) {
  var source = require('./fixtures/basic_csv_numeric.json');
  var target = require('./fixtures/spec.json').basic.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic ordinal csv returns ordinal objects", function(test) {
  var source = require('./fixtures/basic_csv_ordinal.json');
  var target = require('./fixtures/spec.json').basic.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

// Arrays

tape("transform basic year datetime arrays returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_arrays_datetime.json');
  var target = require('./fixtures/spec.json').basic.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic string datetime arrays returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_arrays_datetime_string.json');
  var target = require('./fixtures/spec.json').basic.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic numeric arrays returns numeric objects", function(test) {
  var source = require('./fixtures/basic_arrays_numeric.json');
  var target = require('./fixtures/spec.json').basic.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic ordinal arrays returns ordinal objects", function(test) {
  var source = require('./fixtures/basic_arrays_ordinal.json');
  var target = require('./fixtures/spec.json').basic.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

// Objects

tape("transform basic year datetime objects returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_objects_datetime.json');
  var target = require('./fixtures/spec.json').basic.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic string datetime objects returns datetime datetime objects", function(test) {
  var source = require('./fixtures/basic_objects_datetime_string.json');
  var target = require('./fixtures/spec.json').basic.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic numeric objects returns numeric objects", function(test) {
  var source = require('./fixtures/basic_objects_numeric.json');
  var target = require('./fixtures/spec.json').basic.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform basic ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/basic_objects_ordinal.json');
  var target = require('./fixtures/spec.json').basic.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});

tape("transform multiple basic ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/basic_objects_ordinal_multiple.json');
  var target = require('./fixtures/spec.json').basic.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'basic'), target);
  test.end();
});
