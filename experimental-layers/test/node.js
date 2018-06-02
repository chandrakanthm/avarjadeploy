'use strict';

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

// Enables ES2015 import/export in Node.js
require('reify');

// Registers an alias for this module
var path = require('path');
var moduleAlias = require('module-alias');
moduleAlias.addAlias('deck.gl-layers/test', path.resolve('./test'));
moduleAlias.addAlias('deck.gl-layers', path.resolve('./src'));

require('babel-polyfill');

// Import headless luma support
require('luma.gl/headless');

// Run the tests
require('../../../test/src/experimental-layers');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3Rlc3Qvbm9kZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwicGF0aCIsIm1vZHVsZUFsaWFzIiwiYWRkQWxpYXMiLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0FBLFFBQVEsT0FBUjs7QUFFQTtBQUNBLElBQU1DLE9BQU9ELFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBTUUsY0FBY0YsUUFBUSxjQUFSLENBQXBCO0FBQ0FFLFlBQVlDLFFBQVosQ0FBcUIscUJBQXJCLEVBQTRDRixLQUFLRyxPQUFMLENBQWEsUUFBYixDQUE1QztBQUNBRixZQUFZQyxRQUFaLENBQXFCLGdCQUFyQixFQUF1Q0YsS0FBS0csT0FBTCxDQUFhLE9BQWIsQ0FBdkM7O0FBRUFKLFFBQVEsZ0JBQVI7O0FBRUE7QUFDQUEsUUFBUSxrQkFBUjs7QUFFQTtBQUNBQSxRQUFRLHVDQUFSIiwiZmlsZSI6Im5vZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gRW5hYmxlcyBFUzIwMTUgaW1wb3J0L2V4cG9ydCBpbiBOb2RlLmpzXG5yZXF1aXJlKCdyZWlmeScpO1xuXG4vLyBSZWdpc3RlcnMgYW4gYWxpYXMgZm9yIHRoaXMgbW9kdWxlXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgbW9kdWxlQWxpYXMgPSByZXF1aXJlKCdtb2R1bGUtYWxpYXMnKTtcbm1vZHVsZUFsaWFzLmFkZEFsaWFzKCdkZWNrLmdsLWxheWVycy90ZXN0JywgcGF0aC5yZXNvbHZlKCcuL3Rlc3QnKSk7XG5tb2R1bGVBbGlhcy5hZGRBbGlhcygnZGVjay5nbC1sYXllcnMnLCBwYXRoLnJlc29sdmUoJy4vc3JjJykpO1xuXG5yZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpO1xuXG4vLyBJbXBvcnQgaGVhZGxlc3MgbHVtYSBzdXBwb3J0XG5yZXF1aXJlKCdsdW1hLmdsL2hlYWRsZXNzJyk7XG5cbi8vIFJ1biB0aGUgdGVzdHNcbnJlcXVpcmUoJy4uLy4uLy4uL3Rlc3Qvc3JjL2V4cGVyaW1lbnRhbC1sYXllcnMnKTtcbiJdfQ==