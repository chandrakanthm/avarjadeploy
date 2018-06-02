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

exports.default = "// EXTERNAL CONSTANTS: these must match JavaScript constants in \"src/core/lib/constants.js\"\nconst float COORDINATE_SYSTEM_IDENTITY = 0.;\nconst float COORDINATE_SYSTEM_LNG_LAT = 1.;\nconst float COORDINATE_SYSTEM_METER_OFFSETS = 2.;\nconst float COORDINATE_SYSTEM_LNGLAT_OFFSETS = 3.;\n\nuniform float project_uCoordinateSystem;\nuniform float project_uScale;\nuniform vec3 project_uPixelsPerMeter;\nuniform vec3 project_uPixelsPerDegree;\nuniform vec3 project_uPixelsPerUnit;\nuniform vec3 project_uPixelsPerUnit2;\nuniform vec4 project_uCenter;\nuniform mat4 project_uModelMatrix;\nuniform mat4 project_uViewProjectionMatrix;\nuniform vec2 project_uViewportSize;\nuniform float project_uDevicePixelRatio;\nuniform float project_uFocalDistance;\nuniform vec3 project_uCameraPosition;\n\nconst float TILE_SIZE = 512.0;\nconst float PI = 3.1415926536;\nconst float WORLD_SCALE = TILE_SIZE / (PI * 2.0);\n\n//\n// Scaling offsets - scales meters to \"pixels\"\n// Note the scalar version of project_scale is for scaling the z component only\n//\nfloat project_scale(float meters) {\n  return meters * project_uPixelsPerMeter.z;\n}\n\nvec2 project_scale(vec2 meters) {\n  return meters * project_uPixelsPerMeter.xy;\n}\n\nvec3 project_scale(vec3 meters) {\n  return meters * project_uPixelsPerMeter;\n}\n\nvec4 project_scale(vec4 meters) {\n  return vec4(meters.xyz * project_uPixelsPerMeter, meters.w);\n}\n\n//\n// Projecting normal - transform deltas from current coordinate system to\n// normals in the worldspace\n//\nvec3 project_normal(vec3 vector) {\n  if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNG_LAT ||\n    project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {\n    return normalize(vector * project_uPixelsPerDegree);\n  }\n  return normalize(vector * project_uPixelsPerMeter);\n}\n\nvec4 project_offset_(vec4 offset) {\n  vec3 pixelsPerUnit = project_uPixelsPerUnit + project_uPixelsPerUnit2 * offset.y;\n  return vec4(offset.xyz * pixelsPerUnit, offset.w);\n}\n\n//\n// Projecting positions - non-linear projection: lnglats => unit tile [0-1, 0-1]\n//\nvec2 project_mercator_(vec2 lnglat) {\n  return vec2(\n    radians(lnglat.x) + PI,\n    PI - log(tan_fp32(PI * 0.25 + radians(lnglat.y) * 0.5))\n  );\n}\n\n//\n// Projects lnglats (or meter offsets, depending on mode) to pixels\n//\nvec4 project_position(vec4 position) {\n  // TODO - why not simply subtract center and fall through?\n  if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNG_LAT) {\n    return project_uModelMatrix * vec4(\n      project_mercator_(position.xy) * WORLD_SCALE * project_uScale,\n      project_scale(position.z),\n      position.w\n    );\n  }\n\n  if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {\n    return project_offset_(position);\n  }\n\n  // METER_OFFSETS or IDENTITY\n  // Apply model matrix\n  vec4 position_modelspace = project_uModelMatrix * position;\n  return project_offset_(position_modelspace);\n}\n\nvec3 project_position(vec3 position) {\n  vec4 projected_position = project_position(vec4(position, 1.0));\n  return projected_position.xyz;\n}\n\nvec2 project_position(vec2 position) {\n  vec4 projected_position = project_position(vec4(position, 0.0, 1.0));\n  return projected_position.xy;\n}\n\n//\n// Projects from \"world\" coordinates to clip space.\n// Uses project_uViewProjectionMatrix\n//\nvec4 project_to_clipspace(vec4 position) {\n  if (project_uCoordinateSystem == COORDINATE_SYSTEM_METER_OFFSETS ||\n    project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {\n    // Needs to be divided with project_uPixelsPerMeter\n    position.w *= project_uPixelsPerMeter.z;\n  }\n  return project_uViewProjectionMatrix * position + project_uCenter;\n}\n\n// Returns a clip space offset that corresponds to a given number of **non-device** pixels\nvec4 project_pixel_to_clipspace(vec2 pixels) {\n  vec2 offset = pixels / project_uViewportSize * project_uDevicePixelRatio;\n  return vec4(offset * project_uFocalDistance, 0.0, 0.0);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL3NoYWRlcmxpYi9wcm9qZWN0L3Byb2plY3QuZ2xzbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InByb2plY3QuZ2xzbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5leHBvcnQgZGVmYXVsdCBgXFxcbi8vIEVYVEVSTkFMIENPTlNUQU5UUzogdGhlc2UgbXVzdCBtYXRjaCBKYXZhU2NyaXB0IGNvbnN0YW50cyBpbiBcInNyYy9jb3JlL2xpYi9jb25zdGFudHMuanNcIlxuY29uc3QgZmxvYXQgQ09PUkRJTkFURV9TWVNURU1fSURFTlRJVFkgPSAwLjtcbmNvbnN0IGZsb2F0IENPT1JESU5BVEVfU1lTVEVNX0xOR19MQVQgPSAxLjtcbmNvbnN0IGZsb2F0IENPT1JESU5BVEVfU1lTVEVNX01FVEVSX09GRlNFVFMgPSAyLjtcbmNvbnN0IGZsb2F0IENPT1JESU5BVEVfU1lTVEVNX0xOR0xBVF9PRkZTRVRTID0gMy47XG5cbnVuaWZvcm0gZmxvYXQgcHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbTtcbnVuaWZvcm0gZmxvYXQgcHJvamVjdF91U2NhbGU7XG51bmlmb3JtIHZlYzMgcHJvamVjdF91UGl4ZWxzUGVyTWV0ZXI7XG51bmlmb3JtIHZlYzMgcHJvamVjdF91UGl4ZWxzUGVyRGVncmVlO1xudW5pZm9ybSB2ZWMzIHByb2plY3RfdVBpeGVsc1BlclVuaXQ7XG51bmlmb3JtIHZlYzMgcHJvamVjdF91UGl4ZWxzUGVyVW5pdDI7XG51bmlmb3JtIHZlYzQgcHJvamVjdF91Q2VudGVyO1xudW5pZm9ybSBtYXQ0IHByb2plY3RfdU1vZGVsTWF0cml4O1xudW5pZm9ybSBtYXQ0IHByb2plY3RfdVZpZXdQcm9qZWN0aW9uTWF0cml4O1xudW5pZm9ybSB2ZWMyIHByb2plY3RfdVZpZXdwb3J0U2l6ZTtcbnVuaWZvcm0gZmxvYXQgcHJvamVjdF91RGV2aWNlUGl4ZWxSYXRpbztcbnVuaWZvcm0gZmxvYXQgcHJvamVjdF91Rm9jYWxEaXN0YW5jZTtcbnVuaWZvcm0gdmVjMyBwcm9qZWN0X3VDYW1lcmFQb3NpdGlvbjtcblxuY29uc3QgZmxvYXQgVElMRV9TSVpFID0gNTEyLjA7XG5jb25zdCBmbG9hdCBQSSA9IDMuMTQxNTkyNjUzNjtcbmNvbnN0IGZsb2F0IFdPUkxEX1NDQUxFID0gVElMRV9TSVpFIC8gKFBJICogMi4wKTtcblxuLy9cbi8vIFNjYWxpbmcgb2Zmc2V0cyAtIHNjYWxlcyBtZXRlcnMgdG8gXCJwaXhlbHNcIlxuLy8gTm90ZSB0aGUgc2NhbGFyIHZlcnNpb24gb2YgcHJvamVjdF9zY2FsZSBpcyBmb3Igc2NhbGluZyB0aGUgeiBjb21wb25lbnQgb25seVxuLy9cbmZsb2F0IHByb2plY3Rfc2NhbGUoZmxvYXQgbWV0ZXJzKSB7XG4gIHJldHVybiBtZXRlcnMgKiBwcm9qZWN0X3VQaXhlbHNQZXJNZXRlci56O1xufVxuXG52ZWMyIHByb2plY3Rfc2NhbGUodmVjMiBtZXRlcnMpIHtcbiAgcmV0dXJuIG1ldGVycyAqIHByb2plY3RfdVBpeGVsc1Blck1ldGVyLnh5O1xufVxuXG52ZWMzIHByb2plY3Rfc2NhbGUodmVjMyBtZXRlcnMpIHtcbiAgcmV0dXJuIG1ldGVycyAqIHByb2plY3RfdVBpeGVsc1Blck1ldGVyO1xufVxuXG52ZWM0IHByb2plY3Rfc2NhbGUodmVjNCBtZXRlcnMpIHtcbiAgcmV0dXJuIHZlYzQobWV0ZXJzLnh5eiAqIHByb2plY3RfdVBpeGVsc1Blck1ldGVyLCBtZXRlcnMudyk7XG59XG5cbi8vXG4vLyBQcm9qZWN0aW5nIG5vcm1hbCAtIHRyYW5zZm9ybSBkZWx0YXMgZnJvbSBjdXJyZW50IGNvb3JkaW5hdGUgc3lzdGVtIHRvXG4vLyBub3JtYWxzIGluIHRoZSB3b3JsZHNwYWNlXG4vL1xudmVjMyBwcm9qZWN0X25vcm1hbCh2ZWMzIHZlY3Rvcikge1xuICBpZiAocHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9MTkdfTEFUIHx8XG4gICAgcHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9MTkdMQVRfT0ZGU0VUUykge1xuICAgIHJldHVybiBub3JtYWxpemUodmVjdG9yICogcHJvamVjdF91UGl4ZWxzUGVyRGVncmVlKTtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplKHZlY3RvciAqIHByb2plY3RfdVBpeGVsc1Blck1ldGVyKTtcbn1cblxudmVjNCBwcm9qZWN0X29mZnNldF8odmVjNCBvZmZzZXQpIHtcbiAgdmVjMyBwaXhlbHNQZXJVbml0ID0gcHJvamVjdF91UGl4ZWxzUGVyVW5pdCArIHByb2plY3RfdVBpeGVsc1BlclVuaXQyICogb2Zmc2V0Lnk7XG4gIHJldHVybiB2ZWM0KG9mZnNldC54eXogKiBwaXhlbHNQZXJVbml0LCBvZmZzZXQudyk7XG59XG5cbi8vXG4vLyBQcm9qZWN0aW5nIHBvc2l0aW9ucyAtIG5vbi1saW5lYXIgcHJvamVjdGlvbjogbG5nbGF0cyA9PiB1bml0IHRpbGUgWzAtMSwgMC0xXVxuLy9cbnZlYzIgcHJvamVjdF9tZXJjYXRvcl8odmVjMiBsbmdsYXQpIHtcbiAgcmV0dXJuIHZlYzIoXG4gICAgcmFkaWFucyhsbmdsYXQueCkgKyBQSSxcbiAgICBQSSAtIGxvZyh0YW5fZnAzMihQSSAqIDAuMjUgKyByYWRpYW5zKGxuZ2xhdC55KSAqIDAuNSkpXG4gICk7XG59XG5cbi8vXG4vLyBQcm9qZWN0cyBsbmdsYXRzIChvciBtZXRlciBvZmZzZXRzLCBkZXBlbmRpbmcgb24gbW9kZSkgdG8gcGl4ZWxzXG4vL1xudmVjNCBwcm9qZWN0X3Bvc2l0aW9uKHZlYzQgcG9zaXRpb24pIHtcbiAgLy8gVE9ETyAtIHdoeSBub3Qgc2ltcGx5IHN1YnRyYWN0IGNlbnRlciBhbmQgZmFsbCB0aHJvdWdoP1xuICBpZiAocHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9MTkdfTEFUKSB7XG4gICAgcmV0dXJuIHByb2plY3RfdU1vZGVsTWF0cml4ICogdmVjNChcbiAgICAgIHByb2plY3RfbWVyY2F0b3JfKHBvc2l0aW9uLnh5KSAqIFdPUkxEX1NDQUxFICogcHJvamVjdF91U2NhbGUsXG4gICAgICBwcm9qZWN0X3NjYWxlKHBvc2l0aW9uLnopLFxuICAgICAgcG9zaXRpb24ud1xuICAgICk7XG4gIH1cblxuICBpZiAocHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9MTkdMQVRfT0ZGU0VUUykge1xuICAgIHJldHVybiBwcm9qZWN0X29mZnNldF8ocG9zaXRpb24pO1xuICB9XG5cbiAgLy8gTUVURVJfT0ZGU0VUUyBvciBJREVOVElUWVxuICAvLyBBcHBseSBtb2RlbCBtYXRyaXhcbiAgdmVjNCBwb3NpdGlvbl9tb2RlbHNwYWNlID0gcHJvamVjdF91TW9kZWxNYXRyaXggKiBwb3NpdGlvbjtcbiAgcmV0dXJuIHByb2plY3Rfb2Zmc2V0Xyhwb3NpdGlvbl9tb2RlbHNwYWNlKTtcbn1cblxudmVjMyBwcm9qZWN0X3Bvc2l0aW9uKHZlYzMgcG9zaXRpb24pIHtcbiAgdmVjNCBwcm9qZWN0ZWRfcG9zaXRpb24gPSBwcm9qZWN0X3Bvc2l0aW9uKHZlYzQocG9zaXRpb24sIDEuMCkpO1xuICByZXR1cm4gcHJvamVjdGVkX3Bvc2l0aW9uLnh5ejtcbn1cblxudmVjMiBwcm9qZWN0X3Bvc2l0aW9uKHZlYzIgcG9zaXRpb24pIHtcbiAgdmVjNCBwcm9qZWN0ZWRfcG9zaXRpb24gPSBwcm9qZWN0X3Bvc2l0aW9uKHZlYzQocG9zaXRpb24sIDAuMCwgMS4wKSk7XG4gIHJldHVybiBwcm9qZWN0ZWRfcG9zaXRpb24ueHk7XG59XG5cbi8vXG4vLyBQcm9qZWN0cyBmcm9tIFwid29ybGRcIiBjb29yZGluYXRlcyB0byBjbGlwIHNwYWNlLlxuLy8gVXNlcyBwcm9qZWN0X3VWaWV3UHJvamVjdGlvbk1hdHJpeFxuLy9cbnZlYzQgcHJvamVjdF90b19jbGlwc3BhY2UodmVjNCBwb3NpdGlvbikge1xuICBpZiAocHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9NRVRFUl9PRkZTRVRTIHx8XG4gICAgcHJvamVjdF91Q29vcmRpbmF0ZVN5c3RlbSA9PSBDT09SRElOQVRFX1NZU1RFTV9MTkdMQVRfT0ZGU0VUUykge1xuICAgIC8vIE5lZWRzIHRvIGJlIGRpdmlkZWQgd2l0aCBwcm9qZWN0X3VQaXhlbHNQZXJNZXRlclxuICAgIHBvc2l0aW9uLncgKj0gcHJvamVjdF91UGl4ZWxzUGVyTWV0ZXIuejtcbiAgfVxuICByZXR1cm4gcHJvamVjdF91Vmlld1Byb2plY3Rpb25NYXRyaXggKiBwb3NpdGlvbiArIHByb2plY3RfdUNlbnRlcjtcbn1cblxuLy8gUmV0dXJucyBhIGNsaXAgc3BhY2Ugb2Zmc2V0IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBnaXZlbiBudW1iZXIgb2YgKipub24tZGV2aWNlKiogcGl4ZWxzXG52ZWM0IHByb2plY3RfcGl4ZWxfdG9fY2xpcHNwYWNlKHZlYzIgcGl4ZWxzKSB7XG4gIHZlYzIgb2Zmc2V0ID0gcGl4ZWxzIC8gcHJvamVjdF91Vmlld3BvcnRTaXplICogcHJvamVjdF91RGV2aWNlUGl4ZWxSYXRpbztcbiAgcmV0dXJuIHZlYzQob2Zmc2V0ICogcHJvamVjdF91Rm9jYWxEaXN0YW5jZSwgMC4wLCAwLjApO1xufVxuYDtcbiJdfQ==