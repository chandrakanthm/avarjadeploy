'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.experimental = exports.lighting = exports.project64 = exports.project = exports.OrthographicViewport = exports.PerspectiveViewport = exports.WebMercatorViewport = exports.Viewport = exports.CompositeLayer = exports.Layer = exports.AttributeManager = exports.LayerManager = exports.COORDINATE_SYSTEM = undefined;

var _constants = require('./lib/constants');

Object.defineProperty(exports, 'COORDINATE_SYSTEM', {
  enumerable: true,
  get: function get() {
    return _constants.COORDINATE_SYSTEM;
  }
});

var _layerManager = require('./lib/layer-manager');

Object.defineProperty(exports, 'LayerManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_layerManager).default;
  }
});

var _attributeManager = require('./lib/attribute-manager');

Object.defineProperty(exports, 'AttributeManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_attributeManager).default;
  }
});

var _layer = require('./lib/layer');

Object.defineProperty(exports, 'Layer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_layer).default;
  }
});

var _compositeLayer = require('./lib/composite-layer');

Object.defineProperty(exports, 'CompositeLayer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_compositeLayer).default;
  }
});

var _viewport = require('./viewports/viewport');

Object.defineProperty(exports, 'Viewport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_viewport).default;
  }
});

var _webMercatorViewport = require('./viewports/web-mercator-viewport');

Object.defineProperty(exports, 'WebMercatorViewport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_webMercatorViewport).default;
  }
});

var _perspectiveViewport = require('./viewports/perspective-viewport');

Object.defineProperty(exports, 'PerspectiveViewport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_perspectiveViewport).default;
  }
});

var _orthographicViewport = require('./viewports/orthographic-viewport');

Object.defineProperty(exports, 'OrthographicViewport', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_orthographicViewport).default;
  }
});

var _project = require('./shaderlib/project/project');

Object.defineProperty(exports, 'project', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_project).default;
  }
});

var _project2 = require('./shaderlib/project64/project64');

Object.defineProperty(exports, 'project64', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_project2).default;
  }
});

var _lighting = require('./shaderlib/lighting/lighting');

Object.defineProperty(exports, 'lighting', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_lighting).default;
  }
});

require('./lib/init');

require('./shaderlib');

var _firstPersonState = require('./controllers/first-person-state');

var _firstPersonState2 = _interopRequireDefault(_firstPersonState);

var _orbitState = require('./controllers/orbit-state');

var _orbitState2 = _interopRequireDefault(_orbitState);

var _mapState = require('./controllers/map-state');

var _mapState2 = _interopRequireDefault(_mapState);

var _viewportControls = require('./controllers/viewport-controls');

var _viewportControls2 = _interopRequireDefault(_viewportControls);

var _mapControls = require('./controllers/map-controls');

var _mapControls2 = _interopRequireDefault(_mapControls);

var _firstPersonViewport = require('./viewports/first-person-viewport');

var _firstPersonViewport2 = _interopRequireDefault(_firstPersonViewport);

var _thirdPersonViewport = require('./viewports/third-person-viewport');

var _thirdPersonViewport2 = _interopRequireDefault(_thirdPersonViewport);

var _orbitViewport = require('./viewports/orbit-viewport');

var _orbitViewport2 = _interopRequireDefault(_orbitViewport);

var _deckJs = require('./pure-js/deck-js');

var _deckJs2 = _interopRequireDefault(_deckJs);

var _mapControllerJs = require('./pure-js/map-controller-js');

var _mapControllerJs2 = _interopRequireDefault(_mapControllerJs);

var _orbitControllerJs = require('./pure-js/orbit-controller-js');

var _orbitControllerJs2 = _interopRequireDefault(_orbitControllerJs);

var _effectManager = require('./experimental/lib/effect-manager');

var _effectManager2 = _interopRequireDefault(_effectManager);

var _effect = require('./experimental/lib/effect');

var _effect2 = _interopRequireDefault(_effect);

var _transitionManager = require('./lib/transition-manager');

var _transitionManager2 = _interopRequireDefault(_transitionManager);

var _linearInterpolator = require('./transitions/linear-interpolator');

var _linearInterpolator2 = _interopRequireDefault(_linearInterpolator);

var _viewportFlyToInterpolator = require('./transitions/viewport-fly-to-interpolator');

var _viewportFlyToInterpolator2 = _interopRequireDefault(_viewportFlyToInterpolator);

var _transitionUtils = require('./transitions/transition-utils');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _get = require('./utils/get');

var _count = require('./utils/count');

var _binSorter = require('./utils/bin-sorter');

var _binSorter2 = _interopRequireDefault(_binSorter);

var _colorUtils = require('./utils/color-utils');

var _scaleUtils = require('./utils/scale-utils');

var _flatten = require('./utils/flatten');

var _fp = require('./utils/fp64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// EXPERIMENTAL EXPORTS
// Experimental Features (May change in minor version bumps, use at your own risk)

// Experimental Controllers


// Experimental Pure JS (non-React) bindings


// Experimental Effects (non-React) bindings


// Eperimental Transitions


// INTERNAL EXPORTS

// Layer utilities

// Layer utilities

// TODO - just expose as layer methods instead?


var experimental = exports.experimental = {
  ViewportControls: _viewportControls2.default,
  FirstPersonState: _firstPersonState2.default,
  OrbitState: _orbitState2.default,
  MapState: _mapState2.default,

  Controller: _viewportControls2.default,
  MapController: _mapControls2.default,
  // FirstPersonController,
  // OrbitController,

  FirstPersonViewport: _firstPersonViewport2.default,
  ThirdPersonViewport: _thirdPersonViewport2.default,
  OrbitViewport: _orbitViewport2.default,

  DeckGLJS: _deckJs2.default,
  MapControllerJS: _mapControllerJs2.default,
  OrbitControllerJS: _orbitControllerJs2.default,

  EffectManager: _effectManager2.default,
  Effect: _effect2.default,

  // Transitions
  TRANSITION_EVENTS: _transitionManager.TRANSITION_EVENTS,
  LinearInterpolator: _linearInterpolator2.default,
  ViewportFlyToInterpolator: _viewportFlyToInterpolator2.default,

  // For react module
  TransitionManager: _transitionManager2.default,
  extractViewportFrom: _transitionUtils.extractViewportFrom,

  // For layers
  BinSorter: _binSorter2.default,
  linearScale: _scaleUtils.linearScale,
  getLinearScale: _scaleUtils.getLinearScale,
  quantizeScale: _scaleUtils.quantizeScale,
  getQuantizeScale: _scaleUtils.getQuantizeScale,
  clamp: _scaleUtils.clamp,
  defaultColorRange: _colorUtils.defaultColorRange,

  log: _log2.default,

  get: _get.get,
  count: _count.count,

  flatten: _flatten.flatten,
  countVertices: _flatten.countVertices,
  flattenVertices: _flatten.flattenVertices,
  fillArray: _flatten.fillArray,

  enable64bitSupport: _fp.enable64bitSupport,
  fp64ify: _fp.fp64ify,
  fp64LowPart: _fp.fp64LowPart
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2luZGV4LmpzIl0sIm5hbWVzIjpbIkNPT1JESU5BVEVfU1lTVEVNIiwiZGVmYXVsdCIsImV4cGVyaW1lbnRhbCIsIlZpZXdwb3J0Q29udHJvbHMiLCJGaXJzdFBlcnNvblN0YXRlIiwiT3JiaXRTdGF0ZSIsIk1hcFN0YXRlIiwiQ29udHJvbGxlciIsIk1hcENvbnRyb2xsZXIiLCJGaXJzdFBlcnNvblZpZXdwb3J0IiwiVGhpcmRQZXJzb25WaWV3cG9ydCIsIk9yYml0Vmlld3BvcnQiLCJEZWNrR0xKUyIsIk1hcENvbnRyb2xsZXJKUyIsIk9yYml0Q29udHJvbGxlckpTIiwiRWZmZWN0TWFuYWdlciIsIkVmZmVjdCIsIlRSQU5TSVRJT05fRVZFTlRTIiwiTGluZWFySW50ZXJwb2xhdG9yIiwiVmlld3BvcnRGbHlUb0ludGVycG9sYXRvciIsIlRyYW5zaXRpb25NYW5hZ2VyIiwiZXh0cmFjdFZpZXdwb3J0RnJvbSIsIkJpblNvcnRlciIsImxpbmVhclNjYWxlIiwiZ2V0TGluZWFyU2NhbGUiLCJxdWFudGl6ZVNjYWxlIiwiZ2V0UXVhbnRpemVTY2FsZSIsImNsYW1wIiwiZGVmYXVsdENvbG9yUmFuZ2UiLCJsb2ciLCJnZXQiLCJjb3VudCIsImZsYXR0ZW4iLCJjb3VudFZlcnRpY2VzIiwiZmxhdHRlblZlcnRpY2VzIiwiZmlsbEFycmF5IiwiZW5hYmxlNjRiaXRTdXBwb3J0IiwiZnA2NGlmeSIsImZwNjRMb3dQYXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBNEJRQSxpQjs7Ozs7Ozs7O2lEQUNBQyxPOzs7Ozs7Ozs7cURBQ0FBLE87Ozs7Ozs7OzswQ0FDQUEsTzs7Ozs7Ozs7O21EQUNBQSxPOzs7Ozs7Ozs7NkNBR0FBLE87Ozs7Ozs7Ozt3REFDQUEsTzs7Ozs7Ozs7O3dEQUNBQSxPOzs7Ozs7Ozs7eURBQ0FBLE87Ozs7Ozs7Ozs0Q0FHQUEsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7QUFyQlI7O0FBR0E7O0FBdUJBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBS0E7O0FBS0E7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUNBOztBQUNBOztBQUdBOztBQUVBOzs7O0FBaERBO0FBQ0E7O0FBTUE7OztBQVFBOzs7QUFLQTs7O0FBSUE7OztBQUtBOztBQUtBOztBQUVBOztBQVdBOzs7QUFJTyxJQUFNQyxzQ0FBZTtBQUMxQkMsOENBRDBCO0FBRTFCQyw4Q0FGMEI7QUFHMUJDLGtDQUgwQjtBQUkxQkMsOEJBSjBCOztBQU0xQkMsd0NBTjBCO0FBTzFCQyxzQ0FQMEI7QUFRMUI7QUFDQTs7QUFFQUMsb0RBWDBCO0FBWTFCQyxvREFaMEI7QUFhMUJDLHdDQWIwQjs7QUFlMUJDLDRCQWYwQjtBQWdCMUJDLDRDQWhCMEI7QUFpQjFCQyxnREFqQjBCOztBQW1CMUJDLHdDQW5CMEI7QUFvQjFCQywwQkFwQjBCOztBQXNCMUI7QUFDQUMseURBdkIwQjtBQXdCMUJDLGtEQXhCMEI7QUF5QjFCQyxnRUF6QjBCOztBQTJCMUI7QUFDQUMsZ0RBNUIwQjtBQTZCMUJDLDJEQTdCMEI7O0FBK0IxQjtBQUNBQyxnQ0FoQzBCO0FBaUMxQkMsc0NBakMwQjtBQWtDMUJDLDRDQWxDMEI7QUFtQzFCQywwQ0FuQzBCO0FBb0MxQkMsZ0RBcEMwQjtBQXFDMUJDLDBCQXJDMEI7QUFzQzFCQyxrREF0QzBCOztBQXdDMUJDLG9CQXhDMEI7O0FBMEMxQkMsZUExQzBCO0FBMkMxQkMscUJBM0MwQjs7QUE2QzFCQywyQkE3QzBCO0FBOEMxQkMsdUNBOUMwQjtBQStDMUJDLDJDQS9DMEI7QUFnRDFCQywrQkFoRDBCOztBQWtEMUJDLDRDQWxEMEI7QUFtRDFCQyxzQkFuRDBCO0FBb0QxQkM7QUFwRDBCLENBQXJCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbi8vIEludGlhbGl6ZSBnbG9iYWxzLCBjaGVjayB2ZXJzaW9uXG5pbXBvcnQgJy4vbGliL2luaXQnO1xuXG4vLyBJbXBvcnQgc2hhZGVybGliIHRvIG1ha2Ugc3VyZSBzaGFkZXIgbW9kdWxlcyBhcmUgaW5pdGlhbGl6ZWRcbmltcG9ydCAnLi9zaGFkZXJsaWInO1xuXG4vLyBDb3JlIExpYnJhcnlcbmV4cG9ydCB7Q09PUkRJTkFURV9TWVNURU19IGZyb20gJy4vbGliL2NvbnN0YW50cyc7XG5leHBvcnQge2RlZmF1bHQgYXMgTGF5ZXJNYW5hZ2VyfSBmcm9tICcuL2xpYi9sYXllci1tYW5hZ2VyJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBBdHRyaWJ1dGVNYW5hZ2VyfSBmcm9tICcuL2xpYi9hdHRyaWJ1dGUtbWFuYWdlcic7XG5leHBvcnQge2RlZmF1bHQgYXMgTGF5ZXJ9IGZyb20gJy4vbGliL2xheWVyJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb21wb3NpdGVMYXllcn0gZnJvbSAnLi9saWIvY29tcG9zaXRlLWxheWVyJztcblxuLy8gVmlld3BvcnRzXG5leHBvcnQge2RlZmF1bHQgYXMgVmlld3BvcnR9IGZyb20gJy4vdmlld3BvcnRzL3ZpZXdwb3J0JztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBXZWJNZXJjYXRvclZpZXdwb3J0fSBmcm9tICcuL3ZpZXdwb3J0cy93ZWItbWVyY2F0b3Itdmlld3BvcnQnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFBlcnNwZWN0aXZlVmlld3BvcnR9IGZyb20gJy4vdmlld3BvcnRzL3BlcnNwZWN0aXZlLXZpZXdwb3J0JztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBPcnRob2dyYXBoaWNWaWV3cG9ydH0gZnJvbSAnLi92aWV3cG9ydHMvb3J0aG9ncmFwaGljLXZpZXdwb3J0JztcblxuLy8gU2hhZGVyIG1vZHVsZXNcbmV4cG9ydCB7ZGVmYXVsdCBhcyBwcm9qZWN0fSBmcm9tICcuL3NoYWRlcmxpYi9wcm9qZWN0L3Byb2plY3QnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIHByb2plY3Q2NH0gZnJvbSAnLi9zaGFkZXJsaWIvcHJvamVjdDY0L3Byb2plY3Q2NCc7XG5leHBvcnQge2RlZmF1bHQgYXMgbGlnaHRpbmd9IGZyb20gJy4vc2hhZGVybGliL2xpZ2h0aW5nL2xpZ2h0aW5nJztcblxuLy8gRVhQRVJJTUVOVEFMIEVYUE9SVFNcbi8vIEV4cGVyaW1lbnRhbCBGZWF0dXJlcyAoTWF5IGNoYW5nZSBpbiBtaW5vciB2ZXJzaW9uIGJ1bXBzLCB1c2UgYXQgeW91ciBvd24gcmlzaylcblxuaW1wb3J0IHtkZWZhdWx0IGFzIEZpcnN0UGVyc29uU3RhdGV9IGZyb20gJy4vY29udHJvbGxlcnMvZmlyc3QtcGVyc29uLXN0YXRlJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBPcmJpdFN0YXRlfSBmcm9tICcuL2NvbnRyb2xsZXJzL29yYml0LXN0YXRlJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBNYXBTdGF0ZX0gZnJvbSAnLi9jb250cm9sbGVycy9tYXAtc3RhdGUnO1xuXG4vLyBFeHBlcmltZW50YWwgQ29udHJvbGxlcnNcbmltcG9ydCB7ZGVmYXVsdCBhcyBDb250cm9sbGVyfSBmcm9tICcuL2NvbnRyb2xsZXJzL3ZpZXdwb3J0LWNvbnRyb2xzJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBNYXBDb250cm9sbGVyfSBmcm9tICcuL2NvbnRyb2xsZXJzL21hcC1jb250cm9scyc7XG5cbmltcG9ydCB7ZGVmYXVsdCBhcyBGaXJzdFBlcnNvblZpZXdwb3J0fSBmcm9tICcuL3ZpZXdwb3J0cy9maXJzdC1wZXJzb24tdmlld3BvcnQnO1xuaW1wb3J0IHtkZWZhdWx0IGFzIFRoaXJkUGVyc29uVmlld3BvcnR9IGZyb20gJy4vdmlld3BvcnRzL3RoaXJkLXBlcnNvbi12aWV3cG9ydCc7XG5pbXBvcnQge2RlZmF1bHQgYXMgT3JiaXRWaWV3cG9ydH0gZnJvbSAnLi92aWV3cG9ydHMvb3JiaXQtdmlld3BvcnQnO1xuXG4vLyBFeHBlcmltZW50YWwgUHVyZSBKUyAobm9uLVJlYWN0KSBiaW5kaW5nc1xuaW1wb3J0IHtkZWZhdWx0IGFzIERlY2tHTEpTfSBmcm9tICcuL3B1cmUtanMvZGVjay1qcyc7XG5pbXBvcnQge2RlZmF1bHQgYXMgTWFwQ29udHJvbGxlckpTfSBmcm9tICcuL3B1cmUtanMvbWFwLWNvbnRyb2xsZXItanMnO1xuaW1wb3J0IHtkZWZhdWx0IGFzIE9yYml0Q29udHJvbGxlckpTfSBmcm9tICcuL3B1cmUtanMvb3JiaXQtY29udHJvbGxlci1qcyc7XG5cbi8vIEV4cGVyaW1lbnRhbCBFZmZlY3RzIChub24tUmVhY3QpIGJpbmRpbmdzXG5pbXBvcnQge2RlZmF1bHQgYXMgRWZmZWN0TWFuYWdlcn0gZnJvbSAnLi9leHBlcmltZW50YWwvbGliL2VmZmVjdC1tYW5hZ2VyJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBFZmZlY3R9IGZyb20gJy4vZXhwZXJpbWVudGFsL2xpYi9lZmZlY3QnO1xuXG4vLyBFcGVyaW1lbnRhbCBUcmFuc2l0aW9uc1xuaW1wb3J0IHtUUkFOU0lUSU9OX0VWRU5UU30gZnJvbSAnLi9saWIvdHJhbnNpdGlvbi1tYW5hZ2VyJztcbmltcG9ydCB7ZGVmYXVsdCBhcyBMaW5lYXJJbnRlcnBvbGF0b3J9IGZyb20gJy4vdHJhbnNpdGlvbnMvbGluZWFyLWludGVycG9sYXRvcic7XG5pbXBvcnQge2RlZmF1bHQgYXMgVmlld3BvcnRGbHlUb0ludGVycG9sYXRvcn0gZnJvbSAnLi90cmFuc2l0aW9ucy92aWV3cG9ydC1mbHktdG8taW50ZXJwb2xhdG9yJztcblxuLy8gSU5URVJOQUwgRVhQT1JUU1xuXG5pbXBvcnQgVHJhbnNpdGlvbk1hbmFnZXIgZnJvbSAnLi9saWIvdHJhbnNpdGlvbi1tYW5hZ2VyJztcbmltcG9ydCB7ZXh0cmFjdFZpZXdwb3J0RnJvbX0gZnJvbSAnLi90cmFuc2l0aW9ucy90cmFuc2l0aW9uLXV0aWxzJztcblxuLy8gTGF5ZXIgdXRpbGl0aWVzXG5cbi8vIExheWVyIHV0aWxpdGllc1xuaW1wb3J0IHtkZWZhdWx0IGFzIGxvZ30gZnJvbSAnLi91dGlscy9sb2cnO1xuaW1wb3J0IHtnZXR9IGZyb20gJy4vdXRpbHMvZ2V0JztcbmltcG9ydCB7Y291bnR9IGZyb20gJy4vdXRpbHMvY291bnQnO1xuXG5pbXBvcnQge2RlZmF1bHQgYXMgQmluU29ydGVyfSBmcm9tICcuL3V0aWxzL2Jpbi1zb3J0ZXInO1xuaW1wb3J0IHtkZWZhdWx0Q29sb3JSYW5nZX0gZnJvbSAnLi91dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge2xpbmVhclNjYWxlLCBnZXRMaW5lYXJTY2FsZSwgcXVhbnRpemVTY2FsZSwgZ2V0UXVhbnRpemVTY2FsZX0gZnJvbSAnLi91dGlscy9zY2FsZS11dGlscyc7XG5pbXBvcnQge2NsYW1wfSBmcm9tICcuL3V0aWxzL3NjYWxlLXV0aWxzJztcblxuaW1wb3J0IHtmbGF0dGVuLCBjb3VudFZlcnRpY2VzLCBmbGF0dGVuVmVydGljZXMsIGZpbGxBcnJheX0gZnJvbSAnLi91dGlscy9mbGF0dGVuJztcbi8vIFRPRE8gLSBqdXN0IGV4cG9zZSBhcyBsYXllciBtZXRob2RzIGluc3RlYWQ/XG5pbXBvcnQge2VuYWJsZTY0Yml0U3VwcG9ydH0gZnJvbSAnLi91dGlscy9mcDY0JztcbmltcG9ydCB7ZnA2NGlmeSwgZnA2NExvd1BhcnR9IGZyb20gJy4vdXRpbHMvZnA2NCc7XG5cbmV4cG9ydCBjb25zdCBleHBlcmltZW50YWwgPSB7XG4gIFZpZXdwb3J0Q29udHJvbHM6IENvbnRyb2xsZXIsXG4gIEZpcnN0UGVyc29uU3RhdGUsXG4gIE9yYml0U3RhdGUsXG4gIE1hcFN0YXRlLFxuXG4gIENvbnRyb2xsZXIsXG4gIE1hcENvbnRyb2xsZXIsXG4gIC8vIEZpcnN0UGVyc29uQ29udHJvbGxlcixcbiAgLy8gT3JiaXRDb250cm9sbGVyLFxuXG4gIEZpcnN0UGVyc29uVmlld3BvcnQsXG4gIFRoaXJkUGVyc29uVmlld3BvcnQsXG4gIE9yYml0Vmlld3BvcnQsXG5cbiAgRGVja0dMSlMsXG4gIE1hcENvbnRyb2xsZXJKUyxcbiAgT3JiaXRDb250cm9sbGVySlMsXG5cbiAgRWZmZWN0TWFuYWdlcixcbiAgRWZmZWN0LFxuXG4gIC8vIFRyYW5zaXRpb25zXG4gIFRSQU5TSVRJT05fRVZFTlRTLFxuICBMaW5lYXJJbnRlcnBvbGF0b3IsXG4gIFZpZXdwb3J0Rmx5VG9JbnRlcnBvbGF0b3IsXG5cbiAgLy8gRm9yIHJlYWN0IG1vZHVsZVxuICBUcmFuc2l0aW9uTWFuYWdlcixcbiAgZXh0cmFjdFZpZXdwb3J0RnJvbSxcblxuICAvLyBGb3IgbGF5ZXJzXG4gIEJpblNvcnRlcixcbiAgbGluZWFyU2NhbGUsXG4gIGdldExpbmVhclNjYWxlLFxuICBxdWFudGl6ZVNjYWxlLFxuICBnZXRRdWFudGl6ZVNjYWxlLFxuICBjbGFtcCxcbiAgZGVmYXVsdENvbG9yUmFuZ2UsXG5cbiAgbG9nLFxuXG4gIGdldCxcbiAgY291bnQsXG5cbiAgZmxhdHRlbixcbiAgY291bnRWZXJ0aWNlcyxcbiAgZmxhdHRlblZlcnRpY2VzLFxuICBmaWxsQXJyYXksXG5cbiAgZW5hYmxlNjRiaXRTdXBwb3J0LFxuICBmcDY0aWZ5LFxuICBmcDY0TG93UGFydFxufTtcbiJdfQ==