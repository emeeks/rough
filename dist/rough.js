'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var _Number$MAX_SAFE_INTEGER = _interopDefault(require('babel-runtime/core-js/number/max-safe-integer'));

function RoughSegmentRelation() {
  return {
    LEFT: 0,
    RIGHT: 1,
    INTERSECTS: 2,
    AHEAD: 3,
    BEHIND: 4,
    SEPARATE: 5,
    UNDEFINED: 6
  };
}

var RoughSegment = function () {
  function RoughSegment(px1, py1, px2, py2) {
    _classCallCheck(this, RoughSegment);

    this.RoughSegmentRelationConst = RoughSegmentRelation();
    this.px1 = px1;
    this.py1 = py1;
    this.px2 = px2;
    this.py2 = py2;
    this.xi = Number.MAX_VALUE;
    this.yi = Number.MAX_VALUE;
    this.a = py2 - py1;
    this.b = px1 - px2;
    this.c = px2 * py1 - px1 * py2;
    this._undefined = this.a == 0 && this.b == 0 && this.c == 0;
  }

  _createClass(RoughSegment, [{
    key: "isUndefined",
    value: function isUndefined() {
      return this._undefined;
    }
  }, {
    key: "compare",
    value: function compare(otherSegment) {
      if (this.isUndefined() || otherSegment.isUndefined()) {
        return this.RoughSegmentRelationConst.UNDEFINED;
      }
      var grad1 = Number.MAX_VALUE;
      var grad2 = Number.MAX_VALUE;
      var int1 = 0,
          int2 = 0;
      var a = this.a,
          b = this.b,
          c = this.c;

      if (Math.abs(b) > 0.00001) {
        grad1 = -a / b;
        int1 = -c / b;
      }
      if (Math.abs(otherSegment.b) > 0.00001) {
        grad2 = -otherSegment.a / otherSegment.b;
        int2 = -otherSegment.c / otherSegment.b;
      }

      if (grad1 == Number.MAX_VALUE) {
        if (grad2 == Number.MAX_VALUE) {
          if (-c / a != -otherSegment.c / otherSegment.a) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          if (this.py1 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
            this.xi = this.px1;
            this.yi = this.py1;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          if (this.py2 >= Math.min(otherSegment.py1, otherSegment.py2) && this.py2 <= Math.max(otherSegment.py1, otherSegment.py2)) {
            this.xi = this.px2;
            this.yi = this.py2;
            return this.RoughSegmentRelationConst.INTERSECTS;
          }
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        this.xi = this.px1;
        this.yi = grad2 * this.xi + int2;
        if ((this.py1 - this.yi) * (this.yi - this.py2) < -0.00001 || (otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (Math.abs(otherSegment.a) < 0.00001) {
          if ((otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.INTERSECTS;
      }

      if (grad2 == Number.MAX_VALUE) {
        this.xi = otherSegment.px1;
        this.yi = grad1 * this.xi + int1;
        if ((otherSegment.py1 - this.yi) * (this.yi - otherSegment.py2) < -0.00001 || (this.py1 - this.yi) * (this.yi - this.py2) < -0.00001) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (Math.abs(a) < 0.00001) {
          if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001) {
            return this.RoughSegmentRelationConst.SEPARATE;
          }
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.INTERSECTS;
      }

      if (grad1 == grad2) {
        if (int1 != int2) {
          return this.RoughSegmentRelationConst.SEPARATE;
        }
        if (this.px1 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px1 <= Math.max(otherSegment.py1, otherSegment.py2)) {
          this.xi = this.px1;
          this.yi = this.py1;
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        if (this.px2 >= Math.min(otherSegment.px1, otherSegment.px2) && this.px2 <= Math.max(otherSegment.px1, otherSegment.px2)) {
          this.xi = this.px2;
          this.yi = this.py2;
          return this.RoughSegmentRelationConst.INTERSECTS;
        }
        return this.RoughSegmentRelationConst.SEPARATE;
      }

      this.xi = (int2 - int1) / (grad1 - grad2);
      this.yi = grad1 * this.xi + int1;

      if ((this.px1 - this.xi) * (this.xi - this.px2) < -0.00001 || (otherSegment.px1 - this.xi) * (this.xi - otherSegment.px2) < -0.00001) {
        return this.RoughSegmentRelationConst.SEPARATE;
      }
      return this.RoughSegmentRelationConst.INTERSECTS;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this._getLength(this.px1, this.py1, this.px2, this.py2);
    }
  }, {
    key: "_getLength",
    value: function _getLength(x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }]);

  return RoughSegment;
}();

var RoughHachureIterator = function () {
  function RoughHachureIterator(top, bottom, left, right, gap, sinAngle, cosAngle, tanAngle) {
    _classCallCheck(this, RoughHachureIterator);

    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
    this.gap = gap;
    this.sinAngle = sinAngle;
    this.tanAngle = tanAngle;

    if (Math.abs(sinAngle) < 0.0001) {
      this.pos = left + gap;
    } else if (Math.abs(sinAngle) > 0.9999) {
      this.pos = top + gap;
    } else {
      this.deltaX = (bottom - top) * Math.abs(tanAngle);
      this.pos = left - Math.abs(this.deltaX);
      this.hGap = Math.abs(gap / cosAngle);
      this.sLeft = new RoughSegment(left, bottom, left, top);
      this.sRight = new RoughSegment(right, bottom, right, top);
    }
  }

  _createClass(RoughHachureIterator, [{
    key: "getNextLine",
    value: function getNextLine() {
      if (Math.abs(this.sinAngle) < 0.0001) {
        if (this.pos < this.right) {
          var line = [this.pos, this.top, this.pos, this.bottom];
          this.pos += this.gap;
          return line;
        }
      } else if (Math.abs(this.sinAngle) > 0.9999) {
        if (this.pos < this.bottom) {
          var _line = [this.left, this.pos, this.right, this.pos];
          this.pos += this.gap;
          return _line;
        }
      } else {
        var xLower = this.pos - this.deltaX / 2;
        var xUpper = this.pos + this.deltaX / 2;
        var yLower = this.bottom;
        var yUpper = this.top;
        if (this.pos < this.right + this.deltaX) {
          while (xLower < this.left && xUpper < this.left || xLower > this.right && xUpper > this.right) {
            this.pos += this.hGap;
            xLower = this.pos - this.deltaX / 2;
            xUpper = this.pos + this.deltaX / 2;
            if (this.pos > this.right + this.deltaX) {
              return null;
            }
          }
          var s = new RoughSegment(xLower, yLower, xUpper, yUpper);
          if (s.compare(this.sLeft) == RoughSegmentRelation().INTERSECTS) {
            xLower = s.xi;
            yLower = s.yi;
          }
          if (s.compare(this.sRight) == RoughSegmentRelation().INTERSECTS) {
            xUpper = s.xi;
            yUpper = s.yi;
          }
          if (this.tanAngle > 0) {
            xLower = this.right - (xLower - this.left);
            xUpper = this.right - (xUpper - this.left);
          }
          var _line2 = [xLower, yLower, xUpper, yUpper];
          this.pos += this.hGap;
          return _line2;
        }
      }
      return null;
    }
  }]);

  return RoughHachureIterator;
}();

var PathToken = function () {
  function PathToken(type, text) {
    _classCallCheck(this, PathToken);

    this.type = type;
    this.text = text;
  }

  _createClass(PathToken, [{
    key: "isType",
    value: function isType(type) {
      return this.type === type;
    }
  }]);

  return PathToken;
}();

var ParsedPath = function () {
  function ParsedPath(d) {
    _classCallCheck(this, ParsedPath);

    this.PARAMS = {
      A: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      a: ["rx", "ry", "x-axis-rotation", "large-arc-flag", "sweep-flag", "x", "y"],
      C: ["x1", "y1", "x2", "y2", "x", "y"],
      c: ["x1", "y1", "x2", "y2", "x", "y"],
      H: ["x"],
      h: ["x"],
      L: ["x", "y"],
      l: ["x", "y"],
      M: ["x", "y"],
      m: ["x", "y"],
      Q: ["x1", "y1", "x", "y"],
      q: ["x1", "y1", "x", "y"],
      S: ["x2", "y2", "x", "y"],
      s: ["x2", "y2", "x", "y"],
      T: ["x", "y"],
      t: ["x", "y"],
      V: ["y"],
      v: ["y"],
      Z: [],
      z: []
    };
    this.COMMAND = 0;
    this.NUMBER = 1;
    this.EOD = 2;
    this.segments = [];
    this.d = d || "";
    this.parseData(d);
    this.processPoints();
  }

  _createClass(ParsedPath, [{
    key: "loadFromSegments",
    value: function loadFromSegments(segments) {
      this.segments = segments;
      this.processPoints();
    }
  }, {
    key: "processPoints",
    value: function processPoints() {
      var first = null,
          currentPoint = [0, 0];
      for (var i = 0; i < this.segments.length; i++) {
        var s = this.segments[i];
        switch (s.key) {
          case 'M':
          case 'L':
          case 'T':
            s.point = [s.data[0], s.data[1]];
            break;
          case 'm':
          case 'l':
          case 't':
            s.point = [s.data[0] + currentPoint[0], s.data[1] + currentPoint[1]];
            break;
          case 'H':
            s.point = [s.data[0], currentPoint[1]];
            break;
          case 'h':
            s.point = [s.data[0] + currentPoint[0], currentPoint[1]];
            break;
          case 'V':
            s.point = [currentPoint[0], s.data[0]];
            break;
          case 'v':
            s.point = [currentPoint[0], s.data[0] + currentPoint[1]];
            break;
          case 'z':
          case 'Z':
            if (first) {
              s.point = [first[0], first[1]];
            }
            break;
          case 'C':
            s.point = [s.data[4], s.data[5]];
            break;
          case 'c':
            s.point = [s.data[4] + currentPoint[0], s.data[5] + currentPoint[1]];
            break;
          case 'S':
            s.point = [s.data[2], s.data[3]];
            break;
          case 's':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'Q':
            s.point = [s.data[2], s.data[3]];
            break;
          case 'q':
            s.point = [s.data[2] + currentPoint[0], s.data[3] + currentPoint[1]];
            break;
          case 'A':
            s.point = [s.data[5], s.data[6]];
            break;
          case 'a':
            s.point = [s.data[5] + currentPoint[0], s.data[6] + currentPoint[1]];
            break;
        }
        if (s.key === 'm' || s.key === 'M') {
          first = null;
        }
        if (s.point) {
          currentPoint = s.point;
          if (!first) {
            first = s.point;
          }
        }
        if (s.key === 'z' || s.key === 'Z') {
          first = null;
        }
      }
    }
  }, {
    key: "parseData",
    value: function parseData(d) {
      var tokens = this.tokenize(d);
      var index = 0;
      var token = tokens[index];
      var mode = "BOD";
      this.segments = new Array();
      while (!token.isType(this.EOD)) {
        var param_length;
        var params = new Array();
        if (mode == "BOD") {
          if (token.text == "M" || token.text == "m") {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          } else {
            return this.parseData('M0,0' + d);
          }
        } else {
          if (token.isType(this.NUMBER)) {
            param_length = this.PARAMS[mode].length;
          } else {
            index++;
            param_length = this.PARAMS[token.text].length;
            mode = token.text;
          }
        }

        if (index + param_length < tokens.length) {
          for (var i = index; i < index + param_length; i++) {
            var number = tokens[i];
            if (number.isType(this.NUMBER)) {
              params[params.length] = number.text;
            } else {
              console.error("Parameter type is not a number: " + mode + "," + number.text);
              return;
            }
          }
          var segment;
          if (this.PARAMS[mode]) {
            segment = { key: mode, data: params };
          } else {
            console.error("Unsupported segment type: " + mode);
            return;
          }
          this.segments.push(segment);
          index += param_length;
          token = tokens[index];
          if (mode == "M") mode = "L";
          if (mode == "m") mode = "l";
        } else {
          console.error("Path data ended before all parameters were found");
        }
      }
    }
  }, {
    key: "tokenize",
    value: function tokenize(d) {
      var tokens = new Array();
      while (d != "") {
        if (d.match(/^([ \t\r\n,]+)/)) {
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^([aAcChHlLmMqQsStTvVzZ])/)) {
          tokens[tokens.length] = new PathToken(this.COMMAND, RegExp.$1);
          d = d.substr(RegExp.$1.length);
        } else if (d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) {
          tokens[tokens.length] = new PathToken(this.NUMBER, parseFloat(RegExp.$1));
          d = d.substr(RegExp.$1.length);
        } else {
          console.error("Unrecognized segment command: " + d);
          return null;
        }
      }
      tokens[tokens.length] = new PathToken(this.EOD, null);
      return tokens;
    }
  }, {
    key: "closed",
    get: function get() {
      if (typeof this._closed === 'undefined') {
        this._closed = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(this.segments), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            if (s.key.toLowerCase() === 'z') {
              this._closed = true;
            }
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
      }
      return this._closed;
    }
  }]);

  return ParsedPath;
}();

var RoughPath = function () {
  function RoughPath(d) {
    _classCallCheck(this, RoughPath);

    this.d = d;
    this.parsed = new ParsedPath(d);
    this._position = [0, 0];
    this.bezierReflectionPoint = null;
    this.quadReflectionPoint = null;
    this._first = null;
  }

  _createClass(RoughPath, [{
    key: "setPosition",
    value: function setPosition(x, y) {
      this._position = [x, y];
      if (!this._first) {
        this._first = [x, y];
      }
    }
  }, {
    key: "segments",
    get: function get() {
      return this.parsed.segments;
    }
  }, {
    key: "closed",
    get: function get() {
      return this.parsed.closed;
    }
  }, {
    key: "linearPoints",
    get: function get() {
      if (!this._linearPoints) {
        var lp = [];
        var points = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(this.parsed.segments), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var s = _step2.value;

            var key = s.key.toLowerCase();
            if (key === 'm' || key === 'z') {
              if (points.length) {
                lp.push(points);
                points = [];
              }
              if (key === 'z') {
                continue;
              }
            }
            if (s.point) {
              points.push(s.point);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (points.length) {
          lp.push(points);
          points = [];
        }
        this._linearPoints = lp;
      }
      return this._linearPoints;
    }
  }, {
    key: "first",
    get: function get() {
      return this._first;
    },
    set: function set(v) {
      this._first = v;
    }
  }, {
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "x",
    get: function get() {
      return this._position[0];
    }
  }, {
    key: "y",
    get: function get() {
      return this._position[1];
    }
  }]);

  return RoughPath;
}();

var RoughArcConverter = function () {
  // Algorithm as described in https://www.w3.org/TR/SVG/implnote.html
  // Code adapted from nsSVGPathDataParser.cpp in Mozilla 
  // https://hg.mozilla.org/mozilla-central/file/17156fbebbc8/content/svg/content/src/nsSVGPathDataParser.cpp#l887
  function RoughArcConverter(from, to, radii, angle, largeArcFlag, sweepFlag) {
    _classCallCheck(this, RoughArcConverter);

    var radPerDeg = Math.PI / 180;
    this._segIndex = 0;
    this._numSegs = 0;
    if (from[0] == to[0] && from[1] == to[1]) {
      return;
    }
    this._rx = Math.abs(radii[0]);
    this._ry = Math.abs(radii[1]);
    this._sinPhi = Math.sin(angle * radPerDeg);
    this._cosPhi = Math.cos(angle * radPerDeg);
    var x1dash = this._cosPhi * (from[0] - to[0]) / 2.0 + this._sinPhi * (from[1] - to[1]) / 2.0;
    var y1dash = -this._sinPhi * (from[0] - to[0]) / 2.0 + this._cosPhi * (from[1] - to[1]) / 2.0;
    var root;
    var numerator = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * y1dash * y1dash - this._ry * this._ry * x1dash * x1dash;
    if (numerator < 0) {
      var s = Math.sqrt(1 - numerator / (this._rx * this._rx * this._ry * this._ry));
      this._rx = s;
      this._ry = s;
      root = 0;
    } else {
      root = (largeArcFlag == sweepFlag ? -1.0 : 1.0) * Math.sqrt(numerator / (this._rx * this._rx * y1dash * y1dash + this._ry * this._ry * x1dash * x1dash));
    }
    var cxdash = root * this._rx * y1dash / this._ry;
    var cydash = -root * this._ry * x1dash / this._rx;
    this._C = [0, 0];
    this._C[0] = this._cosPhi * cxdash - this._sinPhi * cydash + (from[0] + to[0]) / 2.0;
    this._C[1] = this._sinPhi * cxdash + this._cosPhi * cydash + (from[1] + to[1]) / 2.0;
    this._theta = this.calculateVectorAngle(1.0, 0.0, (x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry);
    var dtheta = this.calculateVectorAngle((x1dash - cxdash) / this._rx, (y1dash - cydash) / this._ry, (-x1dash - cxdash) / this._rx, (-y1dash - cydash) / this._ry);
    if (!sweepFlag && dtheta > 0) {
      dtheta -= 2 * Math.PI;
    } else if (sweepFlag && dtheta < 0) {
      dtheta += 2 * Math.PI;
    }
    this._numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
    this._delta = dtheta / this._numSegs;
    this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2);
    this._from = from;
  }

  _createClass(RoughArcConverter, [{
    key: "getNextSegment",
    value: function getNextSegment() {
      var cp1, cp2, to;
      if (this._segIndex == this._numSegs) {
        return null;
      }
      var cosTheta1 = Math.cos(this._theta);
      var sinTheta1 = Math.sin(this._theta);
      var theta2 = this._theta + this._delta;
      var cosTheta2 = Math.cos(theta2);
      var sinTheta2 = Math.sin(theta2);

      to = [this._cosPhi * this._rx * cosTheta2 - this._sinPhi * this._ry * sinTheta2 + this._C[0], this._sinPhi * this._rx * cosTheta2 + this._cosPhi * this._ry * sinTheta2 + this._C[1]];
      cp1 = [this._from[0] + this._T * (-this._cosPhi * this._rx * sinTheta1 - this._sinPhi * this._ry * cosTheta1), this._from[1] + this._T * (-this._sinPhi * this._rx * sinTheta1 + this._cosPhi * this._ry * cosTheta1)];
      cp2 = [to[0] + this._T * (this._cosPhi * this._rx * sinTheta2 + this._sinPhi * this._ry * cosTheta2), to[1] + this._T * (this._sinPhi * this._rx * sinTheta2 - this._cosPhi * this._ry * cosTheta2)];

      this._theta = theta2;
      this._from = [to[0], to[1]];
      this._segIndex++;

      return {
        cp1: cp1,
        cp2: cp2,
        to: to
      };
    }
  }, {
    key: "calculateVectorAngle",
    value: function calculateVectorAngle(ux, uy, vx, vy) {
      var ta = Math.atan2(uy, ux);
      var tb = Math.atan2(vy, vx);
      if (tb >= ta) return tb - ta;
      return 2 * Math.PI - (ta - tb);
    }
  }]);

  return RoughArcConverter;
}();

var PathFitter = function () {
  function PathFitter(sets, closed) {
    _classCallCheck(this, PathFitter);

    this.sets = sets;
    this.closed = closed;
  }

  _createClass(PathFitter, [{
    key: "fit",
    value: function fit(simplification) {
      var outSets = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(this.sets), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var set = _step3.value;

          var length = set.length;
          var estLength = Math.floor(simplification * length);
          if (estLength < 5) {
            if (length <= 5) {
              continue;
            }
            estLength = 5;
          }
          outSets.push(this.reduce(set, estLength));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var d = '';
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator(outSets), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _set = _step4.value;

          for (var i = 0; i < _set.length; i++) {
            var point = _set[i];
            if (i === 0) {
              d += 'M' + point[0] + "," + point[1];
            } else {
              d += 'L' + point[0] + "," + point[1];
            }
          }
          if (this.closed) {
            d += 'z ';
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return d;
    }
  }, {
    key: "distance",
    value: function distance(p1, p2) {
      return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }
  }, {
    key: "reduce",
    value: function reduce(set, count) {
      if (set.length <= count) {
        return set;
      }
      var points = set.slice(0);
      while (points.length > count) {
        var minArea = -1;
        var minIndex = -1;
        for (var i = 1; i < points.length - 1; i++) {
          var a = this.distance(points[i - 1], points[i]);
          var b = this.distance(points[i], points[i + 1]);
          var c = this.distance(points[i - 1], points[i + 1]);
          var s = (a + b + c) / 2.0;
          var area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          if (minArea < 0 || area < minArea) {
            minArea = area;
            minIndex = i;
          }
        }
        if (minIndex > 0) {
          points.splice(minIndex, 1);
        } else {
          break;
        }
      }
      return points;
    }
  }]);

  return PathFitter;
}();

var RoughRenderer = function () {
  function RoughRenderer() {
    _classCallCheck(this, RoughRenderer);
  }

  _createClass(RoughRenderer, [{
    key: "line",
    value: function line(x1, y1, x2, y2, o) {
      var ops = this._doubleLine(x1, y1, x2, y2, o);
      return { type: "path", ops: ops };
    }
  }, {
    key: "linearPath",
    value: function linearPath(points, close, o) {
      var len = (points || []).length;
      if (len > 2) {
        var ops = [];
        for (var i = 0; i < len - 1; i++) {
          ops = ops.concat(this._doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
        }
        if (close) {
          ops = ops.concat(this._doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
        }
        return { type: "path", ops: ops };
      } else if (len === 2) {
        return this.line(points[0][0], points[0][1], points[1][0], points[1][1], o);
      }
    }
  }, {
    key: "polygon",
    value: function polygon(points, o) {
      return this.linearPath(points, true, o);
    }
  }, {
    key: "rectangle",
    value: function rectangle(x, y, width, height, o) {
      var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      return this.polygon(points, o);
    }
  }, {
    key: "curve",
    value: function curve(points, o) {
      var o1 = this._curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
      var o2 = this._curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
      return { type: "path", ops: o1.concat(o2) };
    }
  }, {
    key: "ellipse",
    value: function ellipse(x, y, width, height, o) {
      var increment = Math.PI * 2 / o.curveStepCount;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
      ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
      var o1 = this._ellipse(increment, x, y, rx, ry, 1, increment * this._getOffset(0.1, this._getOffset(0.4, 1, o), o), o);
      var o2 = this._ellipse(increment, x, y, rx, ry, 1.5, 0, o);
      return { type: "path", ops: o1.concat(o2) };
    }
  }, {
    key: "arc",
    value: function arc(x, y, width, height, start, stop, closed, roughClosure, o) {
      var cx = x;
      var cy = y;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
      ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
      var strt = start;
      var stp = stop;
      while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
      }
      if (stp - strt > Math.PI * 2) {
        strt = 0;
        stp = Math.PI * 2;
      }
      var ellipseInc = Math.PI * 2 / o.curveStepCount;
      var arcInc = Math.min(ellipseInc / 2, (stp - strt) / 2);
      var o1 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1, o);
      var o2 = this._arc(arcInc, cx, cy, rx, ry, strt, stp, 1.5, o);
      var ops = o1.concat(o2);
      if (closed) {
        if (roughClosure) {
          ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(strt), cy + ry * Math.sin(strt), o));
          ops = ops.concat(this._doubleLine(cx, cy, cx + rx * Math.cos(stp), cy + ry * Math.sin(stp), o));
        } else {
          ops.push({ op: "lineTo", data: [cx, cy] });
          ops.push({
            op: "lineTo",
            data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)]
          });
        }
      }
      return { type: "path", ops: ops };
    }
  }, {
    key: "hachureFillArc",
    value: function hachureFillArc(x, y, width, height, start, stop, o) {
      var cx = x;
      var cy = y;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.01, rx * 0.01, o);
      ry += this._getOffset(-ry * 0.01, ry * 0.01, o);
      var strt = start;
      var stp = stop;
      while (strt < 0) {
        strt += Math.PI * 2;
        stp += Math.PI * 2;
      }
      if (stp - strt > Math.PI * 2) {
        strt = 0;
        stp = Math.PI * 2;
      }
      var increment = (stp - strt) / o.curveStepCount;
      var xc = [],
          yc = [];
      for (var angle = strt; angle <= stp; angle = angle + increment) {
        xc.push(cx + rx * Math.cos(angle));
        yc.push(cy + ry * Math.sin(angle));
      }
      xc.push(cx + rx * Math.cos(stp));
      yc.push(cy + ry * Math.sin(stp));
      xc.push(cx);
      yc.push(cy);
      return this.hachureFillShape(xc, yc, o);
    }
  }, {
    key: "solidFillShape",
    value: function solidFillShape(xCoords, yCoords, o) {
      var ops = [];
      if (xCoords && yCoords && xCoords.length && yCoords.length && xCoords.length === yCoords.length) {
        var offset = o.maxRandomnessOffset || 0;
        var len = xCoords.length;
        if (len > 2) {
          ops.push({
            op: "move",
            data: [xCoords[0] + this._getOffset(-offset, offset, o), yCoords[0] + this._getOffset(-offset, offset, o)]
          });
          for (var i = 1; i < len; i++) {
            ops.push({
              op: "lineTo",
              data: [xCoords[i] + this._getOffset(-offset, offset, o), yCoords[i] + this._getOffset(-offset, offset, o)]
            });
          }
        }
      }
      return { type: "fillPath", ops: ops };
    }
  }, {
    key: "hachureFillShape",
    value: function hachureFillShape(xCoords, yCoords, o) {
      var ops = [];
      if (xCoords && yCoords && xCoords.length && yCoords.length) {
        var left = xCoords[0];
        var right = xCoords[0];
        var top = yCoords[0];
        var bottom = yCoords[0];
        for (var i = 1; i < xCoords.length; i++) {
          left = Math.min(left, xCoords[i]);
          right = Math.max(right, xCoords[i]);
          top = Math.min(top, yCoords[i]);
          bottom = Math.max(bottom, yCoords[i]);
        }
        var angle = o.hachureAngle;
        var gap = o.hachureGap;
        if (gap < 0) {
          gap = o.strokeWidth * 4;
        }
        gap = Math.max(gap, 0.1);

        var radPerDeg = Math.PI / 180;
        var hachureAngle = angle % 180 * radPerDeg;
        var cosAngle = Math.cos(hachureAngle);
        var sinAngle = Math.sin(hachureAngle);
        var tanAngle = Math.tan(hachureAngle);

        var it = new RoughHachureIterator(top - 1, bottom + 1, left - 1, right + 1, gap, sinAngle, cosAngle, tanAngle);
        var rectCoords = void 0;
        while ((rectCoords = it.getNextLine()) != null) {
          var lines = this._getIntersectingLines(rectCoords, xCoords, yCoords);
          for (var _i = 0; _i < lines.length; _i++) {
            if (_i < lines.length - 1) {
              var p1 = lines[_i];
              var p2 = lines[_i + 1];
              ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
            }
          }
        }
      }
      return { type: "fillSketch", ops: ops };
    }
  }, {
    key: "hachureFillEllipse",
    value: function hachureFillEllipse(cx, cy, width, height, o) {
      var ops = [];
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
      ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
      var angle = o.hachureAngle;
      var gap = o.hachureGap;
      if (gap <= 0) {
        gap = o.strokeWidth * 4;
      }
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      var radPerDeg = Math.PI / 180;
      var hachureAngle = angle % 180 * radPerDeg;
      var tanAngle = Math.tan(hachureAngle);
      var aspectRatio = ry / rx;
      var hyp = Math.sqrt(aspectRatio * tanAngle * aspectRatio * tanAngle + 1);
      var sinAnglePrime = aspectRatio * tanAngle / hyp;
      var cosAnglePrime = 1 / hyp;
      var gapPrime = gap / (rx * ry / Math.sqrt(ry * cosAnglePrime * (ry * cosAnglePrime) + rx * sinAnglePrime * (rx * sinAnglePrime)) / rx);
      var halfLen = Math.sqrt(rx * rx - (cx - rx + gapPrime) * (cx - rx + gapPrime));
      for (var xPos = cx - rx + gapPrime; xPos < cx + rx; xPos += gapPrime) {
        halfLen = Math.sqrt(rx * rx - (cx - xPos) * (cx - xPos));
        var p1 = this._affine(xPos, cy - halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        var p2 = this._affine(xPos, cy + halfLen, cx, cy, sinAnglePrime, cosAnglePrime, aspectRatio);
        ops = ops.concat(this._doubleLine(p1[0], p1[1], p2[0], p2[1], o));
      }
      return { type: "fillSketch", ops: ops };
    }
  }, {
    key: "svgPath",
    value: function svgPath(path, o) {
      path = (path || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
      var p = new RoughPath(path);
      if (o.simplification) {
        var fitter = new PathFitter(p.linearPoints, p.closed);
        var d = fitter.fit(o.simplification);
        p = new RoughPath(d);
      }
      var ops = [];
      var segments = p.segments || [];
      for (var i = 0; i < segments.length; i++) {
        var s = segments[i];
        var prev = i > 0 ? segments[i - 1] : null;
        var opList = this._processSegment(p, s, prev, o);
        if (opList && opList.length) {
          ops = ops.concat(opList);
        }
      }
      return { type: "path", ops: ops };
    }

    // privates

  }, {
    key: "_bezierTo",
    value: function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
      var ops = [];
      var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
      var f = null;
      for (var i = 0; i < 2; i++) {
        if (i === 0) {
          ops.push({ op: "move", data: [path.x, path.y] });
        } else {
          ops.push({
            op: "move",
            data: [path.x + this._getOffset(-ros[0], ros[0], o), path.y + this._getOffset(-ros[0], ros[0], o)]
          });
        }
        f = [x + this._getOffset(-ros[i], ros[i], o), y + this._getOffset(-ros[i], ros[i], o)];
        ops.push({
          op: "bcurveTo",
          data: [x1 + this._getOffset(-ros[i], ros[i], o), y1 + this._getOffset(-ros[i], ros[i], o), x2 + this._getOffset(-ros[i], ros[i], o), y2 + this._getOffset(-ros[i], ros[i], o), f[0], f[1]]
        });
      }
      path.setPosition(f[0], f[1]);
      return ops;
    }
  }, {
    key: "_processSegment",
    value: function _processSegment(path, seg, prevSeg, o) {
      var ops = [];
      switch (seg.key) {
        case "M":
        case "m":
          {
            var delta = seg.key === "m";
            if (seg.data.length >= 2) {
              var x = +seg.data[0];
              var y = +seg.data[1];
              if (delta) {
                x += path.x;
                y += path.y;
              }
              var ro = 1 * (o.maxRandomnessOffset || 0);
              x = x + this._getOffset(-ro, ro, o);
              y = y + this._getOffset(-ro, ro, o);
              path.setPosition(x, y);
              ops.push({ op: "move", data: [x, y] });
            }
            break;
          }
        case "L":
        case "l":
          {
            var _delta = seg.key === "l";
            if (seg.data.length >= 2) {
              var _x = +seg.data[0];
              var _y = +seg.data[1];
              if (_delta) {
                _x += path.x;
                _y += path.y;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, _x, _y, o));
              path.setPosition(_x, _y);
            }
            break;
          }
        case "H":
        case "h":
          {
            var _delta2 = seg.key === "h";
            if (seg.data.length) {
              var _x2 = +seg.data[0];
              if (_delta2) {
                _x2 += path.x;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, _x2, path.y, o));
              path.setPosition(_x2, path.y);
            }
            break;
          }
        case "V":
        case "v":
          {
            var _delta3 = seg.key === "v";
            if (seg.data.length) {
              var _y2 = +seg.data[0];
              if (_delta3) {
                _y2 += path.y;
              }
              ops = ops.concat(this._doubleLine(path.x, path.y, path.x, _y2, o));
              path.setPosition(path.x, _y2);
            }
            break;
          }
        case "Z":
        case "z":
          {
            if (path.first) {
              ops = ops.concat(this._doubleLine(path.x, path.y, path.first[0], path.first[1], o));
              path.setPosition(path.first[0], path.first[1]);
              path.first = null;
            }
            break;
          }
        case "C":
        case "c":
          {
            var _delta4 = seg.key === "c";
            if (seg.data.length >= 6) {
              var x1 = +seg.data[0];
              var y1 = +seg.data[1];
              var x2 = +seg.data[2];
              var y2 = +seg.data[3];
              var _x3 = +seg.data[4];
              var _y3 = +seg.data[5];
              if (_delta4) {
                x1 += path.x;
                x2 += path.x;
                _x3 += path.x;
                y1 += path.y;
                y2 += path.y;
                _y3 += path.y;
              }
              var ob = this._bezierTo(x1, y1, x2, y2, _x3, _y3, path, o);
              ops = ops.concat(ob);
              path.bezierReflectionPoint = [_x3 + (_x3 - x2), _y3 + (_y3 - y2)];
            }
            break;
          }
        case "S":
        case "s":
          {
            var _delta5 = seg.key === "s";
            if (seg.data.length >= 4) {
              var _x4 = +seg.data[0];
              var _y4 = +seg.data[1];
              var _x5 = +seg.data[2];
              var _y5 = +seg.data[3];
              if (_delta5) {
                _x4 += path.x;
                _x5 += path.x;
                _y4 += path.y;
                _y5 += path.y;
              }
              var _x6 = _x4;
              var _y6 = _y4;
              var prevKey = prevSeg ? prevSeg.key : "";
              var ref = null;
              if (prevKey == "c" || prevKey == "C" || prevKey == "s" || prevKey == "S") {
                ref = path.bezierReflectionPoint;
              }
              if (ref) {
                _x6 = ref[0];
                _y6 = ref[1];
              }
              var _ob = this._bezierTo(_x6, _y6, _x4, _y4, _x5, _y5, path, o);
              ops = ops.concat(_ob);
              path.bezierReflectionPoint = [_x5 + (_x5 - _x4), _y5 + (_y5 - _y4)];
            }
            break;
          }
        case "Q":
        case "q":
          {
            var _delta6 = seg.key === "q";
            if (seg.data.length >= 4) {
              var _x7 = +seg.data[0];
              var _y7 = +seg.data[1];
              var _x8 = +seg.data[2];
              var _y8 = +seg.data[3];
              if (_delta6) {
                _x7 += path.x;
                _x8 += path.x;
                _y7 += path.y;
                _y8 += path.y;
              }
              var offset1 = 1 * (1 + o.roughness * 0.2);
              var offset2 = 1.5 * (1 + o.roughness * 0.22);
              ops.push({
                op: "move",
                data: [path.x + this._getOffset(-offset1, offset1, o), path.y + this._getOffset(-offset1, offset1, o)]
              });
              var f = [_x8 + this._getOffset(-offset1, offset1, o), _y8 + this._getOffset(-offset1, offset1, o)];
              ops.push({
                op: "qcurveTo",
                data: [_x7 + this._getOffset(-offset1, offset1, o), _y7 + this._getOffset(-offset1, offset1, o), f[0], f[1]]
              });
              ops.push({
                op: "move",
                data: [path.x + this._getOffset(-offset2, offset2, o), path.y + this._getOffset(-offset2, offset2, o)]
              });
              f = [_x8 + this._getOffset(-offset2, offset2, o), _y8 + this._getOffset(-offset2, offset2, o)];
              ops.push({
                op: "qcurveTo",
                data: [_x7 + this._getOffset(-offset2, offset2, o), _y7 + this._getOffset(-offset2, offset2, o), f[0], f[1]]
              });
              path.setPosition(f[0], f[1]);
              path.quadReflectionPoint = [_x8 + (_x8 - _x7), _y8 + (_y8 - _y7)];
            }
            break;
          }
        case "T":
        case "t":
          {
            var _delta7 = seg.key === "t";
            if (seg.data.length >= 2) {
              var _x9 = +seg.data[0];
              var _y9 = +seg.data[1];
              if (_delta7) {
                _x9 += path.x;
                _y9 += path.y;
              }
              var _x10 = _x9;
              var _y10 = _y9;
              var _prevKey = prevSeg ? prevSeg.key : "";
              var ref = null;
              if (_prevKey == "q" || _prevKey == "Q" || _prevKey == "t" || _prevKey == "T") {
                ref = path.quadReflectionPoint;
              }
              if (ref) {
                _x10 = ref[0];
                _y10 = ref[1];
              }
              var _offset = 1 * (1 + o.roughness * 0.2);
              var _offset2 = 1.5 * (1 + o.roughness * 0.22);
              ops.push({
                op: "move",
                data: [path.x + this._getOffset(-_offset, _offset, o), path.y + this._getOffset(-_offset, _offset, o)]
              });
              var _f = [_x9 + this._getOffset(-_offset, _offset, o), _y9 + this._getOffset(-_offset, _offset, o)];
              ops.push({
                op: "qcurveTo",
                data: [_x10 + this._getOffset(-_offset, _offset, o), _y10 + this._getOffset(-_offset, _offset, o), _f[0], _f[1]]
              });
              ops.push({
                op: "move",
                data: [path.x + this._getOffset(-_offset2, _offset2, o), path.y + this._getOffset(-_offset2, _offset2, o)]
              });
              _f = [_x9 + this._getOffset(-_offset2, _offset2, o), _y9 + this._getOffset(-_offset2, _offset2, o)];
              ops.push({
                op: "qcurveTo",
                data: [_x10 + this._getOffset(-_offset2, _offset2, o), _y10 + this._getOffset(-_offset2, _offset2, o), _f[0], _f[1]]
              });
              path.setPosition(_f[0], _f[1]);
              path.quadReflectionPoint = [_x9 + (_x9 - _x10), _y9 + (_y9 - _y10)];
            }
            break;
          }
        case "A":
        case "a":
          {
            var _delta8 = seg.key === "a";
            if (seg.data.length >= 7) {
              var rx = +seg.data[0];
              var ry = +seg.data[1];
              var angle = +seg.data[2];
              var largeArcFlag = +seg.data[3];
              var sweepFlag = +seg.data[4];
              var _x11 = +seg.data[5];
              var _y11 = +seg.data[6];
              if (_delta8) {
                _x11 += path.x;
                _y11 += path.y;
              }
              if (_x11 == path.x && _y11 == path.y) {
                break;
              }
              if (rx == 0 || ry == 0) {
                ops = ops.concat(this._doubleLine(path.x, path.y, _x11, _y11, o));
                path.setPosition(_x11, _y11);
              } else {
                var _ro = o.maxRandomnessOffset || 0;
                for (var i = 0; i < 1; i++) {
                  var arcConverter = new RoughArcConverter([path.x, path.y], [_x11, _y11], [rx, ry], angle, largeArcFlag ? true : false, sweepFlag ? true : false);
                  var segment = arcConverter.getNextSegment();
                  while (segment) {
                    var _ob2 = this._bezierTo(segment.cp1[0], segment.cp1[1], segment.cp2[0], segment.cp2[1], segment.to[0], segment.to[1], path, o);
                    ops = ops.concat(_ob2);
                    segment = arcConverter.getNextSegment();
                  }
                }
              }
            }
            break;
          }
        default:
          break;
      }
      return ops;
    }
  }, {
    key: "_getOffset",
    value: function _getOffset(min, max, ops) {
      return ops.roughness * (Math.random() * (max - min) + min);
    }
  }, {
    key: "_affine",
    value: function _affine(x, y, cx, cy, sinAnglePrime, cosAnglePrime, R) {
      var A = -cx * cosAnglePrime - cy * sinAnglePrime + cx;
      var B = R * (cx * sinAnglePrime - cy * cosAnglePrime) + cy;
      var C = cosAnglePrime;
      var D = sinAnglePrime;
      var E = -R * sinAnglePrime;
      var F = R * cosAnglePrime;
      return [A + C * x + D * y, B + E * x + F * y];
    }
  }, {
    key: "_doubleLine",
    value: function _doubleLine(x1, y1, x2, y2, o) {
      var o1 = this._line(x1, y1, x2, y2, o, true, false);
      var o2 = this._line(x1, y1, x2, y2, o, true, true);
      return o1.concat(o2);
    }
  }, {
    key: "_line",
    value: function _line(x1, y1, x2, y2, o, move, overlay) {
      var lengthSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
      var offset = o.maxRandomnessOffset || 0;
      if (offset * offset * 100 > lengthSq) {
        offset = Math.sqrt(lengthSq) / 10;
      }
      var halfOffset = offset / 2;
      var divergePoint = 0.2 + Math.random() * 0.2;
      var midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
      var midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
      midDispX = this._getOffset(-midDispX, midDispX, o);
      midDispY = this._getOffset(-midDispY, midDispY, o);
      var ops = [];
      if (move) {
        if (overlay) {
          ops.push({
            op: "move",
            data: [x1 + this._getOffset(-halfOffset, halfOffset, o), y1 + this._getOffset(-halfOffset, halfOffset, o)]
          });
        } else {
          ops.push({
            op: "move",
            data: [x1 + this._getOffset(-offset, offset, o), y1 + this._getOffset(-offset, offset, o)]
          });
        }
      }
      if (overlay) {
        ops.push({
          op: "bcurveTo",
          data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), x2 + this._getOffset(-halfOffset, halfOffset, o), y2 + this._getOffset(-halfOffset, halfOffset, o)]
        });
      } else {
        ops.push({
          op: "bcurveTo",
          data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), x2 + this._getOffset(-offset, offset, o), y2 + this._getOffset(-offset, offset, o)]
        });
      }
      return ops;
    }
  }, {
    key: "_curve",
    value: function _curve(points, closePoint, o) {
      var len = points.length;
      var ops = [];
      if (len > 3) {
        var b = [];
        var s = 1 - o.curveTightness;
        ops.push({ op: "move", data: [points[1][0], points[1][1]] });
        for (var i = 1; i + 2 < len; i++) {
          var cachedVertArray = points[i];
          b[0] = [cachedVertArray[0], cachedVertArray[1]];
          b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
          b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
          b[3] = [points[i + 1][0], points[i + 1][1]];
          ops.push({
            op: "bcurveTo",
            data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]]
          });
        }
        if (closePoint && closePoint.length === 2) {
          var ro = o.maxRandomnessOffset;
          // TODO: more roughness here?
          ops.push({
            ops: "lineTo",
            data: [closePoint[0] + this._getOffset(-ro, ro, o), closePoint[1] + +this._getOffset(-ro, ro, o)]
          });
        }
      } else if (len === 3) {
        ops.push({ op: "move", data: [points[1][0], points[1][1]] });
        ops.push({
          op: "bcurveTo",
          data: [points[1][0], points[1][1], points[2][0], points[2][1], points[2][0], points[2][1]]
        });
      } else if (len === 2) {
        ops = ops.concat(this._doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
      }
      return ops;
    }
  }, {
    key: "_ellipse",
    value: function _ellipse(increment, cx, cy, rx, ry, offset, overlap, o) {
      var radOffset = this._getOffset(-0.5, 0.5, o) - Math.PI / 2;
      var points = [];
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
      for (var angle = radOffset; angle < Math.PI * 2 + radOffset - 0.01; angle = angle + increment) {
        points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
      }
      points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)]);
      points.push([this._getOffset(-offset, offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap), this._getOffset(-offset, offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)]);
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)]);
      return this._curve(points, null, o);
    }
  }, {
    key: "_curveWithOffset",
    value: function _curveWithOffset(points, offset, o) {
      var ps = [];
      ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
      ps.push([points[0][0] + this._getOffset(-offset, offset, o), points[0][1] + this._getOffset(-offset, offset, o)]);
      for (var i = 1; i < points.length; i++) {
        ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
        if (i === points.length - 1) {
          ps.push([points[i][0] + this._getOffset(-offset, offset, o), points[i][1] + this._getOffset(-offset, offset, o)]);
        }
      }
      return this._curve(ps, null, o);
    }
  }, {
    key: "_arc",
    value: function _arc(increment, cx, cy, rx, ry, strt, stp, offset, o) {
      var radOffset = strt + this._getOffset(-0.1, 0.1, o);
      var points = [];
      points.push([this._getOffset(-offset, offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment), this._getOffset(-offset, offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)]);
      for (var angle = radOffset; angle <= stp; angle = angle + increment) {
        points.push([this._getOffset(-offset, offset, o) + cx + rx * Math.cos(angle), this._getOffset(-offset, offset, o) + cy + ry * Math.sin(angle)]);
      }
      points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
      points.push([cx + rx * Math.cos(stp), cy + ry * Math.sin(stp)]);
      return this._curve(points, null, o);
    }
  }, {
    key: "_getIntersectingLines",
    value: function _getIntersectingLines(lineCoords, xCoords, yCoords) {
      var intersections = [];
      var s1 = new RoughSegment(lineCoords[0], lineCoords[1], lineCoords[2], lineCoords[3]);
      for (var i = 0; i < xCoords.length; i++) {
        var s2 = new RoughSegment(xCoords[i], yCoords[i], xCoords[(i + 1) % xCoords.length], yCoords[(i + 1) % xCoords.length]);
        if (s1.compare(s2) == RoughSegmentRelation().INTERSECTS) {
          intersections.push([s1.xi, s1.yi]);
        }
      }
      return intersections;
    }
  }]);

  return RoughRenderer;
}();

self._roughScript = self.document && self.document.currentScript && self.document.currentScript.src;

var RoughGenerator = function () {
  function RoughGenerator(config, canvas) {
    _classCallCheck(this, RoughGenerator);

    this.config = config || {};
    this.canvas = canvas;
    this.defaultOptions = {
      maxRandomnessOffset: 2,
      roughness: 1,
      bowing: 1,
      stroke: '#000',
      strokeWidth: 1,
      curveTightness: 0,
      curveStepCount: 9,
      fill: null,
      fillStyle: 'hachure',
      fillWeight: -1,
      hachureAngle: -41,
      hachureGap: -1
    };
    if (this.config.options) {
      this.defaultOptions = this._options(this.config.options);
    }
  }

  _createClass(RoughGenerator, [{
    key: '_options',
    value: function _options(options) {
      return options ? _Object$assign({}, this.defaultOptions, options) : this.defaultOptions;
    }
  }, {
    key: '_drawable',
    value: function _drawable(shape, sets, options) {
      return { shape: shape, sets: sets || [], options: options || this.defaultOptions };
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var o = this._options(options);
      return this._drawable('line', [this.lib.line(x1, y1, x2, y2, o)], o);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        var xc = [x, x + width, x + width, x];
        var yc = [y, y, y + height, y + height];
        if (o.fillStyle === 'solid') {
          paths.push(this.lib.solidFillShape(xc, yc, o));
        } else {
          paths.push(this.lib.hachureFillShape(xc, yc, o));
        }
      }
      paths.push(this.lib.rectangle(x, y, width, height, o));
      return this._drawable('rectangle', paths, o);
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = this.lib.ellipse(x, y, width, height, o);
          shape.type = 'fillPath';
          paths.push(shape);
        } else {
          paths.push(this.lib.hachureFillEllipse(x, y, width, height, o));
        }
      }
      paths.push(this.lib.ellipse(x, y, width, height, o));
      return this._drawable('ellipse', paths, o);
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var ret = this.ellipse(x, y, diameter, diameter, options);
      ret.shape = 'circle';
      return ret;
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var o = this._options(options);
      return this._drawable('linearPath', [this.lib.linearPath(points, false, o)], o);
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var o = this._options(options);
      var paths = [];
      if (o.fill) {
        var xc = [],
            yc = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(points), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            xc.push(p[0]);
            yc.push(p[1]);
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

        if (o.fillStyle === 'solid') {
          paths.push(this.lib.solidFillShape(xc, yc, o));
        } else {
          paths.push(this.lib.hachureFillShape(xc, yc, o));
        }
      }
      paths.push(this.lib.linearPath(points, true, o));
      return this._drawable('polygon', paths, o);
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var o = this._options(options);
      var paths = [];
      if (closed && o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = this.lib.arc(x, y, width, height, start, stop, true, false, o);
          shape.type = 'fillPath';
          paths.push(shape);
        } else {
          paths.push(this.lib.hachureFillArc(x, y, width, height, start, stop, o));
        }
      }
      paths.push(this.lib.arc(x, y, width, height, start, stop, closed, true, o));
      return this._drawable('arc', paths, o);
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var o = this._options(options);
      return this._drawable('curve', [this.lib.curve(points, o)], o);
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var o = this._options(options);
      var paths = [];
      if (!d) {
        return this._drawable('path', paths, o);
      }
      if (o.fill) {
        if (o.fillStyle === 'solid') {
          var shape = { type: 'path2Dfill', path: d };
          paths.push(shape);
        } else {
          var size = this._computePathSize(d);
          var xc = [0, size[0], size[0], 0];
          var yc = [0, 0, size[1], size[1]];
          var _shape = this.lib.hachureFillShape(xc, yc, o);
          _shape.type = 'path2Dpattern';
          _shape.size = size;
          _shape.path = d;
          paths.push(_shape);
        }
      }
      paths.push(this.lib.svgPath(d, o));
      return this._drawable('path', paths, o);
    }
  }, {
    key: 'toPaths',
    value: function toPaths(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.defaultOptions;
      var paths = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(sets), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var drawing = _step2.value;

          var path = null;
          switch (drawing.type) {
            case 'path':
              path = {
                d: this.opsToPath(drawing),
                stroke: o.stroke,
                strokeWidth: o.strokeWidth,
                fill: 'none'
              };
              break;
            case 'fillPath':
              path = {
                d: this.opsToPath(drawing),
                stroke: 'none',
                strokeWidth: 0,
                fill: o.fill
              };
              break;
            case 'fillSketch':
              path = this._fillSketch(drawing, o);
              break;
            case 'path2Dfill':
              path = {
                d: drawing.path,
                stroke: 'none',
                strokeWidth: 0,
                fill: o.fill
              };
              break;
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var pattern = {
                  x: 0, y: 0, width: 1, height: 1,
                  viewBox: '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]),
                  patternUnits: 'objectBoundingBox',
                  path: this._fillSketch(drawing, o)
                };
                path = {
                  d: drawing.path,
                  stroke: 'none',
                  strokeWidth: 0,
                  pattern: pattern
                };
                break;
              }
          }
          if (path) {
            paths.push(path);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return paths;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      return {
        d: this.opsToPath(drawing),
        stroke: o.fill,
        strokeWidth: fweight,
        fill: 'none'
      };
    }
  }, {
    key: 'opsToPath',
    value: function opsToPath(drawing) {
      var path = '';
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(drawing.ops), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          var data = item.data;
          switch (item.op) {
            case 'move':
              path += 'M' + data[0] + ' ' + data[1] + ' ';
              break;
            case 'bcurveTo':
              path += 'C' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ', ' + data[4] + ' ' + data[5] + ' ';
              break;
            case 'qcurveTo':
              path += 'Q' + data[0] + ' ' + data[1] + ', ' + data[2] + ' ' + data[3] + ' ';
              break;
            case 'lineTo':
              path += 'L' + data[0] + ' ' + data[1] + ' ';
              break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return path.trim();
    }
  }, {
    key: '_computePathSize',
    value: function _computePathSize(d) {
      var size = [0, 0];
      if (self.document) {
        try {
          var ns = "http://www.w3.org/2000/svg";
          var svg = self.document.createElementNS(ns, "svg");
          svg.setAttribute("width", "0");
          svg.setAttribute("height", "0");
          var pathNode = self.document.createElementNS(ns, "path");
          pathNode.setAttribute('d', d);
          svg.appendChild(pathNode);
          self.document.body.appendChild(svg);
          var bb = pathNode.getBBox();
          if (bb) {
            size[0] = bb.width || 0;
            size[1] = bb.height || 0;
          }
          self.document.body.removeChild(svg);
        } catch (err) {}
      }
      var canvasSize = this._canvasSize();
      if (!(size[0] * size[1])) {
        size = canvasSize;
      }
      size[0] = Math.min(size[0], canvasSize[0]);
      size[1] = Math.min(size[1], canvasSize[1]);
      return size;
    }
  }, {
    key: '_canvasSize',
    value: function _canvasSize() {
      var val = function val(w) {
        if (w) {
          if ((typeof w === 'undefined' ? 'undefined' : _typeof(w)) === 'object') {
            if (w.baseVal && w.baseVal.value) {
              return w.baseVal.value;
            }
          }
        }
        return w || 100;
      };
      return this.canvas ? [val(this.canvas.width), val(this.canvas.height)] : [100, 100];
    }
  }, {
    key: 'lib',
    get: function get() {
      if (!this._renderer) {
        if (self && self.workly && this.config.async && !this.config.noWorker) {
          var tos = Function.prototype.toString;
          var worklySource = this.config.worklyURL || 'https://cdn.jsdelivr.net/gh/pshihn/workly/dist/workly.min.js';
          var rendererSource = this.config.roughURL || self._roughScript;
          if (rendererSource && worklySource) {
            var code = 'importScripts(\'' + worklySource + '\', \'' + rendererSource + '\');\nworkly.expose(self.rough.createRenderer());';
            var ourl = URL.createObjectURL(new Blob([code]));
            this._renderer = workly.proxy(ourl);
          } else {
            this._renderer = new RoughRenderer();
          }
        } else {
          this._renderer = new RoughRenderer();
        }
      }
      return this._renderer;
    }
  }]);

  return RoughGenerator;
}();

var RoughGeneratorAsync = function (_RoughGenerator) {
  _inherits(RoughGeneratorAsync, _RoughGenerator);

  function RoughGeneratorAsync() {
    _classCallCheck(this, RoughGeneratorAsync);

    return _possibleConstructorReturn(this, (RoughGeneratorAsync.__proto__ || _Object$getPrototypeOf(RoughGeneratorAsync)).apply(this, arguments));
  }

  _createClass(RoughGeneratorAsync, [{
    key: 'line',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(x1, y1, x2, y2, options) {
        var o;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                o = this._options(options);
                _context.t0 = this;
                _context.next = 4;
                return this.lib.line(x1, y1, x2, y2, o);

              case 4:
                _context.t1 = _context.sent;
                _context.t2 = [_context.t1];
                _context.t3 = o;
                return _context.abrupt('return', _context.t0._drawable.call(_context.t0, 'line', _context.t2, _context.t3));

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function line(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return line;
    }()
  }, {
    key: 'rectangle',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(x, y, width, height, options) {
        var o, paths, xc, yc;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context2.next = 18;
                  break;
                }

                xc = [x, x + width, x + width, x];
                yc = [y, y, y + height, y + height];

                if (!(o.fillStyle === 'solid')) {
                  _context2.next = 13;
                  break;
                }

                _context2.t0 = paths;
                _context2.next = 9;
                return this.lib.solidFillShape(xc, yc, o);

              case 9:
                _context2.t1 = _context2.sent;

                _context2.t0.push.call(_context2.t0, _context2.t1);

                _context2.next = 18;
                break;

              case 13:
                _context2.t2 = paths;
                _context2.next = 16;
                return this.lib.hachureFillShape(xc, yc, o);

              case 16:
                _context2.t3 = _context2.sent;

                _context2.t2.push.call(_context2.t2, _context2.t3);

              case 18:
                _context2.t4 = paths;
                _context2.next = 21;
                return this.lib.rectangle(x, y, width, height, o);

              case 21:
                _context2.t5 = _context2.sent;

                _context2.t4.push.call(_context2.t4, _context2.t5);

                return _context2.abrupt('return', this._drawable('rectangle', paths, o));

              case 24:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rectangle(_x6, _x7, _x8, _x9, _x10) {
        return _ref2.apply(this, arguments);
      }

      return rectangle;
    }()
  }, {
    key: 'ellipse',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(x, y, width, height, options) {
        var o, paths, shape;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context3.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 6;
                return this.lib.ellipse(x, y, width, height, o);

              case 6:
                shape = _context3.sent;

                shape.type = 'fillPath';
                paths.push(shape);
                _context3.next = 16;
                break;

              case 11:
                _context3.t0 = paths;
                _context3.next = 14;
                return this.lib.hachureFillEllipse(x, y, width, height, o);

              case 14:
                _context3.t1 = _context3.sent;

                _context3.t0.push.call(_context3.t0, _context3.t1);

              case 16:
                _context3.t2 = paths;
                _context3.next = 19;
                return this.lib.ellipse(x, y, width, height, o);

              case 19:
                _context3.t3 = _context3.sent;

                _context3.t2.push.call(_context3.t2, _context3.t3);

                return _context3.abrupt('return', this._drawable('ellipse', paths, o));

              case 22:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function ellipse(_x11, _x12, _x13, _x14, _x15) {
        return _ref3.apply(this, arguments);
      }

      return ellipse;
    }()
  }, {
    key: 'circle',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(x, y, diameter, options) {
        var ret;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.ellipse(x, y, diameter, diameter, options);

              case 2:
                ret = _context4.sent;

                ret.shape = 'circle';
                return _context4.abrupt('return', ret);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function circle(_x16, _x17, _x18, _x19) {
        return _ref4.apply(this, arguments);
      }

      return circle;
    }()
  }, {
    key: 'linearPath',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(points, options) {
        var o;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                o = this._options(options);
                _context5.t0 = this;
                _context5.next = 4;
                return this.lib.linearPath(points, false, o);

              case 4:
                _context5.t1 = _context5.sent;
                _context5.t2 = [_context5.t1];
                _context5.t3 = o;
                return _context5.abrupt('return', _context5.t0._drawable.call(_context5.t0, 'linearPath', _context5.t2, _context5.t3));

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function linearPath(_x20, _x21) {
        return _ref5.apply(this, arguments);
      }

      return linearPath;
    }()
  }, {
    key: 'polygon',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(points, options) {
        var o, paths, xc, yc, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, p;

        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!o.fill) {
                  _context6.next = 36;
                  break;
                }

                xc = [], yc = [];
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context6.prev = 7;

                for (_iterator4 = _getIterator(points); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  p = _step4.value;

                  xc.push(p[0]);
                  yc.push(p[1]);
                }
                _context6.next = 15;
                break;

              case 11:
                _context6.prev = 11;
                _context6.t0 = _context6['catch'](7);
                _didIteratorError4 = true;
                _iteratorError4 = _context6.t0;

              case 15:
                _context6.prev = 15;
                _context6.prev = 16;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 18:
                _context6.prev = 18;

                if (!_didIteratorError4) {
                  _context6.next = 21;
                  break;
                }

                throw _iteratorError4;

              case 21:
                return _context6.finish(18);

              case 22:
                return _context6.finish(15);

              case 23:
                if (!(o.fillStyle === 'solid')) {
                  _context6.next = 31;
                  break;
                }

                _context6.t1 = paths;
                _context6.next = 27;
                return this.lib.solidFillShape(xc, yc, o);

              case 27:
                _context6.t2 = _context6.sent;

                _context6.t1.push.call(_context6.t1, _context6.t2);

                _context6.next = 36;
                break;

              case 31:
                _context6.t3 = paths;
                _context6.next = 34;
                return this.lib.hachureFillShape(xc, yc, o);

              case 34:
                _context6.t4 = _context6.sent;

                _context6.t3.push.call(_context6.t3, _context6.t4);

              case 36:
                _context6.t5 = paths;
                _context6.next = 39;
                return this.lib.linearPath(points, true, o);

              case 39:
                _context6.t6 = _context6.sent;

                _context6.t5.push.call(_context6.t5, _context6.t6);

                return _context6.abrupt('return', this._drawable('polygon', paths, o));

              case 42:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[7, 11, 15, 23], [16,, 18, 22]]);
      }));

      function polygon(_x22, _x23) {
        return _ref6.apply(this, arguments);
      }

      return polygon;
    }()
  }, {
    key: 'arc',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(x, y, width, height, start, stop, closed, options) {
        var o, paths, shape;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (!(closed && o.fill)) {
                  _context7.next = 16;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context7.next = 11;
                  break;
                }

                _context7.next = 6;
                return this.lib.arc(x, y, width, height, start, stop, true, false, o);

              case 6:
                shape = _context7.sent;

                shape.type = 'fillPath';
                paths.push(shape);
                _context7.next = 16;
                break;

              case 11:
                _context7.t0 = paths;
                _context7.next = 14;
                return this.lib.hachureFillArc(x, y, width, height, start, stop, o);

              case 14:
                _context7.t1 = _context7.sent;

                _context7.t0.push.call(_context7.t0, _context7.t1);

              case 16:
                _context7.t2 = paths;
                _context7.next = 19;
                return this.lib.arc(x, y, width, height, start, stop, closed, true, o);

              case 19:
                _context7.t3 = _context7.sent;

                _context7.t2.push.call(_context7.t2, _context7.t3);

                return _context7.abrupt('return', this._drawable('arc', paths, o));

              case 22:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function arc(_x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31) {
        return _ref7.apply(this, arguments);
      }

      return arc;
    }()
  }, {
    key: 'curve',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(points, options) {
        var o;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                o = this._options(options);
                _context8.t0 = this;
                _context8.next = 4;
                return this.lib.curve(points, o);

              case 4:
                _context8.t1 = _context8.sent;
                _context8.t2 = [_context8.t1];
                _context8.t3 = o;
                return _context8.abrupt('return', _context8.t0._drawable.call(_context8.t0, 'curve', _context8.t2, _context8.t3));

              case 8:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function curve(_x32, _x33) {
        return _ref8.apply(this, arguments);
      }

      return curve;
    }()
  }, {
    key: 'path',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(d, options) {
        var o, paths, shape, size, xc, yc, _shape2;

        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                o = this._options(options);
                paths = [];

                if (d) {
                  _context9.next = 4;
                  break;
                }

                return _context9.abrupt('return', this._drawable('path', paths, o));

              case 4:
                if (!o.fill) {
                  _context9.next = 20;
                  break;
                }

                if (!(o.fillStyle === 'solid')) {
                  _context9.next = 10;
                  break;
                }

                shape = { type: 'path2Dfill', path: d };

                paths.push(shape);
                _context9.next = 20;
                break;

              case 10:
                size = this._computePathSize(d);
                xc = [0, size[0], size[0], 0];
                yc = [0, 0, size[1], size[1]];
                _context9.next = 15;
                return this.lib.hachureFillShape(xc, yc, o);

              case 15:
                _shape2 = _context9.sent;

                _shape2.type = 'path2Dpattern';
                _shape2.size = size;
                _shape2.path = d;
                paths.push(_shape2);

              case 20:
                _context9.t0 = paths;
                _context9.next = 23;
                return this.lib.svgPath(d, o);

              case 23:
                _context9.t1 = _context9.sent;

                _context9.t0.push.call(_context9.t0, _context9.t1);

                return _context9.abrupt('return', this._drawable('path', paths, o));

              case 26:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function path(_x34, _x35) {
        return _ref9.apply(this, arguments);
      }

      return path;
    }()
  }]);

  return RoughGeneratorAsync;
}(RoughGenerator);

var RoughCanvas = function () {
  function RoughCanvas(canvas, config) {
    _classCallCheck(this, RoughCanvas);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this._init(config);
  }

  _createClass(RoughCanvas, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new RoughGenerator(config, this.canvas);
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var d = this.gen.line(x1, y1, x2, y2, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var d = this.gen.rectangle(x, y, width, height, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var d = this.gen.ellipse(x, y, width, height, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var d = this.gen.circle(x, y, diameter, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var d = this.gen.linearPath(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var d = this.gen.polygon(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var d = this.gen.curve(points, options);
      this.draw(d);
      return d;
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var drawing = this.gen.path(d, options);
      this.draw(drawing);
      return drawing;
    }
  }, {
    key: 'draw',
    value: function draw(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.gen.defaultOptions;
      var ctx = this.ctx;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(sets), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var drawing = _step.value;

          switch (drawing.type) {
            case 'path':
              ctx.save();
              ctx.strokeStyle = o.stroke;
              ctx.lineWidth = o.strokeWidth;
              this._drawToContext(ctx, drawing);
              ctx.restore();
              break;
            case 'fillPath':
              ctx.save();
              ctx.fillStyle = o.fill;
              this._drawToContext(ctx, drawing, o);
              ctx.restore();
              break;
            case 'fillSketch':
              this._fillSketch(ctx, drawing, o);
              break;
            case 'path2Dfill':
              {
                this.ctx.save();
                this.ctx.fillStyle = o.fill;
                var p2d = new Path2D(drawing.path);
                this.ctx.fill(p2d);
                this.ctx.restore();
                break;
              }
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var hcanvas = document.createElement('canvas');
                var hcontext = hcanvas.getContext("2d");
                var bbox = this._computeBBox(drawing.path);
                if (bbox && (bbox.width || bbox.height)) {
                  hcanvas.width = this.canvas.width;
                  hcanvas.height = this.canvas.height;
                  hcontext.translate(bbox.x || 0, bbox.y || 0);
                } else {
                  hcanvas.width = size[0];
                  hcanvas.height = size[1];
                }
                this._fillSketch(hcontext, drawing, o);
                this.ctx.save();
                this.ctx.fillStyle = this.ctx.createPattern(hcanvas, 'repeat');
                var _p2d = new Path2D(drawing.path);
                this.ctx.fill(_p2d);
                this.ctx.restore();
                break;
              }
          }
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
    }
  }, {
    key: '_computeBBox',
    value: function _computeBBox(d) {
      if (self.document) {
        try {
          var ns = "http://www.w3.org/2000/svg";
          var svg = self.document.createElementNS(ns, "svg");
          svg.setAttribute("width", "0");
          svg.setAttribute("height", "0");
          var pathNode = self.document.createElementNS(ns, "path");
          pathNode.setAttribute('d', d);
          svg.appendChild(pathNode);
          self.document.body.appendChild(svg);
          var bbox = pathNode.getBBox();
          self.document.body.removeChild(svg);
          return bbox;
        } catch (err) {}
      }
      return null;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(ctx, drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      ctx.save();
      ctx.strokeStyle = o.fill;
      ctx.lineWidth = fweight;
      this._drawToContext(ctx, drawing);
      ctx.restore();
    }
  }, {
    key: '_drawToContext',
    value: function _drawToContext(ctx, drawing) {
      ctx.beginPath();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(drawing.ops), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          var data = item.data;
          switch (item.op) {
            case 'move':
              ctx.moveTo(data[0], data[1]);
              break;
            case 'bcurveTo':
              ctx.bezierCurveTo(data[0], data[1], data[2], data[3], data[4], data[5]);
              break;
            case 'qcurveTo':
              ctx.quadraticCurveTo(data[0], data[1], data[2], data[3]);
              break;
            case 'lineTo':
              ctx.lineTo(data[0], data[1]);
              break;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (drawing.type === 'fillPath') {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }, {
    key: 'generator',
    get: function get() {
      return this.gen;
    }
  }], [{
    key: 'createRenderer',
    value: function createRenderer() {
      return new RoughRenderer();
    }
  }]);

  return RoughCanvas;
}();

var RoughCanvasAsync = function (_RoughCanvas) {
  _inherits(RoughCanvasAsync, _RoughCanvas);

  function RoughCanvasAsync() {
    _classCallCheck(this, RoughCanvasAsync);

    return _possibleConstructorReturn(this, (RoughCanvasAsync.__proto__ || _Object$getPrototypeOf(RoughCanvasAsync)).apply(this, arguments));
  }

  _createClass(RoughCanvasAsync, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new RoughGeneratorAsync(config, this.canvas);
    }
  }, {
    key: 'line',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(x1, y1, x2, y2, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.gen.line(x1, y1, x2, y2, options);

              case 2:
                d = _context.sent;

                this.draw(d);
                return _context.abrupt('return', d);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function line(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return line;
    }()
  }, {
    key: 'rectangle',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(x, y, width, height, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.gen.rectangle(x, y, width, height, options);

              case 2:
                d = _context2.sent;

                this.draw(d);
                return _context2.abrupt('return', d);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rectangle(_x6, _x7, _x8, _x9, _x10) {
        return _ref2.apply(this, arguments);
      }

      return rectangle;
    }()
  }, {
    key: 'ellipse',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(x, y, width, height, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.gen.ellipse(x, y, width, height, options);

              case 2:
                d = _context3.sent;

                this.draw(d);
                return _context3.abrupt('return', d);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function ellipse(_x11, _x12, _x13, _x14, _x15) {
        return _ref3.apply(this, arguments);
      }

      return ellipse;
    }()
  }, {
    key: 'circle',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(x, y, diameter, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.gen.circle(x, y, diameter, options);

              case 2:
                d = _context4.sent;

                this.draw(d);
                return _context4.abrupt('return', d);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function circle(_x16, _x17, _x18, _x19) {
        return _ref4.apply(this, arguments);
      }

      return circle;
    }()
  }, {
    key: 'linearPath',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.gen.linearPath(points, options);

              case 2:
                d = _context5.sent;

                this.draw(d);
                return _context5.abrupt('return', d);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function linearPath(_x20, _x21) {
        return _ref5.apply(this, arguments);
      }

      return linearPath;
    }()
  }, {
    key: 'polygon',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.gen.polygon(points, options);

              case 2:
                d = _context6.sent;

                this.draw(d);
                return _context6.abrupt('return', d);

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function polygon(_x22, _x23) {
        return _ref6.apply(this, arguments);
      }

      return polygon;
    }()
  }, {
    key: 'arc',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(x, y, width, height, start, stop, closed, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.gen.arc(x, y, width, height, start, stop, closed, options);

              case 2:
                d = _context7.sent;

                this.draw(d);
                return _context7.abrupt('return', d);

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function arc(_x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31) {
        return _ref7.apply(this, arguments);
      }

      return arc;
    }()
  }, {
    key: 'curve',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.gen.curve(points, options);

              case 2:
                d = _context8.sent;

                this.draw(d);
                return _context8.abrupt('return', d);

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function curve(_x32, _x33) {
        return _ref8.apply(this, arguments);
      }

      return curve;
    }()
  }, {
    key: 'path',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(d, options) {
        var drawing;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.gen.path(d, options);

              case 2:
                drawing = _context9.sent;

                this.draw(drawing);
                return _context9.abrupt('return', drawing);

              case 5:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function path(_x34, _x35) {
        return _ref9.apply(this, arguments);
      }

      return path;
    }()
  }]);

  return RoughCanvasAsync;
}(RoughCanvas);

var RoughSVG = function () {
  function RoughSVG(svg, config) {
    _classCallCheck(this, RoughSVG);

    this.svg = svg;
    this._init(config);
  }

  _createClass(RoughSVG, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new RoughGenerator(config, this.svg);
    }
  }, {
    key: 'line',
    value: function line(x1, y1, x2, y2, options) {
      var d = this.gen.line(x1, y1, x2, y2, options);
      return this.draw(d);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, options) {
      var d = this.gen.rectangle(x, y, width, height, options);
      return this.draw(d);
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, options) {
      var d = this.gen.ellipse(x, y, width, height, options);
      return this.draw(d);
    }
  }, {
    key: 'circle',
    value: function circle(x, y, diameter, options) {
      var d = this.gen.circle(x, y, diameter, options);
      return this.draw(d);
    }
  }, {
    key: 'linearPath',
    value: function linearPath(points, options) {
      var d = this.gen.linearPath(points, options);
      return this.draw(d);
    }
  }, {
    key: 'polygon',
    value: function polygon(points, options) {
      var d = this.gen.polygon(points, options);
      return this.draw(d);
    }
  }, {
    key: 'arc',
    value: function arc(x, y, width, height, start, stop, closed, options) {
      var d = this.gen.arc(x, y, width, height, start, stop, closed, options);
      return this.draw(d);
    }
  }, {
    key: 'curve',
    value: function curve(points, options) {
      var d = this.gen.curve(points, options);
      return this.draw(d);
    }
  }, {
    key: 'path',
    value: function path(d, options) {
      var drawing = this.gen.path(d, options);
      return this.draw(drawing);
    }
  }, {
    key: 'draw',
    value: function draw(drawable) {
      var sets = drawable.sets || [];
      var o = drawable.options || this.gen.defaultOptions;
      var doc = this.svg.ownerDocument || document;
      var g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(sets), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var drawing = _step.value;

          var path = null;
          switch (drawing.type) {
            case 'path':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', this._opsToPath(drawing));
                path.style.stroke = o.stroke;
                path.style.strokeWidth = o.strokeWidth;
                path.style.fill = 'none';
                break;
              }
            case 'fillPath':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', this._opsToPath(drawing));
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = o.fill;
                break;
              }
            case 'fillSketch':
              {
                path = this._fillSketch(doc, drawing, o);
                break;
              }
            case 'path2Dfill':
              {
                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', drawing.path);
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = o.fill;
                break;
              }
            case 'path2Dpattern':
              {
                var size = drawing.size;
                var pattern = doc.createElementNS('http://www.w3.org/2000/svg', 'pattern');
                var id = 'rough-' + Math.floor(Math.random() * (_Number$MAX_SAFE_INTEGER || 999999));
                pattern.setAttribute('id', id);
                pattern.setAttribute('x', 0);
                pattern.setAttribute('y', 0);
                pattern.setAttribute('width', 1);
                pattern.setAttribute('height', 1);
                pattern.setAttribute('height', 1);
                pattern.setAttribute('viewBox', '0 0 ' + Math.round(size[0]) + ' ' + Math.round(size[1]));
                pattern.setAttribute('patternUnits', 'objectBoundingBox');
                var patternPath = this._fillSketch(doc, drawing, o);
                pattern.appendChild(patternPath);
                this.defs.appendChild(pattern);

                path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', drawing.path);
                path.style.stroke = 'none';
                path.style.strokeWidth = 0;
                path.style.fill = 'url(#' + id + ')';
                break;
              }
          }
          if (path) {
            g.appendChild(path);
          }
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

      return g;
    }
  }, {
    key: '_fillSketch',
    value: function _fillSketch(doc, drawing, o) {
      var fweight = o.fillWeight;
      if (fweight < 0) {
        fweight = o.strokeWidth / 2;
      }
      var path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', this._opsToPath(drawing));
      path.style.stroke = o.fill;
      path.style.strokeWidth = fweight;
      path.style.fill = 'none';
      return path;
    }
  }, {
    key: '_opsToPath',
    value: function _opsToPath(drawing) {
      return this.gen.opsToPath(drawing);
    }
  }, {
    key: 'generator',
    get: function get() {
      return this.gen;
    }
  }, {
    key: 'defs',
    get: function get() {
      if (!this._defs) {
        var doc = this.svg.ownerDocument || document;
        var dnode = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
        if (this.svg.firstChild) {
          this.svg.insertBefore(dnode, this.svg.firstChild);
        } else {
          this.svg.appendChild(dnode);
        }
        this._defs = dnode;
      }
      return this._defs;
    }
  }]);

  return RoughSVG;
}();

var RoughSVGAsync = function (_RoughSVG) {
  _inherits(RoughSVGAsync, _RoughSVG);

  function RoughSVGAsync() {
    _classCallCheck(this, RoughSVGAsync);

    return _possibleConstructorReturn(this, (RoughSVGAsync.__proto__ || _Object$getPrototypeOf(RoughSVGAsync)).apply(this, arguments));
  }

  _createClass(RoughSVGAsync, [{
    key: '_init',
    value: function _init(config) {
      this.gen = new RoughGeneratorAsync(config, this.svg);
    }
  }, {
    key: 'line',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(x1, y1, x2, y2, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.gen.line(x1, y1, x2, y2, options);

              case 2:
                d = _context.sent;
                return _context.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function line(_x, _x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
      }

      return line;
    }()
  }, {
    key: 'rectangle',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(x, y, width, height, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.gen.rectangle(x, y, width, height, options);

              case 2:
                d = _context2.sent;
                return _context2.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function rectangle(_x6, _x7, _x8, _x9, _x10) {
        return _ref2.apply(this, arguments);
      }

      return rectangle;
    }()
  }, {
    key: 'ellipse',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(x, y, width, height, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.gen.ellipse(x, y, width, height, options);

              case 2:
                d = _context3.sent;
                return _context3.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function ellipse(_x11, _x12, _x13, _x14, _x15) {
        return _ref3.apply(this, arguments);
      }

      return ellipse;
    }()
  }, {
    key: 'circle',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(x, y, diameter, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.gen.circle(x, y, diameter, options);

              case 2:
                d = _context4.sent;
                return _context4.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function circle(_x16, _x17, _x18, _x19) {
        return _ref4.apply(this, arguments);
      }

      return circle;
    }()
  }, {
    key: 'linearPath',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.gen.linearPath(points, options);

              case 2:
                d = _context5.sent;
                return _context5.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function linearPath(_x20, _x21) {
        return _ref5.apply(this, arguments);
      }

      return linearPath;
    }()
  }, {
    key: 'polygon',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.gen.polygon(points, options);

              case 2:
                d = _context6.sent;
                return _context6.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function polygon(_x22, _x23) {
        return _ref6.apply(this, arguments);
      }

      return polygon;
    }()
  }, {
    key: 'arc',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(x, y, width, height, start, stop, closed, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.gen.arc(x, y, width, height, start, stop, closed, options);

              case 2:
                d = _context7.sent;
                return _context7.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function arc(_x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31) {
        return _ref7.apply(this, arguments);
      }

      return arc;
    }()
  }, {
    key: 'curve',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(points, options) {
        var d;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.gen.curve(points, options);

              case 2:
                d = _context8.sent;
                return _context8.abrupt('return', this.draw(d));

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function curve(_x32, _x33) {
        return _ref8.apply(this, arguments);
      }

      return curve;
    }()
  }, {
    key: 'path',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(d, options) {
        var drawing;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.gen.path(d, options);

              case 2:
                drawing = _context9.sent;
                return _context9.abrupt('return', this.draw(drawing));

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function path(_x34, _x35) {
        return _ref9.apply(this, arguments);
      }

      return path;
    }()
  }]);

  return RoughSVGAsync;
}(RoughSVG);

var index = {
  canvas: function canvas(_canvas, config) {
    if (config && config.async) {
      return new RoughCanvasAsync(_canvas, config);
    }
    return new RoughCanvas(_canvas, config);
  },
  svg: function svg(_svg, config) {
    if (config && config.async) {
      return new RoughSVGAsync(_svg, config);
    }
    return new RoughSVG(_svg, config);
  },
  createRenderer: function createRenderer() {
    return RoughCanvas.createRenderer();
  },
  generator: function generator(config, size) {
    if (config && config.async) {
      return new RoughGeneratorAsync(config, size);
    }
    return new RoughGenerator(config, size);
  }
};

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91Z2guanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWdtZW50LmpzIiwiLi4vc3JjL2hhY2h1cmUuanMiLCIuLi9zcmMvcGF0aC5qcyIsIi4uL3NyYy9yZW5kZXJlci5qcyIsIi4uL3NyYy9nZW5lcmF0b3IuanMiLCIuLi9zcmMvY2FudmFzLmpzIiwiLi4vc3JjL3N2Zy5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gUm91Z2hTZWdtZW50UmVsYXRpb24oKSB7XG4gIHJldHVybiB7XG4gICAgTEVGVDogMCxcbiAgICBSSUdIVDogMSxcbiAgICBJTlRFUlNFQ1RTOiAyLFxuICAgIEFIRUFEOiAzLFxuICAgIEJFSElORDogNCxcbiAgICBTRVBBUkFURTogNSxcbiAgICBVTkRFRklORUQ6IDZcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoU2VnbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB4MSwgcHkxLCBweDIsIHB5Mikge1xuICAgIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdCA9IFJvdWdoU2VnbWVudFJlbGF0aW9uKCk7XG4gICAgdGhpcy5weDEgPSBweDE7XG4gICAgdGhpcy5weTEgPSBweTE7XG4gICAgdGhpcy5weDIgPSBweDI7XG4gICAgdGhpcy5weTIgPSBweTI7XG4gICAgdGhpcy54aSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy55aSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5hID0gcHkyIC0gcHkxO1xuICAgIHRoaXMuYiA9IHB4MSAtIHB4MjtcbiAgICB0aGlzLmMgPSBweDIgKiBweTEgLSBweDEgKiBweTI7XG4gICAgdGhpcy5fdW5kZWZpbmVkID0gKCh0aGlzLmEgPT0gMCkgJiYgKHRoaXMuYiA9PSAwKSAmJiAodGhpcy5jID09IDApKTtcbiAgfVxuXG4gIGlzVW5kZWZpbmVkKCkge1xuICAgIHJldHVybiB0aGlzLl91bmRlZmluZWQ7XG4gIH1cblxuICBjb21wYXJlKG90aGVyU2VnbWVudCkge1xuICAgIGlmICh0aGlzLmlzVW5kZWZpbmVkKCkgfHwgb3RoZXJTZWdtZW50LmlzVW5kZWZpbmVkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuVU5ERUZJTkVEO1xuICAgIH1cbiAgICB2YXIgZ3JhZDEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIHZhciBncmFkMiA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdmFyIGludDEgPSAwLCBpbnQyID0gMDtcbiAgICB2YXIgYSA9IHRoaXMuYSwgYiA9IHRoaXMuYiwgYyA9IHRoaXMuYztcblxuICAgIGlmIChNYXRoLmFicyhiKSA+IDAuMDAwMDEpIHtcbiAgICAgIGdyYWQxID0gLWEgLyBiO1xuICAgICAgaW50MSA9IC1jIC8gYjtcbiAgICB9XG4gICAgaWYgKE1hdGguYWJzKG90aGVyU2VnbWVudC5iKSA+IDAuMDAwMDEpIHtcbiAgICAgIGdyYWQyID0gLW90aGVyU2VnbWVudC5hIC8gb3RoZXJTZWdtZW50LmI7XG4gICAgICBpbnQyID0gLW90aGVyU2VnbWVudC5jIC8gb3RoZXJTZWdtZW50LmI7XG4gICAgfVxuXG4gICAgaWYgKGdyYWQxID09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgIGlmIChncmFkMiA9PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICAgIGlmICgoLWMgLyBhKSAhPSAoLW90aGVyU2VnbWVudC5jIC8gb3RoZXJTZWdtZW50LmEpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHRoaXMucHkxID49IE1hdGgubWluKG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSAmJiAodGhpcy5weTEgPD0gTWF0aC5tYXgob3RoZXJTZWdtZW50LnB5MSwgb3RoZXJTZWdtZW50LnB5MikpKSB7XG4gICAgICAgICAgdGhpcy54aSA9IHRoaXMucHgxO1xuICAgICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LklOVEVSU0VDVFM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0aGlzLnB5MiA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHkxLCBvdGhlclNlZ21lbnQucHkyKSkgJiYgKHRoaXMucHkyIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSkge1xuICAgICAgICAgIHRoaXMueGkgPSB0aGlzLnB4MjtcbiAgICAgICAgICB0aGlzLnlpID0gdGhpcy5weTI7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuU0VQQVJBVEU7XG4gICAgICB9XG4gICAgICB0aGlzLnhpID0gdGhpcy5weDE7XG4gICAgICB0aGlzLnlpID0gKGdyYWQyICogdGhpcy54aSArIGludDIpO1xuICAgICAgaWYgKCgodGhpcy5weTEgLSB0aGlzLnlpKSAqICh0aGlzLnlpIC0gdGhpcy5weTIpIDwgLTAuMDAwMDEpIHx8ICgob3RoZXJTZWdtZW50LnB5MSAtIHRoaXMueWkpICogKHRoaXMueWkgLSBvdGhlclNlZ21lbnQucHkyKSA8IC0wLjAwMDAxKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGguYWJzKG90aGVyU2VnbWVudC5hKSA8IDAuMDAwMDEpIHtcbiAgICAgICAgaWYgKChvdGhlclNlZ21lbnQucHgxIC0gdGhpcy54aSkgKiAodGhpcy54aSAtIG90aGVyU2VnbWVudC5weDIpIDwgLTAuMDAwMDEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuSU5URVJTRUNUUztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuSU5URVJTRUNUUztcbiAgICB9XG5cbiAgICBpZiAoZ3JhZDIgPT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgdGhpcy54aSA9IG90aGVyU2VnbWVudC5weDE7XG4gICAgICB0aGlzLnlpID0gZ3JhZDEgKiB0aGlzLnhpICsgaW50MTtcbiAgICAgIGlmICgoKG90aGVyU2VnbWVudC5weTEgLSB0aGlzLnlpKSAqICh0aGlzLnlpIC0gb3RoZXJTZWdtZW50LnB5MikgPCAtMC4wMDAwMSkgfHwgKCh0aGlzLnB5MSAtIHRoaXMueWkpICogKHRoaXMueWkgLSB0aGlzLnB5MikgPCAtMC4wMDAwMSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyhhKSA8IDAuMDAwMDEpIHtcbiAgICAgICAgaWYgKCh0aGlzLnB4MSAtIHRoaXMueGkpICogKHRoaXMueGkgLSB0aGlzLnB4MikgPCAtMC4wMDAwMSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuU0VQQVJBVEU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgIH1cblxuICAgIGlmIChncmFkMSA9PSBncmFkMikge1xuICAgICAgaWYgKGludDEgIT0gaW50Mikge1xuICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgfVxuICAgICAgaWYgKCh0aGlzLnB4MSA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHgxLCBvdGhlclNlZ21lbnQucHgyKSkgJiYgKHRoaXMucHgxIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSkge1xuICAgICAgICB0aGlzLnhpID0gdGhpcy5weDE7XG4gICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MTtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgaWYgKCh0aGlzLnB4MiA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHgxLCBvdGhlclNlZ21lbnQucHgyKSkgJiYgKHRoaXMucHgyIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weDEsIG90aGVyU2VnbWVudC5weDIpKSkge1xuICAgICAgICB0aGlzLnhpID0gdGhpcy5weDI7XG4gICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MjtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICB9XG5cbiAgICB0aGlzLnhpID0gKChpbnQyIC0gaW50MSkgLyAoZ3JhZDEgLSBncmFkMikpO1xuICAgIHRoaXMueWkgPSAoZ3JhZDEgKiB0aGlzLnhpICsgaW50MSk7XG5cbiAgICBpZiAoKCh0aGlzLnB4MSAtIHRoaXMueGkpICogKHRoaXMueGkgLSB0aGlzLnB4MikgPCAtMC4wMDAwMSkgfHwgKChvdGhlclNlZ21lbnQucHgxIC0gdGhpcy54aSkgKiAodGhpcy54aSAtIG90aGVyU2VnbWVudC5weDIpIDwgLTAuMDAwMDEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LklOVEVSU0VDVFM7XG4gIH1cblxuICBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldExlbmd0aCh0aGlzLnB4MSwgdGhpcy5weTEsIHRoaXMucHgyLCB0aGlzLnB5Mik7XG4gIH1cblxuICBfZ2V0TGVuZ3RoKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGR4ID0geDIgLSB4MTtcbiAgICB2YXIgZHkgPSB5MiAtIHkxO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hTZWdtZW50UmVsYXRpb24sIFJvdWdoU2VnbWVudCB9IGZyb20gXCIuL3NlZ21lbnRcIjtcblxuZXhwb3J0IGNsYXNzIFJvdWdoSGFjaHVyZUl0ZXJhdG9yIHtcbiAgY29uc3RydWN0b3IodG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0LCBnYXAsIHNpbkFuZ2xlLCBjb3NBbmdsZSwgdGFuQW5nbGUpIHtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmJvdHRvbSA9IGJvdHRvbTtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB0aGlzLmdhcCA9IGdhcDtcbiAgICB0aGlzLnNpbkFuZ2xlID0gc2luQW5nbGU7XG4gICAgdGhpcy50YW5BbmdsZSA9IHRhbkFuZ2xlO1xuXG4gICAgaWYgKE1hdGguYWJzKHNpbkFuZ2xlKSA8IDAuMDAwMSkge1xuICAgICAgdGhpcy5wb3MgPSBsZWZ0ICsgZ2FwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoc2luQW5nbGUpID4gMC45OTk5KSB7XG4gICAgICB0aGlzLnBvcyA9IHRvcCArIGdhcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWx0YVggPSAoYm90dG9tIC0gdG9wKSAqIE1hdGguYWJzKHRhbkFuZ2xlKTtcbiAgICAgIHRoaXMucG9zID0gbGVmdCAtIE1hdGguYWJzKHRoaXMuZGVsdGFYKTtcbiAgICAgIHRoaXMuaEdhcCA9IE1hdGguYWJzKGdhcCAvIGNvc0FuZ2xlKTtcbiAgICAgIHRoaXMuc0xlZnQgPSBuZXcgUm91Z2hTZWdtZW50KGxlZnQsIGJvdHRvbSwgbGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuc1JpZ2h0ID0gbmV3IFJvdWdoU2VnbWVudChyaWdodCwgYm90dG9tLCByaWdodCwgdG9wKTtcbiAgICB9XG4gIH1cblxuICBnZXROZXh0TGluZSgpIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5BbmdsZSkgPCAwLjAwMDEpIHtcbiAgICAgIGlmICh0aGlzLnBvcyA8IHRoaXMucmlnaHQpIHtcbiAgICAgICAgbGV0IGxpbmUgPSBbdGhpcy5wb3MsIHRoaXMudG9wLCB0aGlzLnBvcywgdGhpcy5ib3R0b21dO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmdhcDtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbkFuZ2xlKSA+IDAuOTk5OSkge1xuICAgICAgaWYgKHRoaXMucG9zIDwgdGhpcy5ib3R0b20pIHtcbiAgICAgICAgbGV0IGxpbmUgPSBbdGhpcy5sZWZ0LCB0aGlzLnBvcywgdGhpcy5yaWdodCwgdGhpcy5wb3NdO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmdhcDtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB4TG93ZXIgPSB0aGlzLnBvcyAtIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgIGxldCB4VXBwZXIgPSB0aGlzLnBvcyArIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgIGxldCB5TG93ZXIgPSB0aGlzLmJvdHRvbTtcbiAgICAgIGxldCB5VXBwZXIgPSB0aGlzLnRvcDtcbiAgICAgIGlmICh0aGlzLnBvcyA8ICh0aGlzLnJpZ2h0ICsgdGhpcy5kZWx0YVgpKSB7XG4gICAgICAgIHdoaWxlICgoKHhMb3dlciA8IHRoaXMubGVmdCkgJiYgKHhVcHBlciA8IHRoaXMubGVmdCkpIHx8ICgoeExvd2VyID4gdGhpcy5yaWdodCkgJiYgKHhVcHBlciA+IHRoaXMucmlnaHQpKSkge1xuICAgICAgICAgIHRoaXMucG9zICs9IHRoaXMuaEdhcDtcbiAgICAgICAgICB4TG93ZXIgPSB0aGlzLnBvcyAtIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgICAgICB4VXBwZXIgPSB0aGlzLnBvcyArIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgICAgICBpZiAodGhpcy5wb3MgPiAodGhpcy5yaWdodCArIHRoaXMuZGVsdGFYKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBzID0gbmV3IFJvdWdoU2VnbWVudCh4TG93ZXIsIHlMb3dlciwgeFVwcGVyLCB5VXBwZXIpO1xuICAgICAgICBpZiAocy5jb21wYXJlKHRoaXMuc0xlZnQpID09IFJvdWdoU2VnbWVudFJlbGF0aW9uKCkuSU5URVJTRUNUUykge1xuICAgICAgICAgIHhMb3dlciA9IHMueGk7XG4gICAgICAgICAgeUxvd2VyID0gcy55aTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5jb21wYXJlKHRoaXMuc1JpZ2h0KSA9PSBSb3VnaFNlZ21lbnRSZWxhdGlvbigpLklOVEVSU0VDVFMpIHtcbiAgICAgICAgICB4VXBwZXIgPSBzLnhpO1xuICAgICAgICAgIHlVcHBlciA9IHMueWk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGFuQW5nbGUgPiAwKSB7XG4gICAgICAgICAgeExvd2VyID0gdGhpcy5yaWdodCAtICh4TG93ZXIgLSB0aGlzLmxlZnQpO1xuICAgICAgICAgIHhVcHBlciA9IHRoaXMucmlnaHQgLSAoeFVwcGVyIC0gdGhpcy5sZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGluZSA9IFt4TG93ZXIsIHlMb3dlciwgeFVwcGVyLCB5VXBwZXJdO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmhHYXA7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSIsImNsYXNzIFBhdGhUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIHRleHQpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cbiAgaXNUeXBlKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSB0eXBlO1xuICB9XG59XG5cbmNsYXNzIFBhcnNlZFBhdGgge1xuICBjb25zdHJ1Y3RvcihkKSB7XG4gICAgdGhpcy5QQVJBTVMgPSB7XG4gICAgICBBOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBhOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBDOiBbXCJ4MVwiLCBcInkxXCIsIFwieDJcIiwgXCJ5MlwiLCBcInhcIiwgXCJ5XCJdLFxuICAgICAgYzogW1wieDFcIiwgXCJ5MVwiLCBcIngyXCIsIFwieTJcIiwgXCJ4XCIsIFwieVwiXSxcbiAgICAgIEg6IFtcInhcIl0sXG4gICAgICBoOiBbXCJ4XCJdLFxuICAgICAgTDogW1wieFwiLCBcInlcIl0sXG4gICAgICBsOiBbXCJ4XCIsIFwieVwiXSxcbiAgICAgIE06IFtcInhcIiwgXCJ5XCJdLFxuICAgICAgbTogW1wieFwiLCBcInlcIl0sXG4gICAgICBROiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBxOiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBTOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBzOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBUOiBbXCJ4XCIsIFwieVwiXSxcbiAgICAgIHQ6IFtcInhcIiwgXCJ5XCJdLFxuICAgICAgVjogW1wieVwiXSxcbiAgICAgIHY6IFtcInlcIl0sXG4gICAgICBaOiBbXSxcbiAgICAgIHo6IFtdXG4gICAgfTtcbiAgICB0aGlzLkNPTU1BTkQgPSAwO1xuICAgIHRoaXMuTlVNQkVSID0gMTtcbiAgICB0aGlzLkVPRCA9IDI7XG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICAgIHRoaXMuZCA9IGQgfHwgXCJcIjtcbiAgICB0aGlzLnBhcnNlRGF0YShkKTtcbiAgICB0aGlzLnByb2Nlc3NQb2ludHMoKTtcbiAgfVxuXG4gIGxvYWRGcm9tU2VnbWVudHMoc2VnbWVudHMpIHtcbiAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgdGhpcy5wcm9jZXNzUG9pbnRzKCk7XG4gIH1cblxuICBwcm9jZXNzUG9pbnRzKCkge1xuICAgIGxldCBmaXJzdCA9IG51bGwsIHByZXYgPSBudWxsLCBjdXJyZW50UG9pbnQgPSBbMCwgMF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcyA9IHRoaXMuc2VnbWVudHNbaV07XG4gICAgICBzd2l0Y2ggKHMua2V5KSB7XG4gICAgICAgIGNhc2UgJ00nOlxuICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMF0sIHMuZGF0YVsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICBjYXNlICdsJzpcbiAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMF0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVsxXSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzBdLCBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVswXSArIGN1cnJlbnRQb2ludFswXSwgY3VycmVudFBvaW50WzFdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVic6XG4gICAgICAgICAgcy5wb2ludCA9IFtjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVswXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgIHMucG9pbnQgPSBbY3VycmVudFBvaW50WzBdLCBzLmRhdGFbMF0gKyBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgY2FzZSAnWic6XG4gICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICBzLnBvaW50ID0gW2ZpcnN0WzBdLCBmaXJzdFsxXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVs0XSwgcy5kYXRhWzVdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbNF0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVs1XSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzJdLCBzLmRhdGFbM11dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVsyXSArIGN1cnJlbnRQb2ludFswXSwgcy5kYXRhWzNdICsgY3VycmVudFBvaW50WzFdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMl0sIHMuZGF0YVszXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3EnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzJdICsgY3VycmVudFBvaW50WzBdLCBzLmRhdGFbM10gKyBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVs1XSwgcy5kYXRhWzZdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbNV0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVs2XSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAocy5rZXkgPT09ICdtJyB8fCBzLmtleSA9PT0gJ00nKSB7XG4gICAgICAgIGZpcnN0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChzLnBvaW50KSB7XG4gICAgICAgIGN1cnJlbnRQb2ludCA9IHMucG9pbnQ7XG4gICAgICAgIGlmICghZmlyc3QpIHtcbiAgICAgICAgICBmaXJzdCA9IHMucG9pbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzLmtleSA9PT0gJ3onIHx8IHMua2V5ID09PSAnWicpIHtcbiAgICAgICAgZmlyc3QgPSBudWxsO1xuICAgICAgfVxuICAgICAgcHJldiA9IHM7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNsb3NlZCgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2Nsb3NlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuICAgICAgZm9yIChsZXQgcyBvZiB0aGlzLnNlZ21lbnRzKSB7XG4gICAgICAgIGlmIChzLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpIHtcbiAgICAgICAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jbG9zZWQ7XG4gIH1cblxuICBwYXJzZURhdGEoZCkge1xuICAgIHZhciB0b2tlbnMgPSB0aGlzLnRva2VuaXplKGQpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHRva2VuID0gdG9rZW5zW2luZGV4XTtcbiAgICB2YXIgbW9kZSA9IFwiQk9EXCI7XG4gICAgdGhpcy5zZWdtZW50cyA9IG5ldyBBcnJheSgpO1xuICAgIHdoaWxlICghdG9rZW4uaXNUeXBlKHRoaXMuRU9EKSkge1xuICAgICAgdmFyIHBhcmFtX2xlbmd0aDtcbiAgICAgIHZhciBwYXJhbXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgIGlmIChtb2RlID09IFwiQk9EXCIpIHtcbiAgICAgICAgaWYgKHRva2VuLnRleHQgPT0gXCJNXCIgfHwgdG9rZW4udGV4dCA9PSBcIm1cIikge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgcGFyYW1fbGVuZ3RoID0gdGhpcy5QQVJBTVNbdG9rZW4udGV4dF0ubGVuZ3RoO1xuICAgICAgICAgIG1vZGUgPSB0b2tlbi50ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGF0YSgnTTAsMCcgKyBkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRva2VuLmlzVHlwZSh0aGlzLk5VTUJFUikpIHtcbiAgICAgICAgICBwYXJhbV9sZW5ndGggPSB0aGlzLlBBUkFNU1ttb2RlXS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICBwYXJhbV9sZW5ndGggPSB0aGlzLlBBUkFNU1t0b2tlbi50ZXh0XS5sZW5ndGg7XG4gICAgICAgICAgbW9kZSA9IHRva2VuLnRleHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKChpbmRleCArIHBhcmFtX2xlbmd0aCkgPCB0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBpbmRleDsgaSA8IGluZGV4ICsgcGFyYW1fbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbnVtYmVyID0gdG9rZW5zW2ldO1xuICAgICAgICAgIGlmIChudW1iZXIuaXNUeXBlKHRoaXMuTlVNQkVSKSkge1xuICAgICAgICAgICAgcGFyYW1zW3BhcmFtcy5sZW5ndGhdID0gbnVtYmVyLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlciB0eXBlIGlzIG5vdCBhIG51bWJlcjogXCIgKyBtb2RlICsgXCIsXCIgKyBudW1iZXIudGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzZWdtZW50O1xuICAgICAgICBpZiAodGhpcy5QQVJBTVNbbW9kZV0pIHtcbiAgICAgICAgICBzZWdtZW50ID0geyBrZXk6IG1vZGUsIGRhdGE6IHBhcmFtcyB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnN1cHBvcnRlZCBzZWdtZW50IHR5cGU6IFwiICsgbW9kZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICAgICAgaW5kZXggKz0gcGFyYW1fbGVuZ3RoO1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpbmRleF07XG4gICAgICAgIGlmIChtb2RlID09IFwiTVwiKSBtb2RlID0gXCJMXCI7XG4gICAgICAgIGlmIChtb2RlID09IFwibVwiKSBtb2RlID0gXCJsXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiUGF0aCBkYXRhIGVuZGVkIGJlZm9yZSBhbGwgcGFyYW1ldGVycyB3ZXJlIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRva2VuaXplKGQpIHtcbiAgICB2YXIgdG9rZW5zID0gbmV3IEFycmF5KCk7XG4gICAgd2hpbGUgKGQgIT0gXCJcIikge1xuICAgICAgaWYgKGQubWF0Y2goL14oWyBcXHRcXHJcXG4sXSspLykpIHtcbiAgICAgICAgZCA9IGQuc3Vic3RyKFJlZ0V4cC4kMS5sZW5ndGgpO1xuICAgICAgfSBlbHNlIGlmIChkLm1hdGNoKC9eKFthQWNDaEhsTG1NcVFzU3RUdlZ6Wl0pLykpIHtcbiAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGhdID0gbmV3IFBhdGhUb2tlbih0aGlzLkNPTU1BTkQsIFJlZ0V4cC4kMSk7XG4gICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSBpZiAoZC5tYXRjaCgvXigoWy0rXT9bMC05XSsoXFwuWzAtOV0qKT98Wy0rXT9cXC5bMC05XSspKFtlRV1bLStdP1swLTldKyk/KS8pKSB7XG4gICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoXSA9IG5ldyBQYXRoVG9rZW4odGhpcy5OVU1CRVIsIHBhcnNlRmxvYXQoUmVnRXhwLiQxKSk7XG4gICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnJlY29nbml6ZWQgc2VnbWVudCBjb21tYW5kOiBcIiArIGQpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdG9rZW5zW3Rva2Vucy5sZW5ndGhdID0gbmV3IFBhdGhUb2tlbih0aGlzLkVPRCwgbnVsbCk7XG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm91Z2hQYXRoIHtcbiAgY29uc3RydWN0b3IoZCkge1xuICAgIHRoaXMuZCA9IGQ7XG4gICAgdGhpcy5wYXJzZWQgPSBuZXcgUGFyc2VkUGF0aChkKTtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IFswLCAwXTtcbiAgICB0aGlzLmJlemllclJlZmxlY3Rpb25Qb2ludCA9IG51bGw7XG4gICAgdGhpcy5xdWFkUmVmbGVjdGlvblBvaW50ID0gbnVsbDtcbiAgICB0aGlzLl9maXJzdCA9IG51bGw7XG4gIH1cblxuICBnZXQgc2VnbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VkLnNlZ21lbnRzO1xuICB9XG5cbiAgZ2V0IGNsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZWQuY2xvc2VkO1xuICB9XG5cbiAgZ2V0IGxpbmVhclBvaW50cygpIHtcbiAgICBpZiAoIXRoaXMuX2xpbmVhclBvaW50cykge1xuICAgICAgY29uc3QgbHAgPSBbXTtcbiAgICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICAgIGZvciAobGV0IHMgb2YgdGhpcy5wYXJzZWQuc2VnbWVudHMpIHtcbiAgICAgICAgbGV0IGtleSA9IHMua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChrZXkgPT09ICdtJyB8fCBrZXkgPT09ICd6Jykge1xuICAgICAgICAgIGlmIChwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBscC5wdXNoKHBvaW50cyk7XG4gICAgICAgICAgICBwb2ludHMgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3onKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMucG9pbnQpIHtcbiAgICAgICAgICBwb2ludHMucHVzaChzLnBvaW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgbHAucHVzaChwb2ludHMpO1xuICAgICAgICBwb2ludHMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2xpbmVhclBvaW50cyA9IGxwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbGluZWFyUG9pbnRzO1xuICB9XG5cbiAgZ2V0IGZpcnN0KCkge1xuICAgIHJldHVybiB0aGlzLl9maXJzdDtcbiAgfVxuXG4gIHNldCBmaXJzdCh2KSB7XG4gICAgdGhpcy5fZmlyc3QgPSB2O1xuICB9XG5cbiAgc2V0UG9zaXRpb24oeCwgeSkge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gW3gsIHldO1xuICAgIGlmICghdGhpcy5fZmlyc3QpIHtcbiAgICAgIHRoaXMuX2ZpcnN0ID0gW3gsIHldO1xuICAgIH1cbiAgfVxuXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cblxuICBnZXQgeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25bMF07XG4gIH1cblxuICBnZXQgeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25bMV07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoQXJjQ29udmVydGVyIHtcbiAgLy8gQWxnb3JpdGhtIGFzIGRlc2NyaWJlZCBpbiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL2ltcGxub3RlLmh0bWxcbiAgLy8gQ29kZSBhZGFwdGVkIGZyb20gbnNTVkdQYXRoRGF0YVBhcnNlci5jcHAgaW4gTW96aWxsYSBcbiAgLy8gaHR0cHM6Ly9oZy5tb3ppbGxhLm9yZy9tb3ppbGxhLWNlbnRyYWwvZmlsZS8xNzE1NmZiZWJiYzgvY29udGVudC9zdmcvY29udGVudC9zcmMvbnNTVkdQYXRoRGF0YVBhcnNlci5jcHAjbDg4N1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bywgcmFkaWksIGFuZ2xlLCBsYXJnZUFyY0ZsYWcsIHN3ZWVwRmxhZykge1xuICAgIGNvbnN0IHJhZFBlckRlZyA9IE1hdGguUEkgLyAxODA7XG4gICAgdGhpcy5fc2VnSW5kZXggPSAwO1xuICAgIHRoaXMuX251bVNlZ3MgPSAwO1xuICAgIGlmIChmcm9tWzBdID09IHRvWzBdICYmIGZyb21bMV0gPT0gdG9bMV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fcnggPSBNYXRoLmFicyhyYWRpaVswXSk7XG4gICAgdGhpcy5fcnkgPSBNYXRoLmFicyhyYWRpaVsxXSk7XG4gICAgdGhpcy5fc2luUGhpID0gTWF0aC5zaW4oYW5nbGUgKiByYWRQZXJEZWcpO1xuICAgIHRoaXMuX2Nvc1BoaSA9IE1hdGguY29zKGFuZ2xlICogcmFkUGVyRGVnKTtcbiAgICB2YXIgeDFkYXNoID0gdGhpcy5fY29zUGhpICogKGZyb21bMF0gLSB0b1swXSkgLyAyLjAgKyB0aGlzLl9zaW5QaGkgKiAoZnJvbVsxXSAtIHRvWzFdKSAvIDIuMDtcbiAgICB2YXIgeTFkYXNoID0gLXRoaXMuX3NpblBoaSAqIChmcm9tWzBdIC0gdG9bMF0pIC8gMi4wICsgdGhpcy5fY29zUGhpICogKGZyb21bMV0gLSB0b1sxXSkgLyAyLjA7XG4gICAgdmFyIHJvb3Q7XG4gICAgdmFyIG51bWVyYXRvciA9IHRoaXMuX3J4ICogdGhpcy5fcnggKiB0aGlzLl9yeSAqIHRoaXMuX3J5IC0gdGhpcy5fcnggKiB0aGlzLl9yeCAqIHkxZGFzaCAqIHkxZGFzaCAtIHRoaXMuX3J5ICogdGhpcy5fcnkgKiB4MWRhc2ggKiB4MWRhc2g7XG4gICAgaWYgKG51bWVyYXRvciA8IDApIHtcbiAgICAgIGxldCBzID0gTWF0aC5zcXJ0KDEgLSAobnVtZXJhdG9yIC8gKHRoaXMuX3J4ICogdGhpcy5fcnggKiB0aGlzLl9yeSAqIHRoaXMuX3J5KSkpO1xuICAgICAgdGhpcy5fcnggPSBzO1xuICAgICAgdGhpcy5fcnkgPSBzO1xuICAgICAgcm9vdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QgPSAobGFyZ2VBcmNGbGFnID09IHN3ZWVwRmxhZyA/IC0xLjAgOiAxLjApICpcbiAgICAgICAgTWF0aC5zcXJ0KG51bWVyYXRvciAvICh0aGlzLl9yeCAqIHRoaXMuX3J4ICogeTFkYXNoICogeTFkYXNoICsgdGhpcy5fcnkgKiB0aGlzLl9yeSAqIHgxZGFzaCAqIHgxZGFzaCkpO1xuICAgIH1cbiAgICBsZXQgY3hkYXNoID0gcm9vdCAqIHRoaXMuX3J4ICogeTFkYXNoIC8gdGhpcy5fcnk7XG4gICAgbGV0IGN5ZGFzaCA9IC1yb290ICogdGhpcy5fcnkgKiB4MWRhc2ggLyB0aGlzLl9yeDtcbiAgICB0aGlzLl9DID0gWzAsIDBdO1xuICAgIHRoaXMuX0NbMF0gPSB0aGlzLl9jb3NQaGkgKiBjeGRhc2ggLSB0aGlzLl9zaW5QaGkgKiBjeWRhc2ggKyAoZnJvbVswXSArIHRvWzBdKSAvIDIuMDtcbiAgICB0aGlzLl9DWzFdID0gdGhpcy5fc2luUGhpICogY3hkYXNoICsgdGhpcy5fY29zUGhpICogY3lkYXNoICsgKGZyb21bMV0gKyB0b1sxXSkgLyAyLjA7XG4gICAgdGhpcy5fdGhldGEgPSB0aGlzLmNhbGN1bGF0ZVZlY3RvckFuZ2xlKDEuMCwgMC4wLCAoeDFkYXNoIC0gY3hkYXNoKSAvIHRoaXMuX3J4LCAoeTFkYXNoIC0gY3lkYXNoKSAvIHRoaXMuX3J5KTtcbiAgICBsZXQgZHRoZXRhID0gdGhpcy5jYWxjdWxhdGVWZWN0b3JBbmdsZSgoeDFkYXNoIC0gY3hkYXNoKSAvIHRoaXMuX3J4LCAoeTFkYXNoIC0gY3lkYXNoKSAvIHRoaXMuX3J5LCAoLXgxZGFzaCAtIGN4ZGFzaCkgLyB0aGlzLl9yeCwgKC15MWRhc2ggLSBjeWRhc2gpIC8gdGhpcy5fcnkpO1xuICAgIGlmICgoIXN3ZWVwRmxhZykgJiYgKGR0aGV0YSA+IDApKSB7XG4gICAgICBkdGhldGEgLT0gMiAqIE1hdGguUEk7XG4gICAgfSBlbHNlIGlmIChzd2VlcEZsYWcgJiYgKGR0aGV0YSA8IDApKSB7XG4gICAgICBkdGhldGEgKz0gMiAqIE1hdGguUEk7XG4gICAgfVxuICAgIHRoaXMuX251bVNlZ3MgPSBNYXRoLmNlaWwoTWF0aC5hYnMoZHRoZXRhIC8gKE1hdGguUEkgLyAyKSkpO1xuICAgIHRoaXMuX2RlbHRhID0gZHRoZXRhIC8gdGhpcy5fbnVtU2VncztcbiAgICB0aGlzLl9UID0gKDggLyAzKSAqIE1hdGguc2luKHRoaXMuX2RlbHRhIC8gNCkgKiBNYXRoLnNpbih0aGlzLl9kZWx0YSAvIDQpIC8gTWF0aC5zaW4odGhpcy5fZGVsdGEgLyAyKTtcbiAgICB0aGlzLl9mcm9tID0gZnJvbTtcbiAgfVxuXG4gIGdldE5leHRTZWdtZW50KCkge1xuICAgIHZhciBjcDEsIGNwMiwgdG87XG4gICAgaWYgKHRoaXMuX3NlZ0luZGV4ID09IHRoaXMuX251bVNlZ3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgY29zVGhldGExID0gTWF0aC5jb3ModGhpcy5fdGhldGEpO1xuICAgIGxldCBzaW5UaGV0YTEgPSBNYXRoLnNpbih0aGlzLl90aGV0YSk7XG4gICAgbGV0IHRoZXRhMiA9IHRoaXMuX3RoZXRhICsgdGhpcy5fZGVsdGE7XG4gICAgbGV0IGNvc1RoZXRhMiA9IE1hdGguY29zKHRoZXRhMik7XG4gICAgbGV0IHNpblRoZXRhMiA9IE1hdGguc2luKHRoZXRhMik7XG5cbiAgICB0byA9IFtcbiAgICAgIHRoaXMuX2Nvc1BoaSAqIHRoaXMuX3J4ICogY29zVGhldGEyIC0gdGhpcy5fc2luUGhpICogdGhpcy5fcnkgKiBzaW5UaGV0YTIgKyB0aGlzLl9DWzBdLFxuICAgICAgdGhpcy5fc2luUGhpICogdGhpcy5fcnggKiBjb3NUaGV0YTIgKyB0aGlzLl9jb3NQaGkgKiB0aGlzLl9yeSAqIHNpblRoZXRhMiArIHRoaXMuX0NbMV1cbiAgICBdO1xuICAgIGNwMSA9IFtcbiAgICAgIHRoaXMuX2Zyb21bMF0gKyB0aGlzLl9UICogKC0gdGhpcy5fY29zUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTEgLSB0aGlzLl9zaW5QaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMSksXG4gICAgICB0aGlzLl9mcm9tWzFdICsgdGhpcy5fVCAqICgtIHRoaXMuX3NpblBoaSAqIHRoaXMuX3J4ICogc2luVGhldGExICsgdGhpcy5fY29zUGhpICogdGhpcy5fcnkgKiBjb3NUaGV0YTEpXG4gICAgXTtcbiAgICBjcDIgPSBbXG4gICAgICB0b1swXSArIHRoaXMuX1QgKiAodGhpcy5fY29zUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTIgKyB0aGlzLl9zaW5QaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMiksXG4gICAgICB0b1sxXSArIHRoaXMuX1QgKiAodGhpcy5fc2luUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTIgLSB0aGlzLl9jb3NQaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMilcbiAgICBdO1xuXG4gICAgdGhpcy5fdGhldGEgPSB0aGV0YTI7XG4gICAgdGhpcy5fZnJvbSA9IFt0b1swXSwgdG9bMV1dO1xuICAgIHRoaXMuX3NlZ0luZGV4Kys7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3AxOiBjcDEsXG4gICAgICBjcDI6IGNwMixcbiAgICAgIHRvOiB0b1xuICAgIH07XG4gIH1cblxuICBjYWxjdWxhdGVWZWN0b3JBbmdsZSh1eCwgdXksIHZ4LCB2eSkge1xuICAgIGxldCB0YSA9IE1hdGguYXRhbjIodXksIHV4KTtcbiAgICBsZXQgdGIgPSBNYXRoLmF0YW4yKHZ5LCB2eCk7XG4gICAgaWYgKHRiID49IHRhKVxuICAgICAgcmV0dXJuIHRiIC0gdGE7XG4gICAgcmV0dXJuIDIgKiBNYXRoLlBJIC0gKHRhIC0gdGIpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXRoRml0dGVyIHtcbiAgY29uc3RydWN0b3Ioc2V0cywgY2xvc2VkKSB7XG4gICAgdGhpcy5zZXRzID0gc2V0cztcbiAgICB0aGlzLmNsb3NlZCA9IGNsb3NlZDtcbiAgfVxuXG4gIGZpdChzaW1wbGlmaWNhdGlvbikge1xuICAgIGxldCBvdXRTZXRzID0gW107XG4gICAgZm9yIChjb25zdCBzZXQgb2YgdGhpcy5zZXRzKSB7XG4gICAgICBsZXQgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICAgIGxldCBlc3RMZW5ndGggPSBNYXRoLmZsb29yKHNpbXBsaWZpY2F0aW9uICogbGVuZ3RoKTtcbiAgICAgIGlmIChlc3RMZW5ndGggPCA1KSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gNSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVzdExlbmd0aCA9IDU7XG4gICAgICB9XG4gICAgICBvdXRTZXRzLnB1c2godGhpcy5yZWR1Y2Uoc2V0LCBlc3RMZW5ndGgpKTtcbiAgICB9XG5cbiAgICBsZXQgZCA9ICcnO1xuICAgIGZvciAoY29uc3Qgc2V0IG9mIG91dFNldHMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBwb2ludCA9IHNldFtpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBkICs9ICdNJyArIHBvaW50WzBdICsgXCIsXCIgKyBwb2ludFsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkICs9ICdMJyArIHBvaW50WzBdICsgXCIsXCIgKyBwb2ludFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgIGQgKz0gJ3ogJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBkaXN0YW5jZShwMSwgcDIpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHAxWzBdIC0gcDJbMF0sIDIpICsgTWF0aC5wb3cocDFbMV0gLSBwMlsxXSwgMikpO1xuICB9XG5cbiAgcmVkdWNlKHNldCwgY291bnQpIHtcbiAgICBpZiAoc2V0Lmxlbmd0aCA8PSBjb3VudCkge1xuICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG4gICAgbGV0IHBvaW50cyA9IHNldC5zbGljZSgwKTtcbiAgICB3aGlsZSAocG9pbnRzLmxlbmd0aCA+IGNvdW50KSB7XG4gICAgICBsZXQgYXJlYXMgPSBbXTtcbiAgICAgIGxldCBtaW5BcmVhID0gLTE7XG4gICAgICBsZXQgbWluSW5kZXggPSAtMTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgKHBvaW50cy5sZW5ndGggLSAxKTsgaSsrKSB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kaXN0YW5jZShwb2ludHNbaSAtIDFdLCBwb2ludHNbaV0pO1xuICAgICAgICBsZXQgYiA9IHRoaXMuZGlzdGFuY2UocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdKTtcbiAgICAgICAgbGV0IGMgPSB0aGlzLmRpc3RhbmNlKHBvaW50c1tpIC0gMV0sIHBvaW50c1tpICsgMV0pO1xuICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMi4wO1xuICAgICAgICBsZXQgYXJlYSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgICAgYXJlYXMucHVzaChhcmVhKTtcbiAgICAgICAgaWYgKChtaW5BcmVhIDwgMCkgfHwgKGFyZWEgPCBtaW5BcmVhKSkge1xuICAgICAgICAgIG1pbkFyZWEgPSBhcmVhO1xuICAgICAgICAgIG1pbkluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1pbkluZGV4ID4gMCkge1xuICAgICAgICBwb2ludHMuc3BsaWNlKG1pbkluZGV4LCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hIYWNodXJlSXRlcmF0b3IgfSBmcm9tIFwiLi9oYWNodXJlLmpzXCJcbmltcG9ydCB7IFJvdWdoU2VnbWVudFJlbGF0aW9uLCBSb3VnaFNlZ21lbnQgfSBmcm9tIFwiLi9zZWdtZW50LmpzXCJcbmltcG9ydCB7IFJvdWdoUGF0aCwgUm91Z2hBcmNDb252ZXJ0ZXIsIFBhdGhGaXR0ZXIgfSBmcm9tIFwiLi9wYXRoLmpzXCJcblxuZXhwb3J0IGNsYXNzIFJvdWdoUmVuZGVyZXIge1xuICBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvKSB7XG4gICAgbGV0IG9wcyA9IHRoaXMuX2RvdWJsZUxpbmUoeDEsIHkxLCB4MiwgeTIsIG8pXG4gICAgcmV0dXJuIHsgdHlwZTogXCJwYXRoXCIsIG9wcyB9XG4gIH1cblxuICBsaW5lYXJQYXRoKHBvaW50cywgY2xvc2UsIG8pIHtcbiAgICBjb25zdCBsZW4gPSAocG9pbnRzIHx8IFtdKS5sZW5ndGhcbiAgICBpZiAobGVuID4gMikge1xuICAgICAgbGV0IG9wcyA9IFtdXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KFxuICAgICAgICAgIHRoaXMuX2RvdWJsZUxpbmUoXG4gICAgICAgICAgICBwb2ludHNbaV1bMF0sXG4gICAgICAgICAgICBwb2ludHNbaV1bMV0sXG4gICAgICAgICAgICBwb2ludHNbaSArIDFdWzBdLFxuICAgICAgICAgICAgcG9pbnRzW2kgKyAxXVsxXSxcbiAgICAgICAgICAgIG9cbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGlmIChjbG9zZSkge1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KFxuICAgICAgICAgIHRoaXMuX2RvdWJsZUxpbmUoXG4gICAgICAgICAgICBwb2ludHNbbGVuIC0gMV1bMF0sXG4gICAgICAgICAgICBwb2ludHNbbGVuIC0gMV1bMV0sXG4gICAgICAgICAgICBwb2ludHNbMF1bMF0sXG4gICAgICAgICAgICBwb2ludHNbMF1bMV0sXG4gICAgICAgICAgICBvXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4geyB0eXBlOiBcInBhdGhcIiwgb3BzIH1cbiAgICB9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xuICAgICAgcmV0dXJuIHRoaXMubGluZShcbiAgICAgICAgcG9pbnRzWzBdWzBdLFxuICAgICAgICBwb2ludHNbMF1bMV0sXG4gICAgICAgIHBvaW50c1sxXVswXSxcbiAgICAgICAgcG9pbnRzWzFdWzFdLFxuICAgICAgICBvXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcG9seWdvbihwb2ludHMsIG8pIHtcbiAgICByZXR1cm4gdGhpcy5saW5lYXJQYXRoKHBvaW50cywgdHJ1ZSwgbylcbiAgfVxuXG4gIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKSB7XG4gICAgbGV0IHBvaW50cyA9IFtcbiAgICAgIFt4LCB5XSxcbiAgICAgIFt4ICsgd2lkdGgsIHldLFxuICAgICAgW3ggKyB3aWR0aCwgeSArIGhlaWdodF0sXG4gICAgICBbeCwgeSArIGhlaWdodF1cbiAgICBdXG4gICAgcmV0dXJuIHRoaXMucG9seWdvbihwb2ludHMsIG8pXG4gIH1cblxuICBjdXJ2ZShwb2ludHMsIG8pIHtcbiAgICBsZXQgbzEgPSB0aGlzLl9jdXJ2ZVdpdGhPZmZzZXQocG9pbnRzLCAxICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMiksIG8pXG4gICAgbGV0IG8yID0gdGhpcy5fY3VydmVXaXRoT2Zmc2V0KHBvaW50cywgMS41ICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMjIpLCBvKVxuICAgIHJldHVybiB7IHR5cGU6IFwicGF0aFwiLCBvcHM6IG8xLmNvbmNhdChvMikgfVxuICB9XG5cbiAgZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKSB7XG4gICAgY29uc3QgaW5jcmVtZW50ID0gTWF0aC5QSSAqIDIgLyBvLmN1cnZlU3RlcENvdW50XG4gICAgbGV0IHJ4ID0gTWF0aC5hYnMod2lkdGggLyAyKVxuICAgIGxldCByeSA9IE1hdGguYWJzKGhlaWdodCAvIDIpXG4gICAgcnggKz0gdGhpcy5fZ2V0T2Zmc2V0KC1yeCAqIDAuMDUsIHJ4ICogMC4wNSwgbylcbiAgICByeSArPSB0aGlzLl9nZXRPZmZzZXQoLXJ5ICogMC4wNSwgcnkgKiAwLjA1LCBvKVxuICAgIGxldCBvMSA9IHRoaXMuX2VsbGlwc2UoXG4gICAgICBpbmNyZW1lbnQsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHJ4LFxuICAgICAgcnksXG4gICAgICAxLFxuICAgICAgaW5jcmVtZW50ICogdGhpcy5fZ2V0T2Zmc2V0KDAuMSwgdGhpcy5fZ2V0T2Zmc2V0KDAuNCwgMSwgbyksIG8pLFxuICAgICAgb1xuICAgIClcbiAgICBsZXQgbzIgPSB0aGlzLl9lbGxpcHNlKGluY3JlbWVudCwgeCwgeSwgcngsIHJ5LCAxLjUsIDAsIG8pXG4gICAgcmV0dXJuIHsgdHlwZTogXCJwYXRoXCIsIG9wczogbzEuY29uY2F0KG8yKSB9XG4gIH1cblxuICBhcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgcm91Z2hDbG9zdXJlLCBvKSB7XG4gICAgbGV0IGN4ID0geFxuICAgIGxldCBjeSA9IHlcbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpXG4gICAgbGV0IHJ5ID0gTWF0aC5hYnMoaGVpZ2h0IC8gMilcbiAgICByeCArPSB0aGlzLl9nZXRPZmZzZXQoLXJ4ICogMC4wMSwgcnggKiAwLjAxLCBvKVxuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjAxLCByeSAqIDAuMDEsIG8pXG4gICAgbGV0IHN0cnQgPSBzdGFydFxuICAgIGxldCBzdHAgPSBzdG9wXG4gICAgd2hpbGUgKHN0cnQgPCAwKSB7XG4gICAgICBzdHJ0ICs9IE1hdGguUEkgKiAyXG4gICAgICBzdHAgKz0gTWF0aC5QSSAqIDJcbiAgICB9XG4gICAgaWYgKHN0cCAtIHN0cnQgPiBNYXRoLlBJICogMikge1xuICAgICAgc3RydCA9IDBcbiAgICAgIHN0cCA9IE1hdGguUEkgKiAyXG4gICAgfVxuICAgIGxldCBlbGxpcHNlSW5jID0gTWF0aC5QSSAqIDIgLyBvLmN1cnZlU3RlcENvdW50XG4gICAgbGV0IGFyY0luYyA9IE1hdGgubWluKGVsbGlwc2VJbmMgLyAyLCAoc3RwIC0gc3RydCkgLyAyKVxuICAgIGxldCBvMSA9IHRoaXMuX2FyYyhhcmNJbmMsIGN4LCBjeSwgcngsIHJ5LCBzdHJ0LCBzdHAsIDEsIG8pXG4gICAgbGV0IG8yID0gdGhpcy5fYXJjKGFyY0luYywgY3gsIGN5LCByeCwgcnksIHN0cnQsIHN0cCwgMS41LCBvKVxuICAgIGxldCBvcHMgPSBvMS5jb25jYXQobzIpXG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgaWYgKHJvdWdoQ2xvc3VyZSkge1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KFxuICAgICAgICAgIHRoaXMuX2RvdWJsZUxpbmUoXG4gICAgICAgICAgICBjeCxcbiAgICAgICAgICAgIGN5LFxuICAgICAgICAgICAgY3ggKyByeCAqIE1hdGguY29zKHN0cnQpLFxuICAgICAgICAgICAgY3kgKyByeSAqIE1hdGguc2luKHN0cnQpLFxuICAgICAgICAgICAgb1xuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KFxuICAgICAgICAgIHRoaXMuX2RvdWJsZUxpbmUoXG4gICAgICAgICAgICBjeCxcbiAgICAgICAgICAgIGN5LFxuICAgICAgICAgICAgY3ggKyByeCAqIE1hdGguY29zKHN0cCksXG4gICAgICAgICAgICBjeSArIHJ5ICogTWF0aC5zaW4oc3RwKSxcbiAgICAgICAgICAgIG9cbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKHsgb3A6IFwibGluZVRvXCIsIGRhdGE6IFtjeCwgY3ldIH0pXG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcDogXCJsaW5lVG9cIixcbiAgICAgICAgICBkYXRhOiBbY3ggKyByeCAqIE1hdGguY29zKHN0cnQpLCBjeSArIHJ5ICogTWF0aC5zaW4oc3RydCldXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHR5cGU6IFwicGF0aFwiLCBvcHMgfVxuICB9XG5cbiAgaGFjaHVyZUZpbGxBcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIG8pIHtcbiAgICBsZXQgY3ggPSB4XG4gICAgbGV0IGN5ID0geVxuICAgIGxldCByeCA9IE1hdGguYWJzKHdpZHRoIC8gMilcbiAgICBsZXQgcnkgPSBNYXRoLmFicyhoZWlnaHQgLyAyKVxuICAgIHJ4ICs9IHRoaXMuX2dldE9mZnNldCgtcnggKiAwLjAxLCByeCAqIDAuMDEsIG8pXG4gICAgcnkgKz0gdGhpcy5fZ2V0T2Zmc2V0KC1yeSAqIDAuMDEsIHJ5ICogMC4wMSwgbylcbiAgICBsZXQgc3RydCA9IHN0YXJ0XG4gICAgbGV0IHN0cCA9IHN0b3BcbiAgICB3aGlsZSAoc3RydCA8IDApIHtcbiAgICAgIHN0cnQgKz0gTWF0aC5QSSAqIDJcbiAgICAgIHN0cCArPSBNYXRoLlBJICogMlxuICAgIH1cbiAgICBpZiAoc3RwIC0gc3RydCA+IE1hdGguUEkgKiAyKSB7XG4gICAgICBzdHJ0ID0gMFxuICAgICAgc3RwID0gTWF0aC5QSSAqIDJcbiAgICB9XG4gICAgbGV0IGluY3JlbWVudCA9IChzdHAgLSBzdHJ0KSAvIG8uY3VydmVTdGVwQ291bnRcbiAgICBsZXQgb2Zmc2V0ID0gMVxuICAgIGxldCB4YyA9IFtdLFxuICAgICAgeWMgPSBbXVxuICAgIGZvciAobGV0IGFuZ2xlID0gc3RydDsgYW5nbGUgPD0gc3RwOyBhbmdsZSA9IGFuZ2xlICsgaW5jcmVtZW50KSB7XG4gICAgICB4Yy5wdXNoKGN4ICsgcnggKiBNYXRoLmNvcyhhbmdsZSkpXG4gICAgICB5Yy5wdXNoKGN5ICsgcnkgKiBNYXRoLnNpbihhbmdsZSkpXG4gICAgfVxuICAgIHhjLnB1c2goY3ggKyByeCAqIE1hdGguY29zKHN0cCkpXG4gICAgeWMucHVzaChjeSArIHJ5ICogTWF0aC5zaW4oc3RwKSlcbiAgICB4Yy5wdXNoKGN4KVxuICAgIHljLnB1c2goY3kpXG4gICAgcmV0dXJuIHRoaXMuaGFjaHVyZUZpbGxTaGFwZSh4YywgeWMsIG8pXG4gIH1cblxuICBzb2xpZEZpbGxTaGFwZSh4Q29vcmRzLCB5Q29vcmRzLCBvKSB7XG4gICAgbGV0IG9wcyA9IFtdXG4gICAgaWYgKFxuICAgICAgeENvb3JkcyAmJlxuICAgICAgeUNvb3JkcyAmJlxuICAgICAgeENvb3Jkcy5sZW5ndGggJiZcbiAgICAgIHlDb29yZHMubGVuZ3RoICYmXG4gICAgICB4Q29vcmRzLmxlbmd0aCA9PT0geUNvb3Jkcy5sZW5ndGhcbiAgICApIHtcbiAgICAgIGxldCBvZmZzZXQgPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMFxuICAgICAgY29uc3QgbGVuID0geENvb3Jkcy5sZW5ndGhcbiAgICAgIGlmIChsZW4gPiAyKSB7XG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcDogXCJtb3ZlXCIsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgeENvb3Jkc1swXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICAgICAgeUNvb3Jkc1swXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pXG4gICAgICAgICAgXVxuICAgICAgICB9KVxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6IFwibGluZVRvXCIsXG4gICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgIHhDb29yZHNbaV0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgICAgICAgeUNvb3Jkc1tpXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiBcImZpbGxQYXRoXCIsIG9wcyB9XG4gIH1cblxuICBoYWNodXJlRmlsbFNoYXBlKHhDb29yZHMsIHlDb29yZHMsIG8pIHtcbiAgICBsZXQgb3BzID0gW11cbiAgICBpZiAoeENvb3JkcyAmJiB5Q29vcmRzICYmIHhDb29yZHMubGVuZ3RoICYmIHlDb29yZHMubGVuZ3RoKSB7XG4gICAgICBsZXQgbGVmdCA9IHhDb29yZHNbMF1cbiAgICAgIGxldCByaWdodCA9IHhDb29yZHNbMF1cbiAgICAgIGxldCB0b3AgPSB5Q29vcmRzWzBdXG4gICAgICBsZXQgYm90dG9tID0geUNvb3Jkc1swXVxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB4Q29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLm1pbihsZWZ0LCB4Q29vcmRzW2ldKVxuICAgICAgICByaWdodCA9IE1hdGgubWF4KHJpZ2h0LCB4Q29vcmRzW2ldKVxuICAgICAgICB0b3AgPSBNYXRoLm1pbih0b3AsIHlDb29yZHNbaV0pXG4gICAgICAgIGJvdHRvbSA9IE1hdGgubWF4KGJvdHRvbSwgeUNvb3Jkc1tpXSlcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFuZ2xlID0gby5oYWNodXJlQW5nbGVcbiAgICAgIGxldCBnYXAgPSBvLmhhY2h1cmVHYXBcbiAgICAgIGlmIChnYXAgPCAwKSB7XG4gICAgICAgIGdhcCA9IG8uc3Ryb2tlV2lkdGggKiA0XG4gICAgICB9XG4gICAgICBnYXAgPSBNYXRoLm1heChnYXAsIDAuMSlcblxuICAgICAgY29uc3QgcmFkUGVyRGVnID0gTWF0aC5QSSAvIDE4MFxuICAgICAgY29uc3QgaGFjaHVyZUFuZ2xlID0gKGFuZ2xlICUgMTgwKSAqIHJhZFBlckRlZ1xuICAgICAgY29uc3QgY29zQW5nbGUgPSBNYXRoLmNvcyhoYWNodXJlQW5nbGUpXG4gICAgICBjb25zdCBzaW5BbmdsZSA9IE1hdGguc2luKGhhY2h1cmVBbmdsZSlcbiAgICAgIGNvbnN0IHRhbkFuZ2xlID0gTWF0aC50YW4oaGFjaHVyZUFuZ2xlKVxuXG4gICAgICBjb25zdCBpdCA9IG5ldyBSb3VnaEhhY2h1cmVJdGVyYXRvcihcbiAgICAgICAgdG9wIC0gMSxcbiAgICAgICAgYm90dG9tICsgMSxcbiAgICAgICAgbGVmdCAtIDEsXG4gICAgICAgIHJpZ2h0ICsgMSxcbiAgICAgICAgZ2FwLFxuICAgICAgICBzaW5BbmdsZSxcbiAgICAgICAgY29zQW5nbGUsXG4gICAgICAgIHRhbkFuZ2xlXG4gICAgICApXG4gICAgICBsZXQgcmVjdENvb3Jkc1xuICAgICAgd2hpbGUgKChyZWN0Q29vcmRzID0gaXQuZ2V0TmV4dExpbmUoKSkgIT0gbnVsbCkge1xuICAgICAgICBsZXQgbGluZXMgPSB0aGlzLl9nZXRJbnRlcnNlY3RpbmdMaW5lcyhyZWN0Q29vcmRzLCB4Q29vcmRzLCB5Q29vcmRzKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCBsaW5lcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBsZXQgcDEgPSBsaW5lc1tpXVxuICAgICAgICAgICAgbGV0IHAyID0gbGluZXNbaSArIDFdXG4gICAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocDFbMF0sIHAxWzFdLCBwMlswXSwgcDJbMV0sIG8pKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiBcImZpbGxTa2V0Y2hcIiwgb3BzIH1cbiAgfVxuXG4gIGhhY2h1cmVGaWxsRWxsaXBzZShjeCwgY3ksIHdpZHRoLCBoZWlnaHQsIG8pIHtcbiAgICBsZXQgb3BzID0gW11cbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpXG4gICAgbGV0IHJ5ID0gTWF0aC5hYnMoaGVpZ2h0IC8gMilcbiAgICByeCArPSB0aGlzLl9nZXRPZmZzZXQoLXJ4ICogMC4wNSwgcnggKiAwLjA1LCBvKVxuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjA1LCByeSAqIDAuMDUsIG8pXG4gICAgbGV0IGFuZ2xlID0gby5oYWNodXJlQW5nbGVcbiAgICBsZXQgZ2FwID0gby5oYWNodXJlR2FwXG4gICAgaWYgKGdhcCA8PSAwKSB7XG4gICAgICBnYXAgPSBvLnN0cm9rZVdpZHRoICogNFxuICAgIH1cbiAgICBsZXQgZndlaWdodCA9IG8uZmlsbFdlaWdodFxuICAgIGlmIChmd2VpZ2h0IDwgMCkge1xuICAgICAgZndlaWdodCA9IG8uc3Ryb2tlV2lkdGggLyAyXG4gICAgfVxuICAgIGNvbnN0IHJhZFBlckRlZyA9IE1hdGguUEkgLyAxODBcbiAgICBsZXQgaGFjaHVyZUFuZ2xlID0gKGFuZ2xlICUgMTgwKSAqIHJhZFBlckRlZ1xuICAgIGxldCB0YW5BbmdsZSA9IE1hdGgudGFuKGhhY2h1cmVBbmdsZSlcbiAgICBsZXQgYXNwZWN0UmF0aW8gPSByeSAvIHJ4XG4gICAgbGV0IGh5cCA9IE1hdGguc3FydChhc3BlY3RSYXRpbyAqIHRhbkFuZ2xlICogYXNwZWN0UmF0aW8gKiB0YW5BbmdsZSArIDEpXG4gICAgbGV0IHNpbkFuZ2xlUHJpbWUgPSBhc3BlY3RSYXRpbyAqIHRhbkFuZ2xlIC8gaHlwXG4gICAgbGV0IGNvc0FuZ2xlUHJpbWUgPSAxIC8gaHlwXG4gICAgbGV0IGdhcFByaW1lID1cbiAgICAgIGdhcCAvXG4gICAgICAocnggKlxuICAgICAgICByeSAvXG4gICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICByeSAqIGNvc0FuZ2xlUHJpbWUgKiAocnkgKiBjb3NBbmdsZVByaW1lKSArXG4gICAgICAgICAgICByeCAqIHNpbkFuZ2xlUHJpbWUgKiAocnggKiBzaW5BbmdsZVByaW1lKVxuICAgICAgICApIC9cbiAgICAgICAgcngpXG4gICAgbGV0IGhhbGZMZW4gPSBNYXRoLnNxcnQoXG4gICAgICByeCAqIHJ4IC0gKGN4IC0gcnggKyBnYXBQcmltZSkgKiAoY3ggLSByeCArIGdhcFByaW1lKVxuICAgIClcbiAgICBmb3IgKHZhciB4UG9zID0gY3ggLSByeCArIGdhcFByaW1lOyB4UG9zIDwgY3ggKyByeDsgeFBvcyArPSBnYXBQcmltZSkge1xuICAgICAgaGFsZkxlbiA9IE1hdGguc3FydChyeCAqIHJ4IC0gKGN4IC0geFBvcykgKiAoY3ggLSB4UG9zKSlcbiAgICAgIGxldCBwMSA9IHRoaXMuX2FmZmluZShcbiAgICAgICAgeFBvcyxcbiAgICAgICAgY3kgLSBoYWxmTGVuLFxuICAgICAgICBjeCxcbiAgICAgICAgY3ksXG4gICAgICAgIHNpbkFuZ2xlUHJpbWUsXG4gICAgICAgIGNvc0FuZ2xlUHJpbWUsXG4gICAgICAgIGFzcGVjdFJhdGlvXG4gICAgICApXG4gICAgICBsZXQgcDIgPSB0aGlzLl9hZmZpbmUoXG4gICAgICAgIHhQb3MsXG4gICAgICAgIGN5ICsgaGFsZkxlbixcbiAgICAgICAgY3gsXG4gICAgICAgIGN5LFxuICAgICAgICBzaW5BbmdsZVByaW1lLFxuICAgICAgICBjb3NBbmdsZVByaW1lLFxuICAgICAgICBhc3BlY3RSYXRpb1xuICAgICAgKVxuICAgICAgb3BzID0gb3BzLmNvbmNhdCh0aGlzLl9kb3VibGVMaW5lKHAxWzBdLCBwMVsxXSwgcDJbMF0sIHAyWzFdLCBvKSlcbiAgICB9XG4gICAgcmV0dXJuIHsgdHlwZTogXCJmaWxsU2tldGNoXCIsIG9wcyB9XG4gIH1cblxuICBzdmdQYXRoKHBhdGgsIG8pIHtcbiAgICBwYXRoID0gKHBhdGggfHwgXCJcIilcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgXCIgXCIpXG4gICAgICAucmVwbGFjZSgvKC1cXHMpL2csIFwiLVwiKVxuICAgICAgLnJlcGxhY2UoXCIvKHNzKS9nXCIsIFwiIFwiKVxuICAgIGxldCBwID0gbmV3IFJvdWdoUGF0aChwYXRoKVxuICAgIGlmIChvLnNpbXBsaWZpY2F0aW9uKSB7XG4gICAgICBsZXQgZml0dGVyID0gbmV3IFBhdGhGaXR0ZXIocC5saW5lYXJQb2ludHMsIHAuY2xvc2VkKVxuICAgICAgbGV0IGQgPSBmaXR0ZXIuZml0KG8uc2ltcGxpZmljYXRpb24pXG4gICAgICBwID0gbmV3IFJvdWdoUGF0aChkKVxuICAgIH1cbiAgICBsZXQgb3BzID0gW11cbiAgICBsZXQgc2VnbWVudHMgPSBwLnNlZ21lbnRzIHx8IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHMgPSBzZWdtZW50c1tpXVxuICAgICAgbGV0IHByZXYgPSBpID4gMCA/IHNlZ21lbnRzW2kgLSAxXSA6IG51bGxcbiAgICAgIGxldCBvcExpc3QgPSB0aGlzLl9wcm9jZXNzU2VnbWVudChwLCBzLCBwcmV2LCBvKVxuICAgICAgaWYgKG9wTGlzdCAmJiBvcExpc3QubGVuZ3RoKSB7XG4gICAgICAgIG9wcyA9IG9wcy5jb25jYXQob3BMaXN0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiBcInBhdGhcIiwgb3BzIH1cbiAgfVxuXG4gIC8vIHByaXZhdGVzXG5cbiAgX2JlemllclRvKHgxLCB5MSwgeDIsIHkyLCB4LCB5LCBwYXRoLCBvKSB7XG4gICAgbGV0IG9wcyA9IFtdXG4gICAgbGV0IHJvcyA9IFtvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMSwgKG8ubWF4UmFuZG9tbmVzc09mZnNldCB8fCAxKSArIDAuNV1cbiAgICBsZXQgZiA9IG51bGxcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgb3BzLnB1c2goeyBvcDogXCJtb3ZlXCIsIGRhdGE6IFtwYXRoLngsIHBhdGgueV0gfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcDogXCJtb3ZlXCIsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgcGF0aC54ICsgdGhpcy5fZ2V0T2Zmc2V0KC1yb3NbMF0sIHJvc1swXSwgbyksXG4gICAgICAgICAgICBwYXRoLnkgKyB0aGlzLl9nZXRPZmZzZXQoLXJvc1swXSwgcm9zWzBdLCBvKVxuICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGYgPSBbXG4gICAgICAgIHggKyB0aGlzLl9nZXRPZmZzZXQoLXJvc1tpXSwgcm9zW2ldLCBvKSxcbiAgICAgICAgeSArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pXG4gICAgICBdXG4gICAgICBvcHMucHVzaCh7XG4gICAgICAgIG9wOiBcImJjdXJ2ZVRvXCIsXG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICB4MSArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pLFxuICAgICAgICAgIHkxICsgdGhpcy5fZ2V0T2Zmc2V0KC1yb3NbaV0sIHJvc1tpXSwgbyksXG4gICAgICAgICAgeDIgKyB0aGlzLl9nZXRPZmZzZXQoLXJvc1tpXSwgcm9zW2ldLCBvKSxcbiAgICAgICAgICB5MiArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pLFxuICAgICAgICAgIGZbMF0sXG4gICAgICAgICAgZlsxXVxuICAgICAgICBdXG4gICAgICB9KVxuICAgIH1cbiAgICBwYXRoLnNldFBvc2l0aW9uKGZbMF0sIGZbMV0pXG4gICAgcmV0dXJuIG9wc1xuICB9XG5cbiAgX3Byb2Nlc3NTZWdtZW50KHBhdGgsIHNlZywgcHJldlNlZywgbykge1xuICAgIGxldCBvcHMgPSBbXVxuICAgIHN3aXRjaCAoc2VnLmtleSkge1xuICAgICAgY2FzZSBcIk1cIjpcbiAgICAgIGNhc2UgXCJtXCI6IHtcbiAgICAgICAgbGV0IGRlbHRhID0gc2VnLmtleSA9PT0gXCJtXCJcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbMF1cbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVsxXVxuICAgICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgeCArPSBwYXRoLnhcbiAgICAgICAgICAgIHkgKz0gcGF0aC55XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBybyA9IDEgKiAoby5tYXhSYW5kb21uZXNzT2Zmc2V0IHx8IDApXG4gICAgICAgICAgeCA9IHggKyB0aGlzLl9nZXRPZmZzZXQoLXJvLCBybywgbylcbiAgICAgICAgICB5ID0geSArIHRoaXMuX2dldE9mZnNldCgtcm8sIHJvLCBvKVxuICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24oeCwgeSlcbiAgICAgICAgICBvcHMucHVzaCh7IG9wOiBcIm1vdmVcIiwgZGF0YTogW3gsIHldIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJMXCI6XG4gICAgICBjYXNlIFwibFwiOiB7XG4gICAgICAgIGxldCBkZWx0YSA9IHNlZy5rZXkgPT09IFwibFwiXG4gICAgICAgIGlmIChzZWcuZGF0YS5sZW5ndGggPj0gMikge1xuICAgICAgICAgIGxldCB4ID0gK3NlZy5kYXRhWzBdXG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbMV1cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHggKz0gcGF0aC54XG4gICAgICAgICAgICB5ICs9IHBhdGgueVxuICAgICAgICAgIH1cbiAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocGF0aC54LCBwYXRoLnksIHgsIHksIG8pKVxuICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24oeCwgeSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBcIkhcIjpcbiAgICAgIGNhc2UgXCJoXCI6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBzZWcua2V5ID09PSBcImhcIlxuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbMF1cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHggKz0gcGF0aC54XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgeCwgcGF0aC55LCBvKSlcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKHgsIHBhdGgueSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBcIlZcIjpcbiAgICAgIGNhc2UgXCJ2XCI6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBzZWcua2V5ID09PSBcInZcIlxuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbMF1cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHkgKz0gcGF0aC55XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgcGF0aC54LCB5LCBvKSlcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKHBhdGgueCwgeSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBcIlpcIjpcbiAgICAgIGNhc2UgXCJ6XCI6IHtcbiAgICAgICAgaWYgKHBhdGguZmlyc3QpIHtcbiAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KFxuICAgICAgICAgICAgdGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgcGF0aC5maXJzdFswXSwgcGF0aC5maXJzdFsxXSwgbylcbiAgICAgICAgICApXG4gICAgICAgICAgcGF0aC5zZXRQb3NpdGlvbihwYXRoLmZpcnN0WzBdLCBwYXRoLmZpcnN0WzFdKVxuICAgICAgICAgIHBhdGguZmlyc3QgPSBudWxsXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJDXCI6XG4gICAgICBjYXNlIFwiY1wiOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc2VnLmtleSA9PT0gXCJjXCJcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgbGV0IHgxID0gK3NlZy5kYXRhWzBdXG4gICAgICAgICAgbGV0IHkxID0gK3NlZy5kYXRhWzFdXG4gICAgICAgICAgbGV0IHgyID0gK3NlZy5kYXRhWzJdXG4gICAgICAgICAgbGV0IHkyID0gK3NlZy5kYXRhWzNdXG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbNF1cbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVs1XVxuICAgICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgeDEgKz0gcGF0aC54XG4gICAgICAgICAgICB4MiArPSBwYXRoLnhcbiAgICAgICAgICAgIHggKz0gcGF0aC54XG4gICAgICAgICAgICB5MSArPSBwYXRoLnlcbiAgICAgICAgICAgIHkyICs9IHBhdGgueVxuICAgICAgICAgICAgeSArPSBwYXRoLnlcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IG9iID0gdGhpcy5fYmV6aWVyVG8oeDEsIHkxLCB4MiwgeTIsIHgsIHksIHBhdGgsIG8pXG4gICAgICAgICAgb3BzID0gb3BzLmNvbmNhdChvYilcbiAgICAgICAgICBwYXRoLmJlemllclJlZmxlY3Rpb25Qb2ludCA9IFt4ICsgKHggLSB4MiksIHkgKyAoeSAtIHkyKV1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSBcIlNcIjpcbiAgICAgIGNhc2UgXCJzXCI6IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBzZWcua2V5ID09PSBcInNcIlxuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoID49IDQpIHtcbiAgICAgICAgICBsZXQgeDIgPSArc2VnLmRhdGFbMF1cbiAgICAgICAgICBsZXQgeTIgPSArc2VnLmRhdGFbMV1cbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVsyXVxuICAgICAgICAgIGxldCB5ID0gK3NlZy5kYXRhWzNdXG4gICAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICB4MiArPSBwYXRoLnhcbiAgICAgICAgICAgIHggKz0gcGF0aC54XG4gICAgICAgICAgICB5MiArPSBwYXRoLnlcbiAgICAgICAgICAgIHkgKz0gcGF0aC55XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB4MSA9IHgyXG4gICAgICAgICAgbGV0IHkxID0geTJcbiAgICAgICAgICBsZXQgcHJldktleSA9IHByZXZTZWcgPyBwcmV2U2VnLmtleSA6IFwiXCJcbiAgICAgICAgICB2YXIgcmVmID0gbnVsbFxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHByZXZLZXkgPT0gXCJjXCIgfHxcbiAgICAgICAgICAgIHByZXZLZXkgPT0gXCJDXCIgfHxcbiAgICAgICAgICAgIHByZXZLZXkgPT0gXCJzXCIgfHxcbiAgICAgICAgICAgIHByZXZLZXkgPT0gXCJTXCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJlZiA9IHBhdGguYmV6aWVyUmVmbGVjdGlvblBvaW50XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIHgxID0gcmVmWzBdXG4gICAgICAgICAgICB5MSA9IHJlZlsxXVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgb2IgPSB0aGlzLl9iZXppZXJUbyh4MSwgeTEsIHgyLCB5MiwgeCwgeSwgcGF0aCwgbylcbiAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KG9iKVxuICAgICAgICAgIHBhdGguYmV6aWVyUmVmbGVjdGlvblBvaW50ID0gW3ggKyAoeCAtIHgyKSwgeSArICh5IC0geTIpXVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIFwiUVwiOlxuICAgICAgY2FzZSBcInFcIjoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09IFwicVwiXG4gICAgICAgIGlmIChzZWcuZGF0YS5sZW5ndGggPj0gNCkge1xuICAgICAgICAgIGxldCB4MSA9ICtzZWcuZGF0YVswXVxuICAgICAgICAgIGxldCB5MSA9ICtzZWcuZGF0YVsxXVxuICAgICAgICAgIGxldCB4ID0gK3NlZy5kYXRhWzJdXG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbM11cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHgxICs9IHBhdGgueFxuICAgICAgICAgICAgeCArPSBwYXRoLnhcbiAgICAgICAgICAgIHkxICs9IHBhdGgueVxuICAgICAgICAgICAgeSArPSBwYXRoLnlcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IG9mZnNldDEgPSAxICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMilcbiAgICAgICAgICBsZXQgb2Zmc2V0MiA9IDEuNSAqICgxICsgby5yb3VnaG5lc3MgKiAwLjIyKVxuICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgIG9wOiBcIm1vdmVcIixcbiAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgcGF0aC54ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKSxcbiAgICAgICAgICAgICAgcGF0aC55ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbGV0IGYgPSBbXG4gICAgICAgICAgICB4ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKSxcbiAgICAgICAgICAgIHkgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pXG4gICAgICAgICAgXVxuICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgIG9wOiBcInFjdXJ2ZVRvXCIsXG4gICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgIHgxICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKSxcbiAgICAgICAgICAgICAgeTEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLFxuICAgICAgICAgICAgICBmWzBdLFxuICAgICAgICAgICAgICBmWzFdXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSlcbiAgICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgICBvcDogXCJtb3ZlXCIsXG4gICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgIHBhdGgueCArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbyksXG4gICAgICAgICAgICAgIHBhdGgueSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbylcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGYgPSBbXG4gICAgICAgICAgICB4ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKSxcbiAgICAgICAgICAgIHkgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pXG4gICAgICAgICAgXVxuICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgIG9wOiBcInFjdXJ2ZVRvXCIsXG4gICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgIHgxICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKSxcbiAgICAgICAgICAgICAgeTEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLFxuICAgICAgICAgICAgICBmWzBdLFxuICAgICAgICAgICAgICBmWzFdXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSlcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKGZbMF0sIGZbMV0pXG4gICAgICAgICAgcGF0aC5xdWFkUmVmbGVjdGlvblBvaW50ID0gW3ggKyAoeCAtIHgxKSwgeSArICh5IC0geTEpXVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlIFwiVFwiOlxuICAgICAgY2FzZSBcInRcIjoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09IFwidFwiXG4gICAgICAgIGlmIChzZWcuZGF0YS5sZW5ndGggPj0gMikge1xuICAgICAgICAgIGxldCB4ID0gK3NlZy5kYXRhWzBdXG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbMV1cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHggKz0gcGF0aC54XG4gICAgICAgICAgICB5ICs9IHBhdGgueVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgeDEgPSB4XG4gICAgICAgICAgbGV0IHkxID0geVxuICAgICAgICAgIGxldCBwcmV2S2V5ID0gcHJldlNlZyA/IHByZXZTZWcua2V5IDogXCJcIlxuICAgICAgICAgIHZhciByZWYgPSBudWxsXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcHJldktleSA9PSBcInFcIiB8fFxuICAgICAgICAgICAgcHJldktleSA9PSBcIlFcIiB8fFxuICAgICAgICAgICAgcHJldktleSA9PSBcInRcIiB8fFxuICAgICAgICAgICAgcHJldktleSA9PSBcIlRcIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmVmID0gcGF0aC5xdWFkUmVmbGVjdGlvblBvaW50XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIHgxID0gcmVmWzBdXG4gICAgICAgICAgICB5MSA9IHJlZlsxXVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgb2Zmc2V0MSA9IDEgKiAoMSArIG8ucm91Z2huZXNzICogMC4yKVxuICAgICAgICAgIGxldCBvZmZzZXQyID0gMS41ICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMjIpXG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6IFwibW92ZVwiLFxuICAgICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgICBwYXRoLnggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLFxuICAgICAgICAgICAgICBwYXRoLnkgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSlcbiAgICAgICAgICBsZXQgZiA9IFtcbiAgICAgICAgICAgIHggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLFxuICAgICAgICAgICAgeSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbylcbiAgICAgICAgICBdXG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6IFwicWN1cnZlVG9cIixcbiAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLFxuICAgICAgICAgICAgICB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyksXG4gICAgICAgICAgICAgIGZbMF0sXG4gICAgICAgICAgICAgIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICAgIG9wOiBcIm1vdmVcIixcbiAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgcGF0aC54ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKSxcbiAgICAgICAgICAgICAgcGF0aC55ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pXG4gICAgICAgICAgZiA9IFtcbiAgICAgICAgICAgIHggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLFxuICAgICAgICAgICAgeSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbylcbiAgICAgICAgICBdXG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6IFwicWN1cnZlVG9cIixcbiAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLFxuICAgICAgICAgICAgICB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbyksXG4gICAgICAgICAgICAgIGZbMF0sXG4gICAgICAgICAgICAgIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24oZlswXSwgZlsxXSlcbiAgICAgICAgICBwYXRoLnF1YWRSZWZsZWN0aW9uUG9pbnQgPSBbeCArICh4IC0geDEpLCB5ICsgKHkgLSB5MSldXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgXCJBXCI6XG4gICAgICBjYXNlIFwiYVwiOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc2VnLmtleSA9PT0gXCJhXCJcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSA3KSB7XG4gICAgICAgICAgbGV0IHJ4ID0gK3NlZy5kYXRhWzBdXG4gICAgICAgICAgbGV0IHJ5ID0gK3NlZy5kYXRhWzFdXG4gICAgICAgICAgbGV0IGFuZ2xlID0gK3NlZy5kYXRhWzJdXG4gICAgICAgICAgbGV0IGxhcmdlQXJjRmxhZyA9ICtzZWcuZGF0YVszXVxuICAgICAgICAgIGxldCBzd2VlcEZsYWcgPSArc2VnLmRhdGFbNF1cbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVs1XVxuICAgICAgICAgIGxldCB5ID0gK3NlZy5kYXRhWzZdXG4gICAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICB4ICs9IHBhdGgueFxuICAgICAgICAgICAgeSArPSBwYXRoLnlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHggPT0gcGF0aC54ICYmIHkgPT0gcGF0aC55KSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocnggPT0gMCB8fCByeSA9PSAwKSB7XG4gICAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocGF0aC54LCBwYXRoLnksIHgsIHksIG8pKVxuICAgICAgICAgICAgcGF0aC5zZXRQb3NpdGlvbih4LCB5KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmluYWwgPSBudWxsXG4gICAgICAgICAgICBsZXQgcm8gPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcbiAgICAgICAgICAgICAgbGV0IGFyY0NvbnZlcnRlciA9IG5ldyBSb3VnaEFyY0NvbnZlcnRlcihcbiAgICAgICAgICAgICAgICBbcGF0aC54LCBwYXRoLnldLFxuICAgICAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgICAgICBbcngsIHJ5XSxcbiAgICAgICAgICAgICAgICBhbmdsZSxcbiAgICAgICAgICAgICAgICBsYXJnZUFyY0ZsYWcgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3dlZXBGbGFnID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgbGV0IHNlZ21lbnQgPSBhcmNDb252ZXJ0ZXIuZ2V0TmV4dFNlZ21lbnQoKVxuICAgICAgICAgICAgICB3aGlsZSAoc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBvYiA9IHRoaXMuX2JlemllclRvKFxuICAgICAgICAgICAgICAgICAgc2VnbWVudC5jcDFbMF0sXG4gICAgICAgICAgICAgICAgICBzZWdtZW50LmNwMVsxXSxcbiAgICAgICAgICAgICAgICAgIHNlZ21lbnQuY3AyWzBdLFxuICAgICAgICAgICAgICAgICAgc2VnbWVudC5jcDJbMV0sXG4gICAgICAgICAgICAgICAgICBzZWdtZW50LnRvWzBdLFxuICAgICAgICAgICAgICAgICAgc2VnbWVudC50b1sxXSxcbiAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICBvXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQob2IpXG4gICAgICAgICAgICAgICAgc2VnbWVudCA9IGFyY0NvbnZlcnRlci5nZXROZXh0U2VnbWVudCgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiBvcHNcbiAgfVxuXG4gIF9nZXRPZmZzZXQobWluLCBtYXgsIG9wcykge1xuICAgIHJldHVybiBvcHMucm91Z2huZXNzICogKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcbiAgfVxuXG4gIF9hZmZpbmUoeCwgeSwgY3gsIGN5LCBzaW5BbmdsZVByaW1lLCBjb3NBbmdsZVByaW1lLCBSKSB7XG4gICAgdmFyIEEgPSAtY3ggKiBjb3NBbmdsZVByaW1lIC0gY3kgKiBzaW5BbmdsZVByaW1lICsgY3hcbiAgICB2YXIgQiA9IFIgKiAoY3ggKiBzaW5BbmdsZVByaW1lIC0gY3kgKiBjb3NBbmdsZVByaW1lKSArIGN5XG4gICAgdmFyIEMgPSBjb3NBbmdsZVByaW1lXG4gICAgdmFyIEQgPSBzaW5BbmdsZVByaW1lXG4gICAgdmFyIEUgPSAtUiAqIHNpbkFuZ2xlUHJpbWVcbiAgICB2YXIgRiA9IFIgKiBjb3NBbmdsZVByaW1lXG4gICAgcmV0dXJuIFtBICsgQyAqIHggKyBEICogeSwgQiArIEUgKiB4ICsgRiAqIHldXG4gIH1cblxuICBfZG91YmxlTGluZSh4MSwgeTEsIHgyLCB5Miwgbykge1xuICAgIGNvbnN0IG8xID0gdGhpcy5fbGluZSh4MSwgeTEsIHgyLCB5MiwgbywgdHJ1ZSwgZmFsc2UpXG4gICAgY29uc3QgbzIgPSB0aGlzLl9saW5lKHgxLCB5MSwgeDIsIHkyLCBvLCB0cnVlLCB0cnVlKVxuICAgIHJldHVybiBvMS5jb25jYXQobzIpXG4gIH1cblxuICBfbGluZSh4MSwgeTEsIHgyLCB5MiwgbywgbW92ZSwgb3ZlcmxheSkge1xuICAgIGNvbnN0IGxlbmd0aFNxID0gTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKVxuICAgIGxldCBvZmZzZXQgPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMFxuICAgIGlmIChvZmZzZXQgKiBvZmZzZXQgKiAxMDAgPiBsZW5ndGhTcSkge1xuICAgICAgb2Zmc2V0ID0gTWF0aC5zcXJ0KGxlbmd0aFNxKSAvIDEwXG4gICAgfVxuICAgIGNvbnN0IGhhbGZPZmZzZXQgPSBvZmZzZXQgLyAyXG4gICAgY29uc3QgZGl2ZXJnZVBvaW50ID0gMC4yICsgTWF0aC5yYW5kb20oKSAqIDAuMlxuICAgIGxldCBtaWREaXNwWCA9IG8uYm93aW5nICogby5tYXhSYW5kb21uZXNzT2Zmc2V0ICogKHkyIC0geTEpIC8gMjAwXG4gICAgbGV0IG1pZERpc3BZID0gby5ib3dpbmcgKiBvLm1heFJhbmRvbW5lc3NPZmZzZXQgKiAoeDEgLSB4MikgLyAyMDBcbiAgICBtaWREaXNwWCA9IHRoaXMuX2dldE9mZnNldCgtbWlkRGlzcFgsIG1pZERpc3BYLCBvKVxuICAgIG1pZERpc3BZID0gdGhpcy5fZ2V0T2Zmc2V0KC1taWREaXNwWSwgbWlkRGlzcFksIG8pXG4gICAgbGV0IG9wcyA9IFtdXG4gICAgaWYgKG1vdmUpIHtcbiAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcDogXCJtb3ZlXCIsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgICAgeTEgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pXG4gICAgICAgICAgXVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgIG9wOiBcIm1vdmVcIixcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICB4MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICAgICAgeTEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKVxuICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG92ZXJsYXkpIHtcbiAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgb3A6IFwiYmN1cnZlVG9cIixcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIG1pZERpc3BYICtcbiAgICAgICAgICAgIHgxICtcbiAgICAgICAgICAgICh4MiAtIHgxKSAqIGRpdmVyZ2VQb2ludCArXG4gICAgICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIG1pZERpc3BZICtcbiAgICAgICAgICAgIHkxICtcbiAgICAgICAgICAgICh5MiAtIHkxKSAqIGRpdmVyZ2VQb2ludCArXG4gICAgICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIG1pZERpc3BYICtcbiAgICAgICAgICAgIHgxICtcbiAgICAgICAgICAgIDIgKiAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgK1xuICAgICAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKSxcbiAgICAgICAgICBtaWREaXNwWSArXG4gICAgICAgICAgICB5MSArXG4gICAgICAgICAgICAyICogKHkyIC0geTEpICogZGl2ZXJnZVBvaW50ICtcbiAgICAgICAgICAgIHRoaXMuX2dldE9mZnNldCgtaGFsZk9mZnNldCwgaGFsZk9mZnNldCwgbyksXG4gICAgICAgICAgeDIgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIHkyICsgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKVxuICAgICAgICBdXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcHMucHVzaCh7XG4gICAgICAgIG9wOiBcImJjdXJ2ZVRvXCIsXG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICBtaWREaXNwWCArXG4gICAgICAgICAgICB4MSArXG4gICAgICAgICAgICAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgK1xuICAgICAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgbWlkRGlzcFkgK1xuICAgICAgICAgICAgeTEgK1xuICAgICAgICAgICAgKHkyIC0geTEpICogZGl2ZXJnZVBvaW50ICtcbiAgICAgICAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICAgIG1pZERpc3BYICtcbiAgICAgICAgICAgIHgxICtcbiAgICAgICAgICAgIDIgKiAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgK1xuICAgICAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgbWlkRGlzcFkgK1xuICAgICAgICAgICAgeTEgK1xuICAgICAgICAgICAgMiAqICh5MiAtIHkxKSAqIGRpdmVyZ2VQb2ludCArXG4gICAgICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgICB4MiArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICAgIHkyICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbylcbiAgICAgICAgXVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIG9wc1xuICB9XG5cbiAgX2N1cnZlKHBvaW50cywgY2xvc2VQb2ludCwgbykge1xuICAgIGNvbnN0IGxlbiA9IHBvaW50cy5sZW5ndGhcbiAgICBsZXQgb3BzID0gW11cbiAgICBpZiAobGVuID4gMykge1xuICAgICAgY29uc3QgYiA9IFtdXG4gICAgICBjb25zdCBzID0gMSAtIG8uY3VydmVUaWdodG5lc3NcbiAgICAgIG9wcy5wdXNoKHsgb3A6IFwibW92ZVwiLCBkYXRhOiBbcG9pbnRzWzFdWzBdLCBwb2ludHNbMV1bMV1dIH0pXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSArIDIgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBjYWNoZWRWZXJ0QXJyYXkgPSBwb2ludHNbaV1cbiAgICAgICAgYlswXSA9IFtjYWNoZWRWZXJ0QXJyYXlbMF0sIGNhY2hlZFZlcnRBcnJheVsxXV1cbiAgICAgICAgYlsxXSA9IFtcbiAgICAgICAgICBjYWNoZWRWZXJ0QXJyYXlbMF0gK1xuICAgICAgICAgICAgKHMgKiBwb2ludHNbaSArIDFdWzBdIC0gcyAqIHBvaW50c1tpIC0gMV1bMF0pIC8gNixcbiAgICAgICAgICBjYWNoZWRWZXJ0QXJyYXlbMV0gKyAocyAqIHBvaW50c1tpICsgMV1bMV0gLSBzICogcG9pbnRzW2kgLSAxXVsxXSkgLyA2XG4gICAgICAgIF1cbiAgICAgICAgYlsyXSA9IFtcbiAgICAgICAgICBwb2ludHNbaSArIDFdWzBdICsgKHMgKiBwb2ludHNbaV1bMF0gLSBzICogcG9pbnRzW2kgKyAyXVswXSkgLyA2LFxuICAgICAgICAgIHBvaW50c1tpICsgMV1bMV0gKyAocyAqIHBvaW50c1tpXVsxXSAtIHMgKiBwb2ludHNbaSArIDJdWzFdKSAvIDZcbiAgICAgICAgXVxuICAgICAgICBiWzNdID0gW3BvaW50c1tpICsgMV1bMF0sIHBvaW50c1tpICsgMV1bMV1dXG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcDogXCJiY3VydmVUb1wiLFxuICAgICAgICAgIGRhdGE6IFtiWzFdWzBdLCBiWzFdWzFdLCBiWzJdWzBdLCBiWzJdWzFdLCBiWzNdWzBdLCBiWzNdWzFdXVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKGNsb3NlUG9pbnQgJiYgY2xvc2VQb2ludC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgbGV0IHJvID0gby5tYXhSYW5kb21uZXNzT2Zmc2V0XG4gICAgICAgIC8vIFRPRE86IG1vcmUgcm91Z2huZXNzIGhlcmU/XG4gICAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgICBvcHM6IFwibGluZVRvXCIsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgY2xvc2VQb2ludFswXSArIHRoaXMuX2dldE9mZnNldCgtcm8sIHJvLCBvKSxcbiAgICAgICAgICAgIGNsb3NlUG9pbnRbMV0gKyArdGhpcy5fZ2V0T2Zmc2V0KC1ybywgcm8sIG8pXG4gICAgICAgICAgXVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobGVuID09PSAzKSB7XG4gICAgICBvcHMucHVzaCh7IG9wOiBcIm1vdmVcIiwgZGF0YTogW3BvaW50c1sxXVswXSwgcG9pbnRzWzFdWzFdXSB9KVxuICAgICAgb3BzLnB1c2goe1xuICAgICAgICBvcDogXCJiY3VydmVUb1wiLFxuICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgcG9pbnRzWzFdWzBdLFxuICAgICAgICAgIHBvaW50c1sxXVsxXSxcbiAgICAgICAgICBwb2ludHNbMl1bMF0sXG4gICAgICAgICAgcG9pbnRzWzJdWzFdLFxuICAgICAgICAgIHBvaW50c1syXVswXSxcbiAgICAgICAgICBwb2ludHNbMl1bMV1cbiAgICAgICAgXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xuICAgICAgb3BzID0gb3BzLmNvbmNhdChcbiAgICAgICAgdGhpcy5fZG91YmxlTGluZShcbiAgICAgICAgICBwb2ludHNbMF1bMF0sXG4gICAgICAgICAgcG9pbnRzWzBdWzFdLFxuICAgICAgICAgIHBvaW50c1sxXVswXSxcbiAgICAgICAgICBwb2ludHNbMV1bMV0sXG4gICAgICAgICAgb1xuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBvcHNcbiAgfVxuXG4gIF9lbGxpcHNlKGluY3JlbWVudCwgY3gsIGN5LCByeCwgcnksIG9mZnNldCwgb3ZlcmxhcCwgbykge1xuICAgIGNvbnN0IHJhZE9mZnNldCA9IHRoaXMuX2dldE9mZnNldCgtMC41LCAwLjUsIG8pIC0gTWF0aC5QSSAvIDJcbiAgICBjb25zdCBwb2ludHMgPSBbXVxuICAgIHBvaW50cy5wdXNoKFtcbiAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICtcbiAgICAgICAgY3ggK1xuICAgICAgICAwLjkgKiByeCAqIE1hdGguY29zKHJhZE9mZnNldCAtIGluY3JlbWVudCksXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArXG4gICAgICAgIGN5ICtcbiAgICAgICAgMC45ICogcnkgKiBNYXRoLnNpbihyYWRPZmZzZXQgLSBpbmNyZW1lbnQpXG4gICAgXSlcbiAgICBmb3IgKFxuICAgICAgbGV0IGFuZ2xlID0gcmFkT2Zmc2V0O1xuICAgICAgYW5nbGUgPCBNYXRoLlBJICogMiArIHJhZE9mZnNldCAtIDAuMDE7XG4gICAgICBhbmdsZSA9IGFuZ2xlICsgaW5jcmVtZW50XG4gICAgKSB7XG4gICAgICBwb2ludHMucHVzaChbXG4gICAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICsgY3ggKyByeCAqIE1hdGguY29zKGFuZ2xlKSxcbiAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeSArIHJ5ICogTWF0aC5zaW4oYW5nbGUpXG4gICAgICBdKVxuICAgIH1cbiAgICBwb2ludHMucHVzaChbXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArXG4gICAgICAgIGN4ICtcbiAgICAgICAgcnggKiBNYXRoLmNvcyhyYWRPZmZzZXQgKyBNYXRoLlBJICogMiArIG92ZXJsYXAgKiAwLjUpLFxuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgK1xuICAgICAgICBjeSArXG4gICAgICAgIHJ5ICogTWF0aC5zaW4ocmFkT2Zmc2V0ICsgTWF0aC5QSSAqIDIgKyBvdmVybGFwICogMC41KVxuICAgIF0pXG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgK1xuICAgICAgICBjeCArXG4gICAgICAgIDAuOTggKiByeCAqIE1hdGguY29zKHJhZE9mZnNldCArIG92ZXJsYXApLFxuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgK1xuICAgICAgICBjeSArXG4gICAgICAgIDAuOTggKiByeSAqIE1hdGguc2luKHJhZE9mZnNldCArIG92ZXJsYXApXG4gICAgXSlcbiAgICBwb2ludHMucHVzaChbXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArXG4gICAgICAgIGN4ICtcbiAgICAgICAgMC45ICogcnggKiBNYXRoLmNvcyhyYWRPZmZzZXQgKyBvdmVybGFwICogMC41KSxcbiAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICtcbiAgICAgICAgY3kgK1xuICAgICAgICAwLjkgKiByeSAqIE1hdGguc2luKHJhZE9mZnNldCArIG92ZXJsYXAgKiAwLjUpXG4gICAgXSlcbiAgICByZXR1cm4gdGhpcy5fY3VydmUocG9pbnRzLCBudWxsLCBvKVxuICB9XG5cbiAgX2N1cnZlV2l0aE9mZnNldChwb2ludHMsIG9mZnNldCwgbykge1xuICAgIGNvbnN0IHBzID0gW11cbiAgICBwcy5wdXNoKFtcbiAgICAgIHBvaW50c1swXVswXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgcG9pbnRzWzBdWzFdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbylcbiAgICBdKVxuICAgIHBzLnB1c2goW1xuICAgICAgcG9pbnRzWzBdWzBdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICBwb2ludHNbMF1bMV0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKVxuICAgIF0pXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBzLnB1c2goW1xuICAgICAgICBwb2ludHNbaV1bMF0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgcG9pbnRzW2ldWzFdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbylcbiAgICAgIF0pXG4gICAgICBpZiAoaSA9PT0gcG9pbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgcHMucHVzaChbXG4gICAgICAgICAgcG9pbnRzW2ldWzBdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgcG9pbnRzW2ldWzFdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbylcbiAgICAgICAgXSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnZlKHBzLCBudWxsLCBvKVxuICB9XG5cbiAgX2FyYyhpbmNyZW1lbnQsIGN4LCBjeSwgcngsIHJ5LCBzdHJ0LCBzdHAsIG9mZnNldCwgbykge1xuICAgIGNvbnN0IHJhZE9mZnNldCA9IHN0cnQgKyB0aGlzLl9nZXRPZmZzZXQoLTAuMSwgMC4xLCBvKVxuICAgIGNvbnN0IHBvaW50cyA9IFtdXG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgK1xuICAgICAgICBjeCArXG4gICAgICAgIDAuOSAqIHJ4ICogTWF0aC5jb3MocmFkT2Zmc2V0IC0gaW5jcmVtZW50KSxcbiAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICtcbiAgICAgICAgY3kgK1xuICAgICAgICAwLjkgKiByeSAqIE1hdGguc2luKHJhZE9mZnNldCAtIGluY3JlbWVudClcbiAgICBdKVxuICAgIGZvciAobGV0IGFuZ2xlID0gcmFkT2Zmc2V0OyBhbmdsZSA8PSBzdHA7IGFuZ2xlID0gYW5nbGUgKyBpbmNyZW1lbnQpIHtcbiAgICAgIHBvaW50cy5wdXNoKFtcbiAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeCArIHJ4ICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN5ICsgcnkgKiBNYXRoLnNpbihhbmdsZSlcbiAgICAgIF0pXG4gICAgfVxuICAgIHBvaW50cy5wdXNoKFtjeCArIHJ4ICogTWF0aC5jb3Moc3RwKSwgY3kgKyByeSAqIE1hdGguc2luKHN0cCldKVxuICAgIHBvaW50cy5wdXNoKFtjeCArIHJ4ICogTWF0aC5jb3Moc3RwKSwgY3kgKyByeSAqIE1hdGguc2luKHN0cCldKVxuICAgIHJldHVybiB0aGlzLl9jdXJ2ZShwb2ludHMsIG51bGwsIG8pXG4gIH1cblxuICBfZ2V0SW50ZXJzZWN0aW5nTGluZXMobGluZUNvb3JkcywgeENvb3JkcywgeUNvb3Jkcykge1xuICAgIGxldCBpbnRlcnNlY3Rpb25zID0gW11cbiAgICB2YXIgczEgPSBuZXcgUm91Z2hTZWdtZW50KFxuICAgICAgbGluZUNvb3Jkc1swXSxcbiAgICAgIGxpbmVDb29yZHNbMV0sXG4gICAgICBsaW5lQ29vcmRzWzJdLFxuICAgICAgbGluZUNvb3Jkc1szXVxuICAgIClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhDb29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzMiA9IG5ldyBSb3VnaFNlZ21lbnQoXG4gICAgICAgIHhDb29yZHNbaV0sXG4gICAgICAgIHlDb29yZHNbaV0sXG4gICAgICAgIHhDb29yZHNbKGkgKyAxKSAlIHhDb29yZHMubGVuZ3RoXSxcbiAgICAgICAgeUNvb3Jkc1soaSArIDEpICUgeENvb3Jkcy5sZW5ndGhdXG4gICAgICApXG4gICAgICBpZiAoczEuY29tcGFyZShzMikgPT0gUm91Z2hTZWdtZW50UmVsYXRpb24oKS5JTlRFUlNFQ1RTKSB7XG4gICAgICAgIGludGVyc2VjdGlvbnMucHVzaChbczEueGksIHMxLnlpXSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnNcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm91Z2hSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXIuanMnO1xuc2VsZi5fcm91Z2hTY3JpcHQgPSBzZWxmLmRvY3VtZW50ICYmIHNlbGYuZG9jdW1lbnQuY3VycmVudFNjcmlwdCAmJiBzZWxmLmRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXG5leHBvcnQgY2xhc3MgUm91Z2hHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIGNhbnZhcykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBtYXhSYW5kb21uZXNzT2Zmc2V0OiAyLFxuICAgICAgcm91Z2huZXNzOiAxLFxuICAgICAgYm93aW5nOiAxLFxuICAgICAgc3Ryb2tlOiAnIzAwMCcsXG4gICAgICBzdHJva2VXaWR0aDogMSxcbiAgICAgIGN1cnZlVGlnaHRuZXNzOiAwLFxuICAgICAgY3VydmVTdGVwQ291bnQ6IDksXG4gICAgICBmaWxsOiBudWxsLFxuICAgICAgZmlsbFN0eWxlOiAnaGFjaHVyZScsXG4gICAgICBmaWxsV2VpZ2h0OiAtMSxcbiAgICAgIGhhY2h1cmVBbmdsZTogLTQxLFxuICAgICAgaGFjaHVyZUdhcDogLTFcbiAgICB9O1xuICAgIGlmICh0aGlzLmNvbmZpZy5vcHRpb25zKSB7XG4gICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0gdGhpcy5fb3B0aW9ucyh0aGlzLmNvbmZpZy5vcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBfb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMgPyBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSA6IHRoaXMuZGVmYXVsdE9wdGlvbnM7XG4gIH1cblxuICBfZHJhd2FibGUoc2hhcGUsIHNldHMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4geyBzaGFwZSwgc2V0czogc2V0cyB8fCBbXSwgb3B0aW9uczogb3B0aW9ucyB8fCB0aGlzLmRlZmF1bHRPcHRpb25zIH07XG4gIH1cblxuICBnZXQgbGliKCkge1xuICAgIGlmICghdGhpcy5fcmVuZGVyZXIpIHtcbiAgICAgIGlmIChzZWxmICYmIHNlbGYud29ya2x5ICYmIHRoaXMuY29uZmlnLmFzeW5jICYmICghdGhpcy5jb25maWcubm9Xb3JrZXIpKSB7XG4gICAgICAgIGNvbnN0IHRvcyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcbiAgICAgICAgY29uc3Qgd29ya2x5U291cmNlID0gdGhpcy5jb25maWcud29ya2x5VVJMIHx8ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvZ2gvcHNoaWhuL3dvcmtseS9kaXN0L3dvcmtseS5taW4uanMnO1xuICAgICAgICBjb25zdCByZW5kZXJlclNvdXJjZSA9IHRoaXMuY29uZmlnLnJvdWdoVVJMIHx8IHNlbGYuX3JvdWdoU2NyaXB0O1xuICAgICAgICBpZiAocmVuZGVyZXJTb3VyY2UgJiYgd29ya2x5U291cmNlKSB7XG4gICAgICAgICAgbGV0IGNvZGUgPSBgaW1wb3J0U2NyaXB0cygnJHt3b3JrbHlTb3VyY2V9JywgJyR7cmVuZGVyZXJTb3VyY2V9Jyk7XFxud29ya2x5LmV4cG9zZShzZWxmLnJvdWdoLmNyZWF0ZVJlbmRlcmVyKCkpO2A7XG4gICAgICAgICAgbGV0IG91cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtjb2RlXSkpO1xuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyID0gd29ya2x5LnByb3h5KG91cmwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyID0gbmV3IFJvdWdoUmVuZGVyZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgUm91Z2hSZW5kZXJlcigpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyZXI7XG4gIH1cblxuICBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdsaW5lJywgW3RoaXMubGliLmxpbmUoeDEsIHkxLCB4MiwgeTIsIG8pXSwgbyk7XG4gIH1cblxuICByZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgY29uc3QgeGMgPSBbeCwgeCArIHdpZHRoLCB4ICsgd2lkdGgsIHhdO1xuICAgICAgY29uc3QgeWMgPSBbeSwgeSwgeSArIGhlaWdodCwgeSArIGhlaWdodF07XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgcGF0aHMucHVzaCh0aGlzLmxpYi5zb2xpZEZpbGxTaGFwZSh4YywgeWMsIG8pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaCh0aGlzLmxpYi5oYWNodXJlRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKHRoaXMubGliLnJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKSk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdyZWN0YW5nbGUnLCBwYXRocywgbyk7XG4gIH1cblxuICBlbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChvLmZpbGwpIHtcbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBjb25zdCBzaGFwZSA9IHRoaXMubGliLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbyk7XG4gICAgICAgIHNoYXBlLnR5cGUgPSAnZmlsbFBhdGgnO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2godGhpcy5saWIuaGFjaHVyZUZpbGxFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaCh0aGlzLmxpYi5lbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2VsbGlwc2UnLCBwYXRocywgbyk7XG4gIH1cblxuICBjaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgcmV0ID0gdGhpcy5lbGxpcHNlKHgsIHksIGRpYW1ldGVyLCBkaWFtZXRlciwgb3B0aW9ucyk7XG4gICAgcmV0LnNoYXBlID0gJ2NpcmNsZSc7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdsaW5lYXJQYXRoJywgW3RoaXMubGliLmxpbmVhclBhdGgocG9pbnRzLCBmYWxzZSwgbyldLCBvKTtcbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBsZXQgeGMgPSBbXSwgeWMgPSBbXTtcbiAgICAgIGZvciAobGV0IHAgb2YgcG9pbnRzKSB7XG4gICAgICAgIHhjLnB1c2gocFswXSk7XG4gICAgICAgIHljLnB1c2gocFsxXSk7XG4gICAgICB9XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgcGF0aHMucHVzaCh0aGlzLmxpYi5zb2xpZEZpbGxTaGFwZSh4YywgeWMsIG8pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2godGhpcy5saWIuaGFjaHVyZUZpbGxTaGFwZSh4YywgeWMsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaCh0aGlzLmxpYi5saW5lYXJQYXRoKHBvaW50cywgdHJ1ZSwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncG9seWdvbicsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoY2xvc2VkICYmIG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGxldCBzaGFwZSA9IHRoaXMubGliLmFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgdHJ1ZSwgZmFsc2UsIG8pO1xuICAgICAgICBzaGFwZS50eXBlID0gJ2ZpbGxQYXRoJztcbiAgICAgICAgcGF0aHMucHVzaChzaGFwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXRocy5wdXNoKHRoaXMubGliLmhhY2h1cmVGaWxsQXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBvKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGhzLnB1c2godGhpcy5saWIuYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIHRydWUsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2FyYycsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGN1cnZlKHBvaW50cywgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnY3VydmUnLCBbdGhpcy5saWIuY3VydmUocG9pbnRzLCBvKV0sIG8pO1xuICB9XG5cbiAgcGF0aChkLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoIWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncGF0aCcsIHBhdGhzLCBvKTtcbiAgICB9XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGxldCBzaGFwZSA9IHsgdHlwZTogJ3BhdGgyRGZpbGwnLCBwYXRoOiBkIH07XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2NvbXB1dGVQYXRoU2l6ZShkKTtcbiAgICAgICAgbGV0IHhjID0gWzAsIHNpemVbMF0sIHNpemVbMF0sIDBdO1xuICAgICAgICBsZXQgeWMgPSBbMCwgMCwgc2l6ZVsxXSwgc2l6ZVsxXV07XG4gICAgICAgIGxldCBzaGFwZSA9IHRoaXMubGliLmhhY2h1cmVGaWxsU2hhcGUoeGMsIHljLCBvKTtcbiAgICAgICAgc2hhcGUudHlwZSA9ICdwYXRoMkRwYXR0ZXJuJztcbiAgICAgICAgc2hhcGUuc2l6ZSA9IHNpemU7XG4gICAgICAgIHNoYXBlLnBhdGggPSBkO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaCh0aGlzLmxpYi5zdmdQYXRoKGQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ3BhdGgnLCBwYXRocywgbyk7XG4gIH1cblxuICB0b1BhdGhzKGRyYXdhYmxlKSB7XG4gICAgY29uc3Qgc2V0cyA9IGRyYXdhYmxlLnNldHMgfHwgW107XG4gICAgY29uc3QgbyA9IGRyYXdhYmxlLm9wdGlvbnMgfHwgdGhpcy5kZWZhdWx0T3B0aW9ucztcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGZvciAoY29uc3QgZHJhd2luZyBvZiBzZXRzKSB7XG4gICAgICBsZXQgcGF0aCA9IG51bGw7XG4gICAgICBzd2l0Y2ggKGRyYXdpbmcudHlwZSkge1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgICBwYXRoID0ge1xuICAgICAgICAgICAgZDogdGhpcy5vcHNUb1BhdGgoZHJhd2luZyksXG4gICAgICAgICAgICBzdHJva2U6IG8uc3Ryb2tlLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IG8uc3Ryb2tlV2lkdGgsXG4gICAgICAgICAgICBmaWxsOiAnbm9uZSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmaWxsUGF0aCc6XG4gICAgICAgICAgcGF0aCA9IHtcbiAgICAgICAgICAgIGQ6IHRoaXMub3BzVG9QYXRoKGRyYXdpbmcpLFxuICAgICAgICAgICAgc3Ryb2tlOiAnbm9uZScsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMCxcbiAgICAgICAgICAgIGZpbGw6IG8uZmlsbFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbGxTa2V0Y2gnOlxuICAgICAgICAgIHBhdGggPSB0aGlzLl9maWxsU2tldGNoKGRyYXdpbmcsIG8pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwYXRoMkRmaWxsJzpcbiAgICAgICAgICBwYXRoID0ge1xuICAgICAgICAgICAgZDogZHJhd2luZy5wYXRoLFxuICAgICAgICAgICAgc3Ryb2tlOiAnbm9uZScsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogMCxcbiAgICAgICAgICAgIGZpbGw6IG8uZmlsbFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhdGgyRHBhdHRlcm4nOiB7XG4gICAgICAgICAgY29uc3Qgc2l6ZSA9IGRyYXdpbmcuc2l6ZTtcbiAgICAgICAgICBjb25zdCBwYXR0ZXJuID0ge1xuICAgICAgICAgICAgeDogMCwgeTogMCwgd2lkdGg6IDEsIGhlaWdodDogMSxcbiAgICAgICAgICAgIHZpZXdCb3g6IGAwIDAgJHtNYXRoLnJvdW5kKHNpemVbMF0pfSAke01hdGgucm91bmQoc2l6ZVsxXSl9YCxcbiAgICAgICAgICAgIHBhdHRlcm5Vbml0czogJ29iamVjdEJvdW5kaW5nQm94JyxcbiAgICAgICAgICAgIHBhdGg6IHRoaXMuX2ZpbGxTa2V0Y2goZHJhd2luZywgbylcbiAgICAgICAgICB9O1xuICAgICAgICAgIHBhdGggPSB7XG4gICAgICAgICAgICBkOiBkcmF3aW5nLnBhdGgsXG4gICAgICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgICAgICAgICAgcGF0dGVybjogcGF0dGVyblxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIF9maWxsU2tldGNoKGRyYXdpbmcsIG8pIHtcbiAgICBsZXQgZndlaWdodCA9IG8uZmlsbFdlaWdodDtcbiAgICBpZiAoZndlaWdodCA8IDApIHtcbiAgICAgIGZ3ZWlnaHQgPSBvLnN0cm9rZVdpZHRoIC8gMjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGQ6IHRoaXMub3BzVG9QYXRoKGRyYXdpbmcpLFxuICAgICAgc3Ryb2tlOiBvLmZpbGwsXG4gICAgICBzdHJva2VXaWR0aDogZndlaWdodCxcbiAgICAgIGZpbGw6ICdub25lJ1xuICAgIH07XG4gIH1cblxuICBvcHNUb1BhdGgoZHJhd2luZykge1xuICAgIGxldCBwYXRoID0gJyc7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBkcmF3aW5nLm9wcykge1xuICAgICAgY29uc3QgZGF0YSA9IGl0ZW0uZGF0YTtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgICBwYXRoICs9IGBNJHtkYXRhWzBdfSAke2RhdGFbMV19IGA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2JjdXJ2ZVRvJzpcbiAgICAgICAgICBwYXRoICs9IGBDJHtkYXRhWzBdfSAke2RhdGFbMV19LCAke2RhdGFbMl19ICR7ZGF0YVszXX0sICR7ZGF0YVs0XX0gJHtkYXRhWzVdfSBgO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdxY3VydmVUbyc6XG4gICAgICAgICAgcGF0aCArPSBgUSR7ZGF0YVswXX0gJHtkYXRhWzFdfSwgJHtkYXRhWzJdfSAke2RhdGFbM119IGA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2xpbmVUbyc6XG4gICAgICAgICAgcGF0aCArPSBgTCR7ZGF0YVswXX0gJHtkYXRhWzFdfSBgO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aC50cmltKCk7XG4gIH1cblxuICBfY29tcHV0ZVBhdGhTaXplKGQpIHtcbiAgICBsZXQgc2l6ZSA9IFswLCAwXTtcbiAgICBpZiAoc2VsZi5kb2N1bWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gICAgICAgIGxldCBzdmcgPSBzZWxmLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJzdmdcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjBcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIwXCIpO1xuICAgICAgICBsZXQgcGF0aE5vZGUgPSBzZWxmLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJwYXRoXCIpO1xuICAgICAgICBwYXRoTm9kZS5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKHBhdGhOb2RlKTtcbiAgICAgICAgc2VsZi5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgICAgIGxldCBiYiA9IHBhdGhOb2RlLmdldEJCb3goKVxuICAgICAgICBpZiAoYmIpIHtcbiAgICAgICAgICBzaXplWzBdID0gYmIud2lkdGggfHwgMDtcbiAgICAgICAgICBzaXplWzFdID0gYmIuaGVpZ2h0IHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN2Zyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHsgfVxuICAgIH1cbiAgICBjb25zdCBjYW52YXNTaXplID0gdGhpcy5fY2FudmFzU2l6ZSgpO1xuICAgIGlmICghKHNpemVbMF0gKiBzaXplWzFdKSkge1xuICAgICAgc2l6ZSA9IGNhbnZhc1NpemU7XG4gICAgfVxuICAgIHNpemVbMF0gPSBNYXRoLm1pbihzaXplWzBdLCBjYW52YXNTaXplWzBdKTtcbiAgICBzaXplWzFdID0gTWF0aC5taW4oc2l6ZVsxXSwgY2FudmFzU2l6ZVsxXSk7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICBfY2FudmFzU2l6ZSgpIHtcbiAgICBjb25zdCB2YWwgPSB3ID0+IHtcbiAgICAgIGlmICh3KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBpZiAody5iYXNlVmFsICYmIHcuYmFzZVZhbC52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuYmFzZVZhbC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB3IHx8IDEwMDtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLmNhbnZhcyA/IFt2YWwodGhpcy5jYW52YXMud2lkdGgpLCB2YWwodGhpcy5jYW52YXMuaGVpZ2h0KV0gOiBbMTAwLCAxMDBdO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3VnaEdlbmVyYXRvckFzeW5jIGV4dGVuZHMgUm91Z2hHZW5lcmF0b3Ige1xuICBhc3luYyBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdsaW5lJywgW2F3YWl0IHRoaXMubGliLmxpbmUoeDEsIHkxLCB4MiwgeTIsIG8pXSwgbyk7XG4gIH1cblxuICBhc3luYyByZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgY29uc3QgeGMgPSBbeCwgeCArIHdpZHRoLCB4ICsgd2lkdGgsIHhdO1xuICAgICAgY29uc3QgeWMgPSBbeSwgeSwgeSArIGhlaWdodCwgeSArIGhlaWdodF07XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5zb2xpZEZpbGxTaGFwZSh4YywgeWMsIG8pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5oYWNodXJlRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLnJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKSk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdyZWN0YW5nbGUnLCBwYXRocywgbyk7XG4gIH1cblxuICBhc3luYyBlbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChvLmZpbGwpIHtcbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBjb25zdCBzaGFwZSA9IGF3YWl0IHRoaXMubGliLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbyk7XG4gICAgICAgIHNoYXBlLnR5cGUgPSAnZmlsbFBhdGgnO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2goYXdhaXQgdGhpcy5saWIuaGFjaHVyZUZpbGxFbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5lbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2VsbGlwc2UnLCBwYXRocywgbyk7XG4gIH1cblxuICBhc3luYyBjaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgcmV0ID0gYXdhaXQgdGhpcy5lbGxpcHNlKHgsIHksIGRpYW1ldGVyLCBkaWFtZXRlciwgb3B0aW9ucyk7XG4gICAgcmV0LnNoYXBlID0gJ2NpcmNsZSc7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIGFzeW5jIGxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdsaW5lYXJQYXRoJywgW2F3YWl0IHRoaXMubGliLmxpbmVhclBhdGgocG9pbnRzLCBmYWxzZSwgbyldLCBvKTtcbiAgfVxuXG4gIGFzeW5jIHBvbHlnb24ocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBsZXQgeGMgPSBbXSwgeWMgPSBbXTtcbiAgICAgIGZvciAobGV0IHAgb2YgcG9pbnRzKSB7XG4gICAgICAgIHhjLnB1c2gocFswXSk7XG4gICAgICAgIHljLnB1c2gocFsxXSk7XG4gICAgICB9XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5zb2xpZEZpbGxTaGFwZSh4YywgeWMsIG8pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2goYXdhaXQgdGhpcy5saWIuaGFjaHVyZUZpbGxTaGFwZSh4YywgeWMsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5saW5lYXJQYXRoKHBvaW50cywgdHJ1ZSwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncG9seWdvbicsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGFzeW5jIGFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoY2xvc2VkICYmIG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGxldCBzaGFwZSA9IGF3YWl0IHRoaXMubGliLmFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgdHJ1ZSwgZmFsc2UsIG8pO1xuICAgICAgICBzaGFwZS50eXBlID0gJ2ZpbGxQYXRoJztcbiAgICAgICAgcGF0aHMucHVzaChzaGFwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLmhhY2h1cmVGaWxsQXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBvKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGhzLnB1c2goYXdhaXQgdGhpcy5saWIuYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIHRydWUsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2FyYycsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGFzeW5jIGN1cnZlKHBvaW50cywgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnY3VydmUnLCBbYXdhaXQgdGhpcy5saWIuY3VydmUocG9pbnRzLCBvKV0sIG8pO1xuICB9XG5cbiAgYXN5bmMgcGF0aChkLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoIWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncGF0aCcsIHBhdGhzLCBvKTtcbiAgICB9XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGxldCBzaGFwZSA9IHsgdHlwZTogJ3BhdGgyRGZpbGwnLCBwYXRoOiBkIH07XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuX2NvbXB1dGVQYXRoU2l6ZShkKTtcbiAgICAgICAgbGV0IHhjID0gWzAsIHNpemVbMF0sIHNpemVbMF0sIDBdO1xuICAgICAgICBsZXQgeWMgPSBbMCwgMCwgc2l6ZVsxXSwgc2l6ZVsxXV07XG4gICAgICAgIGxldCBzaGFwZSA9IGF3YWl0IHRoaXMubGliLmhhY2h1cmVGaWxsU2hhcGUoeGMsIHljLCBvKTtcbiAgICAgICAgc2hhcGUudHlwZSA9ICdwYXRoMkRwYXR0ZXJuJztcbiAgICAgICAgc2hhcGUuc2l6ZSA9IHNpemU7XG4gICAgICAgIHNoYXBlLnBhdGggPSBkO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5zdmdQYXRoKGQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ3BhdGgnLCBwYXRocywgbyk7XG4gIH1cbn0iLCJpbXBvcnQgeyBSb3VnaEdlbmVyYXRvciwgUm91Z2hHZW5lcmF0b3JBc3luYyB9IGZyb20gJy4vZ2VuZXJhdG9yLmpzJ1xuaW1wb3J0IHsgUm91Z2hSZW5kZXJlciB9IGZyb20gJy4vcmVuZGVyZXIuanMnO1xuXG5leHBvcnQgY2xhc3MgUm91Z2hDYW52YXMge1xuICBjb25zdHJ1Y3RvcihjYW52YXMsIGNvbmZpZykge1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIHRoaXMuX2luaXQoY29uZmlnKTtcbiAgfVxuXG4gIF9pbml0KGNvbmZpZykge1xuICAgIHRoaXMuZ2VuID0gbmV3IFJvdWdoR2VuZXJhdG9yKGNvbmZpZywgdGhpcy5jYW52YXMpO1xuICB9XG5cbiAgZ2V0IGdlbmVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZW47XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlUmVuZGVyZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSb3VnaFJlbmRlcmVyKCk7XG4gIH1cblxuICBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5saW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICByZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ucmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4uZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBjaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgbGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBwb2x5Z29uKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ucG9seWdvbihwb2ludHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5hcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgY3VydmUocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5jdXJ2ZShwb2ludHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIHBhdGgoZCwgb3B0aW9ucykge1xuICAgIGxldCBkcmF3aW5nID0gdGhpcy5nZW4ucGF0aChkLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZHJhd2luZyk7XG4gICAgcmV0dXJuIGRyYXdpbmc7XG4gIH1cblxuICBkcmF3KGRyYXdhYmxlKSB7XG4gICAgbGV0IHNldHMgPSBkcmF3YWJsZS5zZXRzIHx8IFtdO1xuICAgIGxldCBvID0gZHJhd2FibGUub3B0aW9ucyB8fCB0aGlzLmdlbi5kZWZhdWx0T3B0aW9ucztcbiAgICBsZXQgY3R4ID0gdGhpcy5jdHg7XG4gICAgZm9yIChsZXQgZHJhd2luZyBvZiBzZXRzKSB7XG4gICAgICBzd2l0Y2ggKGRyYXdpbmcudHlwZSkge1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IG8uc3Ryb2tlO1xuICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBvLnN0cm9rZVdpZHRoO1xuICAgICAgICAgIHRoaXMuX2RyYXdUb0NvbnRleHQoY3R4LCBkcmF3aW5nKTtcbiAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmaWxsUGF0aCc6XG4gICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICBjdHguZmlsbFN0eWxlID0gby5maWxsO1xuICAgICAgICAgIHRoaXMuX2RyYXdUb0NvbnRleHQoY3R4LCBkcmF3aW5nLCBvKTtcbiAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmaWxsU2tldGNoJzpcbiAgICAgICAgICB0aGlzLl9maWxsU2tldGNoKGN0eCwgZHJhd2luZywgbyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhdGgyRGZpbGwnOiB7XG4gICAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IG8uZmlsbDtcbiAgICAgICAgICBsZXQgcDJkID0gbmV3IFBhdGgyRChkcmF3aW5nLnBhdGgpO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGwocDJkKTtcbiAgICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAncGF0aDJEcGF0dGVybic6IHtcbiAgICAgICAgICBsZXQgc2l6ZSA9IGRyYXdpbmcuc2l6ZTtcbiAgICAgICAgICBjb25zdCBoY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgY29uc3QgaGNvbnRleHQgPSBoY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICBsZXQgYmJveCA9IHRoaXMuX2NvbXB1dGVCQm94KGRyYXdpbmcucGF0aCk7XG4gICAgICAgICAgaWYgKGJib3ggJiYgKGJib3gud2lkdGggfHwgYmJveC5oZWlnaHQpKSB7XG4gICAgICAgICAgICBoY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICBoY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgIGhjb250ZXh0LnRyYW5zbGF0ZShiYm94LnggfHwgMCwgYmJveC55IHx8IDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoY2FudmFzLndpZHRoID0gc2l6ZVswXTtcbiAgICAgICAgICAgIGhjYW52YXMuaGVpZ2h0ID0gc2l6ZVsxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fZmlsbFNrZXRjaChoY29udGV4dCwgZHJhd2luZywgbyk7XG4gICAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY3R4LmNyZWF0ZVBhdHRlcm4oaGNhbnZhcywgJ3JlcGVhdCcpO1xuICAgICAgICAgIGxldCBwMmQgPSBuZXcgUGF0aDJEKGRyYXdpbmcucGF0aCk7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbChwMmQpO1xuICAgICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9jb21wdXRlQkJveChkKSB7XG4gICAgaWYgKHNlbGYuZG9jdW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuICAgICAgICBsZXQgc3ZnID0gc2VsZi5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIFwic3ZnXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIwXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMFwiKTtcbiAgICAgICAgbGV0IHBhdGhOb2RlID0gc2VsZi5kb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIFwicGF0aFwiKTtcbiAgICAgICAgcGF0aE5vZGUuc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgICAgIHN2Zy5hcHBlbmRDaGlsZChwYXRoTm9kZSk7XG4gICAgICAgIHNlbGYuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdmcpO1xuICAgICAgICBsZXQgYmJveCA9IHBhdGhOb2RlLmdldEJCb3goKTtcbiAgICAgICAgc2VsZi5kb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHN2Zyk7XG4gICAgICAgIHJldHVybiBiYm94O1xuICAgICAgfSBjYXRjaCAoZXJyKSB7IH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBfZmlsbFNrZXRjaChjdHgsIGRyYXdpbmcsIG8pIHtcbiAgICBsZXQgZndlaWdodCA9IG8uZmlsbFdlaWdodDtcbiAgICBpZiAoZndlaWdodCA8IDApIHtcbiAgICAgIGZ3ZWlnaHQgPSBvLnN0cm9rZVdpZHRoIC8gMjtcbiAgICB9XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBvLmZpbGw7XG4gICAgY3R4LmxpbmVXaWR0aCA9IGZ3ZWlnaHQ7XG4gICAgdGhpcy5fZHJhd1RvQ29udGV4dChjdHgsIGRyYXdpbmcpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBfZHJhd1RvQ29udGV4dChjdHgsIGRyYXdpbmcpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBkcmF3aW5nLm9wcykge1xuICAgICAgY29uc3QgZGF0YSA9IGl0ZW0uZGF0YTtcbiAgICAgIHN3aXRjaCAoaXRlbS5vcCkge1xuICAgICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgICBjdHgubW92ZVRvKGRhdGFbMF0sIGRhdGFbMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdiY3VydmVUbyc6XG4gICAgICAgICAgY3R4LmJlemllckN1cnZlVG8oZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXSwgZGF0YVszXSwgZGF0YVs0XSwgZGF0YVs1XSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3FjdXJ2ZVRvJzpcbiAgICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyhkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdLCBkYXRhWzNdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbGluZVRvJzpcbiAgICAgICAgICBjdHgubGluZVRvKGRhdGFbMF0sIGRhdGFbMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZHJhd2luZy50eXBlID09PSAnZmlsbFBhdGgnKSB7XG4gICAgICBjdHguZmlsbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3VnaENhbnZhc0FzeW5jIGV4dGVuZHMgUm91Z2hDYW52YXMge1xuICBfaW5pdChjb25maWcpIHtcbiAgICB0aGlzLmdlbiA9IG5ldyBSb3VnaEdlbmVyYXRvckFzeW5jKGNvbmZpZywgdGhpcy5jYW52YXMpO1xuICB9XG5cbiAgYXN5bmMgbGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ubGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXN5bmMgcmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLnJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyBlbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXN5bmMgY2lyY2xlKHgsIHksIGRpYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5jaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFzeW5jIGxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5saW5lYXJQYXRoKHBvaW50cywgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXN5bmMgcG9seWdvbihwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLnBvbHlnb24ocG9pbnRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyBhcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFzeW5jIGN1cnZlKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uY3VydmUocG9pbnRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyBwYXRoKGQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZHJhd2luZyA9IGF3YWl0IHRoaXMuZ2VuLnBhdGgoZCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGRyYXdpbmcpO1xuICAgIHJldHVybiBkcmF3aW5nO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hHZW5lcmF0b3IsIFJvdWdoR2VuZXJhdG9yQXN5bmMgfSBmcm9tICcuL2dlbmVyYXRvci5qcydcblxuZXhwb3J0IGNsYXNzIFJvdWdoU1ZHIHtcbiAgY29uc3RydWN0b3Ioc3ZnLCBjb25maWcpIHtcbiAgICB0aGlzLnN2ZyA9IHN2ZztcbiAgICB0aGlzLl9pbml0KGNvbmZpZyk7XG4gIH1cblxuICBfaW5pdChjb25maWcpIHtcbiAgICB0aGlzLmdlbiA9IG5ldyBSb3VnaEdlbmVyYXRvcihjb25maWcsIHRoaXMuc3ZnKTtcbiAgfVxuXG4gIGdldCBnZW5lcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuO1xuICB9XG5cbiAgZ2V0IGRlZnMoKSB7XG4gICAgaWYgKCF0aGlzLl9kZWZzKSB7XG4gICAgICBsZXQgZG9jID0gdGhpcy5zdmcub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgIGxldCBkbm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2RlZnMnKTtcbiAgICAgIGlmICh0aGlzLnN2Zy5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMuc3ZnLmluc2VydEJlZm9yZShkbm9kZSwgdGhpcy5zdmcuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN2Zy5hcHBlbmRDaGlsZChkbm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9kZWZzID0gZG5vZGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9kZWZzO1xuICB9XG5cbiAgbGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ubGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5yZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4uZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgY2lyY2xlKHgsIHksIGRpYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5jaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBsaW5lYXJQYXRoKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ubGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBwb2x5Z29uKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ucG9seWdvbihwb2ludHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4uYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBjdXJ2ZShwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmN1cnZlKHBvaW50cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIHBhdGgoZCwgb3B0aW9ucykge1xuICAgIGxldCBkcmF3aW5nID0gdGhpcy5nZW4ucGF0aChkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGRyYXdpbmcpO1xuICB9XG5cbiAgZHJhdyhkcmF3YWJsZSkge1xuICAgIGxldCBzZXRzID0gZHJhd2FibGUuc2V0cyB8fCBbXTtcbiAgICBsZXQgbyA9IGRyYXdhYmxlLm9wdGlvbnMgfHwgdGhpcy5nZW4uZGVmYXVsdE9wdGlvbnM7XG4gICAgbGV0IGRvYyA9IHRoaXMuc3ZnLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgbGV0IGcgPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdnJyk7XG4gICAgZm9yIChsZXQgZHJhd2luZyBvZiBzZXRzKSB7XG4gICAgICBsZXQgcGF0aCA9IG51bGw7XG4gICAgICBzd2l0Y2ggKGRyYXdpbmcudHlwZSkge1xuICAgICAgICBjYXNlICdwYXRoJzoge1xuICAgICAgICAgIHBhdGggPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLl9vcHNUb1BhdGgoZHJhd2luZykpO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlID0gby5zdHJva2U7XG4gICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2VXaWR0aCA9IG8uc3Ryb2tlV2lkdGg7XG4gICAgICAgICAgcGF0aC5zdHlsZS5maWxsID0gJ25vbmUnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2ZpbGxQYXRoJzoge1xuICAgICAgICAgIHBhdGggPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLl9vcHNUb1BhdGgoZHJhd2luZykpO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlID0gJ25vbmUnO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlV2lkdGggPSAwO1xuICAgICAgICAgIHBhdGguc3R5bGUuZmlsbCA9IG8uZmlsbDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdmaWxsU2tldGNoJzoge1xuICAgICAgICAgIHBhdGggPSB0aGlzLl9maWxsU2tldGNoKGRvYywgZHJhd2luZywgbyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAncGF0aDJEZmlsbCc6IHtcbiAgICAgICAgICBwYXRoID0gZG9jLmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgZHJhd2luZy5wYXRoKTtcbiAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZSA9ICdub25lJztcbiAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZVdpZHRoID0gMDtcbiAgICAgICAgICBwYXRoLnN0eWxlLmZpbGwgPSBvLmZpbGw7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAncGF0aDJEcGF0dGVybic6IHtcbiAgICAgICAgICBjb25zdCBzaXplID0gZHJhd2luZy5zaXplO1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXR0ZXJuJyk7XG4gICAgICAgICAgY29uc3QgaWQgPSBgcm91Z2gtJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgfHwgOTk5OTk5KSl9YDtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgICAgICAgcGF0dGVybi5zZXRBdHRyaWJ1dGUoJ3gnLCAwKTtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgneScsIDApO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCd3aWR0aCcsIDEpO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAxKTtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgMSk7XG4gICAgICAgICAgcGF0dGVybi5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7TWF0aC5yb3VuZChzaXplWzBdKX0gJHtNYXRoLnJvdW5kKHNpemVbMV0pfWApO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCdwYXR0ZXJuVW5pdHMnLCAnb2JqZWN0Qm91bmRpbmdCb3gnKTtcbiAgICAgICAgICBjb25zdCBwYXR0ZXJuUGF0aCA9IHRoaXMuX2ZpbGxTa2V0Y2goZG9jLCBkcmF3aW5nLCBvKTtcbiAgICAgICAgICBwYXR0ZXJuLmFwcGVuZENoaWxkKHBhdHRlcm5QYXRoKTtcbiAgICAgICAgICB0aGlzLmRlZnMuYXBwZW5kQ2hpbGQocGF0dGVybik7XG5cbiAgICAgICAgICBwYXRoID0gZG9jLmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgZHJhd2luZy5wYXRoKTtcbiAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZSA9ICdub25lJztcbiAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZVdpZHRoID0gMDtcbiAgICAgICAgICBwYXRoLnN0eWxlLmZpbGwgPSBgdXJsKCMke2lkfSlgO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocGF0aCkge1xuICAgICAgICBnLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZztcbiAgfVxuXG4gIF9maWxsU2tldGNoKGRvYywgZHJhd2luZywgbykge1xuICAgIGxldCBmd2VpZ2h0ID0gby5maWxsV2VpZ2h0O1xuICAgIGlmIChmd2VpZ2h0IDwgMCkge1xuICAgICAgZndlaWdodCA9IG8uc3Ryb2tlV2lkdGggLyAyO1xuICAgIH1cbiAgICBsZXQgcGF0aCA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuX29wc1RvUGF0aChkcmF3aW5nKSk7XG4gICAgcGF0aC5zdHlsZS5zdHJva2UgPSBvLmZpbGw7XG4gICAgcGF0aC5zdHlsZS5zdHJva2VXaWR0aCA9IGZ3ZWlnaHQ7XG4gICAgcGF0aC5zdHlsZS5maWxsID0gJ25vbmUnO1xuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgX29wc1RvUGF0aChkcmF3aW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuLm9wc1RvUGF0aChkcmF3aW5nKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm91Z2hTVkdBc3luYyBleHRlbmRzIFJvdWdoU1ZHIHtcbiAgX2luaXQoY29uZmlnKSB7XG4gICAgdGhpcy5nZW4gPSBuZXcgUm91Z2hHZW5lcmF0b3JBc3luYyhjb25maWcsIHRoaXMuc3ZnKTtcbiAgfVxuXG4gIGFzeW5jIGxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyByZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ucmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBlbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGFzeW5jIGNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uY2lyY2xlKHgsIHksIGRpYW1ldGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgYXN5bmMgbGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgYXN5bmMgcG9seWdvbihwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLnBvbHlnb24ocG9pbnRzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgYXN5bmMgYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgYXN5bmMgY3VydmUocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5jdXJ2ZShwb2ludHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBwYXRoKGQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZHJhd2luZyA9IGF3YWl0IHRoaXMuZ2VuLnBhdGgoZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkcmF3aW5nKTtcbiAgfVxufSIsImltcG9ydCB7IFJvdWdoQ2FudmFzLCBSb3VnaENhbnZhc0FzeW5jIH0gZnJvbSAnLi9jYW52YXMuanMnO1xuaW1wb3J0IHsgUm91Z2hTVkcsIFJvdWdoU1ZHQXN5bmMgfSBmcm9tICcuL3N2Zy5qcyc7XG5pbXBvcnQgeyBSb3VnaEdlbmVyYXRvciwgUm91Z2hHZW5lcmF0b3JBc3luYyB9IGZyb20gJy4vZ2VuZXJhdG9yLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNhbnZhcyhjYW52YXMsIGNvbmZpZykge1xuICAgIGlmIChjb25maWcgJiYgY29uZmlnLmFzeW5jKSB7XG4gICAgICByZXR1cm4gbmV3IFJvdWdoQ2FudmFzQXN5bmMoY2FudmFzLCBjb25maWcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvdWdoQ2FudmFzKGNhbnZhcywgY29uZmlnKTtcbiAgfSxcbiAgc3ZnKHN2ZywgY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYXN5bmMpIHtcbiAgICAgIHJldHVybiBuZXcgUm91Z2hTVkdBc3luYyhzdmcsIGNvbmZpZyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm91Z2hTVkcoc3ZnLCBjb25maWcpO1xuICB9LFxuICBjcmVhdGVSZW5kZXJlcigpIHtcbiAgICByZXR1cm4gUm91Z2hDYW52YXMuY3JlYXRlUmVuZGVyZXIoKTtcbiAgfSxcbiAgZ2VuZXJhdG9yKGNvbmZpZywgc2l6ZSkge1xuICAgIGlmIChjb25maWcgJiYgY29uZmlnLmFzeW5jKSB7XG4gICAgICByZXR1cm4gbmV3IFJvdWdoR2VuZXJhdG9yQXN5bmMoY29uZmlnLCBzaXplKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSb3VnaEdlbmVyYXRvcihjb25maWcsIHNpemUpO1xuICB9XG59OyJdLCJuYW1lcyI6WyJSb3VnaFNlZ21lbnRSZWxhdGlvbiIsIlJvdWdoU2VnbWVudCIsInB4MSIsInB5MSIsInB4MiIsInB5MiIsIlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QiLCJ4aSIsIk51bWJlciIsIk1BWF9WQUxVRSIsInlpIiwiYSIsImIiLCJjIiwiX3VuZGVmaW5lZCIsIm90aGVyU2VnbWVudCIsImlzVW5kZWZpbmVkIiwiVU5ERUZJTkVEIiwiZ3JhZDEiLCJncmFkMiIsImludDEiLCJpbnQyIiwiTWF0aCIsImFicyIsIlNFUEFSQVRFIiwibWluIiwibWF4IiwiSU5URVJTRUNUUyIsIl9nZXRMZW5ndGgiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJzcXJ0IiwiUm91Z2hIYWNodXJlSXRlcmF0b3IiLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwicmlnaHQiLCJnYXAiLCJzaW5BbmdsZSIsImNvc0FuZ2xlIiwidGFuQW5nbGUiLCJwb3MiLCJkZWx0YVgiLCJoR2FwIiwic0xlZnQiLCJzUmlnaHQiLCJsaW5lIiwieExvd2VyIiwieFVwcGVyIiwieUxvd2VyIiwieVVwcGVyIiwicyIsImNvbXBhcmUiLCJQYXRoVG9rZW4iLCJ0eXBlIiwidGV4dCIsIlBhcnNlZFBhdGgiLCJkIiwiUEFSQU1TIiwiQ09NTUFORCIsIk5VTUJFUiIsIkVPRCIsInNlZ21lbnRzIiwicGFyc2VEYXRhIiwicHJvY2Vzc1BvaW50cyIsImZpcnN0IiwicHJldiIsImN1cnJlbnRQb2ludCIsImkiLCJsZW5ndGgiLCJrZXkiLCJwb2ludCIsImRhdGEiLCJ0b2tlbnMiLCJ0b2tlbml6ZSIsImluZGV4IiwidG9rZW4iLCJtb2RlIiwiQXJyYXkiLCJpc1R5cGUiLCJwYXJhbV9sZW5ndGgiLCJwYXJhbXMiLCJudW1iZXIiLCJlcnJvciIsInNlZ21lbnQiLCJwdXNoIiwibWF0Y2giLCJzdWJzdHIiLCJSZWdFeHAiLCIkMSIsInBhcnNlRmxvYXQiLCJfY2xvc2VkIiwidG9Mb3dlckNhc2UiLCJSb3VnaFBhdGgiLCJwYXJzZWQiLCJfcG9zaXRpb24iLCJiZXppZXJSZWZsZWN0aW9uUG9pbnQiLCJxdWFkUmVmbGVjdGlvblBvaW50IiwiX2ZpcnN0IiwieCIsInkiLCJjbG9zZWQiLCJfbGluZWFyUG9pbnRzIiwibHAiLCJwb2ludHMiLCJ2IiwiUm91Z2hBcmNDb252ZXJ0ZXIiLCJmcm9tIiwidG8iLCJyYWRpaSIsImFuZ2xlIiwibGFyZ2VBcmNGbGFnIiwic3dlZXBGbGFnIiwicmFkUGVyRGVnIiwiUEkiLCJfc2VnSW5kZXgiLCJfbnVtU2VncyIsIl9yeCIsIl9yeSIsIl9zaW5QaGkiLCJzaW4iLCJfY29zUGhpIiwiY29zIiwieDFkYXNoIiwieTFkYXNoIiwicm9vdCIsIm51bWVyYXRvciIsImN4ZGFzaCIsImN5ZGFzaCIsIl9DIiwiX3RoZXRhIiwiY2FsY3VsYXRlVmVjdG9yQW5nbGUiLCJkdGhldGEiLCJjZWlsIiwiX2RlbHRhIiwiX1QiLCJfZnJvbSIsImNwMSIsImNwMiIsImNvc1RoZXRhMSIsInNpblRoZXRhMSIsInRoZXRhMiIsImNvc1RoZXRhMiIsInNpblRoZXRhMiIsInV4IiwidXkiLCJ2eCIsInZ5IiwidGEiLCJhdGFuMiIsInRiIiwiUGF0aEZpdHRlciIsInNldHMiLCJzaW1wbGlmaWNhdGlvbiIsIm91dFNldHMiLCJzZXQiLCJlc3RMZW5ndGgiLCJmbG9vciIsInJlZHVjZSIsInAxIiwicDIiLCJwb3ciLCJjb3VudCIsInNsaWNlIiwibWluQXJlYSIsIm1pbkluZGV4IiwiZGlzdGFuY2UiLCJhcmVhIiwiYXJlYXMiLCJzcGxpY2UiLCJSb3VnaFJlbmRlcmVyIiwibyIsIm9wcyIsIl9kb3VibGVMaW5lIiwiY2xvc2UiLCJsZW4iLCJjb25jYXQiLCJsaW5lYXJQYXRoIiwid2lkdGgiLCJoZWlnaHQiLCJwb2x5Z29uIiwibzEiLCJfY3VydmVXaXRoT2Zmc2V0Iiwicm91Z2huZXNzIiwibzIiLCJpbmNyZW1lbnQiLCJjdXJ2ZVN0ZXBDb3VudCIsInJ4IiwicnkiLCJfZ2V0T2Zmc2V0IiwiX2VsbGlwc2UiLCJzdGFydCIsInN0b3AiLCJyb3VnaENsb3N1cmUiLCJjeCIsImN5Iiwic3RydCIsInN0cCIsImVsbGlwc2VJbmMiLCJhcmNJbmMiLCJfYXJjIiwib3AiLCJ4YyIsInljIiwiaGFjaHVyZUZpbGxTaGFwZSIsInhDb29yZHMiLCJ5Q29vcmRzIiwib2Zmc2V0IiwibWF4UmFuZG9tbmVzc09mZnNldCIsImhhY2h1cmVBbmdsZSIsImhhY2h1cmVHYXAiLCJzdHJva2VXaWR0aCIsInRhbiIsIml0IiwicmVjdENvb3JkcyIsImdldE5leHRMaW5lIiwibGluZXMiLCJfZ2V0SW50ZXJzZWN0aW5nTGluZXMiLCJmd2VpZ2h0IiwiZmlsbFdlaWdodCIsImFzcGVjdFJhdGlvIiwiaHlwIiwic2luQW5nbGVQcmltZSIsImNvc0FuZ2xlUHJpbWUiLCJnYXBQcmltZSIsImhhbGZMZW4iLCJ4UG9zIiwiX2FmZmluZSIsInBhdGgiLCJyZXBsYWNlIiwicCIsImZpdHRlciIsImxpbmVhclBvaW50cyIsImZpdCIsIm9wTGlzdCIsIl9wcm9jZXNzU2VnbWVudCIsInJvcyIsImYiLCJzZXRQb3NpdGlvbiIsInNlZyIsInByZXZTZWciLCJkZWx0YSIsInJvIiwib2IiLCJfYmV6aWVyVG8iLCJwcmV2S2V5IiwicmVmIiwib2Zmc2V0MSIsIm9mZnNldDIiLCJhcmNDb252ZXJ0ZXIiLCJnZXROZXh0U2VnbWVudCIsInJhbmRvbSIsIlIiLCJBIiwiQiIsIkMiLCJEIiwiRSIsIkYiLCJfbGluZSIsIm1vdmUiLCJvdmVybGF5IiwibGVuZ3RoU3EiLCJoYWxmT2Zmc2V0IiwiZGl2ZXJnZVBvaW50IiwibWlkRGlzcFgiLCJib3dpbmciLCJtaWREaXNwWSIsImNsb3NlUG9pbnQiLCJjdXJ2ZVRpZ2h0bmVzcyIsImNhY2hlZFZlcnRBcnJheSIsIm92ZXJsYXAiLCJyYWRPZmZzZXQiLCJfY3VydmUiLCJwcyIsImxpbmVDb29yZHMiLCJpbnRlcnNlY3Rpb25zIiwiczEiLCJzMiIsInNlbGYiLCJfcm91Z2hTY3JpcHQiLCJkb2N1bWVudCIsImN1cnJlbnRTY3JpcHQiLCJzcmMiLCJSb3VnaEdlbmVyYXRvciIsImNvbmZpZyIsImNhbnZhcyIsImRlZmF1bHRPcHRpb25zIiwib3B0aW9ucyIsIl9vcHRpb25zIiwic2hhcGUiLCJfZHJhd2FibGUiLCJsaWIiLCJwYXRocyIsImZpbGwiLCJmaWxsU3R5bGUiLCJzb2xpZEZpbGxTaGFwZSIsInJlY3RhbmdsZSIsImVsbGlwc2UiLCJoYWNodXJlRmlsbEVsbGlwc2UiLCJkaWFtZXRlciIsInJldCIsImFyYyIsImhhY2h1cmVGaWxsQXJjIiwiY3VydmUiLCJzaXplIiwiX2NvbXB1dGVQYXRoU2l6ZSIsInN2Z1BhdGgiLCJkcmF3YWJsZSIsImRyYXdpbmciLCJvcHNUb1BhdGgiLCJzdHJva2UiLCJfZmlsbFNrZXRjaCIsInBhdHRlcm4iLCJyb3VuZCIsIml0ZW0iLCJ0cmltIiwibnMiLCJzdmciLCJjcmVhdGVFbGVtZW50TlMiLCJzZXRBdHRyaWJ1dGUiLCJwYXRoTm9kZSIsImFwcGVuZENoaWxkIiwiYm9keSIsImJiIiwiZ2V0QkJveCIsInJlbW92ZUNoaWxkIiwiZXJyIiwiY2FudmFzU2l6ZSIsIl9jYW52YXNTaXplIiwidmFsIiwidyIsImJhc2VWYWwiLCJ2YWx1ZSIsIl9yZW5kZXJlciIsIndvcmtseSIsImFzeW5jIiwibm9Xb3JrZXIiLCJ0b3MiLCJGdW5jdGlvbiIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwid29ya2x5U291cmNlIiwid29ya2x5VVJMIiwicmVuZGVyZXJTb3VyY2UiLCJyb3VnaFVSTCIsImNvZGUiLCJvdXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiQmxvYiIsInByb3h5IiwiUm91Z2hHZW5lcmF0b3JBc3luYyIsIlJvdWdoQ2FudmFzIiwiY3R4IiwiZ2V0Q29udGV4dCIsIl9pbml0IiwiZ2VuIiwiZHJhdyIsImNpcmNsZSIsInNhdmUiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIl9kcmF3VG9Db250ZXh0IiwicmVzdG9yZSIsInAyZCIsIlBhdGgyRCIsImhjYW52YXMiLCJjcmVhdGVFbGVtZW50IiwiaGNvbnRleHQiLCJiYm94IiwiX2NvbXB1dGVCQm94IiwidHJhbnNsYXRlIiwiY3JlYXRlUGF0dGVybiIsImJlZ2luUGF0aCIsIm1vdmVUbyIsImJlemllckN1cnZlVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwibGluZVRvIiwiUm91Z2hDYW52YXNBc3luYyIsIlJvdWdoU1ZHIiwiZG9jIiwib3duZXJEb2N1bWVudCIsImciLCJfb3BzVG9QYXRoIiwic3R5bGUiLCJpZCIsInBhdHRlcm5QYXRoIiwiZGVmcyIsIl9kZWZzIiwiZG5vZGUiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiUm91Z2hTVkdBc3luYyIsImNyZWF0ZVJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBU0Esb0JBQVQsR0FBZ0M7U0FDOUI7VUFDQyxDQUREO1dBRUUsQ0FGRjtnQkFHTyxDQUhQO1dBSUUsQ0FKRjtZQUtHLENBTEg7Y0FNSyxDQU5MO2VBT007R0FQYjs7O0FBV0YsSUFBYUMsWUFBYjt3QkFDY0MsR0FBWixFQUFpQkMsR0FBakIsRUFBc0JDLEdBQXRCLEVBQTJCQyxHQUEzQixFQUFnQzs7O1NBQ3pCQyx5QkFBTCxHQUFpQ04sc0JBQWpDO1NBQ0tFLEdBQUwsR0FBV0EsR0FBWDtTQUNLQyxHQUFMLEdBQVdBLEdBQVg7U0FDS0MsR0FBTCxHQUFXQSxHQUFYO1NBQ0tDLEdBQUwsR0FBV0EsR0FBWDtTQUNLRSxFQUFMLEdBQVVDLE9BQU9DLFNBQWpCO1NBQ0tDLEVBQUwsR0FBVUYsT0FBT0MsU0FBakI7U0FDS0UsQ0FBTCxHQUFTTixNQUFN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
