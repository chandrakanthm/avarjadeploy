'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = require('../../core');

var _hexagonCellLayer = require('../hexagon-cell-layer/hexagon-cell-layer');

var _hexagonCellLayer2 = _interopRequireDefault(_hexagonCellLayer);

var _hexagonAggregator2 = require('./hexagon-aggregator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

var log = _core.experimental.log,
    BinSorter = _core.experimental.BinSorter,
    getQuantizeScale = _core.experimental.getQuantizeScale,
    getLinearScale = _core.experimental.getLinearScale,
    defaultColorRange = _core.experimental.defaultColorRange;


function nop() {}

var defaultProps = {
  // color
  colorDomain: null,
  colorRange: defaultColorRange,
  getColorValue: function getColorValue(points) {
    return points.length;
  },
  lowerPercentile: 0,
  upperPercentile: 100,
  onSetColorDomain: nop,

  // elevation
  elevationDomain: null,
  elevationRange: [0, 1000],
  getElevationValue: function getElevationValue(points) {
    return points.length;
  },
  elevationLowerPercentile: 0,
  elevationUpperPercentile: 100,
  elevationScale: 1,
  onSetElevationDomain: nop,

  radius: 1000,
  coverage: 1,
  extruded: false,
  hexagonAggregator: _hexagonAggregator2.pointToHexbin,
  getPosition: function getPosition(x) {
    return x.position;
  },
  fp64: false,
  // Optional settings for 'lighting' shader module
  lightSettings: {
    lightsPosition: [-122.45, 37.75, 8000, -122.0, 38.0, 5000],
    ambientRatio: 0.05,
    diffuseRatio: 0.6,
    specularRatio: 0.8,
    lightsStrength: [2.0, 0.0, 0.0, 0.0],
    numberOfLights: 2
  }
};

var HexagonLayer = function (_CompositeLayer) {
  _inherits(HexagonLayer, _CompositeLayer);

  function HexagonLayer(props) {
    _classCallCheck(this, HexagonLayer);

    if (!props.hexagonAggregator && !props.radius) {
      log.once(0, 'HexagonLayer: Default hexagonAggregator requires radius prop to be set, ' + 'Now using 1000 meter as default');

      props.radius = defaultProps.radius;
    }

    if (Number.isFinite(props.upperPercentile) && (props.upperPercentile > 100 || props.upperPercentile < 0)) {
      log.once(0, 'HexagonLayer: upperPercentile should be between 0 and 100. ' + 'Assign to 100 by default');

      props.upperPercentile = defaultProps.upperPercentile;
    }

    if (Number.isFinite(props.lowerPercentile) && (props.lowerPercentile > 100 || props.lowerPercentile < 0)) {
      log.once(0, 'HexagonLayer: lowerPercentile should be between 0 and 100. ' + 'Assign to 0 by default');

      props.lowerPercentile = defaultProps.upperPercentile;
    }

    if (props.lowerPercentile >= props.upperPercentile) {
      log.once(0, 'HexagonLayer: lowerPercentile should not be bigger than ' + 'upperPercentile. Assign to 0 by default');

      props.lowerPercentile = defaultProps.lowerPercentile;
    }

    return _possibleConstructorReturn(this, (HexagonLayer.__proto__ || Object.getPrototypeOf(HexagonLayer)).call(this, props));
  }

  _createClass(HexagonLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      this.state = {
        hexagons: [],
        hexagonVertices: null,
        sortedColorBins: null,
        sortedElevationBins: null,
        colorValueDomain: null,
        elevationValueDomain: null,
        colorScaleFunc: nop,
        elevationScaleFunc: nop,
        dimensionUpdaters: this.getDimensionUpdaters()
      };
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref) {
      var _this2 = this;

      var oldProps = _ref.oldProps,
          props = _ref.props,
          changeFlags = _ref.changeFlags;

      var dimensionChanges = this.getDimensionChanges(oldProps, props);

      if (changeFlags.dataChanged || this.needsReProjectPoints(oldProps, props)) {
        // project data into hexagons, and get sortedColorBins
        this.getHexagons();
      } else if (dimensionChanges) {
        dimensionChanges.forEach(function (f) {
          return typeof f === 'function' && f.apply(_this2);
        });
      }
    }
  }, {
    key: 'needsReProjectPoints',
    value: function needsReProjectPoints(oldProps, props) {
      return oldProps.radius !== props.radius || oldProps.hexagonAggregator !== props.hexagonAggregator;
    }
  }, {
    key: 'getDimensionUpdaters',
    value: function getDimensionUpdaters() {
      // dimension updaters are sequential,
      // if the first one needs to be called, the 2nd and 3rd one will automatically
      // be called. e.g. if ColorValue needs to be updated, getColorValueDomain and getColorScale
      // will automatically be called
      return {
        getColor: [{
          id: 'value',
          triggers: ['getColorValue'],
          updater: this.getSortedColorBins
        }, {
          id: 'domain',
          triggers: ['lowerPercentile', 'upperPercentile'],
          updater: this.getColorValueDomain
        }, {
          id: 'scaleFunc',
          triggers: ['colorDomain', 'colorRange'],
          updater: this.getColorScale
        }],
        getElevation: [{
          id: 'value',
          triggers: ['getElevationValue'],
          updater: this.getSortedElevationBins
        }, {
          id: 'domain',
          triggers: ['elevationLowerPercentile', 'elevationUpperPercentile'],
          updater: this.getElevationValueDomain
        }, {
          id: 'scaleFunc',
          triggers: ['elevationDomain', 'elevationRange'],
          updater: this.getElevationScale
        }]
      };
    }
  }, {
    key: 'getDimensionChanges',
    value: function getDimensionChanges(oldProps, props) {
      var dimensionUpdaters = this.state.dimensionUpdaters;

      var updaters = [];

      // get dimension to be updated
      for (var dimensionKey in dimensionUpdaters) {
        // return the first triggered updater for each dimension
        var needUpdate = dimensionUpdaters[dimensionKey].find(function (item) {
          return item.triggers.some(function (t) {
            return oldProps[t] !== props[t];
          });
        });

        if (needUpdate) {
          updaters.push(needUpdate.updater);
        }
      }

      return updaters.length ? updaters : null;
    }
  }, {
    key: 'getHexagons',
    value: function getHexagons() {
      var hexagonAggregator = this.props.hexagonAggregator;
      var viewport = this.context.viewport;

      var _hexagonAggregator = hexagonAggregator(this.props, viewport),
          hexagons = _hexagonAggregator.hexagons,
          hexagonVertices = _hexagonAggregator.hexagonVertices;

      this.setState({ hexagons: hexagons, hexagonVertices: hexagonVertices });
      this.getSortedBins();
    }
  }, {
    key: 'getPickingInfo',
    value: function getPickingInfo(_ref2) {
      var info = _ref2.info;
      var _state = this.state,
          sortedColorBins = _state.sortedColorBins,
          sortedElevationBins = _state.sortedElevationBins;

      var isPicked = info.picked && info.index > -1;

      var object = null;
      if (isPicked) {
        var cell = this.state.hexagons[info.index];

        var colorValue = sortedColorBins.binMap[cell.index] && sortedColorBins.binMap[cell.index].value;
        var elevationValue = sortedElevationBins.binMap[cell.index] && sortedElevationBins.binMap[cell.index].value;

        object = Object.assign({
          colorValue: colorValue,
          elevationValue: elevationValue
        }, cell);
      }

      // add bin colorValue and elevationValue to info
      return Object.assign(info, {
        picked: Boolean(object),
        // override object with picked cell
        object: object
      });
    }
  }, {
    key: 'getUpdateTriggers',
    value: function getUpdateTriggers() {
      var _this3 = this;

      var dimensionUpdaters = this.state.dimensionUpdaters;

      // merge all dimension triggers

      var updateTriggers = {};

      var _loop = function _loop(dimensionKey) {
        updateTriggers[dimensionKey] = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dimensionUpdaters[dimensionKey][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var step = _step.value;

            step.triggers.forEach(function (prop) {
              updateTriggers[dimensionKey][prop] = _this3.props[prop];
            });
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
      };

      for (var dimensionKey in dimensionUpdaters) {
        _loop(dimensionKey);
      }

      return updateTriggers;
    }
  }, {
    key: 'getValueDomain',
    value: function getValueDomain() {
      this.getColorValueDomain();
      this.getElevationValueDomain();
    }
  }, {
    key: 'getSortedBins',
    value: function getSortedBins() {
      this.getSortedColorBins();
      this.getSortedElevationBins();
    }
  }, {
    key: 'getSortedColorBins',
    value: function getSortedColorBins() {
      var getColorValue = this.props.getColorValue;

      var sortedColorBins = new BinSorter(this.state.hexagons || [], getColorValue);

      this.setState({ sortedColorBins: sortedColorBins });
      this.getColorValueDomain();
    }
  }, {
    key: 'getSortedElevationBins',
    value: function getSortedElevationBins() {
      var getElevationValue = this.props.getElevationValue;

      var sortedElevationBins = new BinSorter(this.state.hexagons || [], getElevationValue);
      this.setState({ sortedElevationBins: sortedElevationBins });
      this.getElevationValueDomain();
    }
  }, {
    key: 'getColorValueDomain',
    value: function getColorValueDomain() {
      var _props = this.props,
          lowerPercentile = _props.lowerPercentile,
          upperPercentile = _props.upperPercentile,
          onSetColorDomain = _props.onSetColorDomain;


      this.state.colorValueDomain = this.state.sortedColorBins.getValueRange([lowerPercentile, upperPercentile]);

      if (typeof onSetColorDomain === 'function') {
        onSetColorDomain(this.state.colorValueDomain);
      }

      this.getColorScale();
    }
  }, {
    key: 'getElevationValueDomain',
    value: function getElevationValueDomain() {
      var _props2 = this.props,
          elevationLowerPercentile = _props2.elevationLowerPercentile,
          elevationUpperPercentile = _props2.elevationUpperPercentile,
          onSetElevationDomain = _props2.onSetElevationDomain;


      this.state.elevationValueDomain = this.state.sortedElevationBins.getValueRange([elevationLowerPercentile, elevationUpperPercentile]);

      if (typeof onSetElevationDomain === 'function') {
        onSetElevationDomain(this.state.elevationValueDomain);
      }

      this.getElevationScale();
    }
  }, {
    key: 'getColorScale',
    value: function getColorScale() {
      var colorRange = this.props.colorRange;

      var colorDomain = this.props.colorDomain || this.state.colorValueDomain;

      this.state.colorScaleFunc = getQuantizeScale(colorDomain, colorRange);
    }
  }, {
    key: 'getElevationScale',
    value: function getElevationScale() {
      var elevationRange = this.props.elevationRange;

      var elevationDomain = this.props.elevationDomain || this.state.elevationValueDomain;

      this.state.elevationScaleFunc = getLinearScale(elevationDomain, elevationRange);
    }
  }, {
    key: '_onGetSublayerColor',
    value: function _onGetSublayerColor(cell) {
      var _state2 = this.state,
          sortedColorBins = _state2.sortedColorBins,
          colorScaleFunc = _state2.colorScaleFunc,
          colorValueDomain = _state2.colorValueDomain;


      var cv = sortedColorBins.binMap[cell.index] && sortedColorBins.binMap[cell.index].value;
      var colorDomain = this.props.colorDomain || colorValueDomain;

      var isColorValueInDomain = cv >= colorDomain[0] && cv <= colorDomain[colorDomain.length - 1];

      // if cell value is outside domain, set alpha to 0
      var color = isColorValueInDomain ? colorScaleFunc(cv) : [0, 0, 0, 0];

      // add alpha to color if not defined in colorRange
      color[3] = Number.isFinite(color[3]) ? color[3] : 255;

      return color;
    }
  }, {
    key: '_onGetSublayerElevation',
    value: function _onGetSublayerElevation(cell) {
      var _state3 = this.state,
          sortedElevationBins = _state3.sortedElevationBins,
          elevationScaleFunc = _state3.elevationScaleFunc,
          elevationValueDomain = _state3.elevationValueDomain;

      var ev = sortedElevationBins.binMap[cell.index] && sortedElevationBins.binMap[cell.index].value;

      var elevationDomain = this.props.elevationDomain || elevationValueDomain;

      var isElevationValueInDomain = ev >= elevationDomain[0] && ev <= elevationDomain[elevationDomain.length - 1];

      // if cell value is outside domain, set elevation to -1
      return isElevationValueInDomain ? elevationScaleFunc(ev) : -1;
    }

    // for subclassing, override this method to return
    // customized sub layer props

  }, {
    key: 'getSubLayerProps',
    value: function getSubLayerProps() {
      var _props3 = this.props,
          radius = _props3.radius,
          elevationScale = _props3.elevationScale,
          extruded = _props3.extruded,
          coverage = _props3.coverage,
          lightSettings = _props3.lightSettings,
          fp64 = _props3.fp64;

      // return props to the sublayer constructor

      return _get(HexagonLayer.prototype.__proto__ || Object.getPrototypeOf(HexagonLayer.prototype), 'getSubLayerProps', this).call(this, {
        id: 'hexagon-cell',
        data: this.state.hexagons,

        fp64: fp64,
        hexagonVertices: this.state.hexagonVertices,
        radius: radius,
        elevationScale: elevationScale,
        angle: Math.PI,
        extruded: extruded,
        coverage: coverage,
        lightSettings: lightSettings,

        getColor: this._onGetSublayerColor.bind(this),
        getElevation: this._onGetSublayerElevation.bind(this),
        updateTriggers: this.getUpdateTriggers()
      });
    }

    // for subclassing, override this method to return
    // customized sub layer class

  }, {
    key: 'getSubLayerClass',
    value: function getSubLayerClass() {
      return _hexagonCellLayer2.default;
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
      var SubLayerClass = this.getSubLayerClass();

      return new SubLayerClass(this.getSubLayerProps());
    }
  }]);

  return HexagonLayer;
}(_core.CompositeLayer);

exports.default = HexagonLayer;


HexagonLayer.layerName = 'HexagonLayer';
HexagonLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9oZXhhZ29uLWxheWVyL2hleGFnb24tbGF5ZXIuanMiXSwibmFtZXMiOlsibG9nIiwiQmluU29ydGVyIiwiZ2V0UXVhbnRpemVTY2FsZSIsImdldExpbmVhclNjYWxlIiwiZGVmYXVsdENvbG9yUmFuZ2UiLCJub3AiLCJkZWZhdWx0UHJvcHMiLCJjb2xvckRvbWFpbiIsImNvbG9yUmFuZ2UiLCJnZXRDb2xvclZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwibG93ZXJQZXJjZW50aWxlIiwidXBwZXJQZXJjZW50aWxlIiwib25TZXRDb2xvckRvbWFpbiIsImVsZXZhdGlvbkRvbWFpbiIsImVsZXZhdGlvblJhbmdlIiwiZ2V0RWxldmF0aW9uVmFsdWUiLCJlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUiLCJlbGV2YXRpb25VcHBlclBlcmNlbnRpbGUiLCJlbGV2YXRpb25TY2FsZSIsIm9uU2V0RWxldmF0aW9uRG9tYWluIiwicmFkaXVzIiwiY292ZXJhZ2UiLCJleHRydWRlZCIsImhleGFnb25BZ2dyZWdhdG9yIiwiZ2V0UG9zaXRpb24iLCJ4IiwicG9zaXRpb24iLCJmcDY0IiwibGlnaHRTZXR0aW5ncyIsImxpZ2h0c1Bvc2l0aW9uIiwiYW1iaWVudFJhdGlvIiwiZGlmZnVzZVJhdGlvIiwic3BlY3VsYXJSYXRpbyIsImxpZ2h0c1N0cmVuZ3RoIiwibnVtYmVyT2ZMaWdodHMiLCJIZXhhZ29uTGF5ZXIiLCJwcm9wcyIsIm9uY2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInN0YXRlIiwiaGV4YWdvbnMiLCJoZXhhZ29uVmVydGljZXMiLCJzb3J0ZWRDb2xvckJpbnMiLCJzb3J0ZWRFbGV2YXRpb25CaW5zIiwiY29sb3JWYWx1ZURvbWFpbiIsImVsZXZhdGlvblZhbHVlRG9tYWluIiwiY29sb3JTY2FsZUZ1bmMiLCJlbGV2YXRpb25TY2FsZUZ1bmMiLCJkaW1lbnNpb25VcGRhdGVycyIsImdldERpbWVuc2lvblVwZGF0ZXJzIiwib2xkUHJvcHMiLCJjaGFuZ2VGbGFncyIsImRpbWVuc2lvbkNoYW5nZXMiLCJnZXREaW1lbnNpb25DaGFuZ2VzIiwiZGF0YUNoYW5nZWQiLCJuZWVkc1JlUHJvamVjdFBvaW50cyIsImdldEhleGFnb25zIiwiZm9yRWFjaCIsImYiLCJhcHBseSIsImdldENvbG9yIiwiaWQiLCJ0cmlnZ2VycyIsInVwZGF0ZXIiLCJnZXRTb3J0ZWRDb2xvckJpbnMiLCJnZXRDb2xvclZhbHVlRG9tYWluIiwiZ2V0Q29sb3JTY2FsZSIsImdldEVsZXZhdGlvbiIsImdldFNvcnRlZEVsZXZhdGlvbkJpbnMiLCJnZXRFbGV2YXRpb25WYWx1ZURvbWFpbiIsImdldEVsZXZhdGlvblNjYWxlIiwidXBkYXRlcnMiLCJkaW1lbnNpb25LZXkiLCJuZWVkVXBkYXRlIiwiZmluZCIsIml0ZW0iLCJzb21lIiwidCIsInB1c2giLCJ2aWV3cG9ydCIsImNvbnRleHQiLCJzZXRTdGF0ZSIsImdldFNvcnRlZEJpbnMiLCJpbmZvIiwiaXNQaWNrZWQiLCJwaWNrZWQiLCJpbmRleCIsIm9iamVjdCIsImNlbGwiLCJjb2xvclZhbHVlIiwiYmluTWFwIiwidmFsdWUiLCJlbGV2YXRpb25WYWx1ZSIsIk9iamVjdCIsImFzc2lnbiIsIkJvb2xlYW4iLCJ1cGRhdGVUcmlnZ2VycyIsInN0ZXAiLCJwcm9wIiwiZ2V0VmFsdWVSYW5nZSIsImN2IiwiaXNDb2xvclZhbHVlSW5Eb21haW4iLCJjb2xvciIsImV2IiwiaXNFbGV2YXRpb25WYWx1ZUluRG9tYWluIiwiZGF0YSIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiX29uR2V0U3VibGF5ZXJDb2xvciIsImJpbmQiLCJfb25HZXRTdWJsYXllckVsZXZhdGlvbiIsImdldFVwZGF0ZVRyaWdnZXJzIiwiU3ViTGF5ZXJDbGFzcyIsImdldFN1YkxheWVyQ2xhc3MiLCJnZXRTdWJMYXllclByb3BzIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBb0JBOztBQUNBOzs7O0FBSUE7Ozs7Ozs7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LGtCQUo0QjtBQUs1QmUseUJBQWlCLEtBQUtGLEtBQUwsQ0FBV0UsZUFMQTtBQU01QnRCLHNCQU40QjtBQU81QkYsc0NBUDRCO0FBUTVCeUYsZUFBT0MsS0FBS0MsRUFSZ0I7QUFTNUJ2RiwwQkFUNEI7QUFVNUJELDBCQVY0QjtBQVc1Qk8sb0NBWDRCOztBQWE1QmlDLGtCQUFVLEtBQUtpRCxtQkFBTCxDQUF5QkMsSUFBekIsQ0FBOEIsSUFBOUIsQ0Fia0I7QUFjNUIzQyxzQkFBYyxLQUFLNEMsdUJBQUwsQ0FBNkJELElBQTdCLENBQWtDLElBQWxDLENBZGM7QUFlNUJkLHdCQUFnQixLQUFLZ0IsaUJBQUw7QUFmWSxPQUE5QjtBQWlCRDs7QUFFRDtBQUNBOzs7O3VDQUNtQjtBQUNqQjtBQUNEOzs7bUNBRWM7QUFDYixVQUFNQyxnQkFBZ0IsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsYUFBTyxJQUFJRCxhQUFKLENBQWtCLEtBQUtFLGdCQUFMLEVBQWxCLENBQVA7QUFDRDs7Ozs7O2tCQTlVa0JqRixZOzs7QUFpVnJCQSxhQUFha0YsU0FBYixHQUF5QixjQUF6QjtBQUNBbEYsYUFBYS9CLFlBQWIsR0FBNEJBLFlBQTVCIiwiZmlsZSI6ImhleGFnb24tbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtDb21wb3NpdGVMYXllciwgZXhwZXJpbWVudGFsfSBmcm9tICcuLi8uLi9jb3JlJztcbmltcG9ydCBIZXhhZ29uQ2VsbExheWVyIGZyb20gJy4uL2hleGFnb24tY2VsbC1sYXllci9oZXhhZ29uLWNlbGwtbGF5ZXInO1xuXG5jb25zdCB7bG9nLCBCaW5Tb3J0ZXIsIGdldFF1YW50aXplU2NhbGUsIGdldExpbmVhclNjYWxlLCBkZWZhdWx0Q29sb3JSYW5nZX0gPSBleHBlcmltZW50YWw7XG5cbmltcG9ydCB7cG9pbnRUb0hleGJpbn0gZnJvbSAnLi9oZXhhZ29uLWFnZ3JlZ2F0b3InO1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC8vIGNvbG9yXG4gIGNvbG9yRG9tYWluOiBudWxsLFxuICBjb2xvclJhbmdlOiBkZWZhdWx0Q29sb3JSYW5nZSxcbiAgZ2V0Q29sb3JWYWx1ZTogcG9pbnRzID0+IHBvaW50cy5sZW5ndGgsXG4gIGxvd2VyUGVyY2VudGlsZTogMCxcbiAgdXBwZXJQZXJjZW50aWxlOiAxMDAsXG4gIG9uU2V0Q29sb3JEb21haW46IG5vcCxcblxuICAvLyBlbGV2YXRpb25cbiAgZWxldmF0aW9uRG9tYWluOiBudWxsLFxuICBlbGV2YXRpb25SYW5nZTogWzAsIDEwMDBdLFxuICBnZXRFbGV2YXRpb25WYWx1ZTogcG9pbnRzID0+IHBvaW50cy5sZW5ndGgsXG4gIGVsZXZhdGlvbkxvd2VyUGVyY2VudGlsZTogMCxcbiAgZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlOiAxMDAsXG4gIGVsZXZhdGlvblNjYWxlOiAxLFxuICBvblNldEVsZXZhdGlvbkRvbWFpbjogbm9wLFxuXG4gIHJhZGl1czogMTAwMCxcbiAgY292ZXJhZ2U6IDEsXG4gIGV4dHJ1ZGVkOiBmYWxzZSxcbiAgaGV4YWdvbkFnZ3JlZ2F0b3I6IHBvaW50VG9IZXhiaW4sXG4gIGdldFBvc2l0aW9uOiB4ID0+IHgucG9zaXRpb24sXG4gIGZwNjQ6IGZhbHNlLFxuICAvLyBPcHRpb25hbCBzZXR0aW5ncyBmb3IgJ2xpZ2h0aW5nJyBzaGFkZXIgbW9kdWxlXG4gIGxpZ2h0U2V0dGluZ3M6IHtcbiAgICBsaWdodHNQb3NpdGlvbjogWy0xMjIuNDUsIDM3Ljc1LCA4MDAwLCAtMTIyLjAsIDM4LjAsIDUwMDBdLFxuICAgIGFtYmllbnRSYXRpbzogMC4wNSxcbiAgICBkaWZmdXNlUmF0aW86IDAuNixcbiAgICBzcGVjdWxhclJhdGlvOiAwLjgsXG4gICAgbGlnaHRzU3RyZW5ndGg6IFsyLjAsIDAuMCwgMC4wLCAwLjBdLFxuICAgIG51bWJlck9mTGlnaHRzOiAyXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhleGFnb25MYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLmhleGFnb25BZ2dyZWdhdG9yICYmICFwcm9wcy5yYWRpdXMpIHtcbiAgICAgIGxvZy5vbmNlKFxuICAgICAgICAwLFxuICAgICAgICAnSGV4YWdvbkxheWVyOiBEZWZhdWx0IGhleGFnb25BZ2dyZWdhdG9yIHJlcXVpcmVzIHJhZGl1cyBwcm9wIHRvIGJlIHNldCwgJyArXG4gICAgICAgICAgJ05vdyB1c2luZyAxMDAwIG1ldGVyIGFzIGRlZmF1bHQnXG4gICAgICApO1xuXG4gICAgICBwcm9wcy5yYWRpdXMgPSBkZWZhdWx0UHJvcHMucmFkaXVzO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIE51bWJlci5pc0Zpbml0ZShwcm9wcy51cHBlclBlcmNlbnRpbGUpICYmXG4gICAgICAocHJvcHMudXBwZXJQZXJjZW50aWxlID4gMTAwIHx8IHByb3BzLnVwcGVyUGVyY2VudGlsZSA8IDApXG4gICAgKSB7XG4gICAgICBsb2cub25jZShcbiAgICAgICAgMCxcbiAgICAgICAgJ0hleGFnb25MYXllcjogdXBwZXJQZXJjZW50aWxlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDEwMC4gJyArICdBc3NpZ24gdG8gMTAwIGJ5IGRlZmF1bHQnXG4gICAgICApO1xuXG4gICAgICBwcm9wcy51cHBlclBlcmNlbnRpbGUgPSBkZWZhdWx0UHJvcHMudXBwZXJQZXJjZW50aWxlO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIE51bWJlci5pc0Zpbml0ZShwcm9wcy5sb3dlclBlcmNlbnRpbGUpICYmXG4gICAgICAocHJvcHMubG93ZXJQZXJjZW50aWxlID4gMTAwIHx8IHByb3BzLmxvd2VyUGVyY2VudGlsZSA8IDApXG4gICAgKSB7XG4gICAgICBsb2cub25jZShcbiAgICAgICAgMCxcbiAgICAgICAgJ0hleGFnb25MYXllcjogbG93ZXJQZXJjZW50aWxlIHNob3VsZCBiZSBiZXR3ZWVuIDAgYW5kIDEwMC4gJyArICdBc3NpZ24gdG8gMCBieSBkZWZhdWx0J1xuICAgICAgKTtcblxuICAgICAgcHJvcHMubG93ZXJQZXJjZW50aWxlID0gZGVmYXVsdFByb3BzLnVwcGVyUGVyY2VudGlsZTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMubG93ZXJQZXJjZW50aWxlID49IHByb3BzLnVwcGVyUGVyY2VudGlsZSkge1xuICAgICAgbG9nLm9uY2UoXG4gICAgICAgIDAsXG4gICAgICAgICdIZXhhZ29uTGF5ZXI6IGxvd2VyUGVyY2VudGlsZSBzaG91bGQgbm90IGJlIGJpZ2dlciB0aGFuICcgK1xuICAgICAgICAgICd1cHBlclBlcmNlbnRpbGUuIEFzc2lnbiB0byAwIGJ5IGRlZmF1bHQnXG4gICAgICApO1xuXG4gICAgICBwcm9wcy5sb3dlclBlcmNlbnRpbGUgPSBkZWZhdWx0UHJvcHMubG93ZXJQZXJjZW50aWxlO1xuICAgIH1cblxuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGV4YWdvbnM6IFtdLFxuICAgICAgaGV4YWdvblZlcnRpY2VzOiBudWxsLFxuICAgICAgc29ydGVkQ29sb3JCaW5zOiBudWxsLFxuICAgICAgc29ydGVkRWxldmF0aW9uQmluczogbnVsbCxcbiAgICAgIGNvbG9yVmFsdWVEb21haW46IG51bGwsXG4gICAgICBlbGV2YXRpb25WYWx1ZURvbWFpbjogbnVsbCxcbiAgICAgIGNvbG9yU2NhbGVGdW5jOiBub3AsXG4gICAgICBlbGV2YXRpb25TY2FsZUZ1bmM6IG5vcCxcbiAgICAgIGRpbWVuc2lvblVwZGF0ZXJzOiB0aGlzLmdldERpbWVuc2lvblVwZGF0ZXJzKClcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe29sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3N9KSB7XG4gICAgY29uc3QgZGltZW5zaW9uQ2hhbmdlcyA9IHRoaXMuZ2V0RGltZW5zaW9uQ2hhbmdlcyhvbGRQcm9wcywgcHJvcHMpO1xuXG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkIHx8IHRoaXMubmVlZHNSZVByb2plY3RQb2ludHMob2xkUHJvcHMsIHByb3BzKSkge1xuICAgICAgLy8gcHJvamVjdCBkYXRhIGludG8gaGV4YWdvbnMsIGFuZCBnZXQgc29ydGVkQ29sb3JCaW5zXG4gICAgICB0aGlzLmdldEhleGFnb25zKCk7XG4gICAgfSBlbHNlIGlmIChkaW1lbnNpb25DaGFuZ2VzKSB7XG4gICAgICBkaW1lbnNpb25DaGFuZ2VzLmZvckVhY2goZiA9PiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJyAmJiBmLmFwcGx5KHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBuZWVkc1JlUHJvamVjdFBvaW50cyhvbGRQcm9wcywgcHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgb2xkUHJvcHMucmFkaXVzICE9PSBwcm9wcy5yYWRpdXMgfHwgb2xkUHJvcHMuaGV4YWdvbkFnZ3JlZ2F0b3IgIT09IHByb3BzLmhleGFnb25BZ2dyZWdhdG9yXG4gICAgKTtcbiAgfVxuXG4gIGdldERpbWVuc2lvblVwZGF0ZXJzKCkge1xuICAgIC8vIGRpbWVuc2lvbiB1cGRhdGVycyBhcmUgc2VxdWVudGlhbCxcbiAgICAvLyBpZiB0aGUgZmlyc3Qgb25lIG5lZWRzIHRvIGJlIGNhbGxlZCwgdGhlIDJuZCBhbmQgM3JkIG9uZSB3aWxsIGF1dG9tYXRpY2FsbHlcbiAgICAvLyBiZSBjYWxsZWQuIGUuZy4gaWYgQ29sb3JWYWx1ZSBuZWVkcyB0byBiZSB1cGRhdGVkLCBnZXRDb2xvclZhbHVlRG9tYWluIGFuZCBnZXRDb2xvclNjYWxlXG4gICAgLy8gd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGNhbGxlZFxuICAgIHJldHVybiB7XG4gICAgICBnZXRDb2xvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICd2YWx1ZScsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnZ2V0Q29sb3JWYWx1ZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0U29ydGVkQ29sb3JCaW5zXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2RvbWFpbicsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnbG93ZXJQZXJjZW50aWxlJywgJ3VwcGVyUGVyY2VudGlsZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0Q29sb3JWYWx1ZURvbWFpblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzY2FsZUZ1bmMnLFxuICAgICAgICAgIHRyaWdnZXJzOiBbJ2NvbG9yRG9tYWluJywgJ2NvbG9yUmFuZ2UnXSxcbiAgICAgICAgICB1cGRhdGVyOiB0aGlzLmdldENvbG9yU2NhbGVcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGdldEVsZXZhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICd2YWx1ZScsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnZ2V0RWxldmF0aW9uVmFsdWUnXSxcbiAgICAgICAgICB1cGRhdGVyOiB0aGlzLmdldFNvcnRlZEVsZXZhdGlvbkJpbnNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZG9tYWluJyxcbiAgICAgICAgICB0cmlnZ2VyczogWydlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUnLCAnZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlJ10sXG4gICAgICAgICAgdXBkYXRlcjogdGhpcy5nZXRFbGV2YXRpb25WYWx1ZURvbWFpblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzY2FsZUZ1bmMnLFxuICAgICAgICAgIHRyaWdnZXJzOiBbJ2VsZXZhdGlvbkRvbWFpbicsICdlbGV2YXRpb25SYW5nZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0RWxldmF0aW9uU2NhbGVcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBnZXREaW1lbnNpb25DaGFuZ2VzKG9sZFByb3BzLCBwcm9wcykge1xuICAgIGNvbnN0IHtkaW1lbnNpb25VcGRhdGVyc30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHVwZGF0ZXJzID0gW107XG5cbiAgICAvLyBnZXQgZGltZW5zaW9uIHRvIGJlIHVwZGF0ZWRcbiAgICBmb3IgKGNvbnN0IGRpbWVuc2lvbktleSBpbiBkaW1lbnNpb25VcGRhdGVycykge1xuICAgICAgLy8gcmV0dXJuIHRoZSBmaXJzdCB0cmlnZ2VyZWQgdXBkYXRlciBmb3IgZWFjaCBkaW1lbnNpb25cbiAgICAgIGNvbnN0IG5lZWRVcGRhdGUgPSBkaW1lbnNpb25VcGRhdGVyc1tkaW1lbnNpb25LZXldLmZpbmQoaXRlbSA9PlxuICAgICAgICBpdGVtLnRyaWdnZXJzLnNvbWUodCA9PiBvbGRQcm9wc1t0XSAhPT0gcHJvcHNbdF0pXG4gICAgICApO1xuXG4gICAgICBpZiAobmVlZFVwZGF0ZSkge1xuICAgICAgICB1cGRhdGVycy5wdXNoKG5lZWRVcGRhdGUudXBkYXRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZXJzLmxlbmd0aCA/IHVwZGF0ZXJzIDogbnVsbDtcbiAgfVxuXG4gIGdldEhleGFnb25zKCkge1xuICAgIGNvbnN0IHtoZXhhZ29uQWdncmVnYXRvcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHt2aWV3cG9ydH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3Qge2hleGFnb25zLCBoZXhhZ29uVmVydGljZXN9ID0gaGV4YWdvbkFnZ3JlZ2F0b3IodGhpcy5wcm9wcywgdmlld3BvcnQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2hleGFnb25zLCBoZXhhZ29uVmVydGljZXN9KTtcbiAgICB0aGlzLmdldFNvcnRlZEJpbnMoKTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHtpbmZvfSkge1xuICAgIGNvbnN0IHtzb3J0ZWRDb2xvckJpbnMsIHNvcnRlZEVsZXZhdGlvbkJpbnN9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBpc1BpY2tlZCA9IGluZm8ucGlja2VkICYmIGluZm8uaW5kZXggPiAtMTtcblxuICAgIGxldCBvYmplY3QgPSBudWxsO1xuICAgIGlmIChpc1BpY2tlZCkge1xuICAgICAgY29uc3QgY2VsbCA9IHRoaXMuc3RhdGUuaGV4YWdvbnNbaW5mby5pbmRleF07XG5cbiAgICAgIGNvbnN0IGNvbG9yVmFsdWUgPVxuICAgICAgICBzb3J0ZWRDb2xvckJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZENvbG9yQmlucy5iaW5NYXBbY2VsbC5pbmRleF0udmFsdWU7XG4gICAgICBjb25zdCBlbGV2YXRpb25WYWx1ZSA9XG4gICAgICAgIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdLnZhbHVlO1xuXG4gICAgICBvYmplY3QgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3JWYWx1ZSxcbiAgICAgICAgICBlbGV2YXRpb25WYWx1ZVxuICAgICAgICB9LFxuICAgICAgICBjZWxsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGFkZCBiaW4gY29sb3JWYWx1ZSBhbmQgZWxldmF0aW9uVmFsdWUgdG8gaW5mb1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGluZm8sIHtcbiAgICAgIHBpY2tlZDogQm9vbGVhbihvYmplY3QpLFxuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGNlbGxcbiAgICAgIG9iamVjdFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VXBkYXRlVHJpZ2dlcnMoKSB7XG4gICAgY29uc3Qge2RpbWVuc2lvblVwZGF0ZXJzfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAvLyBtZXJnZSBhbGwgZGltZW5zaW9uIHRyaWdnZXJzXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZGltZW5zaW9uS2V5IGluIGRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICB1cGRhdGVUcmlnZ2Vyc1tkaW1lbnNpb25LZXldID0ge307XG5cbiAgICAgIGZvciAoY29uc3Qgc3RlcCBvZiBkaW1lbnNpb25VcGRhdGVyc1tkaW1lbnNpb25LZXldKSB7XG4gICAgICAgIHN0ZXAudHJpZ2dlcnMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyc1tkaW1lbnNpb25LZXldW3Byb3BdID0gdGhpcy5wcm9wc1twcm9wXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZVRyaWdnZXJzO1xuICB9XG5cbiAgZ2V0VmFsdWVEb21haW4oKSB7XG4gICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG4gICAgdGhpcy5nZXRFbGV2YXRpb25WYWx1ZURvbWFpbigpO1xuICB9XG5cbiAgZ2V0U29ydGVkQmlucygpIHtcbiAgICB0aGlzLmdldFNvcnRlZENvbG9yQmlucygpO1xuICAgIHRoaXMuZ2V0U29ydGVkRWxldmF0aW9uQmlucygpO1xuICB9XG5cbiAgZ2V0U29ydGVkQ29sb3JCaW5zKCkge1xuICAgIGNvbnN0IHtnZXRDb2xvclZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc29ydGVkQ29sb3JCaW5zID0gbmV3IEJpblNvcnRlcih0aGlzLnN0YXRlLmhleGFnb25zIHx8IFtdLCBnZXRDb2xvclZhbHVlKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe3NvcnRlZENvbG9yQmluc30pO1xuICAgIHRoaXMuZ2V0Q29sb3JWYWx1ZURvbWFpbigpO1xuICB9XG5cbiAgZ2V0U29ydGVkRWxldmF0aW9uQmlucygpIHtcbiAgICBjb25zdCB7Z2V0RWxldmF0aW9uVmFsdWV9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzb3J0ZWRFbGV2YXRpb25CaW5zID0gbmV3IEJpblNvcnRlcih0aGlzLnN0YXRlLmhleGFnb25zIHx8IFtdLCBnZXRFbGV2YXRpb25WYWx1ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c29ydGVkRWxldmF0aW9uQmluc30pO1xuICAgIHRoaXMuZ2V0RWxldmF0aW9uVmFsdWVEb21haW4oKTtcbiAgfVxuXG4gIGdldENvbG9yVmFsdWVEb21haW4oKSB7XG4gICAgY29uc3Qge2xvd2VyUGVyY2VudGlsZSwgdXBwZXJQZXJjZW50aWxlLCBvblNldENvbG9yRG9tYWlufSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnN0YXRlLmNvbG9yVmFsdWVEb21haW4gPSB0aGlzLnN0YXRlLnNvcnRlZENvbG9yQmlucy5nZXRWYWx1ZVJhbmdlKFtcbiAgICAgIGxvd2VyUGVyY2VudGlsZSxcbiAgICAgIHVwcGVyUGVyY2VudGlsZVxuICAgIF0pO1xuXG4gICAgaWYgKHR5cGVvZiBvblNldENvbG9yRG9tYWluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvblNldENvbG9yRG9tYWluKHRoaXMuc3RhdGUuY29sb3JWYWx1ZURvbWFpbik7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRDb2xvclNjYWxlKCk7XG4gIH1cblxuICBnZXRFbGV2YXRpb25WYWx1ZURvbWFpbigpIHtcbiAgICBjb25zdCB7ZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlLCBlbGV2YXRpb25VcHBlclBlcmNlbnRpbGUsIG9uU2V0RWxldmF0aW9uRG9tYWlufSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLnN0YXRlLmVsZXZhdGlvblZhbHVlRG9tYWluID0gdGhpcy5zdGF0ZS5zb3J0ZWRFbGV2YXRpb25CaW5zLmdldFZhbHVlUmFuZ2UoW1xuICAgICAgZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlLFxuICAgICAgZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlXG4gICAgXSk7XG5cbiAgICBpZiAodHlwZW9mIG9uU2V0RWxldmF0aW9uRG9tYWluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvblNldEVsZXZhdGlvbkRvbWFpbih0aGlzLnN0YXRlLmVsZXZhdGlvblZhbHVlRG9tYWluKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldEVsZXZhdGlvblNjYWxlKCk7XG4gIH1cblxuICBnZXRDb2xvclNjYWxlKCkge1xuICAgIGNvbnN0IHtjb2xvclJhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgY29sb3JEb21haW4gPSB0aGlzLnByb3BzLmNvbG9yRG9tYWluIHx8IHRoaXMuc3RhdGUuY29sb3JWYWx1ZURvbWFpbjtcblxuICAgIHRoaXMuc3RhdGUuY29sb3JTY2FsZUZ1bmMgPSBnZXRRdWFudGl6ZVNjYWxlKGNvbG9yRG9tYWluLCBjb2xvclJhbmdlKTtcbiAgfVxuXG4gIGdldEVsZXZhdGlvblNjYWxlKCkge1xuICAgIGNvbnN0IHtlbGV2YXRpb25SYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGVsZXZhdGlvbkRvbWFpbiA9IHRoaXMucHJvcHMuZWxldmF0aW9uRG9tYWluIHx8IHRoaXMuc3RhdGUuZWxldmF0aW9uVmFsdWVEb21haW47XG5cbiAgICB0aGlzLnN0YXRlLmVsZXZhdGlvblNjYWxlRnVuYyA9IGdldExpbmVhclNjYWxlKGVsZXZhdGlvbkRvbWFpbiwgZWxldmF0aW9uUmFuZ2UpO1xuICB9XG5cbiAgX29uR2V0U3VibGF5ZXJDb2xvcihjZWxsKSB7XG4gICAgY29uc3Qge3NvcnRlZENvbG9yQmlucywgY29sb3JTY2FsZUZ1bmMsIGNvbG9yVmFsdWVEb21haW59ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGN2ID0gc29ydGVkQ29sb3JCaW5zLmJpbk1hcFtjZWxsLmluZGV4XSAmJiBzb3J0ZWRDb2xvckJpbnMuYmluTWFwW2NlbGwuaW5kZXhdLnZhbHVlO1xuICAgIGNvbnN0IGNvbG9yRG9tYWluID0gdGhpcy5wcm9wcy5jb2xvckRvbWFpbiB8fCBjb2xvclZhbHVlRG9tYWluO1xuXG4gICAgY29uc3QgaXNDb2xvclZhbHVlSW5Eb21haW4gPSBjdiA+PSBjb2xvckRvbWFpblswXSAmJiBjdiA8PSBjb2xvckRvbWFpbltjb2xvckRvbWFpbi5sZW5ndGggLSAxXTtcblxuICAgIC8vIGlmIGNlbGwgdmFsdWUgaXMgb3V0c2lkZSBkb21haW4sIHNldCBhbHBoYSB0byAwXG4gICAgY29uc3QgY29sb3IgPSBpc0NvbG9yVmFsdWVJbkRvbWFpbiA/IGNvbG9yU2NhbGVGdW5jKGN2KSA6IFswLCAwLCAwLCAwXTtcblxuICAgIC8vIGFkZCBhbHBoYSB0byBjb2xvciBpZiBub3QgZGVmaW5lZCBpbiBjb2xvclJhbmdlXG4gICAgY29sb3JbM10gPSBOdW1iZXIuaXNGaW5pdGUoY29sb3JbM10pID8gY29sb3JbM10gOiAyNTU7XG5cbiAgICByZXR1cm4gY29sb3I7XG4gIH1cblxuICBfb25HZXRTdWJsYXllckVsZXZhdGlvbihjZWxsKSB7XG4gICAgY29uc3Qge3NvcnRlZEVsZXZhdGlvbkJpbnMsIGVsZXZhdGlvblNjYWxlRnVuYywgZWxldmF0aW9uVmFsdWVEb21haW59ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBldiA9XG4gICAgICBzb3J0ZWRFbGV2YXRpb25CaW5zLmJpbk1hcFtjZWxsLmluZGV4XSAmJiBzb3J0ZWRFbGV2YXRpb25CaW5zLmJpbk1hcFtjZWxsLmluZGV4XS52YWx1ZTtcblxuICAgIGNvbnN0IGVsZXZhdGlvbkRvbWFpbiA9IHRoaXMucHJvcHMuZWxldmF0aW9uRG9tYWluIHx8IGVsZXZhdGlvblZhbHVlRG9tYWluO1xuXG4gICAgY29uc3QgaXNFbGV2YXRpb25WYWx1ZUluRG9tYWluID1cbiAgICAgIGV2ID49IGVsZXZhdGlvbkRvbWFpblswXSAmJiBldiA8PSBlbGV2YXRpb25Eb21haW5bZWxldmF0aW9uRG9tYWluLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gaWYgY2VsbCB2YWx1ZSBpcyBvdXRzaWRlIGRvbWFpbiwgc2V0IGVsZXZhdGlvbiB0byAtMVxuICAgIHJldHVybiBpc0VsZXZhdGlvblZhbHVlSW5Eb21haW4gPyBlbGV2YXRpb25TY2FsZUZ1bmMoZXYpIDogLTE7XG4gIH1cblxuICAvLyBmb3Igc3ViY2xhc3NpbmcsIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIHJldHVyblxuICAvLyBjdXN0b21pemVkIHN1YiBsYXllciBwcm9wc1xuICBnZXRTdWJMYXllclByb3BzKCkge1xuICAgIGNvbnN0IHtyYWRpdXMsIGVsZXZhdGlvblNjYWxlLCBleHRydWRlZCwgY292ZXJhZ2UsIGxpZ2h0U2V0dGluZ3MsIGZwNjR9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIHJldHVybiBwcm9wcyB0byB0aGUgc3VibGF5ZXIgY29uc3RydWN0b3JcbiAgICByZXR1cm4gc3VwZXIuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICBpZDogJ2hleGFnb24tY2VsbCcsXG4gICAgICBkYXRhOiB0aGlzLnN0YXRlLmhleGFnb25zLFxuXG4gICAgICBmcDY0LFxuICAgICAgaGV4YWdvblZlcnRpY2VzOiB0aGlzLnN0YXRlLmhleGFnb25WZXJ0aWNlcyxcbiAgICAgIHJhZGl1cyxcbiAgICAgIGVsZXZhdGlvblNjYWxlLFxuICAgICAgYW5nbGU6IE1hdGguUEksXG4gICAgICBleHRydWRlZCxcbiAgICAgIGNvdmVyYWdlLFxuICAgICAgbGlnaHRTZXR0aW5ncyxcblxuICAgICAgZ2V0Q29sb3I6IHRoaXMuX29uR2V0U3VibGF5ZXJDb2xvci5iaW5kKHRoaXMpLFxuICAgICAgZ2V0RWxldmF0aW9uOiB0aGlzLl9vbkdldFN1YmxheWVyRWxldmF0aW9uLmJpbmQodGhpcyksXG4gICAgICB1cGRhdGVUcmlnZ2VyczogdGhpcy5nZXRVcGRhdGVUcmlnZ2VycygpXG4gICAgfSk7XG4gIH1cblxuICAvLyBmb3Igc3ViY2xhc3NpbmcsIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIHJldHVyblxuICAvLyBjdXN0b21pemVkIHN1YiBsYXllciBjbGFzc1xuICBnZXRTdWJMYXllckNsYXNzKCkge1xuICAgIHJldHVybiBIZXhhZ29uQ2VsbExheWVyO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IFN1YkxheWVyQ2xhc3MgPSB0aGlzLmdldFN1YkxheWVyQ2xhc3MoKTtcblxuICAgIHJldHVybiBuZXcgU3ViTGF5ZXJDbGFzcyh0aGlzLmdldFN1YkxheWVyUHJvcHMoKSk7XG4gIH1cbn1cblxuSGV4YWdvbkxheWVyLmxheWVyTmFtZSA9ICdIZXhhZ29uTGF5ZXInO1xuSGV4YWdvbkxheWVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==