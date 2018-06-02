'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isContainer = isContainer;
exports.count = count;
exports.values = values;
exports.isKeyedContainer = isKeyedContainer;
exports.keys = keys;
exports.entries = entries;
exports.forEach = forEach;
exports.map = map;
exports.reduce = reduce;
exports.toJS = toJS;
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ES6 includes iteration and iterable protocols, and new standard containers
// Influential libraries like Immutable.js provide useful containers that
// adopt these conventions.
//
// So, is it possible to write generic JavaScript code that works with any
// well-written container class? And is it possible to write generic container
// classes that work with any well-written code.
//
// Almost. But it is not trivial. Importantly the standard JavaScript `Object`s
// lack even basic iteration support and even standard JavaScript `Array`s
// differ in minor but important aspects from the new classes.
//
// The bad news is that it does not appear that these things are going to be
// solved soon, even in an actively evolving language like JavaScript. The
// reason is concerns.
//
// The good news is that it is not overly hard to "paper over" the differences
// with a set of small efficient functions. And voila, container.js.
//
// Different types of containers provide different types of access.
// A random access container
// A keyed container

var ERR_NOT_CONTAINER = 'Expected a container';
var ERR_NOT_KEYED_CONTAINER = 'Expected a "keyed" container';

/**
 * Checks if argument is an indexable object (not a primitive value, nor null)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a JavaScript object
 */
function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * Checks if argument is a plain object (not a class or array etc)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a plain JavaScript object
 */
function isPlainObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Object;
}

function isContainer(value) {
  return Array.isArray(value) || ArrayBuffer.isView(value) || isObject(value);
}

/**
 * Deduces numer of elements in a JavaScript container.
 * - Auto-deduction for ES6 containers that define a count() method
 * - Auto-deduction for ES6 containers that define a size member
 * - Auto-deduction for Classic Arrays via the built-in length attribute
 * - Also handles objects, although note that this an O(N) operation
 */
function count(container) {
  // Check if ES6 collection "count" function is available
  if (typeof container.count === 'function') {
    return container.count();
  }

  // Check if ES6 collection "size" attribute is set
  if (Number.isFinite(container.size)) {
    return container.size;
  }

  // Check if array length attribute is set
  // Note: checking this last since some ES6 collections (Immutable.js)
  // emit profuse warnings when trying to access `length` attribute
  if (Number.isFinite(container.length)) {
    return container.length;
  }

  // Note that getting the count of an object is O(N)
  if (isPlainObject(container)) {
    return Object.keys(container).length;
  }

  throw new Error(ERR_NOT_CONTAINER);
}

// Returns an iterator over all **values** of a container
//
// Note: Keyed containers are expected to provide an `values()` method,
// with the exception of plain objects which get special handling

function values(container) {
  // HACK - Needed to make buble compiler work
  if (Array.isArray(container)) {
    return container;
  }

  var prototype = Object.getPrototypeOf(container);
  if (typeof prototype.values === 'function') {
    return container.values();
  }

  if (typeof container.constructor.values === 'function') {
    return container.constructor.values(container);
  }

  var iterator = container[Symbol.iterator];
  if (iterator) {
    return container;
  }

  throw new Error(ERR_NOT_CONTAINER);
}

// /////////////////////////////////////////////////////////
// KEYED CONTAINERS
// Examples: objects, Map, Immutable.Map, ...

function isKeyedContainer(container) {
  if (Array.isArray(container)) {
    return false;
  }
  var prototype = Object.getPrototypeOf(container);
  // HACK to classify Immutable.List as non keyed container
  if (typeof prototype.shift === 'function') {
    return false;
  }
  var hasKeyedMethods = typeof prototype.get === 'function';
  return hasKeyedMethods || isPlainObject(container);
}

// Returns an iterator over all **entries** of a "keyed container"
// Keyed containers are expected to provide a `keys()` method,
// with the exception of plain objects.
//
function keys(keyedContainer) {
  var prototype = Object.getPrototypeOf(keyedContainer);
  if (typeof prototype.keys === 'function') {
    return keyedContainer.keys();
  }

  if (typeof keyedContainer.constructor.keys === 'function') {
    return keyedContainer.constructor.keys(keyedContainer);
  }

  throw new Error(ERR_NOT_KEYED_CONTAINER);
}

// Returns an iterator over all **entries** of a "keyed container"
//
// Keyed containers are expected to provide an `entries()` method,
// with the exception of plain objects.
//
function entries(keyedContainer) {
  var prototype = Object.getPrototypeOf(keyedContainer);
  if (typeof prototype.entries === 'function') {
    return keyedContainer.entries();
  }

  // if (typeof prototype.constructor.entries === 'function') {
  //   return prototype.constructor.entries(keyedContainer);
  // }

  if (typeof keyedContainer.constructor.entries === 'function') {
    return keyedContainer.constructor.entries(keyedContainer);
  }

  return null;
}

// "Generic" forEach that first attempts to call a
function forEach(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    container.forEach(visitor);
    return;
  }

  var isKeyed = isKeyedContainer(container);
  if (isKeyed) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = entries(container)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        visitor(value, key, container);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return;
  }

  var index = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = values(container)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var element = _step2.value;

      // result[index] = visitor(element, index, container);
      visitor(element, index, container);
      index++;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function map(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    var _result = [];
    container.forEach(function (x, i, e) {
      return _result.push(visitor(x, i, e));
    });
    return _result;
  }

  var isKeyed = isKeyedContainer(container);
  // const result = new Array(count(container));
  var result = [];
  if (isKeyed) {
    // TODO - should this create an object?
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = entries(container)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _step3$value = _slicedToArray(_step3.value, 2),
            key = _step3$value[0],
            value = _step3$value[1];

        // result[index] = visitor(element, index, container);
        result.push(visitor(value, key, container));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  } else {
    var index = 0;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = values(container)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var element = _step4.value;

        // result[index] = visitor(element, index, container);
        result.push(visitor(element, index, container));
        index++;
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }
  return result;
}

function reduce(container, visitor) {
  // Hack to work around limitations in buble compiler
  var prototype = Object.getPrototypeOf(container);
  if (prototype.forEach) {
    var _result2 = [];
    container.forEach(function (x, i, e) {
      return _result2.push(visitor(x, i, e));
    });
    return _result2;
  }

  var isKeyed = isKeyedContainer(container);
  // const result = new Array(count(container));
  var result = [];
  if (isKeyed) {
    // TODO - should this create an object?
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = entries(container)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _step5$value = _slicedToArray(_step5.value, 2),
            key = _step5$value[0],
            value = _step5$value[1];

        // result[index] = visitor(element, index, container);
        result.push(visitor(value, key, container));
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  } else {
    var index = 0;
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = values(container)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var element = _step6.value;

        // result[index] = visitor(element, index, container);
        result.push(visitor(element, index, container));
        index++;
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }
  return result;
}

// Attempt to create a simple (array, plain object) representation of
// a nested structure of ES6 iterable classes.
// Assumption is that if an entries() method is available, the iterable object
// should be represented as an object, if not as an array.
function toJS(container) {
  if (!isObject(container)) {
    return container;
  }

  if (isKeyedContainer(container)) {
    var _result3 = {};
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = entries(container)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var _step7$value = _slicedToArray(_step7.value, 2),
            key = _step7$value[0],
            value = _step7$value[1];

        _result3[key] = toJS(value);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    return _result3;
  }

  var result = [];
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = values(container)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var value = _step8.value;

      result.push(toJS(value));
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return result;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2V4cGVyaW1lbnRhbC91dGlscy9jb250YWluZXIuanMiXSwibmFtZXMiOlsiaXNPYmplY3QiLCJpc1BsYWluT2JqZWN0IiwiaXNDb250YWluZXIiLCJjb3VudCIsInZhbHVlcyIsImlzS2V5ZWRDb250YWluZXIiLCJrZXlzIiwiZW50cmllcyIsImZvckVhY2giLCJtYXAiLCJyZWR1Y2UiLCJ0b0pTIiwiRVJSX05PVF9DT05UQUlORVIiLCJFUlJfTk9UX0tFWUVEX0NPTlRBSU5FUiIsInZhbHVlIiwiY29uc3RydWN0b3IiLCJPYmplY3QiLCJBcnJheSIsImlzQXJyYXkiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImNvbnRhaW5lciIsIk51bWJlciIsImlzRmluaXRlIiwic2l6ZSIsImxlbmd0aCIsIkVycm9yIiwicHJvdG90eXBlIiwiZ2V0UHJvdG90eXBlT2YiLCJpdGVyYXRvciIsIlN5bWJvbCIsInNoaWZ0IiwiaGFzS2V5ZWRNZXRob2RzIiwiZ2V0Iiwia2V5ZWRDb250YWluZXIiLCJ2aXNpdG9yIiwiaXNLZXllZCIsImtleSIsImluZGV4IiwiZWxlbWVudCIsInJlc3VsdCIsIngiLCJpIiwiZSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFtRGdCQSxRLEdBQUFBLFE7UUFTQUMsYSxHQUFBQSxhO1FBSUFDLFcsR0FBQUEsVztRQVdBQyxLLEdBQUFBLEs7UUErQkFDLE0sR0FBQUEsTTtRQTJCQUMsZ0IsR0FBQUEsZ0I7UUFpQkFDLEksR0FBQUEsSTtRQWtCQUMsTyxHQUFBQSxPO1FBa0JBQyxPLEdBQUFBLE87UUF3QkFDLEcsR0FBQUEsRztRQTZCQUMsTSxHQUFBQSxNO1FBaUNBQyxJLEdBQUFBLEk7QUFoUmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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LENBQTNCLG1JQUErQztBQUFBO0FBQUEsWUFBbkNnQixHQUFtQztBQUFBLFlBQTlCdkIsS0FBOEI7O0FBQzdDMEIsaUJBQU9ILEdBQVAsSUFBYzFCLEtBQUtHLEtBQUwsQ0FBZDtBQUNEO0FBSjhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSy9CLFdBQU8wQixRQUFQO0FBQ0Q7O0FBRUQsTUFBTUEsU0FBUyxFQUFmO0FBYjhCO0FBQUE7QUFBQTs7QUFBQTtBQWM5QiwwQkFBb0JwQyxPQUFPaUIsU0FBUCxDQUFwQixtSUFBdUM7QUFBQSxVQUE1QlAsS0FBNEI7O0FBQ3JDMEIsYUFBT0ksSUFBUCxDQUFZakMsS0FBS0csS0FBTCxDQUFaO0FBQ0Q7QUFoQjZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBaUI5QixTQUFPMEIsTUFBUDtBQUNEIiwiZmlsZSI6ImNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vLyBFUzYgaW5jbHVkZXMgaXRlcmF0aW9uIGFuZCBpdGVyYWJsZSBwcm90b2NvbHMsIGFuZCBuZXcgc3RhbmRhcmQgY29udGFpbmVyc1xuLy8gSW5mbHVlbnRpYWwgbGlicmFyaWVzIGxpa2UgSW1tdXRhYmxlLmpzIHByb3ZpZGUgdXNlZnVsIGNvbnRhaW5lcnMgdGhhdFxuLy8gYWRvcHQgdGhlc2UgY29udmVudGlvbnMuXG4vL1xuLy8gU28sIGlzIGl0IHBvc3NpYmxlIHRvIHdyaXRlIGdlbmVyaWMgSmF2YVNjcmlwdCBjb2RlIHRoYXQgd29ya3Mgd2l0aCBhbnlcbi8vIHdlbGwtd3JpdHRlbiBjb250YWluZXIgY2xhc3M/IEFuZCBpcyBpdCBwb3NzaWJsZSB0byB3cml0ZSBnZW5lcmljIGNvbnRhaW5lclxuLy8gY2xhc3NlcyB0aGF0IHdvcmsgd2l0aCBhbnkgd2VsbC13cml0dGVuIGNvZGUuXG4vL1xuLy8gQWxtb3N0LiBCdXQgaXQgaXMgbm90IHRyaXZpYWwuIEltcG9ydGFudGx5IHRoZSBzdGFuZGFyZCBKYXZhU2NyaXB0IGBPYmplY3Rgc1xuLy8gbGFjayBldmVuIGJhc2ljIGl0ZXJhdGlvbiBzdXBwb3J0IGFuZCBldmVuIHN0YW5kYXJkIEphdmFTY3JpcHQgYEFycmF5YHNcbi8vIGRpZmZlciBpbiBtaW5vciBidXQgaW1wb3J0YW50IGFzcGVjdHMgZnJvbSB0aGUgbmV3IGNsYXNzZXMuXG4vL1xuLy8gVGhlIGJhZCBuZXdzIGlzIHRoYXQgaXQgZG9lcyBub3QgYXBwZWFyIHRoYXQgdGhlc2UgdGhpbmdzIGFyZSBnb2luZyB0byBiZVxuLy8gc29sdmVkIHNvb24sIGV2ZW4gaW4gYW4gYWN0aXZlbHkgZXZvbHZpbmcgbGFuZ3VhZ2UgbGlrZSBKYXZhU2NyaXB0LiBUaGVcbi8vIHJlYXNvbiBpcyBjb25jZXJucy5cbi8vXG4vLyBUaGUgZ29vZCBuZXdzIGlzIHRoYXQgaXQgaXMgbm90IG92ZXJseSBoYXJkIHRvIFwicGFwZXIgb3ZlclwiIHRoZSBkaWZmZXJlbmNlc1xuLy8gd2l0aCBhIHNldCBvZiBzbWFsbCBlZmZpY2llbnQgZnVuY3Rpb25zLiBBbmQgdm9pbGEsIGNvbnRhaW5lci5qcy5cbi8vXG4vLyBEaWZmZXJlbnQgdHlwZXMgb2YgY29udGFpbmVycyBwcm92aWRlIGRpZmZlcmVudCB0eXBlcyBvZiBhY2Nlc3MuXG4vLyBBIHJhbmRvbSBhY2Nlc3MgY29udGFpbmVyXG4vLyBBIGtleWVkIGNvbnRhaW5lclxuXG5jb25zdCBFUlJfTk9UX0NPTlRBSU5FUiA9ICdFeHBlY3RlZCBhIGNvbnRhaW5lcic7XG5jb25zdCBFUlJfTk9UX0tFWUVEX0NPTlRBSU5FUiA9ICdFeHBlY3RlZCBhIFwia2V5ZWRcIiBjb250YWluZXInO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhcmd1bWVudCBpcyBhbiBpbmRleGFibGUgb2JqZWN0IChub3QgYSBwcmltaXRpdmUgdmFsdWUsIG5vciBudWxsKVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIEphdmFTY3JpcHQgdmFsdWUgdG8gYmUgdGVzdGVkXG4gKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgYXJndW1lbnQgaXMgYSBKYXZhU2NyaXB0IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFyZ3VtZW50IGlzIGEgcGxhaW4gb2JqZWN0IChub3QgYSBjbGFzcyBvciBhcnJheSBldGMpXG4gKiBAcGFyYW0geyp9IHZhbHVlIC0gSmF2YVNjcmlwdCB2YWx1ZSB0byBiZSB0ZXN0ZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gdHJ1ZSBpZiBhcmd1bWVudCBpcyBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbnRhaW5lcih2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSB8fCBpc09iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogRGVkdWNlcyBudW1lciBvZiBlbGVtZW50cyBpbiBhIEphdmFTY3JpcHQgY29udGFpbmVyLlxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgRVM2IGNvbnRhaW5lcnMgdGhhdCBkZWZpbmUgYSBjb3VudCgpIG1ldGhvZFxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgRVM2IGNvbnRhaW5lcnMgdGhhdCBkZWZpbmUgYSBzaXplIG1lbWJlclxuICogLSBBdXRvLWRlZHVjdGlvbiBmb3IgQ2xhc3NpYyBBcnJheXMgdmlhIHRoZSBidWlsdC1pbiBsZW5ndGggYXR0cmlidXRlXG4gKiAtIEFsc28gaGFuZGxlcyBvYmplY3RzLCBhbHRob3VnaCBub3RlIHRoYXQgdGhpcyBhbiBPKE4pIG9wZXJhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnQoY29udGFpbmVyKSB7XG4gIC8vIENoZWNrIGlmIEVTNiBjb2xsZWN0aW9uIFwiY291bnRcIiBmdW5jdGlvbiBpcyBhdmFpbGFibGVcbiAgaWYgKHR5cGVvZiBjb250YWluZXIuY291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNvdW50KCk7XG4gIH1cblxuICAvLyBDaGVjayBpZiBFUzYgY29sbGVjdGlvbiBcInNpemVcIiBhdHRyaWJ1dGUgaXMgc2V0XG4gIGlmIChOdW1iZXIuaXNGaW5pdGUoY29udGFpbmVyLnNpemUpKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5zaXplO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgYXJyYXkgbGVuZ3RoIGF0dHJpYnV0ZSBpcyBzZXRcbiAgLy8gTm90ZTogY2hlY2tpbmcgdGhpcyBsYXN0IHNpbmNlIHNvbWUgRVM2IGNvbGxlY3Rpb25zIChJbW11dGFibGUuanMpXG4gIC8vIGVtaXQgcHJvZnVzZSB3YXJuaW5ncyB3aGVuIHRyeWluZyB0byBhY2Nlc3MgYGxlbmd0aGAgYXR0cmlidXRlXG4gIGlmIChOdW1iZXIuaXNGaW5pdGUoY29udGFpbmVyLmxlbmd0aCkpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmxlbmd0aDtcbiAgfVxuXG4gIC8vIE5vdGUgdGhhdCBnZXR0aW5nIHRoZSBjb3VudCBvZiBhbiBvYmplY3QgaXMgTyhOKVxuICBpZiAoaXNQbGFpbk9iamVjdChjb250YWluZXIpKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbnRhaW5lcikubGVuZ3RoO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9OT1RfQ09OVEFJTkVSKTtcbn1cblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciBvdmVyIGFsbCAqKnZhbHVlcyoqIG9mIGEgY29udGFpbmVyXG4vL1xuLy8gTm90ZTogS2V5ZWQgY29udGFpbmVycyBhcmUgZXhwZWN0ZWQgdG8gcHJvdmlkZSBhbiBgdmFsdWVzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzIHdoaWNoIGdldCBzcGVjaWFsIGhhbmRsaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoY29udGFpbmVyKSB7XG4gIC8vIEhBQ0sgLSBOZWVkZWQgdG8gbWFrZSBidWJsZSBjb21waWxlciB3b3JrXG4gIGlmIChBcnJheS5pc0FycmF5KGNvbnRhaW5lcikpIHtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLnZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjb250YWluZXIudmFsdWVzKCk7XG4gIH1cblxuICBpZiAodHlwZW9mIGNvbnRhaW5lci5jb25zdHJ1Y3Rvci52YWx1ZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNvbnN0cnVjdG9yLnZhbHVlcyhjb250YWluZXIpO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBjb250YWluZXJbU3ltYm9sLml0ZXJhdG9yXTtcbiAgaWYgKGl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihFUlJfTk9UX0NPTlRBSU5FUik7XG59XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gS0VZRUQgQ09OVEFJTkVSU1xuLy8gRXhhbXBsZXM6IG9iamVjdHMsIE1hcCwgSW1tdXRhYmxlLk1hcCwgLi4uXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleWVkQ29udGFpbmVyKGNvbnRhaW5lcikge1xuICBpZiAoQXJyYXkuaXNBcnJheShjb250YWluZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250YWluZXIpO1xuICAvLyBIQUNLIHRvIGNsYXNzaWZ5IEltbXV0YWJsZS5MaXN0IGFzIG5vbiBrZXllZCBjb250YWluZXJcbiAgaWYgKHR5cGVvZiBwcm90b3R5cGUuc2hpZnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgaGFzS2V5ZWRNZXRob2RzID0gdHlwZW9mIHByb3RvdHlwZS5nZXQgPT09ICdmdW5jdGlvbic7XG4gIHJldHVybiBoYXNLZXllZE1ldGhvZHMgfHwgaXNQbGFpbk9iamVjdChjb250YWluZXIpO1xufVxuXG4vLyBSZXR1cm5zIGFuIGl0ZXJhdG9yIG92ZXIgYWxsICoqZW50cmllcyoqIG9mIGEgXCJrZXllZCBjb250YWluZXJcIlxuLy8gS2V5ZWQgY29udGFpbmVycyBhcmUgZXhwZWN0ZWQgdG8gcHJvdmlkZSBhIGBrZXlzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzLlxuLy9cbmV4cG9ydCBmdW5jdGlvbiBrZXlzKGtleWVkQ29udGFpbmVyKSB7XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihrZXllZENvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLmtleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIua2V5cygpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBrZXllZENvbnRhaW5lci5jb25zdHJ1Y3Rvci5rZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGtleWVkQ29udGFpbmVyLmNvbnN0cnVjdG9yLmtleXMoa2V5ZWRDb250YWluZXIpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9OT1RfS0VZRURfQ09OVEFJTkVSKTtcbn1cblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciBvdmVyIGFsbCAqKmVudHJpZXMqKiBvZiBhIFwia2V5ZWQgY29udGFpbmVyXCJcbi8vXG4vLyBLZXllZCBjb250YWluZXJzIGFyZSBleHBlY3RlZCB0byBwcm92aWRlIGFuIGBlbnRyaWVzKClgIG1ldGhvZCxcbi8vIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBwbGFpbiBvYmplY3RzLlxuLy9cbmV4cG9ydCBmdW5jdGlvbiBlbnRyaWVzKGtleWVkQ29udGFpbmVyKSB7XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihrZXllZENvbnRhaW5lcik7XG4gIGlmICh0eXBlb2YgcHJvdG90eXBlLmVudHJpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIuZW50cmllcygpO1xuICB9XG5cbiAgLy8gaWYgKHR5cGVvZiBwcm90b3R5cGUuY29uc3RydWN0b3IuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyAgIHJldHVybiBwcm90b3R5cGUuY29uc3RydWN0b3IuZW50cmllcyhrZXllZENvbnRhaW5lcik7XG4gIC8vIH1cblxuICBpZiAodHlwZW9mIGtleWVkQ29udGFpbmVyLmNvbnN0cnVjdG9yLmVudHJpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4ga2V5ZWRDb250YWluZXIuY29uc3RydWN0b3IuZW50cmllcyhrZXllZENvbnRhaW5lcik7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLy8gXCJHZW5lcmljXCIgZm9yRWFjaCB0aGF0IGZpcnN0IGF0dGVtcHRzIHRvIGNhbGwgYVxuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2goY29udGFpbmVyLCB2aXNpdG9yKSB7XG4gIC8vIEhhY2sgdG8gd29yayBhcm91bmQgbGltaXRhdGlvbnMgaW4gYnVibGUgY29tcGlsZXJcbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIGlmIChwcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIGNvbnRhaW5lci5mb3JFYWNoKHZpc2l0b3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGlzS2V5ZWQgPSBpc0tleWVkQ29udGFpbmVyKGNvbnRhaW5lcik7XG4gIGlmIChpc0tleWVkKSB7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcyhjb250YWluZXIpKSB7XG4gICAgICB2aXNpdG9yKHZhbHVlLCBrZXksIGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBpbmRleCA9IDA7XG4gIGZvciAoY29uc3QgZWxlbWVudCBvZiB2YWx1ZXMoY29udGFpbmVyKSkge1xuICAgIC8vIHJlc3VsdFtpbmRleF0gPSB2aXNpdG9yKGVsZW1lbnQsIGluZGV4LCBjb250YWluZXIpO1xuICAgIHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcik7XG4gICAgaW5kZXgrKztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwKGNvbnRhaW5lciwgdmlzaXRvcikge1xuICAvLyBIYWNrIHRvIHdvcmsgYXJvdW5kIGxpbWl0YXRpb25zIGluIGJ1YmxlIGNvbXBpbGVyXG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb250YWluZXIpO1xuICBpZiAocHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb250YWluZXIuZm9yRWFjaCgoeCwgaSwgZSkgPT4gcmVzdWx0LnB1c2godmlzaXRvcih4LCBpLCBlKSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjb25zdCBpc0tleWVkID0gaXNLZXllZENvbnRhaW5lcihjb250YWluZXIpO1xuICAvLyBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXkoY291bnQoY29udGFpbmVyKSk7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBpZiAoaXNLZXllZCkge1xuICAgIC8vIFRPRE8gLSBzaG91bGQgdGhpcyBjcmVhdGUgYW4gb2JqZWN0P1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMoY29udGFpbmVyKSkge1xuICAgICAgLy8gcmVzdWx0W2luZGV4XSA9IHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcik7XG4gICAgICByZXN1bHQucHVzaCh2aXNpdG9yKHZhbHVlLCBrZXksIGNvbnRhaW5lcikpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB2YWx1ZXMoY29udGFpbmVyKSkge1xuICAgICAgLy8gcmVzdWx0W2luZGV4XSA9IHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcik7XG4gICAgICByZXN1bHQucHVzaCh2aXNpdG9yKGVsZW1lbnQsIGluZGV4LCBjb250YWluZXIpKTtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoY29udGFpbmVyLCB2aXNpdG9yKSB7XG4gIC8vIEhhY2sgdG8gd29yayBhcm91bmQgbGltaXRhdGlvbnMgaW4gYnVibGUgY29tcGlsZXJcbiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbnRhaW5lcik7XG4gIGlmIChwcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnRhaW5lci5mb3JFYWNoKCh4LCBpLCBlKSA9PiByZXN1bHQucHVzaCh2aXNpdG9yKHgsIGksIGUpKSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IGlzS2V5ZWQgPSBpc0tleWVkQ29udGFpbmVyKGNvbnRhaW5lcik7XG4gIC8vIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheShjb3VudChjb250YWluZXIpKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGlmIChpc0tleWVkKSB7XG4gICAgLy8gVE9ETyAtIHNob3VsZCB0aGlzIGNyZWF0ZSBhbiBvYmplY3Q/XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcyhjb250YWluZXIpKSB7XG4gICAgICAvLyByZXN1bHRbaW5kZXhdID0gdmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKTtcbiAgICAgIHJlc3VsdC5wdXNoKHZpc2l0b3IodmFsdWUsIGtleSwgY29udGFpbmVyKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHZhbHVlcyhjb250YWluZXIpKSB7XG4gICAgICAvLyByZXN1bHRbaW5kZXhdID0gdmlzaXRvcihlbGVtZW50LCBpbmRleCwgY29udGFpbmVyKTtcbiAgICAgIHJlc3VsdC5wdXNoKHZpc2l0b3IoZWxlbWVudCwgaW5kZXgsIGNvbnRhaW5lcikpO1xuICAgICAgaW5kZXgrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gQXR0ZW1wdCB0byBjcmVhdGUgYSBzaW1wbGUgKGFycmF5LCBwbGFpbiBvYmplY3QpIHJlcHJlc2VudGF0aW9uIG9mXG4vLyBhIG5lc3RlZCBzdHJ1Y3R1cmUgb2YgRVM2IGl0ZXJhYmxlIGNsYXNzZXMuXG4vLyBBc3N1bXB0aW9uIGlzIHRoYXQgaWYgYW4gZW50cmllcygpIG1ldGhvZCBpcyBhdmFpbGFibGUsIHRoZSBpdGVyYWJsZSBvYmplY3Rcbi8vIHNob3VsZCBiZSByZXByZXNlbnRlZCBhcyBhbiBvYmplY3QsIGlmIG5vdCBhcyBhbiBhcnJheS5cbmV4cG9ydCBmdW5jdGlvbiB0b0pTKGNvbnRhaW5lcikge1xuICBpZiAoIWlzT2JqZWN0KGNvbnRhaW5lcikpIHtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbiAgaWYgKGlzS2V5ZWRDb250YWluZXIoY29udGFpbmVyKSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMoY29udGFpbmVyKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB0b0pTKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcyhjb250YWluZXIpKSB7XG4gICAgcmVzdWx0LnB1c2godG9KUyh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=