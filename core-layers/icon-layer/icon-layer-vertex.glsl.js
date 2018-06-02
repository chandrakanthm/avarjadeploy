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

exports.default = "#define SHADER_NAME icon-layer-vertex-shader\n\nattribute vec2 positions;\n\nattribute vec3 instancePositions;\nattribute float instanceSizes;\nattribute float instanceAngles;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\nattribute vec4 instanceIconFrames;\nattribute float instanceColorModes;\nattribute vec2 instanceOffsets;\n\nuniform float sizeScale;\nuniform vec2 iconsTextureDim;\n\nvarying float vColorMode;\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\n\nvec2 rotate_by_angle(vec2 vertex, float angle) {\n  float angle_radian = angle * PI / 180.0;\n  float cos_angle = cos(angle_radian);\n  float sin_angle = sin(angle_radian);\n  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);\n  return rotationMatrix * vertex;\n}\n\nvoid main(void) {\n  vec2 iconSize = instanceIconFrames.zw;\n  // scale icon height to match instanceSize\n  float instanceScale = iconSize.y == 0.0 ? 0.0 : instanceSizes / iconSize.y;\n\n  // scale and rotate vertex in \"pixel\" value and convert back to fraction in clipspace\n  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;\n  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * sizeScale * instanceScale;\n  pixelOffset.y *= -1.0;\n\n  vec3 center = project_position(instancePositions);\n  gl_Position = project_to_clipspace(vec4(center, 1.0));\n  gl_Position += project_pixel_to_clipspace(pixelOffset);\n\n  vTextureCoords = mix(\n    instanceIconFrames.xy,\n    instanceIconFrames.xy + iconSize,\n    (positions.xy + 1.0) / 2.0\n  ) / iconsTextureDim;\n\n  vTextureCoords.y = 1.0 - vTextureCoords.y;\n\n  vColor = instanceColors / 255.;\n\n  vColorMode = instanceColorModes;\n\n  // Set color to be rendered to picking fbo (also used to check for selection highlight).\n  picking_setPickingColor(instancePickingColors);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9pY29uLWxheWVyL2ljb24tbGF5ZXItdmVydGV4Lmdsc2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpY29uLWxheWVyLXZlcnRleC5nbHNsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmV4cG9ydCBkZWZhdWx0IGBcXFxuI2RlZmluZSBTSEFERVJfTkFNRSBpY29uLWxheWVyLXZlcnRleC1zaGFkZXJcblxuYXR0cmlidXRlIHZlYzIgcG9zaXRpb25zO1xuXG5hdHRyaWJ1dGUgdmVjMyBpbnN0YW5jZVBvc2l0aW9ucztcbmF0dHJpYnV0ZSBmbG9hdCBpbnN0YW5jZVNpemVzO1xuYXR0cmlidXRlIGZsb2F0IGluc3RhbmNlQW5nbGVzO1xuYXR0cmlidXRlIHZlYzQgaW5zdGFuY2VDb2xvcnM7XG5hdHRyaWJ1dGUgdmVjMyBpbnN0YW5jZVBpY2tpbmdDb2xvcnM7XG5hdHRyaWJ1dGUgdmVjNCBpbnN0YW5jZUljb25GcmFtZXM7XG5hdHRyaWJ1dGUgZmxvYXQgaW5zdGFuY2VDb2xvck1vZGVzO1xuYXR0cmlidXRlIHZlYzIgaW5zdGFuY2VPZmZzZXRzO1xuXG51bmlmb3JtIGZsb2F0IHNpemVTY2FsZTtcbnVuaWZvcm0gdmVjMiBpY29uc1RleHR1cmVEaW07XG5cbnZhcnlpbmcgZmxvYXQgdkNvbG9yTW9kZTtcbnZhcnlpbmcgdmVjNCB2Q29sb3I7XG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZHM7XG5cbnZlYzIgcm90YXRlX2J5X2FuZ2xlKHZlYzIgdmVydGV4LCBmbG9hdCBhbmdsZSkge1xuICBmbG9hdCBhbmdsZV9yYWRpYW4gPSBhbmdsZSAqIFBJIC8gMTgwLjA7XG4gIGZsb2F0IGNvc19hbmdsZSA9IGNvcyhhbmdsZV9yYWRpYW4pO1xuICBmbG9hdCBzaW5fYW5nbGUgPSBzaW4oYW5nbGVfcmFkaWFuKTtcbiAgbWF0MiByb3RhdGlvbk1hdHJpeCA9IG1hdDIoY29zX2FuZ2xlLCAtc2luX2FuZ2xlLCBzaW5fYW5nbGUsIGNvc19hbmdsZSk7XG4gIHJldHVybiByb3RhdGlvbk1hdHJpeCAqIHZlcnRleDtcbn1cblxudm9pZCBtYWluKHZvaWQpIHtcbiAgdmVjMiBpY29uU2l6ZSA9IGluc3RhbmNlSWNvbkZyYW1lcy56dztcbiAgLy8gc2NhbGUgaWNvbiBoZWlnaHQgdG8gbWF0Y2ggaW5zdGFuY2VTaXplXG4gIGZsb2F0IGluc3RhbmNlU2NhbGUgPSBpY29uU2l6ZS55ID09IDAuMCA/IDAuMCA6IGluc3RhbmNlU2l6ZXMgLyBpY29uU2l6ZS55O1xuXG4gIC8vIHNjYWxlIGFuZCByb3RhdGUgdmVydGV4IGluIFwicGl4ZWxcIiB2YWx1ZSBhbmQgY29udmVydCBiYWNrIHRvIGZyYWN0aW9uIGluIGNsaXBzcGFjZVxuICB2ZWMyIHBpeGVsT2Zmc2V0ID0gcG9zaXRpb25zIC8gMi4wICogaWNvblNpemUgKyBpbnN0YW5jZU9mZnNldHM7XG4gIHBpeGVsT2Zmc2V0ID0gcm90YXRlX2J5X2FuZ2xlKHBpeGVsT2Zmc2V0LCBpbnN0YW5jZUFuZ2xlcykgKiBzaXplU2NhbGUgKiBpbnN0YW5jZVNjYWxlO1xuICBwaXhlbE9mZnNldC55ICo9IC0xLjA7XG5cbiAgdmVjMyBjZW50ZXIgPSBwcm9qZWN0X3Bvc2l0aW9uKGluc3RhbmNlUG9zaXRpb25zKTtcbiAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0X3RvX2NsaXBzcGFjZSh2ZWM0KGNlbnRlciwgMS4wKSk7XG4gIGdsX1Bvc2l0aW9uICs9IHByb2plY3RfcGl4ZWxfdG9fY2xpcHNwYWNlKHBpeGVsT2Zmc2V0KTtcblxuICB2VGV4dHVyZUNvb3JkcyA9IG1peChcbiAgICBpbnN0YW5jZUljb25GcmFtZXMueHksXG4gICAgaW5zdGFuY2VJY29uRnJhbWVzLnh5ICsgaWNvblNpemUsXG4gICAgKHBvc2l0aW9ucy54eSArIDEuMCkgLyAyLjBcbiAgKSAvIGljb25zVGV4dHVyZURpbTtcblxuICB2VGV4dHVyZUNvb3Jkcy55ID0gMS4wIC0gdlRleHR1cmVDb29yZHMueTtcblxuICB2Q29sb3IgPSBpbnN0YW5jZUNvbG9ycyAvIDI1NS47XG5cbiAgdkNvbG9yTW9kZSA9IGluc3RhbmNlQ29sb3JNb2RlcztcblxuICAvLyBTZXQgY29sb3IgdG8gYmUgcmVuZGVyZWQgdG8gcGlja2luZyBmYm8gKGFsc28gdXNlZCB0byBjaGVjayBmb3Igc2VsZWN0aW9uIGhpZ2hsaWdodCkuXG4gIHBpY2tpbmdfc2V0UGlja2luZ0NvbG9yKGluc3RhbmNlUGlja2luZ0NvbG9ycyk7XG59XG5gO1xuIl19