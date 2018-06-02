'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _luma = require('luma.gl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Arrow2DGeometry = function (_Geometry) {
  _inherits(Arrow2DGeometry, _Geometry);

  function Arrow2DGeometry() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Arrow2DGeometry);

    return _possibleConstructorReturn(this, (Arrow2DGeometry.__proto__ || Object.getPrototypeOf(Arrow2DGeometry)).call(this, Object.assign({}, opts, {
      attributes: getArrowAttributes(opts)
    })));
  }

  return Arrow2DGeometry;
}(_luma.Geometry);

exports.default = Arrow2DGeometry;


function getArrowAttributes(_ref) {
  var _ref$length = _ref.length,
      length = _ref$length === undefined ? 1 : _ref$length,
      _ref$headSize = _ref.headSize,
      headSize = _ref$headSize === undefined ? 0.2 : _ref$headSize,
      _ref$tailWidth = _ref.tailWidth,
      tailWidth = _ref$tailWidth === undefined ? 0.05 : _ref$tailWidth,
      _ref$tailStart = _ref.tailStart,
      tailStart = _ref$tailStart === undefined ? 0.05 : _ref$tailStart;

  var texCoords = [
  // HEAD
  0.5, 1.0, 0, 0.5 - headSize / 2, 1.0 - headSize, 0, 0.5 + headSize / 2, 1.0 - headSize, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0];

  var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

  // Center and scale
  var positions = new Array(texCoords.length);
  for (var i = 0; i < texCoords.length / 3; i++) {
    var i3 = i * 3;
    positions[i3 + 0] = (texCoords[i3 + 0] - 0.5) * length;
    positions[i3 + 1] = (texCoords[i3 + 1] - 0.5) * length;
    positions[i3 + 2] = 0;
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9wYXRoLW1hcmtlci1sYXllci9hcnJvdy0yZC1nZW9tZXRyeS5qcyJdLCJuYW1lcyI6WyJBcnJvdzJER2VvbWV0cnkiLCJvcHRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYXR0cmlidXRlcyIsImdldEFycm93QXR0cmlidXRlcyIsImxlbmd0aCIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwidGFpbFN0YXJ0IiwidGV4Q29vcmRzIiwibm9ybWFscyIsInBvc2l0aW9ucyIsIkFycmF5IiwiaSIsImkzIiwiRmxvYXQzMkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7SUFFcUJBLGU7OztBQUNuQiw2QkFBdUI7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsNkhBRW5CQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsSUFBbEIsRUFBd0I7QUFDdEJHLGtCQUFZQyxtQkFBbUJKLElBQW5CO0FBRFUsS0FBeEIsQ0FGbUI7QUFNdEI7Ozs7O2tCQVBrQkQsZTs7O0FBVXJCLFNBQVNLLGtCQUFULE9BQThGO0FBQUEseUJBQWpFQyxNQUFpRTtBQUFBLE1BQWpFQSxNQUFpRSwrQkFBeEQsQ0FBd0Q7QUFBQSwyQkFBckRDLFFBQXFEO0FBQUEsTUFBckRBLFFBQXFELGlDQUExQyxHQUEwQztBQUFBLDRCQUFyQ0MsU0FBcUM7QUFBQSxNQUFyQ0EsU0FBcUMsa0NBQXpCLElBQXlCO0FBQUEsNEJBQW5CQyxTQUFtQjtBQUFBLE1BQW5CQSxTQUFtQixrQ0FBUCxJQUFPOztBQUM1RixNQUFNQyxZQUFZO0FBQ2hCO0FBQ0EsS0FGZ0IsRUFHaEIsR0FIZ0IsRUFJaEIsQ0FKZ0IsRUFLaEIsTUFBTUgsV0FBVyxDQUxELEVBTWhCLE1BQU1BLFFBTlUsRUFPaEIsQ0FQZ0IsRUFRaEIsTUFBTUEsV0FBVyxDQVJELEVBU2hCLE1BQU1BLFFBVFUsRUFVaEIsQ0FWZ0IsRUFZaEIsTUFBTUMsWUFBWSxDQVpGLEVBYWhCQyxTQWJnQixFQWNoQixDQWRnQixFQWVoQixNQUFNRCxZQUFZLENBZkYsRUFnQmhCLE1BQU1ELFFBaEJVLEVBaUJoQixDQWpCZ0IsRUFrQmhCLE1BQU1DLFlBQVksQ0FsQkYsRUFtQmhCQyxTQW5CZ0IsRUFvQmhCLENBcEJnQixFQXNCaEIsTUFBTUQsWUFBWSxDQXRCRixFQXVCaEJDLFNBdkJnQixFQXdCaEIsQ0F4QmdCLEVBeUJoQixNQUFNRCxZQUFZLENBekJGLEVBMEJoQixNQUFNRCxRQTFCVSxFQTJCaEIsQ0EzQmdCLEVBNEJoQixNQUFNQyxZQUFZLENBNUJGLEVBNkJoQixNQUFNRCxRQTdCVSxFQThCaEIsQ0E5QmdCLENBQWxCOztBQWlDQSxNQUFNSSxVQUFVLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsRUFBaUQsQ0FBakQsRUFBb0QsQ0FBcEQsRUFBdUQsQ0FBdkQsRUFBMEQsQ0FBMUQsRUFBNkQsQ0FBN0QsRUFBZ0UsQ0FBaEUsRUFBbUUsQ0FBbkUsRUFBc0UsQ0FBdEUsRUFBeUUsQ0FBekUsRUFBNEUsQ0FBNUUsRUFBK0UsQ0FBL0UsQ0FBaEI7O0FBRUE7QUFDQSxNQUFNQyxZQUFZLElBQUlDLEtBQUosQ0FBVUgsVUFBVUosTUFBcEIsQ0FBbEI7QUFDQSxPQUFLLElBQUlRLElBQUksQ0FBYixFQUFnQkEsSUFBSUosVUFBVUosTUFBVixHQUFtQixDQUF2QyxFQUEwQ1EsR0FBMUMsRUFBK0M7QUFDN0MsUUFBTUMsS0FBS0QsSUFBSSxDQUFmO0FBQ0FGLGNBQVVHLEtBQUssQ0FBZixJQUFvQixDQUFDTCxVQUFVSyxLQUFLLENBQWYsSUFBb0IsR0FBckIsSUFBNEJULE1BQWhEO0FBQ0FNLGNBQVVHLEtBQUssQ0FBZixJQUFvQixDQUFDTCxVQUFVSyxLQUFLLENBQWYsSUFBb0IsR0FBckIsSUFBNEJULE1BQWhEO0FBQ0FNLGNBQVVHLEtBQUssQ0FBZixJQUFvQixDQUFwQjtBQUNEO0FBQ0QsU0FBTztBQUNMSCxlQUFXLElBQUlJLFlBQUosQ0FBaUJKLFNBQWpCLENBRE47QUFFTEQsYUFBUyxJQUFJSyxZQUFKLENBQWlCTCxPQUFqQixDQUZKO0FBR0xELGVBQVcsSUFBSU0sWUFBSixDQUFpQk4sU0FBakI7QUFITixHQUFQO0FBS0QiLCJmaWxlIjoiYXJyb3ctMmQtZ2VvbWV0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJyb3cyREdlb21ldHJ5IGV4dGVuZHMgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIHtcbiAgICAgICAgYXR0cmlidXRlczogZ2V0QXJyb3dBdHRyaWJ1dGVzKG9wdHMpXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXJyb3dBdHRyaWJ1dGVzKHtsZW5ndGggPSAxLCBoZWFkU2l6ZSA9IDAuMiwgdGFpbFdpZHRoID0gMC4wNSwgdGFpbFN0YXJ0ID0gMC4wNX0pIHtcbiAgY29uc3QgdGV4Q29vcmRzID0gW1xuICAgIC8vIEhFQURcbiAgICAwLjUsXG4gICAgMS4wLFxuICAgIDAsXG4gICAgMC41IC0gaGVhZFNpemUgLyAyLFxuICAgIDEuMCAtIGhlYWRTaXplLFxuICAgIDAsXG4gICAgMC41ICsgaGVhZFNpemUgLyAyLFxuICAgIDEuMCAtIGhlYWRTaXplLFxuICAgIDAsXG5cbiAgICAwLjUgLSB0YWlsV2lkdGggLyAyLFxuICAgIHRhaWxTdGFydCxcbiAgICAwLFxuICAgIDAuNSArIHRhaWxXaWR0aCAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgKyB0YWlsV2lkdGggLyAyLFxuICAgIHRhaWxTdGFydCxcbiAgICAwLFxuXG4gICAgMC41IC0gdGFpbFdpZHRoIC8gMixcbiAgICB0YWlsU3RhcnQsXG4gICAgMCxcbiAgICAwLjUgLSB0YWlsV2lkdGggLyAyLFxuICAgIDEuMCAtIGhlYWRTaXplLFxuICAgIDAsXG4gICAgMC41ICsgdGFpbFdpZHRoIC8gMixcbiAgICAxLjAgLSBoZWFkU2l6ZSxcbiAgICAwXG4gIF07XG5cbiAgY29uc3Qgbm9ybWFscyA9IFswLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAwLCAxXTtcblxuICAvLyBDZW50ZXIgYW5kIHNjYWxlXG4gIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBBcnJheSh0ZXhDb29yZHMubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXhDb29yZHMubGVuZ3RoIC8gMzsgaSsrKSB7XG4gICAgY29uc3QgaTMgPSBpICogMztcbiAgICBwb3NpdGlvbnNbaTMgKyAwXSA9ICh0ZXhDb29yZHNbaTMgKyAwXSAtIDAuNSkgKiBsZW5ndGg7XG4gICAgcG9zaXRpb25zW2kzICsgMV0gPSAodGV4Q29vcmRzW2kzICsgMV0gLSAwLjUpICogbGVuZ3RoO1xuICAgIHBvc2l0aW9uc1tpMyArIDJdID0gMDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHBvc2l0aW9uczogbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxuICAgIG5vcm1hbHM6IG5ldyBGbG9hdDMyQXJyYXkobm9ybWFscyksXG4gICAgdGV4Q29vcmRzOiBuZXcgRmxvYXQzMkFycmF5KHRleENvb3JkcylcbiAgfTtcbn1cbiJdfQ==