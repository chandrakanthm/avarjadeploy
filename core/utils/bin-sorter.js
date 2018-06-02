"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// getValue takes an array of points returns a value to sort the bins on.
// by default it returns the number of points
// this is where to pass in a function to color the bins by
// avg/mean/max of specific value of the point
var defaultGetValue = function defaultGetValue(points) {
  return points.length;
};

var BinSorter = function () {
  function BinSorter() {
    var bins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var getValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultGetValue;

    _classCallCheck(this, BinSorter);

    this.sortedBins = this.getSortedBins(bins, getValue);
    this.maxCount = this.getMaxCount();
    this.binMap = this.getBinMap();
  }

  /**
   * Get an array of object with sorted values and index of bins
   * @param {Array} bins
   * @param {Function} getValue
   * @return {Array} array of values and index lookup
   */


  _createClass(BinSorter, [{
    key: "getSortedBins",
    value: function getSortedBins(bins, getValue) {
      return bins.reduce(function (accu, h, i) {
        var value = getValue(h.points);

        if (value !== null && value !== undefined) {
          // filter bins if value is null or undefined
          accu.push({
            i: Number.isFinite(h.index) ? h.index : i,
            value: value,
            counts: h.points.length
          });
        }

        return accu;
      }, []).sort(function (a, b) {
        return a.value - b.value;
      });
    }

    /**
     * Get range of values of all bins
     * @param {Number[]} range
     * @param {Number} range[0] - lower bound
     * @param {Number} range[1] - upper bound
     * @return {Array} array of new value range
     */

  }, {
    key: "getValueRange",
    value: function getValueRange(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          lower = _ref2[0],
          upper = _ref2[1];

      var len = this.sortedBins.length;
      if (!len) {
        return [0, 0];
      }
      var lowerIdx = Math.ceil(lower / 100 * (len - 1));
      var upperIdx = Math.floor(upper / 100 * (len - 1));

      return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
    }

    /**
     * Get ths max count of all bins
     * @return {Number | Boolean} max count
     */

  }, {
    key: "getMaxCount",
    value: function getMaxCount() {
      return Math.max.apply(Math, _toConsumableArray(this.sortedBins.map(function (b) {
        return b.counts;
      })));
    }

    /**
     * Get a mapping from cell/hexagon index to sorted bin
     * This is used to retrieve bin value for color calculation
     * @return {Object} bin index to sortedBins
     */

  }, {
    key: "getBinMap",
    value: function getBinMap() {
      return this.sortedBins.reduce(function (mapper, curr) {
        return Object.assign(mapper, _defineProperty({}, curr.i, curr));
      }, {});
    }
  }]);

  return BinSorter;
}();

exports.default = BinSorter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL2Jpbi1zb3J0ZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdEdldFZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwiQmluU29ydGVyIiwiYmlucyIsImdldFZhbHVlIiwic29ydGVkQmlucyIsImdldFNvcnRlZEJpbnMiLCJtYXhDb3VudCIsImdldE1heENvdW50IiwiYmluTWFwIiwiZ2V0QmluTWFwIiwicmVkdWNlIiwiYWNjdSIsImgiLCJpIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJwdXNoIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJpbmRleCIsImNvdW50cyIsInNvcnQiLCJhIiwiYiIsImxvd2VyIiwidXBwZXIiLCJsZW4iLCJsb3dlcklkeCIsIk1hdGgiLCJjZWlsIiwidXBwZXJJZHgiLCJmbG9vciIsIm1heCIsIm1hcCIsIm1hcHBlciIsImN1cnIiLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxTQUFVQyxPQUFPQyxNQUFqQjtBQUFBLENBQXhCOztJQUVxQkMsUztBQUNuQix1QkFBbUQ7QUFBQSxRQUF2Q0MsSUFBdUMsdUVBQWhDLEVBQWdDO0FBQUEsUUFBNUJDLFFBQTRCLHVFQUFqQkwsZUFBaUI7O0FBQUE7O0FBQ2pELFNBQUtNLFVBQUwsR0FBa0IsS0FBS0MsYUFBTCxDQUFtQkgsSUFBbkIsRUFBeUJDLFFBQXpCLENBQWxCO0FBQ0EsU0FBS0csUUFBTCxHQUFnQixLQUFLQyxXQUFMLEVBQWhCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLEtBQUtDLFNBQUwsRUFBZDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2tDQU1jUCxJLEVBQU1DLFEsRUFBVTtBQUM1QixhQUFPRCxLQUNKUSxNQURJLENBQ0csVUFBQ0MsSUFBRCxFQUFPQyxDQUFQLEVBQVVDLENBQVYsRUFBZ0I7QUFDdEIsWUFBTUMsUUFBUVgsU0FBU1MsRUFBRWIsTUFBWCxDQUFkOztBQUVBLFlBQUllLFVBQVUsSUFBVixJQUFrQkEsVUFBVUMsU0FBaEMsRUFBMkM7QUFDekM7QUFDQUosZUFBS0ssSUFBTCxDQUFVO0FBQ1JILGVBQUdJLE9BQU9DLFFBQVAsQ0FBZ0JOLEVBQUVPLEtBQWxCLElBQTJCUCxFQUFFTyxLQUE3QixHQUFxQ04sQ0FEaEM7QUFFUkMsd0JBRlE7QUFHUk0sb0JBQVFSLEVBQUViLE1BQUYsQ0FBU0M7QUFIVCxXQUFWO0FBS0Q7O0FBRUQsZUFBT1csSUFBUDtBQUNELE9BZEksRUFjRixFQWRFLEVBZUpVLElBZkksQ0FlQyxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxlQUFVRCxFQUFFUixLQUFGLEdBQVVTLEVBQUVULEtBQXRCO0FBQUEsT0FmRCxDQUFQO0FBZ0JEOztBQUVEOzs7Ozs7Ozs7O3dDQU84QjtBQUFBO0FBQUEsVUFBZlUsS0FBZTtBQUFBLFVBQVJDLEtBQVE7O0FBQzVCLFVBQU1DLE1BQU0sS0FBS3RCLFVBQUwsQ0FBZ0JKLE1BQTVCO0FBQ0EsVUFBSSxDQUFDMEIsR0FBTCxFQUFVO0FBQ1IsZUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVA7QUFDRDtBQUNELFVBQU1DLFdBQVdDLEtBQUtDLElBQUwsQ0FBVUwsUUFBUSxHQUFSLElBQWVFLE1BQU0sQ0FBckIsQ0FBVixDQUFqQjtBQUNBLFVBQU1JLFdBQVdGLEtBQUtHLEtBQUwsQ0FBV04sUUFBUSxHQUFSLElBQWVDLE1BQU0sQ0FBckIsQ0FBWCxDQUFqQjs7QUFFQSxhQUFPLENBQUMsS0FBS3RCLFVBQUwsQ0FBZ0J1QixRQUFoQixFQUEwQmIsS0FBM0IsRUFBa0MsS0FBS1YsVUFBTCxDQUFnQjBCLFFBQWhCLEVBQTBCaEIsS0FBNUQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O2tDQUljO0FBQ1osYUFBT2MsS0FBS0ksR0FBTCxnQ0FBWSxLQUFLNUIsVUFBTCxDQUFnQjZCLEdBQWhCLENBQW9CO0FBQUEsZUFBS1YsRUFBRUgsTUFBUDtBQUFBLE9BQXBCLENBQVosRUFBUDtBQUNEOztBQUVEOzs7Ozs7OztnQ0FLWTtBQUNWLGFBQU8sS0FBS2hCLFVBQUwsQ0FBZ0JNLE1BQWhCLENBQ0wsVUFBQ3dCLE1BQUQsRUFBU0MsSUFBVDtBQUFBLGVBQ0VDLE9BQU9DLE1BQVAsQ0FBY0gsTUFBZCxzQkFDR0MsS0FBS3RCLENBRFIsRUFDWXNCLElBRFosRUFERjtBQUFBLE9BREssRUFLTCxFQUxLLENBQVA7QUFPRDs7Ozs7O2tCQXZFa0JsQyxTIiwiZmlsZSI6ImJpbi1zb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gZ2V0VmFsdWUgdGFrZXMgYW4gYXJyYXkgb2YgcG9pbnRzIHJldHVybnMgYSB2YWx1ZSB0byBzb3J0IHRoZSBiaW5zIG9uLlxuLy8gYnkgZGVmYXVsdCBpdCByZXR1cm5zIHRoZSBudW1iZXIgb2YgcG9pbnRzXG4vLyB0aGlzIGlzIHdoZXJlIHRvIHBhc3MgaW4gYSBmdW5jdGlvbiB0byBjb2xvciB0aGUgYmlucyBieVxuLy8gYXZnL21lYW4vbWF4IG9mIHNwZWNpZmljIHZhbHVlIG9mIHRoZSBwb2ludFxuY29uc3QgZGVmYXVsdEdldFZhbHVlID0gcG9pbnRzID0+IHBvaW50cy5sZW5ndGg7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpblNvcnRlciB7XG4gIGNvbnN0cnVjdG9yKGJpbnMgPSBbXSwgZ2V0VmFsdWUgPSBkZWZhdWx0R2V0VmFsdWUpIHtcbiAgICB0aGlzLnNvcnRlZEJpbnMgPSB0aGlzLmdldFNvcnRlZEJpbnMoYmlucywgZ2V0VmFsdWUpO1xuICAgIHRoaXMubWF4Q291bnQgPSB0aGlzLmdldE1heENvdW50KCk7XG4gICAgdGhpcy5iaW5NYXAgPSB0aGlzLmdldEJpbk1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBhcnJheSBvZiBvYmplY3Qgd2l0aCBzb3J0ZWQgdmFsdWVzIGFuZCBpbmRleCBvZiBiaW5zXG4gICAqIEBwYXJhbSB7QXJyYXl9IGJpbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0VmFsdWVcbiAgICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIHZhbHVlcyBhbmQgaW5kZXggbG9va3VwXG4gICAqL1xuICBnZXRTb3J0ZWRCaW5zKGJpbnMsIGdldFZhbHVlKSB7XG4gICAgcmV0dXJuIGJpbnNcbiAgICAgIC5yZWR1Y2UoKGFjY3UsIGgsIGkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBnZXRWYWx1ZShoLnBvaW50cyk7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBmaWx0ZXIgYmlucyBpZiB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgICBpOiBOdW1iZXIuaXNGaW5pdGUoaC5pbmRleCkgPyBoLmluZGV4IDogaSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgY291bnRzOiBoLnBvaW50cy5sZW5ndGhcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfSwgW10pXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS52YWx1ZSAtIGIudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCByYW5nZSBvZiB2YWx1ZXMgb2YgYWxsIGJpbnNcbiAgICogQHBhcmFtIHtOdW1iZXJbXX0gcmFuZ2VcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhbmdlWzBdIC0gbG93ZXIgYm91bmRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhbmdlWzFdIC0gdXBwZXIgYm91bmRcbiAgICogQHJldHVybiB7QXJyYXl9IGFycmF5IG9mIG5ldyB2YWx1ZSByYW5nZVxuICAgKi9cbiAgZ2V0VmFsdWVSYW5nZShbbG93ZXIsIHVwcGVyXSkge1xuICAgIGNvbnN0IGxlbiA9IHRoaXMuc29ydGVkQmlucy5sZW5ndGg7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICAgIGNvbnN0IGxvd2VySWR4ID0gTWF0aC5jZWlsKGxvd2VyIC8gMTAwICogKGxlbiAtIDEpKTtcbiAgICBjb25zdCB1cHBlcklkeCA9IE1hdGguZmxvb3IodXBwZXIgLyAxMDAgKiAobGVuIC0gMSkpO1xuXG4gICAgcmV0dXJuIFt0aGlzLnNvcnRlZEJpbnNbbG93ZXJJZHhdLnZhbHVlLCB0aGlzLnNvcnRlZEJpbnNbdXBwZXJJZHhdLnZhbHVlXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhzIG1heCBjb3VudCBvZiBhbGwgYmluc1xuICAgKiBAcmV0dXJuIHtOdW1iZXIgfCBCb29sZWFufSBtYXggY291bnRcbiAgICovXG4gIGdldE1heENvdW50KCkge1xuICAgIHJldHVybiBNYXRoLm1heCguLi50aGlzLnNvcnRlZEJpbnMubWFwKGIgPT4gYi5jb3VudHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBtYXBwaW5nIGZyb20gY2VsbC9oZXhhZ29uIGluZGV4IHRvIHNvcnRlZCBiaW5cbiAgICogVGhpcyBpcyB1c2VkIHRvIHJldHJpZXZlIGJpbiB2YWx1ZSBmb3IgY29sb3IgY2FsY3VsYXRpb25cbiAgICogQHJldHVybiB7T2JqZWN0fSBiaW4gaW5kZXggdG8gc29ydGVkQmluc1xuICAgKi9cbiAgZ2V0QmluTWFwKCkge1xuICAgIHJldHVybiB0aGlzLnNvcnRlZEJpbnMucmVkdWNlKFxuICAgICAgKG1hcHBlciwgY3VycikgPT5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihtYXBwZXIsIHtcbiAgICAgICAgICBbY3Vyci5pXTogY3VyclxuICAgICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgfVxufVxuIl19