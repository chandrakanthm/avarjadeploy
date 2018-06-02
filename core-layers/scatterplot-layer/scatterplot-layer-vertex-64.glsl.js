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

exports.default = "#define SHADER_NAME scatterplot-layer-vertex-shader-64\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute vec2 instancePositions64xyLow;\nattribute float instanceRadius;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\n// Only one-dimensional arrays may be declared in GLSL ES 1.0. specs p.24\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float outline;\nuniform float strokeWidth;\n\nvarying vec4 vColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\n\nvoid main(void) {\n  // Multiply out radius and clamp to limits\n  float outerRadiusPixels = clamp(\n    project_scale(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n\n  // outline is centered at the radius\n  // outer radius needs to offset by half stroke width\n  outerRadiusPixels += outline * strokeWidth / 2.0;\n\n  // position on the containing square in [-1, 1] space\n  unitPosition = positions.xy;\n  // 0 - solid circle, 1 - stroke with lineWidth=0\n  innerUnitRadius = outline * (1.0 - strokeWidth / outerRadiusPixels);\n\n  vec4 instancePositions64xy = vec4(\n    instancePositions.x, instancePositions64xyLow.x,\n    instancePositions.y, instancePositions64xyLow.y);\n\n  vec2 projected_coord_xy[2];\n  project_position_fp64(instancePositions64xy, projected_coord_xy);\n\n  vec2 vertex_pos_localspace[4];\n  vec4_fp64(vec4(positions * outerRadiusPixels, 0.0), vertex_pos_localspace);\n\n  vec2 vertex_pos_modelspace[4];\n  vertex_pos_modelspace[0] = sum_fp64(vertex_pos_localspace[0], projected_coord_xy[0]);\n  vertex_pos_modelspace[1] = sum_fp64(vertex_pos_localspace[1], projected_coord_xy[1]);\n  vertex_pos_modelspace[2] = sum_fp64(vertex_pos_localspace[2],\n    vec2(project_scale(instancePositions.z), 0.0));\n  vertex_pos_modelspace[3] = vec2(1.0, 0.0);\n\n  gl_Position = project_to_clipspace_fp64(vertex_pos_modelspace);\n\n  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity) / 255.;\n\n  // Set color to be rendered to picking fbo (also used to check for selection highlight).\n  picking_setPickingColor(instancePickingColors);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9zY2F0dGVycGxvdC1sYXllci9zY2F0dGVycGxvdC1sYXllci12ZXJ0ZXgtNjQuZ2xzbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjYXR0ZXJwbG90LWxheWVyLXZlcnRleC02NC5nbHNsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmV4cG9ydCBkZWZhdWx0IGBcXFxuI2RlZmluZSBTSEFERVJfTkFNRSBzY2F0dGVycGxvdC1sYXllci12ZXJ0ZXgtc2hhZGVyLTY0XG5cbmF0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9ucztcblxuYXR0cmlidXRlIHZlYzMgaW5zdGFuY2VQb3NpdGlvbnM7XG5hdHRyaWJ1dGUgdmVjMiBpbnN0YW5jZVBvc2l0aW9uczY0eHlMb3c7XG5hdHRyaWJ1dGUgZmxvYXQgaW5zdGFuY2VSYWRpdXM7XG5hdHRyaWJ1dGUgdmVjNCBpbnN0YW5jZUNvbG9ycztcbmF0dHJpYnV0ZSB2ZWMzIGluc3RhbmNlUGlja2luZ0NvbG9ycztcblxuLy8gT25seSBvbmUtZGltZW5zaW9uYWwgYXJyYXlzIG1heSBiZSBkZWNsYXJlZCBpbiBHTFNMIEVTIDEuMC4gc3BlY3MgcC4yNFxudW5pZm9ybSBmbG9hdCBvcGFjaXR5O1xudW5pZm9ybSBmbG9hdCByYWRpdXNTY2FsZTtcbnVuaWZvcm0gZmxvYXQgcmFkaXVzTWluUGl4ZWxzO1xudW5pZm9ybSBmbG9hdCByYWRpdXNNYXhQaXhlbHM7XG51bmlmb3JtIGZsb2F0IG91dGxpbmU7XG51bmlmb3JtIGZsb2F0IHN0cm9rZVdpZHRoO1xuXG52YXJ5aW5nIHZlYzQgdkNvbG9yO1xudmFyeWluZyB2ZWMyIHVuaXRQb3NpdGlvbjtcbnZhcnlpbmcgZmxvYXQgaW5uZXJVbml0UmFkaXVzO1xuXG52b2lkIG1haW4odm9pZCkge1xuICAvLyBNdWx0aXBseSBvdXQgcmFkaXVzIGFuZCBjbGFtcCB0byBsaW1pdHNcbiAgZmxvYXQgb3V0ZXJSYWRpdXNQaXhlbHMgPSBjbGFtcChcbiAgICBwcm9qZWN0X3NjYWxlKHJhZGl1c1NjYWxlICogaW5zdGFuY2VSYWRpdXMpLFxuICAgIHJhZGl1c01pblBpeGVscywgcmFkaXVzTWF4UGl4ZWxzXG4gICk7XG5cbiAgLy8gb3V0bGluZSBpcyBjZW50ZXJlZCBhdCB0aGUgcmFkaXVzXG4gIC8vIG91dGVyIHJhZGl1cyBuZWVkcyB0byBvZmZzZXQgYnkgaGFsZiBzdHJva2Ugd2lkdGhcbiAgb3V0ZXJSYWRpdXNQaXhlbHMgKz0gb3V0bGluZSAqIHN0cm9rZVdpZHRoIC8gMi4wO1xuXG4gIC8vIHBvc2l0aW9uIG9uIHRoZSBjb250YWluaW5nIHNxdWFyZSBpbiBbLTEsIDFdIHNwYWNlXG4gIHVuaXRQb3NpdGlvbiA9IHBvc2l0aW9ucy54eTtcbiAgLy8gMCAtIHNvbGlkIGNpcmNsZSwgMSAtIHN0cm9rZSB3aXRoIGxpbmVXaWR0aD0wXG4gIGlubmVyVW5pdFJhZGl1cyA9IG91dGxpbmUgKiAoMS4wIC0gc3Ryb2tlV2lkdGggLyBvdXRlclJhZGl1c1BpeGVscyk7XG5cbiAgdmVjNCBpbnN0YW5jZVBvc2l0aW9uczY0eHkgPSB2ZWM0KFxuICAgIGluc3RhbmNlUG9zaXRpb25zLngsIGluc3RhbmNlUG9zaXRpb25zNjR4eUxvdy54LFxuICAgIGluc3RhbmNlUG9zaXRpb25zLnksIGluc3RhbmNlUG9zaXRpb25zNjR4eUxvdy55KTtcblxuICB2ZWMyIHByb2plY3RlZF9jb29yZF94eVsyXTtcbiAgcHJvamVjdF9wb3NpdGlvbl9mcDY0KGluc3RhbmNlUG9zaXRpb25zNjR4eSwgcHJvamVjdGVkX2Nvb3JkX3h5KTtcblxuICB2ZWMyIHZlcnRleF9wb3NfbG9jYWxzcGFjZVs0XTtcbiAgdmVjNF9mcDY0KHZlYzQocG9zaXRpb25zICogb3V0ZXJSYWRpdXNQaXhlbHMsIDAuMCksIHZlcnRleF9wb3NfbG9jYWxzcGFjZSk7XG5cbiAgdmVjMiB2ZXJ0ZXhfcG9zX21vZGVsc3BhY2VbNF07XG4gIHZlcnRleF9wb3NfbW9kZWxzcGFjZVswXSA9IHN1bV9mcDY0KHZlcnRleF9wb3NfbG9jYWxzcGFjZVswXSwgcHJvamVjdGVkX2Nvb3JkX3h5WzBdKTtcbiAgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzFdID0gc3VtX2ZwNjQodmVydGV4X3Bvc19sb2NhbHNwYWNlWzFdLCBwcm9qZWN0ZWRfY29vcmRfeHlbMV0pO1xuICB2ZXJ0ZXhfcG9zX21vZGVsc3BhY2VbMl0gPSBzdW1fZnA2NCh2ZXJ0ZXhfcG9zX2xvY2Fsc3BhY2VbMl0sXG4gICAgdmVjMihwcm9qZWN0X3NjYWxlKGluc3RhbmNlUG9zaXRpb25zLnopLCAwLjApKTtcbiAgdmVydGV4X3Bvc19tb2RlbHNwYWNlWzNdID0gdmVjMigxLjAsIDAuMCk7XG5cbiAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0X3RvX2NsaXBzcGFjZV9mcDY0KHZlcnRleF9wb3NfbW9kZWxzcGFjZSk7XG5cbiAgdkNvbG9yID0gdmVjNChpbnN0YW5jZUNvbG9ycy5yZ2IsIGluc3RhbmNlQ29sb3JzLmEgKiBvcGFjaXR5KSAvIDI1NS47XG5cbiAgLy8gU2V0IGNvbG9yIHRvIGJlIHJlbmRlcmVkIHRvIHBpY2tpbmcgZmJvIChhbHNvIHVzZWQgdG8gY2hlY2sgZm9yIHNlbGVjdGlvbiBoaWdobGlnaHQpLlxuICBwaWNraW5nX3NldFBpY2tpbmdDb2xvcihpbnN0YW5jZVBpY2tpbmdDb2xvcnMpO1xufVxuYDtcbiJdfQ==