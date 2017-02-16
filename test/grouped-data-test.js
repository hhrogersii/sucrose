var tape = require("tape"),
    sucrose = require("../build/sucrose.node.js"),
    d3 = require("../build/d3");

// --------------------
// Grouped Data Transform Tests

// CSV

tape("transform year datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_csv_datetime.json');
  var target = require('./fixtures/spec.json').grouped.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform string datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_csv_datetime_string.json');
  var target = require('./fixtures/spec.json').grouped.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform numeric objects returns numeric objects", function(test) {
  var source = require('./fixtures/grouped_csv_numeric.json');
  var target = require('./fixtures/spec.json').grouped.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/grouped_csv_ordinal.json');
  var target = require('./fixtures/spec.json').grouped.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

// Arrays

tape("transform year datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_arrays_datetime.json');
  var target = require('./fixtures/spec.json').grouped.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform string datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_arrays_datetime_string.json');
  var target = require('./fixtures/spec.json').grouped.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform numeric objects returns numeric objects", function(test) {
  var source = require('./fixtures/grouped_arrays_numeric.json');
  var target = require('./fixtures/spec.json').grouped.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/grouped_arrays_ordinal.json');
  var target = require('./fixtures/spec.json').grouped.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

// Objects

tape("transform year datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_objects_datetime.json');
  var target = require('./fixtures/spec.json').grouped.datetime;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform string datetime objects returns datetime objects", function(test) {
  var source = require('./fixtures/grouped_objects_datetime_string.json');
  var target = require('./fixtures/spec.json').grouped.datetime_string;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform numeric objects returns numeric objects", function(test) {
  var source = require('./fixtures/grouped_objects_numeric.json');
  var target = require('./fixtures/spec.json').grouped.numeric;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

tape("transform ordinal objects returns ordinal objects", function(test) {
  var source = require('./fixtures/grouped_objects_ordinal.json');
  var target = require('./fixtures/spec.json').grouped.ordinal;
  test.deepEqual(sucrose.transform(source, 'multibar', 'grouped'), target);
  test.end();
});

