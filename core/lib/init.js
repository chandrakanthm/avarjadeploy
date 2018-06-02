'use strict';

var _globals = require('../utils/globals');

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Version detection using babel plugin
// Fallback for tests and SSR since global variable is defined by Webpack.
/* global __VERSION__ */
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

var version = typeof '5.1.1' !== 'undefined' ? '5.1.1' : _globals.global.DECK_VERSION || 'untranspiled source';

var STARTUP_MESSAGE = 'set deck.log.priority=1 (or higher) to trace attribute updates';

if (_globals.global.deck && _globals.global.deck.VERSION !== version) {
  throw new Error('deck.gl - multiple versions detected: ' + _globals.global.deck.VERSION + ' vs ' + version);
}

if (!_globals.global.deck) {
  /* global console */
  /* eslint-disable no-console */
  console.log('deck.gl ' + version + ' - ' + STARTUP_MESSAGE);

  _globals.global.deck = _globals.global.deck || {
    VERSION: version,
    version: version,
    log: _log2.default
  };
}

// TODO - Hack, remove when luma.gl 4.1.0-alpha.5 is published
if (!console.table) {
  console.table = function () {};
}

// Make sure we register shader modules
require('../shaderlib');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2xpYi9pbml0LmpzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJERUNLX1ZFUlNJT04iLCJTVEFSVFVQX01FU1NBR0UiLCJkZWNrIiwiVkVSU0lPTiIsIkVycm9yIiwiY29uc29sZSIsImxvZyIsInRhYmxlIiwicmVxdWlyZSJdLCJtYXBwaW5ncyI6Ijs7QUFvQkE7O0FBQ0E7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQXhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFPQSxJQUFNQSxVQUNKLG1CQUF1QixXQUF2QixhQUFtRCxnQkFBT0MsWUFBUCxJQUF1QixxQkFENUU7O0FBR0EsSUFBTUMsa0JBQWtCLGdFQUF4Qjs7QUFFQSxJQUFJLGdCQUFPQyxJQUFQLElBQWUsZ0JBQU9BLElBQVAsQ0FBWUMsT0FBWixLQUF3QkosT0FBM0MsRUFBb0Q7QUFDbEQsUUFBTSxJQUFJSyxLQUFKLDRDQUFtRCxnQkFBT0YsSUFBUCxDQUFZQyxPQUEvRCxZQUE2RUosT0FBN0UsQ0FBTjtBQUNEOztBQUVELElBQUksQ0FBQyxnQkFBT0csSUFBWixFQUFrQjtBQUNoQjtBQUNBO0FBQ0FHLFVBQVFDLEdBQVIsY0FBdUJQLE9BQXZCLFdBQW9DRSxlQUFwQzs7QUFFQSxrQkFBT0MsSUFBUCxHQUFjLGdCQUFPQSxJQUFQLElBQWU7QUFDM0JDLGFBQVNKLE9BRGtCO0FBRTNCQSxvQkFGMkI7QUFHM0JPO0FBSDJCLEdBQTdCO0FBS0Q7O0FBRUQ7QUFDQSxJQUFJLENBQUNELFFBQVFFLEtBQWIsRUFBb0I7QUFDbEJGLFVBQVFFLEtBQVIsR0FBZ0IsWUFBTSxDQUFFLENBQXhCO0FBQ0Q7O0FBRUQ7QUFDQUMsUUFBUSxjQUFSIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtnbG9iYWx9IGZyb20gJy4uL3V0aWxzL2dsb2JhbHMnO1xuaW1wb3J0IGxvZyBmcm9tICcuLi91dGlscy9sb2cnO1xuLy8gVmVyc2lvbiBkZXRlY3Rpb24gdXNpbmcgYmFiZWwgcGx1Z2luXG4vLyBGYWxsYmFjayBmb3IgdGVzdHMgYW5kIFNTUiBzaW5jZSBnbG9iYWwgdmFyaWFibGUgaXMgZGVmaW5lZCBieSBXZWJwYWNrLlxuLyogZ2xvYmFsIF9fVkVSU0lPTl9fICovXG5jb25zdCB2ZXJzaW9uID1cbiAgdHlwZW9mIF9fVkVSU0lPTl9fICE9PSAndW5kZWZpbmVkJyA/IF9fVkVSU0lPTl9fIDogZ2xvYmFsLkRFQ0tfVkVSU0lPTiB8fCAndW50cmFuc3BpbGVkIHNvdXJjZSc7XG5cbmNvbnN0IFNUQVJUVVBfTUVTU0FHRSA9ICdzZXQgZGVjay5sb2cucHJpb3JpdHk9MSAob3IgaGlnaGVyKSB0byB0cmFjZSBhdHRyaWJ1dGUgdXBkYXRlcyc7XG5cbmlmIChnbG9iYWwuZGVjayAmJiBnbG9iYWwuZGVjay5WRVJTSU9OICE9PSB2ZXJzaW9uKSB7XG4gIHRocm93IG5ldyBFcnJvcihgZGVjay5nbCAtIG11bHRpcGxlIHZlcnNpb25zIGRldGVjdGVkOiAke2dsb2JhbC5kZWNrLlZFUlNJT059IHZzICR7dmVyc2lvbn1gKTtcbn1cblxuaWYgKCFnbG9iYWwuZGVjaykge1xuICAvKiBnbG9iYWwgY29uc29sZSAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGNvbnNvbGUubG9nKGBkZWNrLmdsICR7dmVyc2lvbn0gLSAke1NUQVJUVVBfTUVTU0FHRX1gKTtcblxuICBnbG9iYWwuZGVjayA9IGdsb2JhbC5kZWNrIHx8IHtcbiAgICBWRVJTSU9OOiB2ZXJzaW9uLFxuICAgIHZlcnNpb24sXG4gICAgbG9nXG4gIH07XG59XG5cbi8vIFRPRE8gLSBIYWNrLCByZW1vdmUgd2hlbiBsdW1hLmdsIDQuMS4wLWFscGhhLjUgaXMgcHVibGlzaGVkXG5pZiAoIWNvbnNvbGUudGFibGUpIHtcbiAgY29uc29sZS50YWJsZSA9ICgpID0+IHt9O1xufVxuXG4vLyBNYWtlIHN1cmUgd2UgcmVnaXN0ZXIgc2hhZGVyIG1vZHVsZXNcbnJlcXVpcmUoJy4uL3NoYWRlcmxpYicpO1xuIl19