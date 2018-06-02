"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.default = "#define SHADER_NAME path-layer-fragment-shader\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform float jointType;\nuniform float miterLimit;\nuniform float alignMode;\n\nvarying vec4 vColor;\nvarying vec2 vCornerOffset;\nvarying float vMiterLength;\nvarying vec2 vDashArray;\nvarying float vPathPosition;\nvarying float vPathLength;\n\n// mod doesn't work correctly for negative numbers\nfloat mod2(float a, float b) {\n  return a - floor(a / b) * b;\n}\n\nfloat round(float x) {\n  return floor(x + 0.5);\n}\n\n// if given position is in the gap part of the dashed line\n// dashArray.x: solid stroke length, relative to width\n// dashArray.y: gap length, relative to width\n// alignMode:\n// 0 - no adjustment\n// o----     ----     ----     ---- o----     -o----     ----     o\n// 1 - stretch to fit, draw half dash at each end for nicer joints\n// o--    ----    ----    ----    --o--      --o--     ----     --o\nbool dash_isFragInGap() {\n  float solidLength = vDashArray.x;\n  float gapLength = vDashArray.y;\n\n  float unitLength = solidLength + gapLength;\n\n  if (unitLength == 0.0) {\n    return false;\n  }\n\n  unitLength = mix(\n    unitLength,\n    vPathLength / round(vPathLength / unitLength),\n    alignMode\n  );\n\n  float offset = alignMode * solidLength / 2.0;\n\n  return gapLength > 0.0 &&\n    vPathPosition >= 0.0 &&\n    vPathPosition <= vPathLength &&\n    mod2(vPathPosition + offset, unitLength) > solidLength;\n}\n\nvoid main(void) {\n  // if joint is rounded, test distance from the corner\n  if (jointType > 0.0 && vMiterLength > 0.0 && length(vCornerOffset) > 1.0) {\n    // Enable to debug joints\n    // gl_FragColor = vec4(0., 1., 0., 1.);\n    // return;\n    discard;\n  }\n  if (jointType == 0.0 && vMiterLength > miterLimit) {\n    // Enable to debug joints\n    // gl_FragColor = vec4(0., 0., 1., 1.);\n    // return;\n    discard;\n  }\n  if (vColor.a == 0.0 || dash_isFragInGap()) {\n    // Enable to debug joints\n    // gl_FragColor = vec4(0., 1., 1., 1.);\n    // return;\n    discard;\n  }\n  gl_FragColor = vColor;\n\n  // use highlight color if this fragment belongs to the selected object.\n  gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n\n  // use picking color if rendering to picking FBO.\n  gl_FragColor = picking_filterPickingColor(gl_FragColor);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9wYXRoLWxheWVyL3BhdGgtbGF5ZXItZnJhZ21lbnQuZ2xzbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBhdGgtbGF5ZXItZnJhZ21lbnQuZ2xzbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5leHBvcnQgZGVmYXVsdCBgXFxcbiNkZWZpbmUgU0hBREVSX05BTUUgcGF0aC1sYXllci1mcmFnbWVudC1zaGFkZXJcblxuI2lmZGVmIEdMX0VTXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG4jZW5kaWZcblxudW5pZm9ybSBmbG9hdCBqb2ludFR5cGU7XG51bmlmb3JtIGZsb2F0IG1pdGVyTGltaXQ7XG51bmlmb3JtIGZsb2F0IGFsaWduTW9kZTtcblxudmFyeWluZyB2ZWM0IHZDb2xvcjtcbnZhcnlpbmcgdmVjMiB2Q29ybmVyT2Zmc2V0O1xudmFyeWluZyBmbG9hdCB2TWl0ZXJMZW5ndGg7XG52YXJ5aW5nIHZlYzIgdkRhc2hBcnJheTtcbnZhcnlpbmcgZmxvYXQgdlBhdGhQb3NpdGlvbjtcbnZhcnlpbmcgZmxvYXQgdlBhdGhMZW5ndGg7XG5cbi8vIG1vZCBkb2Vzbid0IHdvcmsgY29ycmVjdGx5IGZvciBuZWdhdGl2ZSBudW1iZXJzXG5mbG9hdCBtb2QyKGZsb2F0IGEsIGZsb2F0IGIpIHtcbiAgcmV0dXJuIGEgLSBmbG9vcihhIC8gYikgKiBiO1xufVxuXG5mbG9hdCByb3VuZChmbG9hdCB4KSB7XG4gIHJldHVybiBmbG9vcih4ICsgMC41KTtcbn1cblxuLy8gaWYgZ2l2ZW4gcG9zaXRpb24gaXMgaW4gdGhlIGdhcCBwYXJ0IG9mIHRoZSBkYXNoZWQgbGluZVxuLy8gZGFzaEFycmF5Lng6IHNvbGlkIHN0cm9rZSBsZW5ndGgsIHJlbGF0aXZlIHRvIHdpZHRoXG4vLyBkYXNoQXJyYXkueTogZ2FwIGxlbmd0aCwgcmVsYXRpdmUgdG8gd2lkdGhcbi8vIGFsaWduTW9kZTpcbi8vIDAgLSBubyBhZGp1c3RtZW50XG4vLyBvLS0tLSAgICAgLS0tLSAgICAgLS0tLSAgICAgLS0tLSBvLS0tLSAgICAgLW8tLS0tICAgICAtLS0tICAgICBvXG4vLyAxIC0gc3RyZXRjaCB0byBmaXQsIGRyYXcgaGFsZiBkYXNoIGF0IGVhY2ggZW5kIGZvciBuaWNlciBqb2ludHNcbi8vIG8tLSAgICAtLS0tICAgIC0tLS0gICAgLS0tLSAgICAtLW8tLSAgICAgIC0tby0tICAgICAtLS0tICAgICAtLW9cbmJvb2wgZGFzaF9pc0ZyYWdJbkdhcCgpIHtcbiAgZmxvYXQgc29saWRMZW5ndGggPSB2RGFzaEFycmF5Lng7XG4gIGZsb2F0IGdhcExlbmd0aCA9IHZEYXNoQXJyYXkueTtcblxuICBmbG9hdCB1bml0TGVuZ3RoID0gc29saWRMZW5ndGggKyBnYXBMZW5ndGg7XG5cbiAgaWYgKHVuaXRMZW5ndGggPT0gMC4wKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdW5pdExlbmd0aCA9IG1peChcbiAgICB1bml0TGVuZ3RoLFxuICAgIHZQYXRoTGVuZ3RoIC8gcm91bmQodlBhdGhMZW5ndGggLyB1bml0TGVuZ3RoKSxcbiAgICBhbGlnbk1vZGVcbiAgKTtcblxuICBmbG9hdCBvZmZzZXQgPSBhbGlnbk1vZGUgKiBzb2xpZExlbmd0aCAvIDIuMDtcblxuICByZXR1cm4gZ2FwTGVuZ3RoID4gMC4wICYmXG4gICAgdlBhdGhQb3NpdGlvbiA+PSAwLjAgJiZcbiAgICB2UGF0aFBvc2l0aW9uIDw9IHZQYXRoTGVuZ3RoICYmXG4gICAgbW9kMih2UGF0aFBvc2l0aW9uICsgb2Zmc2V0LCB1bml0TGVuZ3RoKSA+IHNvbGlkTGVuZ3RoO1xufVxuXG52b2lkIG1haW4odm9pZCkge1xuICAvLyBpZiBqb2ludCBpcyByb3VuZGVkLCB0ZXN0IGRpc3RhbmNlIGZyb20gdGhlIGNvcm5lclxuICBpZiAoam9pbnRUeXBlID4gMC4wICYmIHZNaXRlckxlbmd0aCA+IDAuMCAmJiBsZW5ndGgodkNvcm5lck9mZnNldCkgPiAxLjApIHtcbiAgICAvLyBFbmFibGUgdG8gZGVidWcgam9pbnRzXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLiwgMS4sIDAuLCAxLik7XG4gICAgLy8gcmV0dXJuO1xuICAgIGRpc2NhcmQ7XG4gIH1cbiAgaWYgKGpvaW50VHlwZSA9PSAwLjAgJiYgdk1pdGVyTGVuZ3RoID4gbWl0ZXJMaW1pdCkge1xuICAgIC8vIEVuYWJsZSB0byBkZWJ1ZyBqb2ludHNcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuLCAwLiwgMS4sIDEuKTtcbiAgICAvLyByZXR1cm47XG4gICAgZGlzY2FyZDtcbiAgfVxuICBpZiAodkNvbG9yLmEgPT0gMC4wIHx8IGRhc2hfaXNGcmFnSW5HYXAoKSkge1xuICAgIC8vIEVuYWJsZSB0byBkZWJ1ZyBqb2ludHNcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuLCAxLiwgMS4sIDEuKTtcbiAgICAvLyByZXR1cm47XG4gICAgZGlzY2FyZDtcbiAgfVxuICBnbF9GcmFnQ29sb3IgPSB2Q29sb3I7XG5cbiAgLy8gdXNlIGhpZ2hsaWdodCBjb2xvciBpZiB0aGlzIGZyYWdtZW50IGJlbG9uZ3MgdG8gdGhlIHNlbGVjdGVkIG9iamVjdC5cbiAgZ2xfRnJhZ0NvbG9yID0gcGlja2luZ19maWx0ZXJIaWdobGlnaHRDb2xvcihnbF9GcmFnQ29sb3IpO1xuXG4gIC8vIHVzZSBwaWNraW5nIGNvbG9yIGlmIHJlbmRlcmluZyB0byBwaWNraW5nIEZCTy5cbiAgZ2xfRnJhZ0NvbG9yID0gcGlja2luZ19maWx0ZXJQaWNraW5nQ29sb3IoZ2xfRnJhZ0NvbG9yKTtcbn1cbmA7XG4iXX0=