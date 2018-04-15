var rough = (function (_classCallCheck,_createClass,_getIterator,_regeneratorRuntime,_asyncToGenerator,_Object$getPrototypeOf,_possibleConstructorReturn,_inherits,_typeof,_Object$assign,_Number$MAX_SAFE_INTEGER) {
'use strict';

_classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
_createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
_getIterator = _getIterator && _getIterator.hasOwnProperty('default') ? _getIterator['default'] : _getIterator;
_regeneratorRuntime = _regeneratorRuntime && _regeneratorRuntime.hasOwnProperty('default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;
_asyncToGenerator = _asyncToGenerator && _asyncToGenerator.hasOwnProperty('default') ? _asyncToGenerator['default'] : _asyncToGenerator;
_Object$getPrototypeOf = _Object$getPrototypeOf && _Object$getPrototypeOf.hasOwnProperty('default') ? _Object$getPrototypeOf['default'] : _Object$getPrototypeOf;
_possibleConstructorReturn = _possibleConstructorReturn && _possibleConstructorReturn.hasOwnProperty('default') ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
_inherits = _inherits && _inherits.hasOwnProperty('default') ? _inherits['default'] : _inherits;
_typeof = _typeof && _typeof.hasOwnProperty('default') ? _typeof['default'] : _typeof;
_Object$assign = _Object$assign && _Object$assign.hasOwnProperty('default') ? _Object$assign['default'] : _Object$assign;
_Number$MAX_SAFE_INTEGER = _Number$MAX_SAFE_INTEGER && _Number$MAX_SAFE_INTEGER.hasOwnProperty('default') ? _Number$MAX_SAFE_INTEGER['default'] : _Number$MAX_SAFE_INTEGER;

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
    key: 'line',
    value: function line(x1, y1, x2, y2, o) {
      var ops = this._doubleLine(x1, y1, x2, y2, o);
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'linearPath',
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
        return { type: 'path', ops: ops };
      } else if (len === 2) {
        return this.line(points[0][0], points[0][1], points[1][0], points[1][1], o);
      }
    }
  }, {
    key: 'polygon',
    value: function polygon(points, o) {
      return this.linearPath(points, true, o);
    }
  }, {
    key: 'rectangle',
    value: function rectangle(x, y, width, height, o) {
      var points = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
      return this.polygon(points, o);
    }
  }, {
    key: 'curve',
    value: function curve(points, o) {
      var o1 = this._curveWithOffset(points, 1 * (1 + o.roughness * 0.2), o);
      var o2 = this._curveWithOffset(points, 1.5 * (1 + o.roughness * 0.22), o);
      return { type: 'path', ops: o1.concat(o2) };
    }
  }, {
    key: 'ellipse',
    value: function ellipse(x, y, width, height, o) {
      var increment = Math.PI * 2 / o.curveStepCount;
      var rx = Math.abs(width / 2);
      var ry = Math.abs(height / 2);
      rx += this._getOffset(-rx * 0.05, rx * 0.05, o);
      ry += this._getOffset(-ry * 0.05, ry * 0.05, o);
      var o1 = this._ellipse(increment, x, y, rx, ry, 1, increment * this._getOffset(0.1, this._getOffset(0.4, 1, o), o), o);
      var o2 = this._ellipse(increment, x, y, rx, ry, 1.5, 0, o);
      return { type: 'path', ops: o1.concat(o2) };
    }
  }, {
    key: 'arc',
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
          ops.push({ op: 'lineTo', data: [cx, cy] });
          ops.push({ op: 'lineTo', data: [cx + rx * Math.cos(strt), cy + ry * Math.sin(strt)] });
        }
      }
      return { type: 'path', ops: ops };
    }
  }, {
    key: 'hachureFillArc',
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
    key: 'solidFillShape',
    value: function solidFillShape(xCoords, yCoords, o) {
      var ops = [];
      if (xCoords && yCoords && xCoords.length && yCoords.length && xCoords.length === yCoords.length) {
        var offset = o.maxRandomnessOffset || 0;
        var len = xCoords.length;
        if (len > 2) {
          ops.push({ op: 'move', data: [xCoords[0] + this._getOffset(-offset, offset, o), yCoords[0] + this._getOffset(-offset, offset, o)] });
          for (var i = 1; i < len; i++) {
            ops.push({ op: 'lineTo', data: [xCoords[i] + this._getOffset(-offset, offset, o), yCoords[i] + this._getOffset(-offset, offset, o)] });
          }
        }
      }
      return { type: 'fillPath', ops: ops };
    }
  }, {
    key: 'hachureFillShape',
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
      return { type: 'fillSketch', ops: ops };
    }
  }, {
    key: 'hachureFillEllipse',
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
      return { type: 'fillSketch', ops: ops };
    }
  }, {
    key: 'svgPath',
    value: function svgPath(path, o) {
      path = (path || '').replace(/\n/g, " ").replace(/(-)/g, " -").replace(/(-\s)/g, "-").replace("/(\s\s)/g", " ");
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
      return { type: 'path', ops: ops };
    }

    // privates

  }, {
    key: '_bezierTo',
    value: function _bezierTo(x1, y1, x2, y2, x, y, path, o) {
      var ops = [];
      var ros = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + 0.5];
      var f = null;
      for (var i = 0; i < 2; i++) {
        if (i === 0) {
          ops.push({ op: 'move', data: [path.x, path.y] });
        } else {
          ops.push({ op: 'move', data: [path.x + this._getOffset(-ros[0], ros[0], o), path.y + this._getOffset(-ros[0], ros[0], o)] });
        }
        f = [x + this._getOffset(-ros[i], ros[i], o), y + this._getOffset(-ros[i], ros[i], o)];
        ops.push({
          op: 'bcurveTo', data: [x1 + this._getOffset(-ros[i], ros[i], o), y1 + this._getOffset(-ros[i], ros[i], o), x2 + this._getOffset(-ros[i], ros[i], o), y2 + this._getOffset(-ros[i], ros[i], o), f[0], f[1]]
        });
      }
      path.setPosition(f[0], f[1]);
      return ops;
    }
  }, {
    key: '_processSegment',
    value: function _processSegment(path, seg, prevSeg, o) {
      var ops = [];
      switch (seg.key) {
        case 'M':
        case 'm':
          {
            var delta = seg.key === 'm';
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
              ops.push({ op: 'move', data: [x, y] });
            }
            break;
          }
        case 'L':
        case 'l':
          {
            var _delta = seg.key === 'l';
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
        case 'H':
        case 'h':
          {
            var _delta2 = seg.key === 'h';
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
        case 'V':
        case 'v':
          {
            var _delta3 = seg.key === 'v';
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
        case 'Z':
        case 'z':
          {
            if (path.first) {
              ops = ops.concat(this._doubleLine(path.x, path.y, path.first[0], path.first[1], o));
              path.setPosition(path.first[0], path.first[1]);
              path.first = null;
            }
            break;
          }
        case 'C':
        case 'c':
          {
            var _delta4 = seg.key === 'c';
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
        case 'S':
        case 's':
          {
            var _delta5 = seg.key === 's';
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
              if (prevKey == 'c' || prevKey == 'C' || prevKey == 's' || prevKey == 'S') {
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
        case 'Q':
        case 'q':
          {
            var _delta6 = seg.key === 'q';
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
              ops.push({ op: 'move', data: [path.x + this._getOffset(-offset1, offset1, o), path.y + this._getOffset(-offset1, offset1, o)] });
              var f = [_x8 + this._getOffset(-offset1, offset1, o), _y8 + this._getOffset(-offset1, offset1, o)];
              ops.push({
                op: 'qcurveTo', data: [_x7 + this._getOffset(-offset1, offset1, o), _y7 + this._getOffset(-offset1, offset1, o), f[0], f[1]]
              });
              ops.push({ op: 'move', data: [path.x + this._getOffset(-offset2, offset2, o), path.y + this._getOffset(-offset2, offset2, o)] });
              f = [_x8 + this._getOffset(-offset2, offset2, o), _y8 + this._getOffset(-offset2, offset2, o)];
              ops.push({
                op: 'qcurveTo', data: [_x7 + this._getOffset(-offset2, offset2, o), _y7 + this._getOffset(-offset2, offset2, o), f[0], f[1]]
              });
              path.setPosition(f[0], f[1]);
              path.quadReflectionPoint = [_x8 + (_x8 - _x7), _y8 + (_y8 - _y7)];
            }
            break;
          }
        case 'T':
        case 't':
          {
            var _delta7 = seg.key === 't';
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
              if (_prevKey == 'q' || _prevKey == 'Q' || _prevKey == 't' || _prevKey == 'T') {
                ref = path.quadReflectionPoint;
              }
              if (ref) {
                _x10 = ref[0];
                _y10 = ref[1];
              }
              var _offset = 1 * (1 + o.roughness * 0.2);
              var _offset2 = 1.5 * (1 + o.roughness * 0.22);
              ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset, _offset, o), path.y + this._getOffset(-_offset, _offset, o)] });
              var _f = [_x9 + this._getOffset(-_offset, _offset, o), _y9 + this._getOffset(-_offset, _offset, o)];
              ops.push({
                op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset, _offset, o), _y10 + this._getOffset(-_offset, _offset, o), _f[0], _f[1]]
              });
              ops.push({ op: 'move', data: [path.x + this._getOffset(-_offset2, _offset2, o), path.y + this._getOffset(-_offset2, _offset2, o)] });
              _f = [_x9 + this._getOffset(-_offset2, _offset2, o), _y9 + this._getOffset(-_offset2, _offset2, o)];
              ops.push({
                op: 'qcurveTo', data: [_x10 + this._getOffset(-_offset2, _offset2, o), _y10 + this._getOffset(-_offset2, _offset2, o), _f[0], _f[1]]
              });
              path.setPosition(_f[0], _f[1]);
              path.quadReflectionPoint = [_x9 + (_x9 - _x10), _y9 + (_y9 - _y10)];
            }
            break;
          }
        case 'A':
        case 'a':
          {
            var _delta8 = seg.key === 'a';
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
    key: '_getOffset',
    value: function _getOffset(min, max, ops) {
      return ops.roughness * (Math.random() * (max - min) + min);
    }
  }, {
    key: '_affine',
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
    key: '_doubleLine',
    value: function _doubleLine(x1, y1, x2, y2, o) {
      var o1 = this._line(x1, y1, x2, y2, o, true, false);
      var o2 = this._line(x1, y1, x2, y2, o, true, true);
      return o1.concat(o2);
    }
  }, {
    key: '_line',
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
            op: 'move', data: [x1 + this._getOffset(-halfOffset, halfOffset, o), y1 + this._getOffset(-halfOffset, halfOffset, o)]
          });
        } else {
          ops.push({
            op: 'move', data: [x1 + this._getOffset(-offset, offset, o), y1 + this._getOffset(-offset, offset, o)]
          });
        }
      }
      if (overlay) {
        ops.push({
          op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-halfOffset, halfOffset, o), x2 + this._getOffset(-halfOffset, halfOffset, o), y2 + this._getOffset(-halfOffset, halfOffset, o)]
        });
      } else {
        ops.push({
          op: 'bcurveTo', data: [midDispX + x1 + (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), midDispX + x1 + 2 * (x2 - x1) * divergePoint + this._getOffset(-offset, offset, o), midDispY + y1 + 2 * (y2 - y1) * divergePoint + this._getOffset(-offset, offset, o), x2 + this._getOffset(-offset, offset, o), y2 + this._getOffset(-offset, offset, o)]
        });
      }
      return ops;
    }
  }, {
    key: '_curve',
    value: function _curve(points, closePoint, o) {
      var len = points.length;
      var ops = [];
      if (len > 3) {
        var b = [];
        var s = 1 - o.curveTightness;
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        for (var i = 1; i + 2 < len; i++) {
          var cachedVertArray = points[i];
          b[0] = [cachedVertArray[0], cachedVertArray[1]];
          b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
          b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
          b[3] = [points[i + 1][0], points[i + 1][1]];
          ops.push({ op: 'bcurveTo', data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
        }
        if (closePoint && closePoint.length === 2) {
          var ro = o.maxRandomnessOffset;
          // TODO: more roughness here?
          ops.push({ ops: 'lineTo', data: [closePoint[0] + this._getOffset(-ro, ro, o), closePoint[1] + +this._getOffset(-ro, ro, o)] });
        }
      } else if (len === 3) {
        ops.push({ op: 'move', data: [points[1][0], points[1][1]] });
        ops.push({
          op: 'bcurveTo', data: [points[1][0], points[1][1], points[2][0], points[2][1], points[2][0], points[2][1]]
        });
      } else if (len === 2) {
        ops = ops.concat(this._doubleLine(points[0][0], points[0][1], points[1][0], points[1][1], o));
      }
      return ops;
    }
  }, {
    key: '_ellipse',
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
    key: '_curveWithOffset',
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
    key: '_arc',
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
    key: '_getIntersectingLines',
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

return index;

}(_classCallCheck,_createClass,_getIterator,_regeneratorRuntime,_asyncToGenerator,_Object$getPrototypeOf,_possibleConstructorReturn,_inherits,_typeof,_Object$assign,_Number$MAX_SAFE_INTEGER));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91Z2guanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWdtZW50LmpzIiwiLi4vc3JjL2hhY2h1cmUuanMiLCIuLi9zcmMvcGF0aC5qcyIsIi4uL3NyYy9yZW5kZXJlci5qcyIsIi4uL3NyYy9nZW5lcmF0b3IuanMiLCIuLi9zcmMvY2FudmFzLmpzIiwiLi4vc3JjL3N2Zy5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gUm91Z2hTZWdtZW50UmVsYXRpb24oKSB7XG4gIHJldHVybiB7XG4gICAgTEVGVDogMCxcbiAgICBSSUdIVDogMSxcbiAgICBJTlRFUlNFQ1RTOiAyLFxuICAgIEFIRUFEOiAzLFxuICAgIEJFSElORDogNCxcbiAgICBTRVBBUkFURTogNSxcbiAgICBVTkRFRklORUQ6IDZcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoU2VnbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB4MSwgcHkxLCBweDIsIHB5Mikge1xuICAgIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdCA9IFJvdWdoU2VnbWVudFJlbGF0aW9uKCk7XG4gICAgdGhpcy5weDEgPSBweDE7XG4gICAgdGhpcy5weTEgPSBweTE7XG4gICAgdGhpcy5weDIgPSBweDI7XG4gICAgdGhpcy5weTIgPSBweTI7XG4gICAgdGhpcy54aSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy55aSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5hID0gcHkyIC0gcHkxO1xuICAgIHRoaXMuYiA9IHB4MSAtIHB4MjtcbiAgICB0aGlzLmMgPSBweDIgKiBweTEgLSBweDEgKiBweTI7XG4gICAgdGhpcy5fdW5kZWZpbmVkID0gKCh0aGlzLmEgPT0gMCkgJiYgKHRoaXMuYiA9PSAwKSAmJiAodGhpcy5jID09IDApKTtcbiAgfVxuXG4gIGlzVW5kZWZpbmVkKCkge1xuICAgIHJldHVybiB0aGlzLl91bmRlZmluZWQ7XG4gIH1cblxuICBjb21wYXJlKG90aGVyU2VnbWVudCkge1xuICAgIGlmICh0aGlzLmlzVW5kZWZpbmVkKCkgfHwgb3RoZXJTZWdtZW50LmlzVW5kZWZpbmVkKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuVU5ERUZJTkVEO1xuICAgIH1cbiAgICB2YXIgZ3JhZDEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIHZhciBncmFkMiA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdmFyIGludDEgPSAwLCBpbnQyID0gMDtcbiAgICB2YXIgYSA9IHRoaXMuYSwgYiA9IHRoaXMuYiwgYyA9IHRoaXMuYztcblxuICAgIGlmIChNYXRoLmFicyhiKSA+IDAuMDAwMDEpIHtcbiAgICAgIGdyYWQxID0gLWEgLyBiO1xuICAgICAgaW50MSA9IC1jIC8gYjtcbiAgICB9XG4gICAgaWYgKE1hdGguYWJzKG90aGVyU2VnbWVudC5iKSA+IDAuMDAwMDEpIHtcbiAgICAgIGdyYWQyID0gLW90aGVyU2VnbWVudC5hIC8gb3RoZXJTZWdtZW50LmI7XG4gICAgICBpbnQyID0gLW90aGVyU2VnbWVudC5jIC8gb3RoZXJTZWdtZW50LmI7XG4gICAgfVxuXG4gICAgaWYgKGdyYWQxID09IE51bWJlci5NQVhfVkFMVUUpIHtcbiAgICAgIGlmIChncmFkMiA9PSBOdW1iZXIuTUFYX1ZBTFVFKSB7XG4gICAgICAgIGlmICgoLWMgLyBhKSAhPSAoLW90aGVyU2VnbWVudC5jIC8gb3RoZXJTZWdtZW50LmEpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHRoaXMucHkxID49IE1hdGgubWluKG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSAmJiAodGhpcy5weTEgPD0gTWF0aC5tYXgob3RoZXJTZWdtZW50LnB5MSwgb3RoZXJTZWdtZW50LnB5MikpKSB7XG4gICAgICAgICAgdGhpcy54aSA9IHRoaXMucHgxO1xuICAgICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LklOVEVSU0VDVFM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh0aGlzLnB5MiA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHkxLCBvdGhlclNlZ21lbnQucHkyKSkgJiYgKHRoaXMucHkyIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSkge1xuICAgICAgICAgIHRoaXMueGkgPSB0aGlzLnB4MjtcbiAgICAgICAgICB0aGlzLnlpID0gdGhpcy5weTI7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuU0VQQVJBVEU7XG4gICAgICB9XG4gICAgICB0aGlzLnhpID0gdGhpcy5weDE7XG4gICAgICB0aGlzLnlpID0gKGdyYWQyICogdGhpcy54aSArIGludDIpO1xuICAgICAgaWYgKCgodGhpcy5weTEgLSB0aGlzLnlpKSAqICh0aGlzLnlpIC0gdGhpcy5weTIpIDwgLTAuMDAwMDEpIHx8ICgob3RoZXJTZWdtZW50LnB5MSAtIHRoaXMueWkpICogKHRoaXMueWkgLSBvdGhlclNlZ21lbnQucHkyKSA8IC0wLjAwMDAxKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgfVxuICAgICAgaWYgKE1hdGguYWJzKG90aGVyU2VnbWVudC5hKSA8IDAuMDAwMDEpIHtcbiAgICAgICAgaWYgKChvdGhlclNlZ21lbnQucHgxIC0gdGhpcy54aSkgKiAodGhpcy54aSAtIG90aGVyU2VnbWVudC5weDIpIDwgLTAuMDAwMDEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuSU5URVJTRUNUUztcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuSU5URVJTRUNUUztcbiAgICB9XG5cbiAgICBpZiAoZ3JhZDIgPT0gTnVtYmVyLk1BWF9WQUxVRSkge1xuICAgICAgdGhpcy54aSA9IG90aGVyU2VnbWVudC5weDE7XG4gICAgICB0aGlzLnlpID0gZ3JhZDEgKiB0aGlzLnhpICsgaW50MTtcbiAgICAgIGlmICgoKG90aGVyU2VnbWVudC5weTEgLSB0aGlzLnlpKSAqICh0aGlzLnlpIC0gb3RoZXJTZWdtZW50LnB5MikgPCAtMC4wMDAwMSkgfHwgKCh0aGlzLnB5MSAtIHRoaXMueWkpICogKHRoaXMueWkgLSB0aGlzLnB5MikgPCAtMC4wMDAwMSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyhhKSA8IDAuMDAwMDEpIHtcbiAgICAgICAgaWYgKCh0aGlzLnB4MSAtIHRoaXMueGkpICogKHRoaXMueGkgLSB0aGlzLnB4MikgPCAtMC4wMDAwMSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLlJvdWdoU2VnbWVudFJlbGF0aW9uQ29uc3QuU0VQQVJBVEU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgIH1cblxuICAgIGlmIChncmFkMSA9PSBncmFkMikge1xuICAgICAgaWYgKGludDEgIT0gaW50Mikge1xuICAgICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgICAgfVxuICAgICAgaWYgKCh0aGlzLnB4MSA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHgxLCBvdGhlclNlZ21lbnQucHgyKSkgJiYgKHRoaXMucHgxIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weTEsIG90aGVyU2VnbWVudC5weTIpKSkge1xuICAgICAgICB0aGlzLnhpID0gdGhpcy5weDE7XG4gICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MTtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgaWYgKCh0aGlzLnB4MiA+PSBNYXRoLm1pbihvdGhlclNlZ21lbnQucHgxLCBvdGhlclNlZ21lbnQucHgyKSkgJiYgKHRoaXMucHgyIDw9IE1hdGgubWF4KG90aGVyU2VnbWVudC5weDEsIG90aGVyU2VnbWVudC5weDIpKSkge1xuICAgICAgICB0aGlzLnhpID0gdGhpcy5weDI7XG4gICAgICAgIHRoaXMueWkgPSB0aGlzLnB5MjtcbiAgICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5JTlRFUlNFQ1RTO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdC5TRVBBUkFURTtcbiAgICB9XG5cbiAgICB0aGlzLnhpID0gKChpbnQyIC0gaW50MSkgLyAoZ3JhZDEgLSBncmFkMikpO1xuICAgIHRoaXMueWkgPSAoZ3JhZDEgKiB0aGlzLnhpICsgaW50MSk7XG5cbiAgICBpZiAoKCh0aGlzLnB4MSAtIHRoaXMueGkpICogKHRoaXMueGkgLSB0aGlzLnB4MikgPCAtMC4wMDAwMSkgfHwgKChvdGhlclNlZ21lbnQucHgxIC0gdGhpcy54aSkgKiAodGhpcy54aSAtIG90aGVyU2VnbWVudC5weDIpIDwgLTAuMDAwMDEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LlNFUEFSQVRFO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5Sb3VnaFNlZ21lbnRSZWxhdGlvbkNvbnN0LklOVEVSU0VDVFM7XG4gIH1cblxuICBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldExlbmd0aCh0aGlzLnB4MSwgdGhpcy5weTEsIHRoaXMucHgyLCB0aGlzLnB5Mik7XG4gIH1cblxuICBfZ2V0TGVuZ3RoKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgdmFyIGR4ID0geDIgLSB4MTtcbiAgICB2YXIgZHkgPSB5MiAtIHkxO1xuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hTZWdtZW50UmVsYXRpb24sIFJvdWdoU2VnbWVudCB9IGZyb20gXCIuL3NlZ21lbnRcIjtcblxuZXhwb3J0IGNsYXNzIFJvdWdoSGFjaHVyZUl0ZXJhdG9yIHtcbiAgY29uc3RydWN0b3IodG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0LCBnYXAsIHNpbkFuZ2xlLCBjb3NBbmdsZSwgdGFuQW5nbGUpIHtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmJvdHRvbSA9IGJvdHRvbTtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB0aGlzLmdhcCA9IGdhcDtcbiAgICB0aGlzLnNpbkFuZ2xlID0gc2luQW5nbGU7XG4gICAgdGhpcy50YW5BbmdsZSA9IHRhbkFuZ2xlO1xuXG4gICAgaWYgKE1hdGguYWJzKHNpbkFuZ2xlKSA8IDAuMDAwMSkge1xuICAgICAgdGhpcy5wb3MgPSBsZWZ0ICsgZ2FwO1xuICAgIH0gZWxzZSBpZiAoTWF0aC5hYnMoc2luQW5nbGUpID4gMC45OTk5KSB7XG4gICAgICB0aGlzLnBvcyA9IHRvcCArIGdhcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWx0YVggPSAoYm90dG9tIC0gdG9wKSAqIE1hdGguYWJzKHRhbkFuZ2xlKTtcbiAgICAgIHRoaXMucG9zID0gbGVmdCAtIE1hdGguYWJzKHRoaXMuZGVsdGFYKTtcbiAgICAgIHRoaXMuaEdhcCA9IE1hdGguYWJzKGdhcCAvIGNvc0FuZ2xlKTtcbiAgICAgIHRoaXMuc0xlZnQgPSBuZXcgUm91Z2hTZWdtZW50KGxlZnQsIGJvdHRvbSwgbGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuc1JpZ2h0ID0gbmV3IFJvdWdoU2VnbWVudChyaWdodCwgYm90dG9tLCByaWdodCwgdG9wKTtcbiAgICB9XG4gIH1cblxuICBnZXROZXh0TGluZSgpIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5BbmdsZSkgPCAwLjAwMDEpIHtcbiAgICAgIGlmICh0aGlzLnBvcyA8IHRoaXMucmlnaHQpIHtcbiAgICAgICAgbGV0IGxpbmUgPSBbdGhpcy5wb3MsIHRoaXMudG9wLCB0aGlzLnBvcywgdGhpcy5ib3R0b21dO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmdhcDtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbkFuZ2xlKSA+IDAuOTk5OSkge1xuICAgICAgaWYgKHRoaXMucG9zIDwgdGhpcy5ib3R0b20pIHtcbiAgICAgICAgbGV0IGxpbmUgPSBbdGhpcy5sZWZ0LCB0aGlzLnBvcywgdGhpcy5yaWdodCwgdGhpcy5wb3NdO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmdhcDtcbiAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB4TG93ZXIgPSB0aGlzLnBvcyAtIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgIGxldCB4VXBwZXIgPSB0aGlzLnBvcyArIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgIGxldCB5TG93ZXIgPSB0aGlzLmJvdHRvbTtcbiAgICAgIGxldCB5VXBwZXIgPSB0aGlzLnRvcDtcbiAgICAgIGlmICh0aGlzLnBvcyA8ICh0aGlzLnJpZ2h0ICsgdGhpcy5kZWx0YVgpKSB7XG4gICAgICAgIHdoaWxlICgoKHhMb3dlciA8IHRoaXMubGVmdCkgJiYgKHhVcHBlciA8IHRoaXMubGVmdCkpIHx8ICgoeExvd2VyID4gdGhpcy5yaWdodCkgJiYgKHhVcHBlciA+IHRoaXMucmlnaHQpKSkge1xuICAgICAgICAgIHRoaXMucG9zICs9IHRoaXMuaEdhcDtcbiAgICAgICAgICB4TG93ZXIgPSB0aGlzLnBvcyAtIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgICAgICB4VXBwZXIgPSB0aGlzLnBvcyArIHRoaXMuZGVsdGFYIC8gMjtcbiAgICAgICAgICBpZiAodGhpcy5wb3MgPiAodGhpcy5yaWdodCArIHRoaXMuZGVsdGFYKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBzID0gbmV3IFJvdWdoU2VnbWVudCh4TG93ZXIsIHlMb3dlciwgeFVwcGVyLCB5VXBwZXIpO1xuICAgICAgICBpZiAocy5jb21wYXJlKHRoaXMuc0xlZnQpID09IFJvdWdoU2VnbWVudFJlbGF0aW9uKCkuSU5URVJTRUNUUykge1xuICAgICAgICAgIHhMb3dlciA9IHMueGk7XG4gICAgICAgICAgeUxvd2VyID0gcy55aTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5jb21wYXJlKHRoaXMuc1JpZ2h0KSA9PSBSb3VnaFNlZ21lbnRSZWxhdGlvbigpLklOVEVSU0VDVFMpIHtcbiAgICAgICAgICB4VXBwZXIgPSBzLnhpO1xuICAgICAgICAgIHlVcHBlciA9IHMueWk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGFuQW5nbGUgPiAwKSB7XG4gICAgICAgICAgeExvd2VyID0gdGhpcy5yaWdodCAtICh4TG93ZXIgLSB0aGlzLmxlZnQpO1xuICAgICAgICAgIHhVcHBlciA9IHRoaXMucmlnaHQgLSAoeFVwcGVyIC0gdGhpcy5sZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGluZSA9IFt4TG93ZXIsIHlMb3dlciwgeFVwcGVyLCB5VXBwZXJdO1xuICAgICAgICB0aGlzLnBvcyArPSB0aGlzLmhHYXA7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSIsImNsYXNzIFBhdGhUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIHRleHQpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cbiAgaXNUeXBlKHR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSB0eXBlO1xuICB9XG59XG5cbmNsYXNzIFBhcnNlZFBhdGgge1xuICBjb25zdHJ1Y3RvcihkKSB7XG4gICAgdGhpcy5QQVJBTVMgPSB7XG4gICAgICBBOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBhOiBbXCJyeFwiLCBcInJ5XCIsIFwieC1heGlzLXJvdGF0aW9uXCIsIFwibGFyZ2UtYXJjLWZsYWdcIiwgXCJzd2VlcC1mbGFnXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBDOiBbXCJ4MVwiLCBcInkxXCIsIFwieDJcIiwgXCJ5MlwiLCBcInhcIiwgXCJ5XCJdLFxuICAgICAgYzogW1wieDFcIiwgXCJ5MVwiLCBcIngyXCIsIFwieTJcIiwgXCJ4XCIsIFwieVwiXSxcbiAgICAgIEg6IFtcInhcIl0sXG4gICAgICBoOiBbXCJ4XCJdLFxuICAgICAgTDogW1wieFwiLCBcInlcIl0sXG4gICAgICBsOiBbXCJ4XCIsIFwieVwiXSxcbiAgICAgIE06IFtcInhcIiwgXCJ5XCJdLFxuICAgICAgbTogW1wieFwiLCBcInlcIl0sXG4gICAgICBROiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBxOiBbXCJ4MVwiLCBcInkxXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBTOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBzOiBbXCJ4MlwiLCBcInkyXCIsIFwieFwiLCBcInlcIl0sXG4gICAgICBUOiBbXCJ4XCIsIFwieVwiXSxcbiAgICAgIHQ6IFtcInhcIiwgXCJ5XCJdLFxuICAgICAgVjogW1wieVwiXSxcbiAgICAgIHY6IFtcInlcIl0sXG4gICAgICBaOiBbXSxcbiAgICAgIHo6IFtdXG4gICAgfTtcbiAgICB0aGlzLkNPTU1BTkQgPSAwO1xuICAgIHRoaXMuTlVNQkVSID0gMTtcbiAgICB0aGlzLkVPRCA9IDI7XG4gICAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICAgIHRoaXMuZCA9IGQgfHwgXCJcIjtcbiAgICB0aGlzLnBhcnNlRGF0YShkKTtcbiAgICB0aGlzLnByb2Nlc3NQb2ludHMoKTtcbiAgfVxuXG4gIGxvYWRGcm9tU2VnbWVudHMoc2VnbWVudHMpIHtcbiAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgdGhpcy5wcm9jZXNzUG9pbnRzKCk7XG4gIH1cblxuICBwcm9jZXNzUG9pbnRzKCkge1xuICAgIGxldCBmaXJzdCA9IG51bGwsIHByZXYgPSBudWxsLCBjdXJyZW50UG9pbnQgPSBbMCwgMF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcyA9IHRoaXMuc2VnbWVudHNbaV07XG4gICAgICBzd2l0Y2ggKHMua2V5KSB7XG4gICAgICAgIGNhc2UgJ00nOlxuICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMF0sIHMuZGF0YVsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICBjYXNlICdsJzpcbiAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMF0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVsxXSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzBdLCBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVswXSArIGN1cnJlbnRQb2ludFswXSwgY3VycmVudFBvaW50WzFdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVic6XG4gICAgICAgICAgcy5wb2ludCA9IFtjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVswXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgIHMucG9pbnQgPSBbY3VycmVudFBvaW50WzBdLCBzLmRhdGFbMF0gKyBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd6JzpcbiAgICAgICAgY2FzZSAnWic6XG4gICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICBzLnBvaW50ID0gW2ZpcnN0WzBdLCBmaXJzdFsxXV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVs0XSwgcy5kYXRhWzVdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYyc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbNF0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVs1XSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzJdLCBzLmRhdGFbM11dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVsyXSArIGN1cnJlbnRQb2ludFswXSwgcy5kYXRhWzNdICsgY3VycmVudFBvaW50WzFdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbMl0sIHMuZGF0YVszXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3EnOlxuICAgICAgICAgIHMucG9pbnQgPSBbcy5kYXRhWzJdICsgY3VycmVudFBvaW50WzBdLCBzLmRhdGFbM10gKyBjdXJyZW50UG9pbnRbMV1dO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICBzLnBvaW50ID0gW3MuZGF0YVs1XSwgcy5kYXRhWzZdXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgcy5wb2ludCA9IFtzLmRhdGFbNV0gKyBjdXJyZW50UG9pbnRbMF0sIHMuZGF0YVs2XSArIGN1cnJlbnRQb2ludFsxXV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAocy5rZXkgPT09ICdtJyB8fCBzLmtleSA9PT0gJ00nKSB7XG4gICAgICAgIGZpcnN0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChzLnBvaW50KSB7XG4gICAgICAgIGN1cnJlbnRQb2ludCA9IHMucG9pbnQ7XG4gICAgICAgIGlmICghZmlyc3QpIHtcbiAgICAgICAgICBmaXJzdCA9IHMucG9pbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzLmtleSA9PT0gJ3onIHx8IHMua2V5ID09PSAnWicpIHtcbiAgICAgICAgZmlyc3QgPSBudWxsO1xuICAgICAgfVxuICAgICAgcHJldiA9IHM7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNsb3NlZCgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2Nsb3NlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuICAgICAgZm9yIChsZXQgcyBvZiB0aGlzLnNlZ21lbnRzKSB7XG4gICAgICAgIGlmIChzLmtleS50b0xvd2VyQ2FzZSgpID09PSAneicpIHtcbiAgICAgICAgICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jbG9zZWQ7XG4gIH1cblxuICBwYXJzZURhdGEoZCkge1xuICAgIHZhciB0b2tlbnMgPSB0aGlzLnRva2VuaXplKGQpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHRva2VuID0gdG9rZW5zW2luZGV4XTtcbiAgICB2YXIgbW9kZSA9IFwiQk9EXCI7XG4gICAgdGhpcy5zZWdtZW50cyA9IG5ldyBBcnJheSgpO1xuICAgIHdoaWxlICghdG9rZW4uaXNUeXBlKHRoaXMuRU9EKSkge1xuICAgICAgdmFyIHBhcmFtX2xlbmd0aDtcbiAgICAgIHZhciBwYXJhbXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgIGlmIChtb2RlID09IFwiQk9EXCIpIHtcbiAgICAgICAgaWYgKHRva2VuLnRleHQgPT0gXCJNXCIgfHwgdG9rZW4udGV4dCA9PSBcIm1cIikge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgcGFyYW1fbGVuZ3RoID0gdGhpcy5QQVJBTVNbdG9rZW4udGV4dF0ubGVuZ3RoO1xuICAgICAgICAgIG1vZGUgPSB0b2tlbi50ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGF0YSgnTTAsMCcgKyBkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRva2VuLmlzVHlwZSh0aGlzLk5VTUJFUikpIHtcbiAgICAgICAgICBwYXJhbV9sZW5ndGggPSB0aGlzLlBBUkFNU1ttb2RlXS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICBwYXJhbV9sZW5ndGggPSB0aGlzLlBBUkFNU1t0b2tlbi50ZXh0XS5sZW5ndGg7XG4gICAgICAgICAgbW9kZSA9IHRva2VuLnRleHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKChpbmRleCArIHBhcmFtX2xlbmd0aCkgPCB0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBpbmRleDsgaSA8IGluZGV4ICsgcGFyYW1fbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbnVtYmVyID0gdG9rZW5zW2ldO1xuICAgICAgICAgIGlmIChudW1iZXIuaXNUeXBlKHRoaXMuTlVNQkVSKSkge1xuICAgICAgICAgICAgcGFyYW1zW3BhcmFtcy5sZW5ndGhdID0gbnVtYmVyLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlciB0eXBlIGlzIG5vdCBhIG51bWJlcjogXCIgKyBtb2RlICsgXCIsXCIgKyBudW1iZXIudGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzZWdtZW50O1xuICAgICAgICBpZiAodGhpcy5QQVJBTVNbbW9kZV0pIHtcbiAgICAgICAgICBzZWdtZW50ID0geyBrZXk6IG1vZGUsIGRhdGE6IHBhcmFtcyB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnN1cHBvcnRlZCBzZWdtZW50IHR5cGU6IFwiICsgbW9kZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICAgICAgaW5kZXggKz0gcGFyYW1fbGVuZ3RoO1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpbmRleF07XG4gICAgICAgIGlmIChtb2RlID09IFwiTVwiKSBtb2RlID0gXCJMXCI7XG4gICAgICAgIGlmIChtb2RlID09IFwibVwiKSBtb2RlID0gXCJsXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiUGF0aCBkYXRhIGVuZGVkIGJlZm9yZSBhbGwgcGFyYW1ldGVycyB3ZXJlIGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRva2VuaXplKGQpIHtcbiAgICB2YXIgdG9rZW5zID0gbmV3IEFycmF5KCk7XG4gICAgd2hpbGUgKGQgIT0gXCJcIikge1xuICAgICAgaWYgKGQubWF0Y2goL14oWyBcXHRcXHJcXG4sXSspLykpIHtcbiAgICAgICAgZCA9IGQuc3Vic3RyKFJlZ0V4cC4kMS5sZW5ndGgpO1xuICAgICAgfSBlbHNlIGlmIChkLm1hdGNoKC9eKFthQWNDaEhsTG1NcVFzU3RUdlZ6Wl0pLykpIHtcbiAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGhdID0gbmV3IFBhdGhUb2tlbih0aGlzLkNPTU1BTkQsIFJlZ0V4cC4kMSk7XG4gICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSBpZiAoZC5tYXRjaCgvXigoWy0rXT9bMC05XSsoXFwuWzAtOV0qKT98Wy0rXT9cXC5bMC05XSspKFtlRV1bLStdP1swLTldKyk/KS8pKSB7XG4gICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoXSA9IG5ldyBQYXRoVG9rZW4odGhpcy5OVU1CRVIsIHBhcnNlRmxvYXQoUmVnRXhwLiQxKSk7XG4gICAgICAgIGQgPSBkLnN1YnN0cihSZWdFeHAuJDEubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbnJlY29nbml6ZWQgc2VnbWVudCBjb21tYW5kOiBcIiArIGQpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdG9rZW5zW3Rva2Vucy5sZW5ndGhdID0gbmV3IFBhdGhUb2tlbih0aGlzLkVPRCwgbnVsbCk7XG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm91Z2hQYXRoIHtcbiAgY29uc3RydWN0b3IoZCkge1xuICAgIHRoaXMuZCA9IGQ7XG4gICAgdGhpcy5wYXJzZWQgPSBuZXcgUGFyc2VkUGF0aChkKTtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IFswLCAwXTtcbiAgICB0aGlzLmJlemllclJlZmxlY3Rpb25Qb2ludCA9IG51bGw7XG4gICAgdGhpcy5xdWFkUmVmbGVjdGlvblBvaW50ID0gbnVsbDtcbiAgICB0aGlzLl9maXJzdCA9IG51bGw7XG4gIH1cblxuICBnZXQgc2VnbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VkLnNlZ21lbnRzO1xuICB9XG5cbiAgZ2V0IGNsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZWQuY2xvc2VkO1xuICB9XG5cbiAgZ2V0IGxpbmVhclBvaW50cygpIHtcbiAgICBpZiAoIXRoaXMuX2xpbmVhclBvaW50cykge1xuICAgICAgY29uc3QgbHAgPSBbXTtcbiAgICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICAgIGZvciAobGV0IHMgb2YgdGhpcy5wYXJzZWQuc2VnbWVudHMpIHtcbiAgICAgICAgbGV0IGtleSA9IHMua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChrZXkgPT09ICdtJyB8fCBrZXkgPT09ICd6Jykge1xuICAgICAgICAgIGlmIChwb2ludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBscC5wdXNoKHBvaW50cyk7XG4gICAgICAgICAgICBwb2ludHMgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3onKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMucG9pbnQpIHtcbiAgICAgICAgICBwb2ludHMucHVzaChzLnBvaW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgbHAucHVzaChwb2ludHMpO1xuICAgICAgICBwb2ludHMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2xpbmVhclBvaW50cyA9IGxwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbGluZWFyUG9pbnRzO1xuICB9XG5cbiAgZ2V0IGZpcnN0KCkge1xuICAgIHJldHVybiB0aGlzLl9maXJzdDtcbiAgfVxuXG4gIHNldCBmaXJzdCh2KSB7XG4gICAgdGhpcy5fZmlyc3QgPSB2O1xuICB9XG5cbiAgc2V0UG9zaXRpb24oeCwgeSkge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gW3gsIHldO1xuICAgIGlmICghdGhpcy5fZmlyc3QpIHtcbiAgICAgIHRoaXMuX2ZpcnN0ID0gW3gsIHldO1xuICAgIH1cbiAgfVxuXG4gIGdldCBwb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cblxuICBnZXQgeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25bMF07XG4gIH1cblxuICBnZXQgeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25bMV07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoQXJjQ29udmVydGVyIHtcbiAgLy8gQWxnb3JpdGhtIGFzIGRlc2NyaWJlZCBpbiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL2ltcGxub3RlLmh0bWxcbiAgLy8gQ29kZSBhZGFwdGVkIGZyb20gbnNTVkdQYXRoRGF0YVBhcnNlci5jcHAgaW4gTW96aWxsYSBcbiAgLy8gaHR0cHM6Ly9oZy5tb3ppbGxhLm9yZy9tb3ppbGxhLWNlbnRyYWwvZmlsZS8xNzE1NmZiZWJiYzgvY29udGVudC9zdmcvY29udGVudC9zcmMvbnNTVkdQYXRoRGF0YVBhcnNlci5jcHAjbDg4N1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bywgcmFkaWksIGFuZ2xlLCBsYXJnZUFyY0ZsYWcsIHN3ZWVwRmxhZykge1xuICAgIGNvbnN0IHJhZFBlckRlZyA9IE1hdGguUEkgLyAxODA7XG4gICAgdGhpcy5fc2VnSW5kZXggPSAwO1xuICAgIHRoaXMuX251bVNlZ3MgPSAwO1xuICAgIGlmIChmcm9tWzBdID09IHRvWzBdICYmIGZyb21bMV0gPT0gdG9bMV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fcnggPSBNYXRoLmFicyhyYWRpaVswXSk7XG4gICAgdGhpcy5fcnkgPSBNYXRoLmFicyhyYWRpaVsxXSk7XG4gICAgdGhpcy5fc2luUGhpID0gTWF0aC5zaW4oYW5nbGUgKiByYWRQZXJEZWcpO1xuICAgIHRoaXMuX2Nvc1BoaSA9IE1hdGguY29zKGFuZ2xlICogcmFkUGVyRGVnKTtcbiAgICB2YXIgeDFkYXNoID0gdGhpcy5fY29zUGhpICogKGZyb21bMF0gLSB0b1swXSkgLyAyLjAgKyB0aGlzLl9zaW5QaGkgKiAoZnJvbVsxXSAtIHRvWzFdKSAvIDIuMDtcbiAgICB2YXIgeTFkYXNoID0gLXRoaXMuX3NpblBoaSAqIChmcm9tWzBdIC0gdG9bMF0pIC8gMi4wICsgdGhpcy5fY29zUGhpICogKGZyb21bMV0gLSB0b1sxXSkgLyAyLjA7XG4gICAgdmFyIHJvb3Q7XG4gICAgdmFyIG51bWVyYXRvciA9IHRoaXMuX3J4ICogdGhpcy5fcnggKiB0aGlzLl9yeSAqIHRoaXMuX3J5IC0gdGhpcy5fcnggKiB0aGlzLl9yeCAqIHkxZGFzaCAqIHkxZGFzaCAtIHRoaXMuX3J5ICogdGhpcy5fcnkgKiB4MWRhc2ggKiB4MWRhc2g7XG4gICAgaWYgKG51bWVyYXRvciA8IDApIHtcbiAgICAgIGxldCBzID0gTWF0aC5zcXJ0KDEgLSAobnVtZXJhdG9yIC8gKHRoaXMuX3J4ICogdGhpcy5fcnggKiB0aGlzLl9yeSAqIHRoaXMuX3J5KSkpO1xuICAgICAgdGhpcy5fcnggPSBzO1xuICAgICAgdGhpcy5fcnkgPSBzO1xuICAgICAgcm9vdCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QgPSAobGFyZ2VBcmNGbGFnID09IHN3ZWVwRmxhZyA/IC0xLjAgOiAxLjApICpcbiAgICAgICAgTWF0aC5zcXJ0KG51bWVyYXRvciAvICh0aGlzLl9yeCAqIHRoaXMuX3J4ICogeTFkYXNoICogeTFkYXNoICsgdGhpcy5fcnkgKiB0aGlzLl9yeSAqIHgxZGFzaCAqIHgxZGFzaCkpO1xuICAgIH1cbiAgICBsZXQgY3hkYXNoID0gcm9vdCAqIHRoaXMuX3J4ICogeTFkYXNoIC8gdGhpcy5fcnk7XG4gICAgbGV0IGN5ZGFzaCA9IC1yb290ICogdGhpcy5fcnkgKiB4MWRhc2ggLyB0aGlzLl9yeDtcbiAgICB0aGlzLl9DID0gWzAsIDBdO1xuICAgIHRoaXMuX0NbMF0gPSB0aGlzLl9jb3NQaGkgKiBjeGRhc2ggLSB0aGlzLl9zaW5QaGkgKiBjeWRhc2ggKyAoZnJvbVswXSArIHRvWzBdKSAvIDIuMDtcbiAgICB0aGlzLl9DWzFdID0gdGhpcy5fc2luUGhpICogY3hkYXNoICsgdGhpcy5fY29zUGhpICogY3lkYXNoICsgKGZyb21bMV0gKyB0b1sxXSkgLyAyLjA7XG4gICAgdGhpcy5fdGhldGEgPSB0aGlzLmNhbGN1bGF0ZVZlY3RvckFuZ2xlKDEuMCwgMC4wLCAoeDFkYXNoIC0gY3hkYXNoKSAvIHRoaXMuX3J4LCAoeTFkYXNoIC0gY3lkYXNoKSAvIHRoaXMuX3J5KTtcbiAgICBsZXQgZHRoZXRhID0gdGhpcy5jYWxjdWxhdGVWZWN0b3JBbmdsZSgoeDFkYXNoIC0gY3hkYXNoKSAvIHRoaXMuX3J4LCAoeTFkYXNoIC0gY3lkYXNoKSAvIHRoaXMuX3J5LCAoLXgxZGFzaCAtIGN4ZGFzaCkgLyB0aGlzLl9yeCwgKC15MWRhc2ggLSBjeWRhc2gpIC8gdGhpcy5fcnkpO1xuICAgIGlmICgoIXN3ZWVwRmxhZykgJiYgKGR0aGV0YSA+IDApKSB7XG4gICAgICBkdGhldGEgLT0gMiAqIE1hdGguUEk7XG4gICAgfSBlbHNlIGlmIChzd2VlcEZsYWcgJiYgKGR0aGV0YSA8IDApKSB7XG4gICAgICBkdGhldGEgKz0gMiAqIE1hdGguUEk7XG4gICAgfVxuICAgIHRoaXMuX251bVNlZ3MgPSBNYXRoLmNlaWwoTWF0aC5hYnMoZHRoZXRhIC8gKE1hdGguUEkgLyAyKSkpO1xuICAgIHRoaXMuX2RlbHRhID0gZHRoZXRhIC8gdGhpcy5fbnVtU2VncztcbiAgICB0aGlzLl9UID0gKDggLyAzKSAqIE1hdGguc2luKHRoaXMuX2RlbHRhIC8gNCkgKiBNYXRoLnNpbih0aGlzLl9kZWx0YSAvIDQpIC8gTWF0aC5zaW4odGhpcy5fZGVsdGEgLyAyKTtcbiAgICB0aGlzLl9mcm9tID0gZnJvbTtcbiAgfVxuXG4gIGdldE5leHRTZWdtZW50KCkge1xuICAgIHZhciBjcDEsIGNwMiwgdG87XG4gICAgaWYgKHRoaXMuX3NlZ0luZGV4ID09IHRoaXMuX251bVNlZ3MpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgY29zVGhldGExID0gTWF0aC5jb3ModGhpcy5fdGhldGEpO1xuICAgIGxldCBzaW5UaGV0YTEgPSBNYXRoLnNpbih0aGlzLl90aGV0YSk7XG4gICAgbGV0IHRoZXRhMiA9IHRoaXMuX3RoZXRhICsgdGhpcy5fZGVsdGE7XG4gICAgbGV0IGNvc1RoZXRhMiA9IE1hdGguY29zKHRoZXRhMik7XG4gICAgbGV0IHNpblRoZXRhMiA9IE1hdGguc2luKHRoZXRhMik7XG5cbiAgICB0byA9IFtcbiAgICAgIHRoaXMuX2Nvc1BoaSAqIHRoaXMuX3J4ICogY29zVGhldGEyIC0gdGhpcy5fc2luUGhpICogdGhpcy5fcnkgKiBzaW5UaGV0YTIgKyB0aGlzLl9DWzBdLFxuICAgICAgdGhpcy5fc2luUGhpICogdGhpcy5fcnggKiBjb3NUaGV0YTIgKyB0aGlzLl9jb3NQaGkgKiB0aGlzLl9yeSAqIHNpblRoZXRhMiArIHRoaXMuX0NbMV1cbiAgICBdO1xuICAgIGNwMSA9IFtcbiAgICAgIHRoaXMuX2Zyb21bMF0gKyB0aGlzLl9UICogKC0gdGhpcy5fY29zUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTEgLSB0aGlzLl9zaW5QaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMSksXG4gICAgICB0aGlzLl9mcm9tWzFdICsgdGhpcy5fVCAqICgtIHRoaXMuX3NpblBoaSAqIHRoaXMuX3J4ICogc2luVGhldGExICsgdGhpcy5fY29zUGhpICogdGhpcy5fcnkgKiBjb3NUaGV0YTEpXG4gICAgXTtcbiAgICBjcDIgPSBbXG4gICAgICB0b1swXSArIHRoaXMuX1QgKiAodGhpcy5fY29zUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTIgKyB0aGlzLl9zaW5QaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMiksXG4gICAgICB0b1sxXSArIHRoaXMuX1QgKiAodGhpcy5fc2luUGhpICogdGhpcy5fcnggKiBzaW5UaGV0YTIgLSB0aGlzLl9jb3NQaGkgKiB0aGlzLl9yeSAqIGNvc1RoZXRhMilcbiAgICBdO1xuXG4gICAgdGhpcy5fdGhldGEgPSB0aGV0YTI7XG4gICAgdGhpcy5fZnJvbSA9IFt0b1swXSwgdG9bMV1dO1xuICAgIHRoaXMuX3NlZ0luZGV4Kys7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3AxOiBjcDEsXG4gICAgICBjcDI6IGNwMixcbiAgICAgIHRvOiB0b1xuICAgIH07XG4gIH1cblxuICBjYWxjdWxhdGVWZWN0b3JBbmdsZSh1eCwgdXksIHZ4LCB2eSkge1xuICAgIGxldCB0YSA9IE1hdGguYXRhbjIodXksIHV4KTtcbiAgICBsZXQgdGIgPSBNYXRoLmF0YW4yKHZ5LCB2eCk7XG4gICAgaWYgKHRiID49IHRhKVxuICAgICAgcmV0dXJuIHRiIC0gdGE7XG4gICAgcmV0dXJuIDIgKiBNYXRoLlBJIC0gKHRhIC0gdGIpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXRoRml0dGVyIHtcbiAgY29uc3RydWN0b3Ioc2V0cywgY2xvc2VkKSB7XG4gICAgdGhpcy5zZXRzID0gc2V0cztcbiAgICB0aGlzLmNsb3NlZCA9IGNsb3NlZDtcbiAgfVxuXG4gIGZpdChzaW1wbGlmaWNhdGlvbikge1xuICAgIGxldCBvdXRTZXRzID0gW107XG4gICAgZm9yIChjb25zdCBzZXQgb2YgdGhpcy5zZXRzKSB7XG4gICAgICBsZXQgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICAgIGxldCBlc3RMZW5ndGggPSBNYXRoLmZsb29yKHNpbXBsaWZpY2F0aW9uICogbGVuZ3RoKTtcbiAgICAgIGlmIChlc3RMZW5ndGggPCA1KSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gNSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVzdExlbmd0aCA9IDU7XG4gICAgICB9XG4gICAgICBvdXRTZXRzLnB1c2godGhpcy5yZWR1Y2Uoc2V0LCBlc3RMZW5ndGgpKTtcbiAgICB9XG5cbiAgICBsZXQgZCA9ICcnO1xuICAgIGZvciAoY29uc3Qgc2V0IG9mIG91dFNldHMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBwb2ludCA9IHNldFtpXTtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICBkICs9ICdNJyArIHBvaW50WzBdICsgXCIsXCIgKyBwb2ludFsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkICs9ICdMJyArIHBvaW50WzBdICsgXCIsXCIgKyBwb2ludFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgIGQgKz0gJ3ogJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBkaXN0YW5jZShwMSwgcDIpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHAxWzBdIC0gcDJbMF0sIDIpICsgTWF0aC5wb3cocDFbMV0gLSBwMlsxXSwgMikpO1xuICB9XG5cbiAgcmVkdWNlKHNldCwgY291bnQpIHtcbiAgICBpZiAoc2V0Lmxlbmd0aCA8PSBjb3VudCkge1xuICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG4gICAgbGV0IHBvaW50cyA9IHNldC5zbGljZSgwKTtcbiAgICB3aGlsZSAocG9pbnRzLmxlbmd0aCA+IGNvdW50KSB7XG4gICAgICBsZXQgYXJlYXMgPSBbXTtcbiAgICAgIGxldCBtaW5BcmVhID0gLTE7XG4gICAgICBsZXQgbWluSW5kZXggPSAtMTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgKHBvaW50cy5sZW5ndGggLSAxKTsgaSsrKSB7XG4gICAgICAgIGxldCBhID0gdGhpcy5kaXN0YW5jZShwb2ludHNbaSAtIDFdLCBwb2ludHNbaV0pO1xuICAgICAgICBsZXQgYiA9IHRoaXMuZGlzdGFuY2UocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdKTtcbiAgICAgICAgbGV0IGMgPSB0aGlzLmRpc3RhbmNlKHBvaW50c1tpIC0gMV0sIHBvaW50c1tpICsgMV0pO1xuICAgICAgICBsZXQgcyA9IChhICsgYiArIGMpIC8gMi4wO1xuICAgICAgICBsZXQgYXJlYSA9IE1hdGguc3FydChzICogKHMgLSBhKSAqIChzIC0gYikgKiAocyAtIGMpKTtcbiAgICAgICAgYXJlYXMucHVzaChhcmVhKTtcbiAgICAgICAgaWYgKChtaW5BcmVhIDwgMCkgfHwgKGFyZWEgPCBtaW5BcmVhKSkge1xuICAgICAgICAgIG1pbkFyZWEgPSBhcmVhO1xuICAgICAgICAgIG1pbkluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1pbkluZGV4ID4gMCkge1xuICAgICAgICBwb2ludHMuc3BsaWNlKG1pbkluZGV4LCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hIYWNodXJlSXRlcmF0b3IgfSBmcm9tICcuL2hhY2h1cmUuanMnO1xuaW1wb3J0IHsgUm91Z2hTZWdtZW50UmVsYXRpb24sIFJvdWdoU2VnbWVudCB9IGZyb20gJy4vc2VnbWVudC5qcyc7XG5pbXBvcnQgeyBSb3VnaFBhdGgsIFJvdWdoQXJjQ29udmVydGVyLCBQYXRoRml0dGVyIH0gZnJvbSAnLi9wYXRoLmpzJztcblxuZXhwb3J0IGNsYXNzIFJvdWdoUmVuZGVyZXIge1xuICBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvKSB7XG4gICAgbGV0IG9wcyA9IHRoaXMuX2RvdWJsZUxpbmUoeDEsIHkxLCB4MiwgeTIsIG8pO1xuICAgIHJldHVybiB7IHR5cGU6ICdwYXRoJywgb3BzIH07XG4gIH1cblxuICBsaW5lYXJQYXRoKHBvaW50cywgY2xvc2UsIG8pIHtcbiAgICBjb25zdCBsZW4gPSAocG9pbnRzIHx8IFtdKS5sZW5ndGg7XG4gICAgaWYgKGxlbiA+IDIpIHtcbiAgICAgIGxldCBvcHMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKGxlbiAtIDEpOyBpKyspIHtcbiAgICAgICAgb3BzID0gb3BzLmNvbmNhdCh0aGlzLl9kb3VibGVMaW5lKHBvaW50c1tpXVswXSwgcG9pbnRzW2ldWzFdLCBwb2ludHNbaSArIDFdWzBdLCBwb2ludHNbaSArIDFdWzFdLCBvKSk7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2UpIHtcbiAgICAgICAgb3BzID0gb3BzLmNvbmNhdCh0aGlzLl9kb3VibGVMaW5lKHBvaW50c1tsZW4gLSAxXVswXSwgcG9pbnRzW2xlbiAtIDFdWzFdLCBwb2ludHNbMF1bMF0sIHBvaW50c1swXVsxXSwgbykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgdHlwZTogJ3BhdGgnLCBvcHMgfTtcbiAgICB9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xuICAgICAgcmV0dXJuIHRoaXMubGluZShwb2ludHNbMF1bMF0sIHBvaW50c1swXVsxXSwgcG9pbnRzWzFdWzBdLCBwb2ludHNbMV1bMV0sIG8pO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzLCBvKSB7XG4gICAgcmV0dXJuIHRoaXMubGluZWFyUGF0aChwb2ludHMsIHRydWUsIG8pO1xuICB9XG5cbiAgcmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pIHtcbiAgICBsZXQgcG9pbnRzID0gW1xuICAgICAgW3gsIHldLCBbeCArIHdpZHRoLCB5XSwgW3ggKyB3aWR0aCwgeSArIGhlaWdodF0sIFt4LCB5ICsgaGVpZ2h0XVxuICAgIF07XG4gICAgcmV0dXJuIHRoaXMucG9seWdvbihwb2ludHMsIG8pO1xuICB9XG5cbiAgY3VydmUocG9pbnRzLCBvKSB7XG4gICAgbGV0IG8xID0gdGhpcy5fY3VydmVXaXRoT2Zmc2V0KHBvaW50cywgMSAqICgxICsgby5yb3VnaG5lc3MgKiAwLjIpLCBvKTtcbiAgICBsZXQgbzIgPSB0aGlzLl9jdXJ2ZVdpdGhPZmZzZXQocG9pbnRzLCAxLjUgKiAoMSArIG8ucm91Z2huZXNzICogMC4yMiksIG8pO1xuICAgIHJldHVybiB7IHR5cGU6ICdwYXRoJywgb3BzOiBvMS5jb25jYXQobzIpIH07XG4gIH1cblxuICBlbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pIHtcbiAgICBjb25zdCBpbmNyZW1lbnQgPSAoTWF0aC5QSSAqIDIpIC8gby5jdXJ2ZVN0ZXBDb3VudDtcbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpO1xuICAgIGxldCByeSA9IE1hdGguYWJzKGhlaWdodCAvIDIpO1xuICAgIHJ4ICs9IHRoaXMuX2dldE9mZnNldCgtcnggKiAwLjA1LCByeCAqIDAuMDUsIG8pO1xuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjA1LCByeSAqIDAuMDUsIG8pO1xuICAgIGxldCBvMSA9IHRoaXMuX2VsbGlwc2UoaW5jcmVtZW50LCB4LCB5LCByeCwgcnksIDEsIGluY3JlbWVudCAqIHRoaXMuX2dldE9mZnNldCgwLjEsIHRoaXMuX2dldE9mZnNldCgwLjQsIDEsIG8pLCBvKSwgbyk7XG4gICAgbGV0IG8yID0gdGhpcy5fZWxsaXBzZShpbmNyZW1lbnQsIHgsIHksIHJ4LCByeSwgMS41LCAwLCBvKTtcbiAgICByZXR1cm4geyB0eXBlOiAncGF0aCcsIG9wczogbzEuY29uY2F0KG8yKSB9O1xuICB9XG5cbiAgYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIHJvdWdoQ2xvc3VyZSwgbykge1xuICAgIGxldCBjeCA9IHg7XG4gICAgbGV0IGN5ID0geTtcbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpO1xuICAgIGxldCByeSA9IE1hdGguYWJzKGhlaWdodCAvIDIpO1xuICAgIHJ4ICs9IHRoaXMuX2dldE9mZnNldCgtcnggKiAwLjAxLCByeCAqIDAuMDEsIG8pO1xuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjAxLCByeSAqIDAuMDEsIG8pO1xuICAgIGxldCBzdHJ0ID0gc3RhcnQ7XG4gICAgbGV0IHN0cCA9IHN0b3A7XG4gICAgd2hpbGUgKHN0cnQgPCAwKSB7XG4gICAgICBzdHJ0ICs9IE1hdGguUEkgKiAyO1xuICAgICAgc3RwICs9IE1hdGguUEkgKiAyO1xuICAgIH1cbiAgICBpZiAoKHN0cCAtIHN0cnQpID4gKE1hdGguUEkgKiAyKSkge1xuICAgICAgc3RydCA9IDA7XG4gICAgICBzdHAgPSBNYXRoLlBJICogMjtcbiAgICB9XG4gICAgbGV0IGVsbGlwc2VJbmMgPSAoTWF0aC5QSSAqIDIpIC8gby5jdXJ2ZVN0ZXBDb3VudDtcbiAgICBsZXQgYXJjSW5jID0gTWF0aC5taW4oZWxsaXBzZUluYyAvIDIsIChzdHAgLSBzdHJ0KSAvIDIpO1xuICAgIGxldCBvMSA9IHRoaXMuX2FyYyhhcmNJbmMsIGN4LCBjeSwgcngsIHJ5LCBzdHJ0LCBzdHAsIDEsIG8pO1xuICAgIGxldCBvMiA9IHRoaXMuX2FyYyhhcmNJbmMsIGN4LCBjeSwgcngsIHJ5LCBzdHJ0LCBzdHAsIDEuNSwgbyk7XG4gICAgbGV0IG9wcyA9IG8xLmNvbmNhdChvMik7XG4gICAgaWYgKGNsb3NlZCkge1xuICAgICAgaWYgKHJvdWdoQ2xvc3VyZSkge1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUoY3gsIGN5LCBjeCArIHJ4ICogTWF0aC5jb3Moc3RydCksIGN5ICsgcnkgKiBNYXRoLnNpbihzdHJ0KSwgbykpO1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUoY3gsIGN5LCBjeCArIHJ4ICogTWF0aC5jb3Moc3RwKSwgY3kgKyByeSAqIE1hdGguc2luKHN0cCksIG8pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKHsgb3A6ICdsaW5lVG8nLCBkYXRhOiBbY3gsIGN5XSB9KTtcbiAgICAgICAgb3BzLnB1c2goeyBvcDogJ2xpbmVUbycsIGRhdGE6IFtjeCArIHJ4ICogTWF0aC5jb3Moc3RydCksIGN5ICsgcnkgKiBNYXRoLnNpbihzdHJ0KV0gfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHR5cGU6ICdwYXRoJywgb3BzIH07XG4gIH1cblxuICBoYWNodXJlRmlsbEFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgbykge1xuICAgIGxldCBjeCA9IHg7XG4gICAgbGV0IGN5ID0geTtcbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpO1xuICAgIGxldCByeSA9IE1hdGguYWJzKGhlaWdodCAvIDIpO1xuICAgIHJ4ICs9IHRoaXMuX2dldE9mZnNldCgtcnggKiAwLjAxLCByeCAqIDAuMDEsIG8pO1xuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjAxLCByeSAqIDAuMDEsIG8pO1xuICAgIGxldCBzdHJ0ID0gc3RhcnQ7XG4gICAgbGV0IHN0cCA9IHN0b3A7XG4gICAgd2hpbGUgKHN0cnQgPCAwKSB7XG4gICAgICBzdHJ0ICs9IE1hdGguUEkgKiAyO1xuICAgICAgc3RwICs9IE1hdGguUEkgKiAyO1xuICAgIH1cbiAgICBpZiAoKHN0cCAtIHN0cnQpID4gKE1hdGguUEkgKiAyKSkge1xuICAgICAgc3RydCA9IDA7XG4gICAgICBzdHAgPSBNYXRoLlBJICogMjtcbiAgICB9XG4gICAgbGV0IGluY3JlbWVudCA9IChzdHAgLSBzdHJ0KSAvIG8uY3VydmVTdGVwQ291bnQ7XG4gICAgbGV0IG9mZnNldCA9IDE7XG4gICAgbGV0IHhjID0gW10sIHljID0gW107XG4gICAgZm9yIChsZXQgYW5nbGUgPSBzdHJ0OyBhbmdsZSA8PSBzdHA7IGFuZ2xlID0gYW5nbGUgKyBpbmNyZW1lbnQpIHtcbiAgICAgIHhjLnB1c2goY3ggKyByeCAqIE1hdGguY29zKGFuZ2xlKSk7XG4gICAgICB5Yy5wdXNoKGN5ICsgcnkgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgIH1cbiAgICB4Yy5wdXNoKGN4ICsgcnggKiBNYXRoLmNvcyhzdHApKTtcbiAgICB5Yy5wdXNoKGN5ICsgcnkgKiBNYXRoLnNpbihzdHApKTtcbiAgICB4Yy5wdXNoKGN4KTtcbiAgICB5Yy5wdXNoKGN5KTtcbiAgICByZXR1cm4gdGhpcy5oYWNodXJlRmlsbFNoYXBlKHhjLCB5Yywgbyk7XG4gIH1cblxuICBzb2xpZEZpbGxTaGFwZSh4Q29vcmRzLCB5Q29vcmRzLCBvKSB7XG4gICAgbGV0IG9wcyA9IFtdO1xuICAgIGlmICh4Q29vcmRzICYmIHlDb29yZHMgJiYgeENvb3Jkcy5sZW5ndGggJiYgeUNvb3Jkcy5sZW5ndGggJiYgeENvb3Jkcy5sZW5ndGggPT09IHlDb29yZHMubGVuZ3RoKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gby5tYXhSYW5kb21uZXNzT2Zmc2V0IHx8IDA7XG4gICAgICBjb25zdCBsZW4gPSB4Q29vcmRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPiAyKSB7XG4gICAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3hDb29yZHNbMF0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSwgeUNvb3Jkc1swXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pXSB9KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG9wcy5wdXNoKHsgb3A6ICdsaW5lVG8nLCBkYXRhOiBbeENvb3Jkc1tpXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLCB5Q29vcmRzW2ldICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyldIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHR5cGU6ICdmaWxsUGF0aCcsIG9wcyB9O1xuICB9XG5cbiAgaGFjaHVyZUZpbGxTaGFwZSh4Q29vcmRzLCB5Q29vcmRzLCBvKSB7XG4gICAgbGV0IG9wcyA9IFtdO1xuICAgIGlmICh4Q29vcmRzICYmIHlDb29yZHMgJiYgeENvb3Jkcy5sZW5ndGggJiYgeUNvb3Jkcy5sZW5ndGgpIHtcbiAgICAgIGxldCBsZWZ0ID0geENvb3Jkc1swXTtcbiAgICAgIGxldCByaWdodCA9IHhDb29yZHNbMF07XG4gICAgICBsZXQgdG9wID0geUNvb3Jkc1swXTtcbiAgICAgIGxldCBib3R0b20gPSB5Q29vcmRzWzBdO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB4Q29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLm1pbihsZWZ0LCB4Q29vcmRzW2ldKTtcbiAgICAgICAgcmlnaHQgPSBNYXRoLm1heChyaWdodCwgeENvb3Jkc1tpXSk7XG4gICAgICAgIHRvcCA9IE1hdGgubWluKHRvcCwgeUNvb3Jkc1tpXSk7XG4gICAgICAgIGJvdHRvbSA9IE1hdGgubWF4KGJvdHRvbSwgeUNvb3Jkc1tpXSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhbmdsZSA9IG8uaGFjaHVyZUFuZ2xlO1xuICAgICAgbGV0IGdhcCA9IG8uaGFjaHVyZUdhcDtcbiAgICAgIGlmIChnYXAgPCAwKSB7XG4gICAgICAgIGdhcCA9IG8uc3Ryb2tlV2lkdGggKiA0O1xuICAgICAgfVxuICAgICAgZ2FwID0gTWF0aC5tYXgoZ2FwLCAwLjEpO1xuXG4gICAgICBjb25zdCByYWRQZXJEZWcgPSBNYXRoLlBJIC8gMTgwO1xuICAgICAgY29uc3QgaGFjaHVyZUFuZ2xlID0gKGFuZ2xlICUgMTgwKSAqIHJhZFBlckRlZztcbiAgICAgIGNvbnN0IGNvc0FuZ2xlID0gTWF0aC5jb3MoaGFjaHVyZUFuZ2xlKTtcbiAgICAgIGNvbnN0IHNpbkFuZ2xlID0gTWF0aC5zaW4oaGFjaHVyZUFuZ2xlKTtcbiAgICAgIGNvbnN0IHRhbkFuZ2xlID0gTWF0aC50YW4oaGFjaHVyZUFuZ2xlKTtcblxuICAgICAgY29uc3QgaXQgPSBuZXcgUm91Z2hIYWNodXJlSXRlcmF0b3IodG9wIC0gMSwgYm90dG9tICsgMSwgbGVmdCAtIDEsIHJpZ2h0ICsgMSwgZ2FwLCBzaW5BbmdsZSwgY29zQW5nbGUsIHRhbkFuZ2xlKTtcbiAgICAgIGxldCByZWN0Q29vcmRzO1xuICAgICAgd2hpbGUgKChyZWN0Q29vcmRzID0gaXQuZ2V0TmV4dExpbmUoKSkgIT0gbnVsbCkge1xuICAgICAgICBsZXQgbGluZXMgPSB0aGlzLl9nZXRJbnRlcnNlY3RpbmdMaW5lcyhyZWN0Q29vcmRzLCB4Q29vcmRzLCB5Q29vcmRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChpIDwgKGxpbmVzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICBsZXQgcDEgPSBsaW5lc1tpXTtcbiAgICAgICAgICAgIGxldCBwMiA9IGxpbmVzW2kgKyAxXTtcbiAgICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwMVswXSwgcDFbMV0sIHAyWzBdLCBwMlsxXSwgbykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiAnZmlsbFNrZXRjaCcsIG9wcyB9O1xuICB9XG5cbiAgaGFjaHVyZUZpbGxFbGxpcHNlKGN4LCBjeSwgd2lkdGgsIGhlaWdodCwgbykge1xuICAgIGxldCBvcHMgPSBbXTtcbiAgICBsZXQgcnggPSBNYXRoLmFicyh3aWR0aCAvIDIpO1xuICAgIGxldCByeSA9IE1hdGguYWJzKGhlaWdodCAvIDIpO1xuICAgIHJ4ICs9IHRoaXMuX2dldE9mZnNldCgtcnggKiAwLjA1LCByeCAqIDAuMDUsIG8pO1xuICAgIHJ5ICs9IHRoaXMuX2dldE9mZnNldCgtcnkgKiAwLjA1LCByeSAqIDAuMDUsIG8pO1xuICAgIGxldCBhbmdsZSA9IG8uaGFjaHVyZUFuZ2xlO1xuICAgIGxldCBnYXAgPSBvLmhhY2h1cmVHYXA7XG4gICAgaWYgKGdhcCA8PSAwKSB7XG4gICAgICBnYXAgPSBvLnN0cm9rZVdpZHRoICogNDtcbiAgICB9XG4gICAgbGV0IGZ3ZWlnaHQgPSBvLmZpbGxXZWlnaHQ7XG4gICAgaWYgKGZ3ZWlnaHQgPCAwKSB7XG4gICAgICBmd2VpZ2h0ID0gby5zdHJva2VXaWR0aCAvIDI7XG4gICAgfVxuICAgIGNvbnN0IHJhZFBlckRlZyA9IE1hdGguUEkgLyAxODA7XG4gICAgbGV0IGhhY2h1cmVBbmdsZSA9IChhbmdsZSAlIDE4MCkgKiByYWRQZXJEZWc7XG4gICAgbGV0IHRhbkFuZ2xlID0gTWF0aC50YW4oaGFjaHVyZUFuZ2xlKTtcbiAgICBsZXQgYXNwZWN0UmF0aW8gPSByeSAvIHJ4O1xuICAgIGxldCBoeXAgPSBNYXRoLnNxcnQoYXNwZWN0UmF0aW8gKiB0YW5BbmdsZSAqIGFzcGVjdFJhdGlvICogdGFuQW5nbGUgKyAxKTtcbiAgICBsZXQgc2luQW5nbGVQcmltZSA9IGFzcGVjdFJhdGlvICogdGFuQW5nbGUgLyBoeXA7XG4gICAgbGV0IGNvc0FuZ2xlUHJpbWUgPSAxIC8gaHlwO1xuICAgIGxldCBnYXBQcmltZSA9IGdhcCAvICgocnggKiByeSAvIE1hdGguc3FydCgocnkgKiBjb3NBbmdsZVByaW1lKSAqIChyeSAqIGNvc0FuZ2xlUHJpbWUpICsgKHJ4ICogc2luQW5nbGVQcmltZSkgKiAocnggKiBzaW5BbmdsZVByaW1lKSkpIC8gcngpO1xuICAgIGxldCBoYWxmTGVuID0gTWF0aC5zcXJ0KChyeCAqIHJ4KSAtIChjeCAtIHJ4ICsgZ2FwUHJpbWUpICogKGN4IC0gcnggKyBnYXBQcmltZSkpO1xuICAgIGZvciAodmFyIHhQb3MgPSBjeCAtIHJ4ICsgZ2FwUHJpbWU7IHhQb3MgPCBjeCArIHJ4OyB4UG9zICs9IGdhcFByaW1lKSB7XG4gICAgICBoYWxmTGVuID0gTWF0aC5zcXJ0KChyeCAqIHJ4KSAtIChjeCAtIHhQb3MpICogKGN4IC0geFBvcykpO1xuICAgICAgbGV0IHAxID0gdGhpcy5fYWZmaW5lKHhQb3MsIGN5IC0gaGFsZkxlbiwgY3gsIGN5LCBzaW5BbmdsZVByaW1lLCBjb3NBbmdsZVByaW1lLCBhc3BlY3RSYXRpbyk7XG4gICAgICBsZXQgcDIgPSB0aGlzLl9hZmZpbmUoeFBvcywgY3kgKyBoYWxmTGVuLCBjeCwgY3ksIHNpbkFuZ2xlUHJpbWUsIGNvc0FuZ2xlUHJpbWUsIGFzcGVjdFJhdGlvKTtcbiAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwMVswXSwgcDFbMV0sIHAyWzBdLCBwMlsxXSwgbykpO1xuICAgIH1cbiAgICByZXR1cm4geyB0eXBlOiAnZmlsbFNrZXRjaCcsIG9wcyB9O1xuICB9XG5cbiAgc3ZnUGF0aChwYXRoLCBvKSB7XG4gICAgcGF0aCA9IChwYXRoIHx8ICcnKS5yZXBsYWNlKC9cXG4vZywgXCIgXCIpLnJlcGxhY2UoLygtKS9nLCBcIiAtXCIpLnJlcGxhY2UoLygtXFxzKS9nLCBcIi1cIikucmVwbGFjZShcIi8oXFxzXFxzKS9nXCIsIFwiIFwiKTtcbiAgICBsZXQgcCA9IG5ldyBSb3VnaFBhdGgocGF0aCk7XG4gICAgaWYgKG8uc2ltcGxpZmljYXRpb24pIHtcbiAgICAgIGxldCBmaXR0ZXIgPSBuZXcgUGF0aEZpdHRlcihwLmxpbmVhclBvaW50cywgcC5jbG9zZWQpO1xuICAgICAgbGV0IGQgPSBmaXR0ZXIuZml0KG8uc2ltcGxpZmljYXRpb24pO1xuICAgICAgcCA9IG5ldyBSb3VnaFBhdGgoZCk7XG4gICAgfVxuICAgIGxldCBvcHMgPSBbXTtcbiAgICBsZXQgc2VnbWVudHMgPSBwLnNlZ21lbnRzIHx8IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzID0gc2VnbWVudHNbaV07XG4gICAgICBsZXQgcHJldiA9IGkgPiAwID8gc2VnbWVudHNbaSAtIDFdIDogbnVsbDtcbiAgICAgIGxldCBvcExpc3QgPSB0aGlzLl9wcm9jZXNzU2VnbWVudChwLCBzLCBwcmV2LCBvKTtcbiAgICAgIGlmIChvcExpc3QgJiYgb3BMaXN0Lmxlbmd0aCkge1xuICAgICAgICBvcHMgPSBvcHMuY29uY2F0KG9wTGlzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHR5cGU6ICdwYXRoJywgb3BzIH07XG4gIH1cblxuICAvLyBwcml2YXRlc1xuXG4gIF9iZXppZXJUbyh4MSwgeTEsIHgyLCB5MiwgeCwgeSwgcGF0aCwgbykge1xuICAgIGxldCBvcHMgPSBbXTtcbiAgICBsZXQgcm9zID0gW28ubWF4UmFuZG9tbmVzc09mZnNldCB8fCAxLCAoby5tYXhSYW5kb21uZXNzT2Zmc2V0IHx8IDEpICsgMC41XTtcbiAgICBsZXQgZiA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3BhdGgueCwgcGF0aC55XSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3BhdGgueCArIHRoaXMuX2dldE9mZnNldCgtcm9zWzBdLCByb3NbMF0sIG8pLCBwYXRoLnkgKyB0aGlzLl9nZXRPZmZzZXQoLXJvc1swXSwgcm9zWzBdLCBvKV0gfSk7XG4gICAgICB9XG4gICAgICBmID0gW3ggKyB0aGlzLl9nZXRPZmZzZXQoLXJvc1tpXSwgcm9zW2ldLCBvKSwgeSArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pXTtcbiAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgb3A6ICdiY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICB4MSArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pLCB5MSArIHRoaXMuX2dldE9mZnNldCgtcm9zW2ldLCByb3NbaV0sIG8pLFxuICAgICAgICAgIHgyICsgdGhpcy5fZ2V0T2Zmc2V0KC1yb3NbaV0sIHJvc1tpXSwgbyksIHkyICsgdGhpcy5fZ2V0T2Zmc2V0KC1yb3NbaV0sIHJvc1tpXSwgbyksXG4gICAgICAgICAgZlswXSwgZlsxXVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG4gICAgcGF0aC5zZXRQb3NpdGlvbihmWzBdLCBmWzFdKTtcbiAgICByZXR1cm4gb3BzO1xuICB9XG5cbiAgX3Byb2Nlc3NTZWdtZW50KHBhdGgsIHNlZywgcHJldlNlZywgbykge1xuICAgIGxldCBvcHMgPSBbXTtcbiAgICBzd2l0Y2ggKHNlZy5rZXkpIHtcbiAgICAgIGNhc2UgJ00nOlxuICAgICAgY2FzZSAnbSc6IHtcbiAgICAgICAgbGV0IGRlbHRhID0gc2VnLmtleSA9PT0gJ20nO1xuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVswXTtcbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVsxXTtcbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHggKz0gcGF0aC54O1xuICAgICAgICAgICAgeSArPSBwYXRoLnk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBybyA9IDEgKiAoby5tYXhSYW5kb21uZXNzT2Zmc2V0IHx8IDApO1xuICAgICAgICAgIHggPSB4ICsgdGhpcy5fZ2V0T2Zmc2V0KC1ybywgcm8sIG8pO1xuICAgICAgICAgIHkgPSB5ICsgdGhpcy5fZ2V0T2Zmc2V0KC1ybywgcm8sIG8pO1xuICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgb3BzLnB1c2goeyBvcDogJ21vdmUnLCBkYXRhOiBbeCwgeV0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdMJzpcbiAgICAgIGNhc2UgJ2wnOiB7XG4gICAgICAgIGxldCBkZWx0YSA9IHNlZy5rZXkgPT09ICdsJztcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbMF07XG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbMV07XG4gICAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICB4ICs9IHBhdGgueDtcbiAgICAgICAgICAgIHkgKz0gcGF0aC55O1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocGF0aC54LCBwYXRoLnksIHgsIHksIG8pKTtcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnSCc6XG4gICAgICBjYXNlICdoJzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09ICdoJztcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGxldCB4ID0gK3NlZy5kYXRhWzBdO1xuICAgICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgeCArPSBwYXRoLng7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgeCwgcGF0aC55LCBvKSk7XG4gICAgICAgICAgcGF0aC5zZXRQb3NpdGlvbih4LCBwYXRoLnkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnVic6XG4gICAgICBjYXNlICd2Jzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09ICd2JztcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGxldCB5ID0gK3NlZy5kYXRhWzBdO1xuICAgICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgeSArPSBwYXRoLnk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgcGF0aC54LCB5LCBvKSk7XG4gICAgICAgICAgcGF0aC5zZXRQb3NpdGlvbihwYXRoLngsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnWic6XG4gICAgICBjYXNlICd6Jzoge1xuICAgICAgICBpZiAocGF0aC5maXJzdCkge1xuICAgICAgICAgIG9wcyA9IG9wcy5jb25jYXQodGhpcy5fZG91YmxlTGluZShwYXRoLngsIHBhdGgueSwgcGF0aC5maXJzdFswXSwgcGF0aC5maXJzdFsxXSwgbykpO1xuICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24ocGF0aC5maXJzdFswXSwgcGF0aC5maXJzdFsxXSk7XG4gICAgICAgICAgcGF0aC5maXJzdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdDJzpcbiAgICAgIGNhc2UgJ2MnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc2VnLmtleSA9PT0gJ2MnO1xuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICBsZXQgeDEgPSArc2VnLmRhdGFbMF07XG4gICAgICAgICAgbGV0IHkxID0gK3NlZy5kYXRhWzFdO1xuICAgICAgICAgIGxldCB4MiA9ICtzZWcuZGF0YVsyXTtcbiAgICAgICAgICBsZXQgeTIgPSArc2VnLmRhdGFbM107XG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbNF07XG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbNV07XG4gICAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICB4MSArPSBwYXRoLng7XG4gICAgICAgICAgICB4MiArPSBwYXRoLng7XG4gICAgICAgICAgICB4ICs9IHBhdGgueDtcbiAgICAgICAgICAgIHkxICs9IHBhdGgueTtcbiAgICAgICAgICAgIHkyICs9IHBhdGgueTtcbiAgICAgICAgICAgIHkgKz0gcGF0aC55O1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgb2IgPSB0aGlzLl9iZXppZXJUbyh4MSwgeTEsIHgyLCB5MiwgeCwgeSwgcGF0aCwgbyk7XG4gICAgICAgICAgb3BzID0gb3BzLmNvbmNhdChvYik7XG4gICAgICAgICAgcGF0aC5iZXppZXJSZWZsZWN0aW9uUG9pbnQgPSBbeCArICh4IC0geDIpLCB5ICsgKHkgLSB5MildO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUyc6XG4gICAgICBjYXNlICdzJzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09ICdzJztcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgICAgbGV0IHgyID0gK3NlZy5kYXRhWzBdO1xuICAgICAgICAgIGxldCB5MiA9ICtzZWcuZGF0YVsxXTtcbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVsyXTtcbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVszXTtcbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHgyICs9IHBhdGgueDtcbiAgICAgICAgICAgIHggKz0gcGF0aC54O1xuICAgICAgICAgICAgeTIgKz0gcGF0aC55O1xuICAgICAgICAgICAgeSArPSBwYXRoLnk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB4MSA9IHgyO1xuICAgICAgICAgIGxldCB5MSA9IHkyO1xuICAgICAgICAgIGxldCBwcmV2S2V5ID0gcHJldlNlZyA/IHByZXZTZWcua2V5IDogXCJcIjtcbiAgICAgICAgICB2YXIgcmVmID0gbnVsbDtcbiAgICAgICAgICBpZiAocHJldktleSA9PSAnYycgfHwgcHJldktleSA9PSAnQycgfHwgcHJldktleSA9PSAncycgfHwgcHJldktleSA9PSAnUycpIHtcbiAgICAgICAgICAgIHJlZiA9IHBhdGguYmV6aWVyUmVmbGVjdGlvblBvaW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVmKSB7XG4gICAgICAgICAgICB4MSA9IHJlZlswXTtcbiAgICAgICAgICAgIHkxID0gcmVmWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgb2IgPSB0aGlzLl9iZXppZXJUbyh4MSwgeTEsIHgyLCB5MiwgeCwgeSwgcGF0aCwgbyk7XG4gICAgICAgICAgb3BzID0gb3BzLmNvbmNhdChvYik7XG4gICAgICAgICAgcGF0aC5iZXppZXJSZWZsZWN0aW9uUG9pbnQgPSBbeCArICh4IC0geDIpLCB5ICsgKHkgLSB5MildO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnUSc6XG4gICAgICBjYXNlICdxJzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHNlZy5rZXkgPT09ICdxJztcbiAgICAgICAgaWYgKHNlZy5kYXRhLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgICAgbGV0IHgxID0gK3NlZy5kYXRhWzBdO1xuICAgICAgICAgIGxldCB5MSA9ICtzZWcuZGF0YVsxXTtcbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVsyXTtcbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVszXTtcbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHgxICs9IHBhdGgueDtcbiAgICAgICAgICAgIHggKz0gcGF0aC54O1xuICAgICAgICAgICAgeTEgKz0gcGF0aC55O1xuICAgICAgICAgICAgeSArPSBwYXRoLnk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBvZmZzZXQxID0gMSAqICgxICsgby5yb3VnaG5lc3MgKiAwLjIpO1xuICAgICAgICAgIGxldCBvZmZzZXQyID0gMS41ICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMjIpO1xuICAgICAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3BhdGgueCArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyksIHBhdGgueSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyldIH0pO1xuICAgICAgICAgIGxldCBmID0gW3ggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLCB5ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKV07XG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6ICdxY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLCB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyksXG4gICAgICAgICAgICAgIGZbMF0sIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvcHMucHVzaCh7IG9wOiAnbW92ZScsIGRhdGE6IFtwYXRoLnggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCBwYXRoLnkgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pXSB9KTtcbiAgICAgICAgICBmID0gW3ggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCB5ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKV07XG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6ICdxY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbyksXG4gICAgICAgICAgICAgIGZbMF0sIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKGZbMF0sIGZbMV0pO1xuICAgICAgICAgIHBhdGgucXVhZFJlZmxlY3Rpb25Qb2ludCA9IFt4ICsgKHggLSB4MSksIHkgKyAoeSAtIHkxKV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdUJzpcbiAgICAgIGNhc2UgJ3QnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc2VnLmtleSA9PT0gJ3QnO1xuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICBsZXQgeCA9ICtzZWcuZGF0YVswXTtcbiAgICAgICAgICBsZXQgeSA9ICtzZWcuZGF0YVsxXTtcbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIHggKz0gcGF0aC54O1xuICAgICAgICAgICAgeSArPSBwYXRoLnk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCB4MSA9IHg7XG4gICAgICAgICAgbGV0IHkxID0geTtcbiAgICAgICAgICBsZXQgcHJldktleSA9IHByZXZTZWcgPyBwcmV2U2VnLmtleSA6IFwiXCI7XG4gICAgICAgICAgdmFyIHJlZiA9IG51bGw7XG4gICAgICAgICAgaWYgKHByZXZLZXkgPT0gJ3EnIHx8IHByZXZLZXkgPT0gJ1EnIHx8IHByZXZLZXkgPT0gJ3QnIHx8IHByZXZLZXkgPT0gJ1QnKSB7XG4gICAgICAgICAgICByZWYgPSBwYXRoLnF1YWRSZWZsZWN0aW9uUG9pbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIHgxID0gcmVmWzBdO1xuICAgICAgICAgICAgeTEgPSByZWZbMV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBvZmZzZXQxID0gMSAqICgxICsgby5yb3VnaG5lc3MgKiAwLjIpO1xuICAgICAgICAgIGxldCBvZmZzZXQyID0gMS41ICogKDEgKyBvLnJvdWdobmVzcyAqIDAuMjIpO1xuICAgICAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3BhdGgueCArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyksIHBhdGgueSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyldIH0pO1xuICAgICAgICAgIGxldCBmID0gW3ggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLCB5ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQxLCBvZmZzZXQxLCBvKV07XG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6ICdxY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDEsIG9mZnNldDEsIG8pLCB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0MSwgb2Zmc2V0MSwgbyksXG4gICAgICAgICAgICAgIGZbMF0sIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvcHMucHVzaCh7IG9wOiAnbW92ZScsIGRhdGE6IFtwYXRoLnggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCBwYXRoLnkgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pXSB9KTtcbiAgICAgICAgICBmID0gW3ggKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCB5ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQyLCBvZmZzZXQyLCBvKV07XG4gICAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgICAgb3A6ICdxY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldDIsIG9mZnNldDIsIG8pLCB5MSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0Miwgb2Zmc2V0MiwgbyksXG4gICAgICAgICAgICAgIGZbMF0sIGZbMV1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwYXRoLnNldFBvc2l0aW9uKGZbMF0sIGZbMV0pO1xuICAgICAgICAgIHBhdGgucXVhZFJlZmxlY3Rpb25Qb2ludCA9IFt4ICsgKHggLSB4MSksIHkgKyAoeSAtIHkxKV07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdBJzpcbiAgICAgIGNhc2UgJ2EnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gc2VnLmtleSA9PT0gJ2EnO1xuICAgICAgICBpZiAoc2VnLmRhdGEubGVuZ3RoID49IDcpIHtcbiAgICAgICAgICBsZXQgcnggPSArc2VnLmRhdGFbMF07XG4gICAgICAgICAgbGV0IHJ5ID0gK3NlZy5kYXRhWzFdO1xuICAgICAgICAgIGxldCBhbmdsZSA9ICtzZWcuZGF0YVsyXTtcbiAgICAgICAgICBsZXQgbGFyZ2VBcmNGbGFnID0gK3NlZy5kYXRhWzNdO1xuICAgICAgICAgIGxldCBzd2VlcEZsYWcgPSArc2VnLmRhdGFbNF07XG4gICAgICAgICAgbGV0IHggPSArc2VnLmRhdGFbNV07XG4gICAgICAgICAgbGV0IHkgPSArc2VnLmRhdGFbNl07XG4gICAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICB4ICs9IHBhdGgueDtcbiAgICAgICAgICAgIHkgKz0gcGF0aC55O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCA9PSBwYXRoLnggJiYgeSA9PSBwYXRoLnkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocnggPT0gMCB8fCByeSA9PSAwKSB7XG4gICAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocGF0aC54LCBwYXRoLnksIHgsIHksIG8pKTtcbiAgICAgICAgICAgIHBhdGguc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaW5hbCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgcm8gPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XG4gICAgICAgICAgICAgIGxldCBhcmNDb252ZXJ0ZXIgPSBuZXcgUm91Z2hBcmNDb252ZXJ0ZXIoXG4gICAgICAgICAgICAgICAgW3BhdGgueCwgcGF0aC55XSxcbiAgICAgICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICAgICAgW3J4LCByeV0sXG4gICAgICAgICAgICAgICAgYW5nbGUsXG4gICAgICAgICAgICAgICAgbGFyZ2VBcmNGbGFnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHN3ZWVwRmxhZyA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBsZXQgc2VnbWVudCA9IGFyY0NvbnZlcnRlci5nZXROZXh0U2VnbWVudCgpO1xuICAgICAgICAgICAgICB3aGlsZSAoc2VnbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBvYiA9IHRoaXMuX2JlemllclRvKHNlZ21lbnQuY3AxWzBdLCBzZWdtZW50LmNwMVsxXSwgc2VnbWVudC5jcDJbMF0sIHNlZ21lbnQuY3AyWzFdLCBzZWdtZW50LnRvWzBdLCBzZWdtZW50LnRvWzFdLCBwYXRoLCBvKTtcbiAgICAgICAgICAgICAgICBvcHMgPSBvcHMuY29uY2F0KG9iKTtcbiAgICAgICAgICAgICAgICBzZWdtZW50ID0gYXJjQ29udmVydGVyLmdldE5leHRTZWdtZW50KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG9wcztcbiAgfVxuXG4gIF9nZXRPZmZzZXQobWluLCBtYXgsIG9wcykge1xuICAgIHJldHVybiBvcHMucm91Z2huZXNzICogKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluKTtcbiAgfVxuXG4gIF9hZmZpbmUoeCwgeSwgY3gsIGN5LCBzaW5BbmdsZVByaW1lLCBjb3NBbmdsZVByaW1lLCBSKSB7XG4gICAgdmFyIEEgPSAtY3ggKiBjb3NBbmdsZVByaW1lIC0gY3kgKiBzaW5BbmdsZVByaW1lICsgY3g7XG4gICAgdmFyIEIgPSBSICogKGN4ICogc2luQW5nbGVQcmltZSAtIGN5ICogY29zQW5nbGVQcmltZSkgKyBjeTtcbiAgICB2YXIgQyA9IGNvc0FuZ2xlUHJpbWU7XG4gICAgdmFyIEQgPSBzaW5BbmdsZVByaW1lO1xuICAgIHZhciBFID0gLVIgKiBzaW5BbmdsZVByaW1lO1xuICAgIHZhciBGID0gUiAqIGNvc0FuZ2xlUHJpbWU7XG4gICAgcmV0dXJuIFtcbiAgICAgIEEgKyBDICogeCArIEQgKiB5LFxuICAgICAgQiArIEUgKiB4ICsgRiAqIHlcbiAgICBdO1xuICB9XG5cbiAgX2RvdWJsZUxpbmUoeDEsIHkxLCB4MiwgeTIsIG8pIHtcbiAgICBjb25zdCBvMSA9IHRoaXMuX2xpbmUoeDEsIHkxLCB4MiwgeTIsIG8sIHRydWUsIGZhbHNlKTtcbiAgICBjb25zdCBvMiA9IHRoaXMuX2xpbmUoeDEsIHkxLCB4MiwgeTIsIG8sIHRydWUsIHRydWUpO1xuICAgIHJldHVybiBvMS5jb25jYXQobzIpO1xuICB9XG5cbiAgX2xpbmUoeDEsIHkxLCB4MiwgeTIsIG8sIG1vdmUsIG92ZXJsYXkpIHtcbiAgICBjb25zdCBsZW5ndGhTcSA9IE1hdGgucG93KCh4MSAtIHgyKSwgMikgKyBNYXRoLnBvdygoeTEgLSB5MiksIDIpO1xuICAgIGxldCBvZmZzZXQgPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQgfHwgMDtcbiAgICBpZiAoKG9mZnNldCAqIG9mZnNldCAqIDEwMCkgPiBsZW5ndGhTcSkge1xuICAgICAgb2Zmc2V0ID0gTWF0aC5zcXJ0KGxlbmd0aFNxKSAvIDEwO1xuICAgIH1cbiAgICBjb25zdCBoYWxmT2Zmc2V0ID0gb2Zmc2V0IC8gMjtcbiAgICBjb25zdCBkaXZlcmdlUG9pbnQgPSAwLjIgKyBNYXRoLnJhbmRvbSgpICogMC4yO1xuICAgIGxldCBtaWREaXNwWCA9IG8uYm93aW5nICogby5tYXhSYW5kb21uZXNzT2Zmc2V0ICogKHkyIC0geTEpIC8gMjAwO1xuICAgIGxldCBtaWREaXNwWSA9IG8uYm93aW5nICogby5tYXhSYW5kb21uZXNzT2Zmc2V0ICogKHgxIC0geDIpIC8gMjAwO1xuICAgIG1pZERpc3BYID0gdGhpcy5fZ2V0T2Zmc2V0KC1taWREaXNwWCwgbWlkRGlzcFgsIG8pO1xuICAgIG1pZERpc3BZID0gdGhpcy5fZ2V0T2Zmc2V0KC1taWREaXNwWSwgbWlkRGlzcFksIG8pO1xuICAgIGxldCBvcHMgPSBbXTtcbiAgICBpZiAobW92ZSkge1xuICAgICAgaWYgKG92ZXJsYXkpIHtcbiAgICAgICAgb3BzLnB1c2goe1xuICAgICAgICAgIG9wOiAnbW92ZScsIGRhdGE6IFtcbiAgICAgICAgICAgIHgxICsgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKSxcbiAgICAgICAgICAgIHkxICsgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKVxuICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHMucHVzaCh7XG4gICAgICAgICAgb3A6ICdtb3ZlJywgZGF0YTogW1xuICAgICAgICAgICAgeDEgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgICAgIHkxICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbylcbiAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3ZlcmxheSkge1xuICAgICAgb3BzLnB1c2goe1xuICAgICAgICBvcDogJ2JjdXJ2ZVRvJywgZGF0YTogW1xuICAgICAgICAgIG1pZERpc3BYICsgeDEgKyAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIG1pZERpc3BZICsgeTEgKyAoeTIgLSB5MSkgKiBkaXZlcmdlUG9pbnQgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIG1pZERpc3BYICsgeDEgKyAyICogKHgyIC0geDEpICogZGl2ZXJnZVBvaW50ICsgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKSxcbiAgICAgICAgICBtaWREaXNwWSArIHkxICsgMiAqICh5MiAtIHkxKSAqIGRpdmVyZ2VQb2ludCArIHRoaXMuX2dldE9mZnNldCgtaGFsZk9mZnNldCwgaGFsZk9mZnNldCwgbyksXG4gICAgICAgICAgeDIgKyB0aGlzLl9nZXRPZmZzZXQoLWhhbGZPZmZzZXQsIGhhbGZPZmZzZXQsIG8pLFxuICAgICAgICAgIHkyICsgdGhpcy5fZ2V0T2Zmc2V0KC1oYWxmT2Zmc2V0LCBoYWxmT2Zmc2V0LCBvKVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3BzLnB1c2goe1xuICAgICAgICBvcDogJ2JjdXJ2ZVRvJywgZGF0YTogW1xuICAgICAgICAgIG1pZERpc3BYICsgeDEgKyAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgICBtaWREaXNwWSArIHkxICsgKHkyIC0geTEpICogZGl2ZXJnZVBvaW50ICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgbWlkRGlzcFggKyB4MSArIDIgKiAoeDIgLSB4MSkgKiBkaXZlcmdlUG9pbnQgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgICAgICBtaWREaXNwWSArIHkxICsgMiAqICh5MiAtIHkxKSAqIGRpdmVyZ2VQb2ludCArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICAgIHgyICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgeTIgKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG9wcztcbiAgfVxuXG4gIF9jdXJ2ZShwb2ludHMsIGNsb3NlUG9pbnQsIG8pIHtcbiAgICBjb25zdCBsZW4gPSBwb2ludHMubGVuZ3RoO1xuICAgIGxldCBvcHMgPSBbXTtcbiAgICBpZiAobGVuID4gMykge1xuICAgICAgY29uc3QgYiA9IFtdO1xuICAgICAgY29uc3QgcyA9IDEgLSBvLmN1cnZlVGlnaHRuZXNzO1xuICAgICAgb3BzLnB1c2goeyBvcDogJ21vdmUnLCBkYXRhOiBbcG9pbnRzWzFdWzBdLCBwb2ludHNbMV1bMV1dIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IChpICsgMikgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBjYWNoZWRWZXJ0QXJyYXkgPSBwb2ludHNbaV07XG4gICAgICAgIGJbMF0gPSBbY2FjaGVkVmVydEFycmF5WzBdLCBjYWNoZWRWZXJ0QXJyYXlbMV1dO1xuICAgICAgICBiWzFdID0gW2NhY2hlZFZlcnRBcnJheVswXSArIChzICogcG9pbnRzW2kgKyAxXVswXSAtIHMgKiBwb2ludHNbaSAtIDFdWzBdKSAvIDYsIGNhY2hlZFZlcnRBcnJheVsxXSArIChzICogcG9pbnRzW2kgKyAxXVsxXSAtIHMgKiBwb2ludHNbaSAtIDFdWzFdKSAvIDZdO1xuICAgICAgICBiWzJdID0gW3BvaW50c1tpICsgMV1bMF0gKyAocyAqIHBvaW50c1tpXVswXSAtIHMgKiBwb2ludHNbaSArIDJdWzBdKSAvIDYsIHBvaW50c1tpICsgMV1bMV0gKyAocyAqIHBvaW50c1tpXVsxXSAtIHMgKiBwb2ludHNbaSArIDJdWzFdKSAvIDZdO1xuICAgICAgICBiWzNdID0gW3BvaW50c1tpICsgMV1bMF0sIHBvaW50c1tpICsgMV1bMV1dO1xuICAgICAgICBvcHMucHVzaCh7IG9wOiAnYmN1cnZlVG8nLCBkYXRhOiBbYlsxXVswXSwgYlsxXVsxXSwgYlsyXVswXSwgYlsyXVsxXSwgYlszXVswXSwgYlszXVsxXV0gfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2xvc2VQb2ludCAmJiBjbG9zZVBvaW50Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICBsZXQgcm8gPSBvLm1heFJhbmRvbW5lc3NPZmZzZXQ7XG4gICAgICAgIC8vIFRPRE86IG1vcmUgcm91Z2huZXNzIGhlcmU/XG4gICAgICAgIG9wcy5wdXNoKHsgb3BzOiAnbGluZVRvJywgZGF0YTogW2Nsb3NlUG9pbnRbMF0gKyB0aGlzLl9nZXRPZmZzZXQoLXJvLCBybywgbyksIGNsb3NlUG9pbnRbMV0gKyArIHRoaXMuX2dldE9mZnNldCgtcm8sIHJvLCBvKV0gfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChsZW4gPT09IDMpIHtcbiAgICAgIG9wcy5wdXNoKHsgb3A6ICdtb3ZlJywgZGF0YTogW3BvaW50c1sxXVswXSwgcG9pbnRzWzFdWzFdXSB9KTtcbiAgICAgIG9wcy5wdXNoKHtcbiAgICAgICAgb3A6ICdiY3VydmVUbycsIGRhdGE6IFtcbiAgICAgICAgICBwb2ludHNbMV1bMF0sIHBvaW50c1sxXVsxXSxcbiAgICAgICAgICBwb2ludHNbMl1bMF0sIHBvaW50c1syXVsxXSxcbiAgICAgICAgICBwb2ludHNbMl1bMF0sIHBvaW50c1syXVsxXV1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XG4gICAgICBvcHMgPSBvcHMuY29uY2F0KHRoaXMuX2RvdWJsZUxpbmUocG9pbnRzWzBdWzBdLCBwb2ludHNbMF1bMV0sIHBvaW50c1sxXVswXSwgcG9pbnRzWzFdWzFdLCBvKSk7XG4gICAgfVxuICAgIHJldHVybiBvcHM7XG4gIH1cblxuICBfZWxsaXBzZShpbmNyZW1lbnQsIGN4LCBjeSwgcngsIHJ5LCBvZmZzZXQsIG92ZXJsYXAsIG8pIHtcbiAgICBjb25zdCByYWRPZmZzZXQgPSB0aGlzLl9nZXRPZmZzZXQoLTAuNSwgMC41LCBvKSAtIChNYXRoLlBJIC8gMik7XG4gICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeCArIDAuOSAqIHJ4ICogTWF0aC5jb3MocmFkT2Zmc2V0IC0gaW5jcmVtZW50KSxcbiAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICsgY3kgKyAwLjkgKiByeSAqIE1hdGguc2luKHJhZE9mZnNldCAtIGluY3JlbWVudClcbiAgICBdKTtcbiAgICBmb3IgKGxldCBhbmdsZSA9IHJhZE9mZnNldDsgYW5nbGUgPCAoTWF0aC5QSSAqIDIgKyByYWRPZmZzZXQgLSAwLjAxKTsgYW5nbGUgPSBhbmdsZSArIGluY3JlbWVudCkge1xuICAgICAgcG9pbnRzLnB1c2goW1xuICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN4ICsgcnggKiBNYXRoLmNvcyhhbmdsZSksXG4gICAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICsgY3kgKyByeSAqIE1hdGguc2luKGFuZ2xlKVxuICAgICAgXSk7XG4gICAgfVxuICAgIHBvaW50cy5wdXNoKFtcbiAgICAgIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pICsgY3ggKyByeCAqIE1hdGguY29zKHJhZE9mZnNldCArIE1hdGguUEkgKiAyICsgb3ZlcmxhcCAqIDAuNSksXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN5ICsgcnkgKiBNYXRoLnNpbihyYWRPZmZzZXQgKyBNYXRoLlBJICogMiArIG92ZXJsYXAgKiAwLjUpXG4gICAgXSk7XG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeCArIDAuOTggKiByeCAqIE1hdGguY29zKHJhZE9mZnNldCArIG92ZXJsYXApLFxuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeSArIDAuOTggKiByeSAqIE1hdGguc2luKHJhZE9mZnNldCArIG92ZXJsYXApXG4gICAgXSk7XG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeCArIDAuOSAqIHJ4ICogTWF0aC5jb3MocmFkT2Zmc2V0ICsgb3ZlcmxhcCAqIDAuNSksXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN5ICsgMC45ICogcnkgKiBNYXRoLnNpbihyYWRPZmZzZXQgKyBvdmVybGFwICogMC41KVxuICAgIF0pO1xuICAgIHJldHVybiB0aGlzLl9jdXJ2ZShwb2ludHMsIG51bGwsIG8pO1xuICB9XG5cbiAgX2N1cnZlV2l0aE9mZnNldChwb2ludHMsIG9mZnNldCwgbykge1xuICAgIGNvbnN0IHBzID0gW107XG4gICAgcHMucHVzaChbXG4gICAgICBwb2ludHNbMF1bMF0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgIHBvaW50c1swXVsxXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgIF0pO1xuICAgIHBzLnB1c2goW1xuICAgICAgcG9pbnRzWzBdWzBdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICBwb2ludHNbMF1bMV0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICBdKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgcHMucHVzaChbXG4gICAgICAgIHBvaW50c1tpXVswXSArIHRoaXMuX2dldE9mZnNldCgtb2Zmc2V0LCBvZmZzZXQsIG8pLFxuICAgICAgICBwb2ludHNbaV1bMV0gKyB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSxcbiAgICAgIF0pO1xuICAgICAgaWYgKGkgPT09IChwb2ludHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgcHMucHVzaChbXG4gICAgICAgICAgcG9pbnRzW2ldWzBdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgICAgcG9pbnRzW2ldWzFdICsgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbyksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VydmUocHMsIG51bGwsIG8pO1xuICB9XG5cbiAgX2FyYyhpbmNyZW1lbnQsIGN4LCBjeSwgcngsIHJ5LCBzdHJ0LCBzdHAsIG9mZnNldCwgbykge1xuICAgIGNvbnN0IHJhZE9mZnNldCA9IHN0cnQgKyB0aGlzLl9nZXRPZmZzZXQoLTAuMSwgMC4xLCBvKTtcbiAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICBwb2ludHMucHVzaChbXG4gICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN4ICsgMC45ICogcnggKiBNYXRoLmNvcyhyYWRPZmZzZXQgLSBpbmNyZW1lbnQpLFxuICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeSArIDAuOSAqIHJ5ICogTWF0aC5zaW4ocmFkT2Zmc2V0IC0gaW5jcmVtZW50KVxuICAgIF0pO1xuICAgIGZvciAobGV0IGFuZ2xlID0gcmFkT2Zmc2V0OyBhbmdsZSA8PSBzdHA7IGFuZ2xlID0gYW5nbGUgKyBpbmNyZW1lbnQpIHtcbiAgICAgIHBvaW50cy5wdXNoKFtcbiAgICAgICAgdGhpcy5fZ2V0T2Zmc2V0KC1vZmZzZXQsIG9mZnNldCwgbykgKyBjeCArIHJ4ICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICB0aGlzLl9nZXRPZmZzZXQoLW9mZnNldCwgb2Zmc2V0LCBvKSArIGN5ICsgcnkgKiBNYXRoLnNpbihhbmdsZSlcbiAgICAgIF0pO1xuICAgIH1cbiAgICBwb2ludHMucHVzaChbXG4gICAgICBjeCArIHJ4ICogTWF0aC5jb3Moc3RwKSxcbiAgICAgIGN5ICsgcnkgKiBNYXRoLnNpbihzdHApXG4gICAgXSk7XG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgY3ggKyByeCAqIE1hdGguY29zKHN0cCksXG4gICAgICBjeSArIHJ5ICogTWF0aC5zaW4oc3RwKVxuICAgIF0pO1xuICAgIHJldHVybiB0aGlzLl9jdXJ2ZShwb2ludHMsIG51bGwsIG8pO1xuICB9XG5cbiAgX2dldEludGVyc2VjdGluZ0xpbmVzKGxpbmVDb29yZHMsIHhDb29yZHMsIHlDb29yZHMpIHtcbiAgICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtdO1xuICAgIHZhciBzMSA9IG5ldyBSb3VnaFNlZ21lbnQobGluZUNvb3Jkc1swXSwgbGluZUNvb3Jkc1sxXSwgbGluZUNvb3Jkc1syXSwgbGluZUNvb3Jkc1szXSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Q29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgczIgPSBuZXcgUm91Z2hTZWdtZW50KHhDb29yZHNbaV0sIHlDb29yZHNbaV0sIHhDb29yZHNbKGkgKyAxKSAlIHhDb29yZHMubGVuZ3RoXSwgeUNvb3Jkc1soaSArIDEpICUgeENvb3Jkcy5sZW5ndGhdKTtcbiAgICAgIGlmIChzMS5jb21wYXJlKHMyKSA9PSBSb3VnaFNlZ21lbnRSZWxhdGlvbigpLklOVEVSU0VDVFMpIHtcbiAgICAgICAgaW50ZXJzZWN0aW9ucy5wdXNoKFtzMS54aSwgczEueWldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIH1cbn0iLCJpbXBvcnQgeyBSb3VnaFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlci5qcyc7XG5zZWxmLl9yb3VnaFNjcmlwdCA9IHNlbGYuZG9jdW1lbnQgJiYgc2VsZi5kb2N1bWVudC5jdXJyZW50U2NyaXB0ICYmIHNlbGYuZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cbmV4cG9ydCBjbGFzcyBSb3VnaEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZywgY2FudmFzKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIG1heFJhbmRvbW5lc3NPZmZzZXQ6IDIsXG4gICAgICByb3VnaG5lc3M6IDEsXG4gICAgICBib3dpbmc6IDEsXG4gICAgICBzdHJva2U6ICcjMDAwJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAxLFxuICAgICAgY3VydmVUaWdodG5lc3M6IDAsXG4gICAgICBjdXJ2ZVN0ZXBDb3VudDogOSxcbiAgICAgIGZpbGw6IG51bGwsXG4gICAgICBmaWxsU3R5bGU6ICdoYWNodXJlJyxcbiAgICAgIGZpbGxXZWlnaHQ6IC0xLFxuICAgICAgaGFjaHVyZUFuZ2xlOiAtNDEsXG4gICAgICBoYWNodXJlR2FwOiAtMVxuICAgIH07XG4gICAgaWYgKHRoaXMuY29uZmlnLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB0aGlzLl9vcHRpb25zKHRoaXMuY29uZmlnLm9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIF9vcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpIDogdGhpcy5kZWZhdWx0T3B0aW9ucztcbiAgfVxuXG4gIF9kcmF3YWJsZShzaGFwZSwgc2V0cywgb3B0aW9ucykge1xuICAgIHJldHVybiB7IHNoYXBlLCBzZXRzOiBzZXRzIHx8IFtdLCBvcHRpb25zOiBvcHRpb25zIHx8IHRoaXMuZGVmYXVsdE9wdGlvbnMgfTtcbiAgfVxuXG4gIGdldCBsaWIoKSB7XG4gICAgaWYgKCF0aGlzLl9yZW5kZXJlcikge1xuICAgICAgaWYgKHNlbGYgJiYgc2VsZi53b3JrbHkgJiYgdGhpcy5jb25maWcuYXN5bmMgJiYgKCF0aGlzLmNvbmZpZy5ub1dvcmtlcikpIHtcbiAgICAgICAgY29uc3QgdG9zID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgICAgICBjb25zdCB3b3JrbHlTb3VyY2UgPSB0aGlzLmNvbmZpZy53b3JrbHlVUkwgfHwgJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC9wc2hpaG4vd29ya2x5L2Rpc3Qvd29ya2x5Lm1pbi5qcyc7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyU291cmNlID0gdGhpcy5jb25maWcucm91Z2hVUkwgfHwgc2VsZi5fcm91Z2hTY3JpcHQ7XG4gICAgICAgIGlmIChyZW5kZXJlclNvdXJjZSAmJiB3b3JrbHlTb3VyY2UpIHtcbiAgICAgICAgICBsZXQgY29kZSA9IGBpbXBvcnRTY3JpcHRzKCcke3dvcmtseVNvdXJjZX0nLCAnJHtyZW5kZXJlclNvdXJjZX0nKTtcXG53b3JrbHkuZXhwb3NlKHNlbGYucm91Z2guY3JlYXRlUmVuZGVyZXIoKSk7YDtcbiAgICAgICAgICBsZXQgb3VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2NvZGVdKSk7XG4gICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSB3b3JrbHkucHJveHkob3VybCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgUm91Z2hSZW5kZXJlcigpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZW5kZXJlciA9IG5ldyBSb3VnaFJlbmRlcmVyKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yZW5kZXJlcjtcbiAgfVxuXG4gIGxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2xpbmUnLCBbdGhpcy5saWIubGluZSh4MSwgeTEsIHgyLCB5MiwgbyldLCBvKTtcbiAgfVxuXG4gIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBjb25zdCB4YyA9IFt4LCB4ICsgd2lkdGgsIHggKyB3aWR0aCwgeF07XG4gICAgICBjb25zdCB5YyA9IFt5LCB5LCB5ICsgaGVpZ2h0LCB5ICsgaGVpZ2h0XTtcbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBwYXRocy5wdXNoKHRoaXMubGliLnNvbGlkRmlsbFNoYXBlKHhjLCB5YywgbykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXRocy5wdXNoKHRoaXMubGliLmhhY2h1cmVGaWxsU2hhcGUoeGMsIHljLCBvKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGhzLnB1c2godGhpcy5saWIucmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ3JlY3RhbmdsZScsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5saWIuZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKTtcbiAgICAgICAgc2hhcGUudHlwZSA9ICdmaWxsUGF0aCc7XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaCh0aGlzLmxpYi5oYWNodXJlRmlsbEVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKHRoaXMubGliLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnZWxsaXBzZScsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSB0aGlzLmVsbGlwc2UoeCwgeSwgZGlhbWV0ZXIsIGRpYW1ldGVyLCBvcHRpb25zKTtcbiAgICByZXQuc2hhcGUgPSAnY2lyY2xlJztcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgbGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2xpbmVhclBhdGgnLCBbdGhpcy5saWIubGluZWFyUGF0aChwb2ludHMsIGZhbHNlLCBvKV0sIG8pO1xuICB9XG5cbiAgcG9seWdvbihwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChvLmZpbGwpIHtcbiAgICAgIGxldCB4YyA9IFtdLCB5YyA9IFtdO1xuICAgICAgZm9yIChsZXQgcCBvZiBwb2ludHMpIHtcbiAgICAgICAgeGMucHVzaChwWzBdKTtcbiAgICAgICAgeWMucHVzaChwWzFdKTtcbiAgICAgIH1cbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBwYXRocy5wdXNoKHRoaXMubGliLnNvbGlkRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaCh0aGlzLmxpYi5oYWNodXJlRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKHRoaXMubGliLmxpbmVhclBhdGgocG9pbnRzLCB0cnVlLCBvKSk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdwb2x5Z29uJywgcGF0aHMsIG8pO1xuICB9XG5cbiAgYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChjbG9zZWQgJiYgby5maWxsKSB7XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5saWIuYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCB0cnVlLCBmYWxzZSwgbyk7XG4gICAgICAgIHNoYXBlLnR5cGUgPSAnZmlsbFBhdGgnO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2godGhpcy5saWIuaGFjaHVyZUZpbGxBcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaCh0aGlzLmxpYi5hcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgdHJ1ZSwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnYXJjJywgcGF0aHMsIG8pO1xuICB9XG5cbiAgY3VydmUocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdjdXJ2ZScsIFt0aGlzLmxpYi5jdXJ2ZShwb2ludHMsIG8pXSwgbyk7XG4gIH1cblxuICBwYXRoKGQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmICghZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdwYXRoJywgcGF0aHMsIG8pO1xuICAgIH1cbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgbGV0IHNoYXBlID0geyB0eXBlOiAncGF0aDJEZmlsbCcsIHBhdGg6IGQgfTtcbiAgICAgICAgcGF0aHMucHVzaChzaGFwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5fY29tcHV0ZVBhdGhTaXplKGQpO1xuICAgICAgICBsZXQgeGMgPSBbMCwgc2l6ZVswXSwgc2l6ZVswXSwgMF07XG4gICAgICAgIGxldCB5YyA9IFswLCAwLCBzaXplWzFdLCBzaXplWzFdXTtcbiAgICAgICAgbGV0IHNoYXBlID0gdGhpcy5saWIuaGFjaHVyZUZpbGxTaGFwZSh4YywgeWMsIG8pO1xuICAgICAgICBzaGFwZS50eXBlID0gJ3BhdGgyRHBhdHRlcm4nO1xuICAgICAgICBzaGFwZS5zaXplID0gc2l6ZTtcbiAgICAgICAgc2hhcGUucGF0aCA9IGQ7XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKHRoaXMubGliLnN2Z1BhdGgoZCwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncGF0aCcsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIHRvUGF0aHMoZHJhd2FibGUpIHtcbiAgICBjb25zdCBzZXRzID0gZHJhd2FibGUuc2V0cyB8fCBbXTtcbiAgICBjb25zdCBvID0gZHJhd2FibGUub3B0aW9ucyB8fCB0aGlzLmRlZmF1bHRPcHRpb25zO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgZm9yIChjb25zdCBkcmF3aW5nIG9mIHNldHMpIHtcbiAgICAgIGxldCBwYXRoID0gbnVsbDtcbiAgICAgIHN3aXRjaCAoZHJhd2luZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIHBhdGggPSB7XG4gICAgICAgICAgICBkOiB0aGlzLm9wc1RvUGF0aChkcmF3aW5nKSxcbiAgICAgICAgICAgIHN0cm9rZTogby5zdHJva2UsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogby5zdHJva2VXaWR0aCxcbiAgICAgICAgICAgIGZpbGw6ICdub25lJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbGxQYXRoJzpcbiAgICAgICAgICBwYXRoID0ge1xuICAgICAgICAgICAgZDogdGhpcy5vcHNUb1BhdGgoZHJhd2luZyksXG4gICAgICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgICAgICAgICAgZmlsbDogby5maWxsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmlsbFNrZXRjaCc6XG4gICAgICAgICAgcGF0aCA9IHRoaXMuX2ZpbGxTa2V0Y2goZHJhd2luZywgbyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3BhdGgyRGZpbGwnOlxuICAgICAgICAgIHBhdGggPSB7XG4gICAgICAgICAgICBkOiBkcmF3aW5nLnBhdGgsXG4gICAgICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLFxuICAgICAgICAgICAgZmlsbDogby5maWxsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGF0aDJEcGF0dGVybic6IHtcbiAgICAgICAgICBjb25zdCBzaXplID0gZHJhd2luZy5zaXplO1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm4gPSB7XG4gICAgICAgICAgICB4OiAwLCB5OiAwLCB3aWR0aDogMSwgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgdmlld0JveDogYDAgMCAke01hdGgucm91bmQoc2l6ZVswXSl9ICR7TWF0aC5yb3VuZChzaXplWzFdKX1gLFxuICAgICAgICAgICAgcGF0dGVyblVuaXRzOiAnb2JqZWN0Qm91bmRpbmdCb3gnLFxuICAgICAgICAgICAgcGF0aDogdGhpcy5fZmlsbFNrZXRjaChkcmF3aW5nLCBvKVxuICAgICAgICAgIH07XG4gICAgICAgICAgcGF0aCA9IHtcbiAgICAgICAgICAgIGQ6IGRyYXdpbmcucGF0aCxcbiAgICAgICAgICAgIHN0cm9rZTogJ25vbmUnLFxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgX2ZpbGxTa2V0Y2goZHJhd2luZywgbykge1xuICAgIGxldCBmd2VpZ2h0ID0gby5maWxsV2VpZ2h0O1xuICAgIGlmIChmd2VpZ2h0IDwgMCkge1xuICAgICAgZndlaWdodCA9IG8uc3Ryb2tlV2lkdGggLyAyO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZDogdGhpcy5vcHNUb1BhdGgoZHJhd2luZyksXG4gICAgICBzdHJva2U6IG8uZmlsbCxcbiAgICAgIHN0cm9rZVdpZHRoOiBmd2VpZ2h0LFxuICAgICAgZmlsbDogJ25vbmUnXG4gICAgfTtcbiAgfVxuXG4gIG9wc1RvUGF0aChkcmF3aW5nKSB7XG4gICAgbGV0IHBhdGggPSAnJztcbiAgICBmb3IgKGxldCBpdGVtIG9mIGRyYXdpbmcub3BzKSB7XG4gICAgICBjb25zdCBkYXRhID0gaXRlbS5kYXRhO1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgIHBhdGggKz0gYE0ke2RhdGFbMF19ICR7ZGF0YVsxXX0gYDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYmN1cnZlVG8nOlxuICAgICAgICAgIHBhdGggKz0gYEMke2RhdGFbMF19ICR7ZGF0YVsxXX0sICR7ZGF0YVsyXX0gJHtkYXRhWzNdfSwgJHtkYXRhWzRdfSAke2RhdGFbNV19IGA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3FjdXJ2ZVRvJzpcbiAgICAgICAgICBwYXRoICs9IGBRJHtkYXRhWzBdfSAke2RhdGFbMV19LCAke2RhdGFbMl19ICR7ZGF0YVszXX0gYDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbGluZVRvJzpcbiAgICAgICAgICBwYXRoICs9IGBMJHtkYXRhWzBdfSAke2RhdGFbMV19IGA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoLnRyaW0oKTtcbiAgfVxuXG4gIF9jb21wdXRlUGF0aFNpemUoZCkge1xuICAgIGxldCBzaXplID0gWzAsIDBdO1xuICAgIGlmIChzZWxmLmRvY3VtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbiAgICAgICAgbGV0IHN2ZyA9IHNlbGYuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBcInN2Z1wiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFwiMFwiKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjBcIik7XG4gICAgICAgIGxldCBwYXRoTm9kZSA9IHNlbGYuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBcInBhdGhcIik7XG4gICAgICAgIHBhdGhOb2RlLnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgICAgICBzdmcuYXBwZW5kQ2hpbGQocGF0aE5vZGUpO1xuICAgICAgICBzZWxmLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICAgICAgbGV0IGJiID0gcGF0aE5vZGUuZ2V0QkJveCgpXG4gICAgICAgIGlmIChiYikge1xuICAgICAgICAgIHNpemVbMF0gPSBiYi53aWR0aCB8fCAwO1xuICAgICAgICAgIHNpemVbMV0gPSBiYi5oZWlnaHQgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc3ZnKTtcbiAgICAgIH0gY2F0Y2ggKGVycikgeyB9XG4gICAgfVxuICAgIGNvbnN0IGNhbnZhc1NpemUgPSB0aGlzLl9jYW52YXNTaXplKCk7XG4gICAgaWYgKCEoc2l6ZVswXSAqIHNpemVbMV0pKSB7XG4gICAgICBzaXplID0gY2FudmFzU2l6ZTtcbiAgICB9XG4gICAgc2l6ZVswXSA9IE1hdGgubWluKHNpemVbMF0sIGNhbnZhc1NpemVbMF0pO1xuICAgIHNpemVbMV0gPSBNYXRoLm1pbihzaXplWzFdLCBjYW52YXNTaXplWzFdKTtcbiAgICByZXR1cm4gc2l6ZTtcbiAgfVxuXG4gIF9jYW52YXNTaXplKCkge1xuICAgIGNvbnN0IHZhbCA9IHcgPT4ge1xuICAgICAgaWYgKHcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmICh3LmJhc2VWYWwgJiYgdy5iYXNlVmFsLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdy5iYXNlVmFsLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHcgfHwgMTAwO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzID8gW3ZhbCh0aGlzLmNhbnZhcy53aWR0aCksIHZhbCh0aGlzLmNhbnZhcy5oZWlnaHQpXSA6IFsxMDAsIDEwMF07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoR2VuZXJhdG9yQXN5bmMgZXh0ZW5kcyBSb3VnaEdlbmVyYXRvciB7XG4gIGFzeW5jIGxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2xpbmUnLCBbYXdhaXQgdGhpcy5saWIubGluZSh4MSwgeTEsIHgyLCB5MiwgbyldLCBvKTtcbiAgfVxuXG4gIGFzeW5jIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBjb25zdCB4YyA9IFt4LCB4ICsgd2lkdGgsIHggKyB3aWR0aCwgeF07XG4gICAgICBjb25zdCB5YyA9IFt5LCB5LCB5ICsgaGVpZ2h0LCB5ICsgaGVpZ2h0XTtcbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLnNvbGlkRmlsbFNoYXBlKHhjLCB5YywgbykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLmhhY2h1cmVGaWxsU2hhcGUoeGMsIHljLCBvKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGhzLnB1c2goYXdhaXQgdGhpcy5saWIucmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG8pKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ3JlY3RhbmdsZScsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGFzeW5jIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGNvbnN0IG8gPSB0aGlzLl9vcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgaWYgKG8uZmlsbCkge1xuICAgICAgaWYgKG8uZmlsbFN0eWxlID09PSAnc29saWQnKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gYXdhaXQgdGhpcy5saWIuZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvKTtcbiAgICAgICAgc2hhcGUudHlwZSA9ICdmaWxsUGF0aCc7XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5oYWNodXJlRmlsbEVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLmVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnZWxsaXBzZScsIHBhdGhzLCBvKTtcbiAgfVxuXG4gIGFzeW5jIGNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSBhd2FpdCB0aGlzLmVsbGlwc2UoeCwgeSwgZGlhbWV0ZXIsIGRpYW1ldGVyLCBvcHRpb25zKTtcbiAgICByZXQuc2hhcGUgPSAnY2lyY2xlJztcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgYXN5bmMgbGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2FibGUoJ2xpbmVhclBhdGgnLCBbYXdhaXQgdGhpcy5saWIubGluZWFyUGF0aChwb2ludHMsIGZhbHNlLCBvKV0sIG8pO1xuICB9XG5cbiAgYXN5bmMgcG9seWdvbihwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChvLmZpbGwpIHtcbiAgICAgIGxldCB4YyA9IFtdLCB5YyA9IFtdO1xuICAgICAgZm9yIChsZXQgcCBvZiBwb2ludHMpIHtcbiAgICAgICAgeGMucHVzaChwWzBdKTtcbiAgICAgICAgeWMucHVzaChwWzFdKTtcbiAgICAgIH1cbiAgICAgIGlmIChvLmZpbGxTdHlsZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLnNvbGlkRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5oYWNodXJlRmlsbFNoYXBlKHhjLCB5YywgbykpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLmxpbmVhclBhdGgocG9pbnRzLCB0cnVlLCBvKSk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdwb2x5Z29uJywgcGF0aHMsIG8pO1xuICB9XG5cbiAgYXN5bmMgYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmIChjbG9zZWQgJiYgby5maWxsKSB7XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgbGV0IHNoYXBlID0gYXdhaXQgdGhpcy5saWIuYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCB0cnVlLCBmYWxzZSwgbyk7XG4gICAgICAgIHNoYXBlLnR5cGUgPSAnZmlsbFBhdGgnO1xuICAgICAgICBwYXRocy5wdXNoKHNoYXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhdGhzLnB1c2goYXdhaXQgdGhpcy5saWIuaGFjaHVyZUZpbGxBcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIG8pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0aHMucHVzaChhd2FpdCB0aGlzLmxpYi5hcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgdHJ1ZSwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgnYXJjJywgcGF0aHMsIG8pO1xuICB9XG5cbiAgYXN5bmMgY3VydmUocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbyA9IHRoaXMuX29wdGlvbnMob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdjdXJ2ZScsIFthd2FpdCB0aGlzLmxpYi5jdXJ2ZShwb2ludHMsIG8pXSwgbyk7XG4gIH1cblxuICBhc3luYyBwYXRoKGQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvID0gdGhpcy5fb3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGlmICghZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RyYXdhYmxlKCdwYXRoJywgcGF0aHMsIG8pO1xuICAgIH1cbiAgICBpZiAoby5maWxsKSB7XG4gICAgICBpZiAoby5maWxsU3R5bGUgPT09ICdzb2xpZCcpIHtcbiAgICAgICAgbGV0IHNoYXBlID0geyB0eXBlOiAncGF0aDJEZmlsbCcsIHBhdGg6IGQgfTtcbiAgICAgICAgcGF0aHMucHVzaChzaGFwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5fY29tcHV0ZVBhdGhTaXplKGQpO1xuICAgICAgICBsZXQgeGMgPSBbMCwgc2l6ZVswXSwgc2l6ZVswXSwgMF07XG4gICAgICAgIGxldCB5YyA9IFswLCAwLCBzaXplWzFdLCBzaXplWzFdXTtcbiAgICAgICAgbGV0IHNoYXBlID0gYXdhaXQgdGhpcy5saWIuaGFjaHVyZUZpbGxTaGFwZSh4YywgeWMsIG8pO1xuICAgICAgICBzaGFwZS50eXBlID0gJ3BhdGgyRHBhdHRlcm4nO1xuICAgICAgICBzaGFwZS5zaXplID0gc2l6ZTtcbiAgICAgICAgc2hhcGUucGF0aCA9IGQ7XG4gICAgICAgIHBhdGhzLnB1c2goc2hhcGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRocy5wdXNoKGF3YWl0IHRoaXMubGliLnN2Z1BhdGgoZCwgbykpO1xuICAgIHJldHVybiB0aGlzLl9kcmF3YWJsZSgncGF0aCcsIHBhdGhzLCBvKTtcbiAgfVxufSIsImltcG9ydCB7IFJvdWdoR2VuZXJhdG9yLCBSb3VnaEdlbmVyYXRvckFzeW5jIH0gZnJvbSAnLi9nZW5lcmF0b3IuanMnXG5pbXBvcnQgeyBSb3VnaFJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlci5qcyc7XG5cbmV4cG9ydCBjbGFzcyBSb3VnaENhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKGNhbnZhcywgY29uZmlnKSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgdGhpcy5faW5pdChjb25maWcpO1xuICB9XG5cbiAgX2luaXQoY29uZmlnKSB7XG4gICAgdGhpcy5nZW4gPSBuZXcgUm91Z2hHZW5lcmF0b3IoY29uZmlnLCB0aGlzLmNhbnZhcyk7XG4gIH1cblxuICBnZXQgZ2VuZXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmdlbjtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVSZW5kZXJlcigpIHtcbiAgICByZXR1cm4gbmV3IFJvdWdoUmVuZGVyZXIoKTtcbiAgfVxuXG4gIGxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmxpbmUoeDEsIHkxLCB4MiwgeTIsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5yZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5lbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4uY2lyY2xlKHgsIHksIGRpYW1ldGVyLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBsaW5lYXJQYXRoKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4ubGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5wb2x5Z29uKHBvaW50cywgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBjdXJ2ZShwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmN1cnZlKHBvaW50cywgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgcGF0aChkLCBvcHRpb25zKSB7XG4gICAgbGV0IGRyYXdpbmcgPSB0aGlzLmdlbi5wYXRoKGQsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkcmF3aW5nKTtcbiAgICByZXR1cm4gZHJhd2luZztcbiAgfVxuXG4gIGRyYXcoZHJhd2FibGUpIHtcbiAgICBsZXQgc2V0cyA9IGRyYXdhYmxlLnNldHMgfHwgW107XG4gICAgbGV0IG8gPSBkcmF3YWJsZS5vcHRpb25zIHx8IHRoaXMuZ2VuLmRlZmF1bHRPcHRpb25zO1xuICAgIGxldCBjdHggPSB0aGlzLmN0eDtcbiAgICBmb3IgKGxldCBkcmF3aW5nIG9mIHNldHMpIHtcbiAgICAgIHN3aXRjaCAoZHJhd2luZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gby5zdHJva2U7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IG8uc3Ryb2tlV2lkdGg7XG4gICAgICAgICAgdGhpcy5fZHJhd1RvQ29udGV4dChjdHgsIGRyYXdpbmcpO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbGxQYXRoJzpcbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBvLmZpbGw7XG4gICAgICAgICAgdGhpcy5fZHJhd1RvQ29udGV4dChjdHgsIGRyYXdpbmcsIG8pO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbGxTa2V0Y2gnOlxuICAgICAgICAgIHRoaXMuX2ZpbGxTa2V0Y2goY3R4LCBkcmF3aW5nLCBvKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGF0aDJEZmlsbCc6IHtcbiAgICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gby5maWxsO1xuICAgICAgICAgIGxldCBwMmQgPSBuZXcgUGF0aDJEKGRyYXdpbmcucGF0aCk7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbChwMmQpO1xuICAgICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdwYXRoMkRwYXR0ZXJuJzoge1xuICAgICAgICAgIGxldCBzaXplID0gZHJhd2luZy5zaXplO1xuICAgICAgICAgIGNvbnN0IGhjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICBjb25zdCBoY29udGV4dCA9IGhjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgIGxldCBiYm94ID0gdGhpcy5fY29tcHV0ZUJCb3goZHJhd2luZy5wYXRoKTtcbiAgICAgICAgICBpZiAoYmJveCAmJiAoYmJveC53aWR0aCB8fCBiYm94LmhlaWdodCkpIHtcbiAgICAgICAgICAgIGhjYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgICAgIGhjYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgICAgICAgICAgaGNvbnRleHQudHJhbnNsYXRlKGJib3gueCB8fCAwLCBiYm94LnkgfHwgMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhjYW52YXMud2lkdGggPSBzaXplWzBdO1xuICAgICAgICAgICAgaGNhbnZhcy5oZWlnaHQgPSBzaXplWzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9maWxsU2tldGNoKGhjb250ZXh0LCBkcmF3aW5nLCBvKTtcbiAgICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jdHguY3JlYXRlUGF0dGVybihoY2FudmFzLCAncmVwZWF0Jyk7XG4gICAgICAgICAgbGV0IHAyZCA9IG5ldyBQYXRoMkQoZHJhd2luZy5wYXRoKTtcbiAgICAgICAgICB0aGlzLmN0eC5maWxsKHAyZCk7XG4gICAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2NvbXB1dGVCQm94KGQpIHtcbiAgICBpZiAoc2VsZi5kb2N1bWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gICAgICAgIGxldCBzdmcgPSBzZWxmLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJzdmdcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjBcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIwXCIpO1xuICAgICAgICBsZXQgcGF0aE5vZGUgPSBzZWxmLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJwYXRoXCIpO1xuICAgICAgICBwYXRoTm9kZS5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKHBhdGhOb2RlKTtcbiAgICAgICAgc2VsZi5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgICAgIGxldCBiYm94ID0gcGF0aE5vZGUuZ2V0QkJveCgpO1xuICAgICAgICBzZWxmLmRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc3ZnKTtcbiAgICAgICAgcmV0dXJuIGJib3g7XG4gICAgICB9IGNhdGNoIChlcnIpIHsgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIF9maWxsU2tldGNoKGN0eCwgZHJhd2luZywgbykge1xuICAgIGxldCBmd2VpZ2h0ID0gby5maWxsV2VpZ2h0O1xuICAgIGlmIChmd2VpZ2h0IDwgMCkge1xuICAgICAgZndlaWdodCA9IG8uc3Ryb2tlV2lkdGggLyAyO1xuICAgIH1cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IG8uZmlsbDtcbiAgICBjdHgubGluZVdpZHRoID0gZndlaWdodDtcbiAgICB0aGlzLl9kcmF3VG9Db250ZXh0KGN0eCwgZHJhd2luZyk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIF9kcmF3VG9Db250ZXh0KGN0eCwgZHJhd2luZykge1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBmb3IgKGxldCBpdGVtIG9mIGRyYXdpbmcub3BzKSB7XG4gICAgICBjb25zdCBkYXRhID0gaXRlbS5kYXRhO1xuICAgICAgc3dpdGNoIChpdGVtLm9wKSB7XG4gICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgIGN0eC5tb3ZlVG8oZGF0YVswXSwgZGF0YVsxXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2JjdXJ2ZVRvJzpcbiAgICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhkYXRhWzBdLCBkYXRhWzFdLCBkYXRhWzJdLCBkYXRhWzNdLCBkYXRhWzRdLCBkYXRhWzVdKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncWN1cnZlVG8nOlxuICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKGRhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl0sIGRhdGFbM10pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdsaW5lVG8nOlxuICAgICAgICAgIGN0eC5saW5lVG8oZGF0YVswXSwgZGF0YVsxXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkcmF3aW5nLnR5cGUgPT09ICdmaWxsUGF0aCcpIHtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdWdoQ2FudmFzQXN5bmMgZXh0ZW5kcyBSb3VnaENhbnZhcyB7XG4gIF9pbml0KGNvbmZpZykge1xuICAgIHRoaXMuZ2VuID0gbmV3IFJvdWdoR2VuZXJhdG9yQXN5bmMoY29uZmlnLCB0aGlzLmNhbnZhcyk7XG4gIH1cblxuICBhc3luYyBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5saW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyByZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ucmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFzeW5jIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyBjaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXN5bmMgbGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZCk7XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBhc3luYyBwb2x5Z29uKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ucG9seWdvbihwb2ludHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFzeW5jIGFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5hcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucyk7XG4gICAgdGhpcy5kcmF3KGQpO1xuICAgIHJldHVybiBkO1xuICB9XG5cbiAgYXN5bmMgY3VydmUocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5jdXJ2ZShwb2ludHMsIG9wdGlvbnMpO1xuICAgIHRoaXMuZHJhdyhkKTtcbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGFzeW5jIHBhdGgoZCwgb3B0aW9ucykge1xuICAgIGxldCBkcmF3aW5nID0gYXdhaXQgdGhpcy5nZW4ucGF0aChkLCBvcHRpb25zKTtcbiAgICB0aGlzLmRyYXcoZHJhd2luZyk7XG4gICAgcmV0dXJuIGRyYXdpbmc7XG4gIH1cbn0iLCJpbXBvcnQgeyBSb3VnaEdlbmVyYXRvciwgUm91Z2hHZW5lcmF0b3JBc3luYyB9IGZyb20gJy4vZ2VuZXJhdG9yLmpzJ1xuXG5leHBvcnQgY2xhc3MgUm91Z2hTVkcge1xuICBjb25zdHJ1Y3RvcihzdmcsIGNvbmZpZykge1xuICAgIHRoaXMuc3ZnID0gc3ZnO1xuICAgIHRoaXMuX2luaXQoY29uZmlnKTtcbiAgfVxuXG4gIF9pbml0KGNvbmZpZykge1xuICAgIHRoaXMuZ2VuID0gbmV3IFJvdWdoR2VuZXJhdG9yKGNvbmZpZywgdGhpcy5zdmcpO1xuICB9XG5cbiAgZ2V0IGdlbmVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZW47XG4gIH1cblxuICBnZXQgZGVmcygpIHtcbiAgICBpZiAoIXRoaXMuX2RlZnMpIHtcbiAgICAgIGxldCBkb2MgPSB0aGlzLnN2Zy5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgbGV0IGRub2RlID0gZG9jLmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZGVmcycpO1xuICAgICAgaWYgKHRoaXMuc3ZnLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5zdmcuaW5zZXJ0QmVmb3JlKGRub2RlLCB0aGlzLnN2Zy5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3ZnLmFwcGVuZENoaWxkKGRub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RlZnMgPSBkbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2RlZnM7XG4gIH1cblxuICBsaW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5saW5lKHgxLCB5MSwgeDIsIHkyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgcmVjdGFuZ2xlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLnJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5lbGxpcHNlKHgsIHksIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBjaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IHRoaXMuZ2VuLmNpcmNsZSh4LCB5LCBkaWFtZXRlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGxpbmVhclBhdGgocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5saW5lYXJQYXRoKHBvaW50cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5wb2x5Z29uKHBvaW50cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGFyYyh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzdGFydCwgc3RvcCwgY2xvc2VkLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSB0aGlzLmdlbi5hcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGN1cnZlKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gdGhpcy5nZW4uY3VydmUocG9pbnRzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgcGF0aChkLCBvcHRpb25zKSB7XG4gICAgbGV0IGRyYXdpbmcgPSB0aGlzLmdlbi5wYXRoKGQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZHJhd2luZyk7XG4gIH1cblxuICBkcmF3KGRyYXdhYmxlKSB7XG4gICAgbGV0IHNldHMgPSBkcmF3YWJsZS5zZXRzIHx8IFtdO1xuICAgIGxldCBvID0gZHJhd2FibGUub3B0aW9ucyB8fCB0aGlzLmdlbi5kZWZhdWx0T3B0aW9ucztcbiAgICBsZXQgZG9jID0gdGhpcy5zdmcub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICBsZXQgZyA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2cnKTtcbiAgICBmb3IgKGxldCBkcmF3aW5nIG9mIHNldHMpIHtcbiAgICAgIGxldCBwYXRoID0gbnVsbDtcbiAgICAgIHN3aXRjaCAoZHJhd2luZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3BhdGgnOiB7XG4gICAgICAgICAgcGF0aCA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuX29wc1RvUGF0aChkcmF3aW5nKSk7XG4gICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2UgPSBvLnN0cm9rZTtcbiAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZVdpZHRoID0gby5zdHJva2VXaWR0aDtcbiAgICAgICAgICBwYXRoLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnZmlsbFBhdGgnOiB7XG4gICAgICAgICAgcGF0aCA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdGgnKTtcbiAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZSgnZCcsIHRoaXMuX29wc1RvUGF0aChkcmF3aW5nKSk7XG4gICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2UgPSAnbm9uZSc7XG4gICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2VXaWR0aCA9IDA7XG4gICAgICAgICAgcGF0aC5zdHlsZS5maWxsID0gby5maWxsO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2ZpbGxTa2V0Y2gnOiB7XG4gICAgICAgICAgcGF0aCA9IHRoaXMuX2ZpbGxTa2V0Y2goZG9jLCBkcmF3aW5nLCBvKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdwYXRoMkRmaWxsJzoge1xuICAgICAgICAgIHBhdGggPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBkcmF3aW5nLnBhdGgpO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlID0gJ25vbmUnO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlV2lkdGggPSAwO1xuICAgICAgICAgIHBhdGguc3R5bGUuZmlsbCA9IG8uZmlsbDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdwYXRoMkRwYXR0ZXJuJzoge1xuICAgICAgICAgIGNvbnN0IHNpemUgPSBkcmF3aW5nLnNpemU7XG4gICAgICAgICAgY29uc3QgcGF0dGVybiA9IGRvYy5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3BhdHRlcm4nKTtcbiAgICAgICAgICBjb25zdCBpZCA9IGByb3VnaC0ke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiB8fCA5OTk5OTkpKX1gO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgneCcsIDApO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCd5JywgMCk7XG4gICAgICAgICAgcGF0dGVybi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgMSk7XG4gICAgICAgICAgcGF0dGVybi5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIDEpO1xuICAgICAgICAgIHBhdHRlcm4uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAxKTtcbiAgICAgICAgICBwYXR0ZXJuLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtNYXRoLnJvdW5kKHNpemVbMF0pfSAke01hdGgucm91bmQoc2l6ZVsxXSl9YCk7XG4gICAgICAgICAgcGF0dGVybi5zZXRBdHRyaWJ1dGUoJ3BhdHRlcm5Vbml0cycsICdvYmplY3RCb3VuZGluZ0JveCcpO1xuICAgICAgICAgIGNvbnN0IHBhdHRlcm5QYXRoID0gdGhpcy5fZmlsbFNrZXRjaChkb2MsIGRyYXdpbmcsIG8pO1xuICAgICAgICAgIHBhdHRlcm4uYXBwZW5kQ2hpbGQocGF0dGVyblBhdGgpO1xuICAgICAgICAgIHRoaXMuZGVmcy5hcHBlbmRDaGlsZChwYXR0ZXJuKTtcblxuICAgICAgICAgIHBhdGggPSBkb2MuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwYXRoJyk7XG4gICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBkcmF3aW5nLnBhdGgpO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlID0gJ25vbmUnO1xuICAgICAgICAgIHBhdGguc3R5bGUuc3Ryb2tlV2lkdGggPSAwO1xuICAgICAgICAgIHBhdGguc3R5bGUuZmlsbCA9IGB1cmwoIyR7aWR9KWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgIGcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBnO1xuICB9XG5cbiAgX2ZpbGxTa2V0Y2goZG9jLCBkcmF3aW5nLCBvKSB7XG4gICAgbGV0IGZ3ZWlnaHQgPSBvLmZpbGxXZWlnaHQ7XG4gICAgaWYgKGZ3ZWlnaHQgPCAwKSB7XG4gICAgICBmd2VpZ2h0ID0gby5zdHJva2VXaWR0aCAvIDI7XG4gICAgfVxuICAgIGxldCBwYXRoID0gZG9jLmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy5fb3BzVG9QYXRoKGRyYXdpbmcpKTtcbiAgICBwYXRoLnN0eWxlLnN0cm9rZSA9IG8uZmlsbDtcbiAgICBwYXRoLnN0eWxlLnN0cm9rZVdpZHRoID0gZndlaWdodDtcbiAgICBwYXRoLnN0eWxlLmZpbGwgPSAnbm9uZSc7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBfb3BzVG9QYXRoKGRyYXdpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nZW4ub3BzVG9QYXRoKGRyYXdpbmcpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3VnaFNWR0FzeW5jIGV4dGVuZHMgUm91Z2hTVkcge1xuICBfaW5pdChjb25maWcpIHtcbiAgICB0aGlzLmdlbiA9IG5ldyBSb3VnaEdlbmVyYXRvckFzeW5jKGNvbmZpZywgdGhpcy5zdmcpO1xuICB9XG5cbiAgYXN5bmMgbGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ubGluZSh4MSwgeTEsIHgyLCB5Miwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGFzeW5jIHJlY3RhbmdsZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5yZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGFzeW5jIGVsbGlwc2UoeCwgeSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uZWxsaXBzZSh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGQpO1xuICB9XG5cbiAgYXN5bmMgY2lyY2xlKHgsIHksIGRpYW1ldGVyLCBvcHRpb25zKSB7XG4gICAgbGV0IGQgPSBhd2FpdCB0aGlzLmdlbi5jaXJjbGUoeCwgeSwgZGlhbWV0ZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBsaW5lYXJQYXRoKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ubGluZWFyUGF0aChwb2ludHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBwb2x5Z29uKHBvaW50cywgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4ucG9seWdvbihwb2ludHMsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBhcmMoeCwgeSwgd2lkdGgsIGhlaWdodCwgc3RhcnQsIHN0b3AsIGNsb3NlZCwgb3B0aW9ucykge1xuICAgIGxldCBkID0gYXdhaXQgdGhpcy5nZW4uYXJjKHgsIHksIHdpZHRoLCBoZWlnaHQsIHN0YXJ0LCBzdG9wLCBjbG9zZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmRyYXcoZCk7XG4gIH1cblxuICBhc3luYyBjdXJ2ZShwb2ludHMsIG9wdGlvbnMpIHtcbiAgICBsZXQgZCA9IGF3YWl0IHRoaXMuZ2VuLmN1cnZlKHBvaW50cywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRoaXMuZHJhdyhkKTtcbiAgfVxuXG4gIGFzeW5jIHBhdGgoZCwgb3B0aW9ucykge1xuICAgIGxldCBkcmF3aW5nID0gYXdhaXQgdGhpcy5nZW4ucGF0aChkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5kcmF3KGRyYXdpbmcpO1xuICB9XG59IiwiaW1wb3J0IHsgUm91Z2hDYW52YXMsIFJvdWdoQ2FudmFzQXN5bmMgfSBmcm9tICcuL2NhbnZhcy5qcyc7XG5pbXBvcnQgeyBSb3VnaFNWRywgUm91Z2hTVkdBc3luYyB9IGZyb20gJy4vc3ZnLmpzJztcbmltcG9ydCB7IFJvdWdoR2VuZXJhdG9yLCBSb3VnaEdlbmVyYXRvckFzeW5jIH0gZnJvbSAnLi9nZW5lcmF0b3IuanMnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY2FudmFzKGNhbnZhcywgY29uZmlnKSB7XG4gICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYXN5bmMpIHtcbiAgICAgIHJldHVybiBuZXcgUm91Z2hDYW52YXNBc3luYyhjYW52YXMsIGNvbmZpZyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUm91Z2hDYW52YXMoY2FudmFzLCBjb25maWcpO1xuICB9LFxuICBzdmcoc3ZnLCBjb25maWcpIHtcbiAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5hc3luYykge1xuICAgICAgcmV0dXJuIG5ldyBSb3VnaFNWR0FzeW5jKHN2ZywgY29uZmlnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSb3VnaFNWRyhzdmcsIGNvbmZpZyk7XG4gIH0sXG4gIGNyZWF0ZVJlbmRlcmVyKCkge1xuICAgIHJldHVybiBSb3VnaENhbnZhcy5jcmVhdGVSZW5kZXJlcigpO1xuICB9LFxuICBnZW5lcmF0b3IoY29uZmlnLCBzaXplKSB7XG4gICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYXN5bmMpIHtcbiAgICAgIHJldHVybiBuZXcgUm91Z2hHZW5lcmF0b3JBc3luYyhjb25maWcsIHNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJvdWdoR2VuZXJhdG9yKGNvbmZpZywgc2l6ZSk7XG4gIH1cbn07Il0sIm5hbWVzIjpbIlJvdWdoU2VnbWVudFJlbGF0aW9uIiwiUm91Z2hTZWdtZW50IiwicHgxIiwicHkxIiwicHgyIiwicHkyIiwiUm91Z2hTZWdtZW50UmVsYXRpb25Db25zdCIsInhpIiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwieWkiLCJhIiwiYiIsImMiLCJfdW5kZWZpbmVkIiwib3RoZXJTZWdtZW50IiwiaXNVbmRlZmluZWQiLCJVTkRFRklORUQiLCJncmFkMSIsImdyYWQyIiwiaW50MSIsImludDIiLCJNYXRoIiwiYWJzIiwiU0VQQVJBVEUiLCJtaW4iLCJtYXgiLCJJTlRFUlNFQ1RTIiwiX2dldExlbmd0aCIsIngxIiwieTEiLCJ4MiIsInkyIiwiZHgiLCJkeSIsInNxcnQiLCJSb3VnaEhhY2h1cmVJdGVyYXRvciIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsImdhcCIsInNpbkFuZ2xlIiwiY29zQW5nbGUiLCJ0YW5BbmdsZSIsInBvcyIsImRlbHRhWCIsImhHYXAiLCJzTGVmdCIsInNSaWdodCIsImxpbmUiLCJ4TG93ZXIiLCJ4VXBwZXIiLCJ5TG93ZXIiLCJ5VXBwZXIiLCJzIiwiY29tcGFyZSIsIlBhdGhUb2tlbiIsInR5cGUiLCJ0ZXh0IiwiUGFyc2VkUGF0aCIsImQiLCJQQVJBTVMiLCJDT01NQU5EIiwiTlVNQkVSIiwiRU9EIiwic2VnbWVudHMiLCJwYXJzZURhdGEiLCJwcm9jZXNzUG9pbnRzIiwiZmlyc3QiLCJwcmV2IiwiY3VycmVudFBvaW50IiwiaSIsImxlbmd0aCIsImtleSIsInBvaW50IiwiZGF0YSIsInRva2VucyIsInRva2VuaXplIiwiaW5kZXgiLCJ0b2tlbiIsIm1vZGUiLCJBcnJheSIsImlzVHlwZSIsInBhcmFtX2xlbmd0aCIsInBhcmFtcyIsIm51bWJlciIsImVycm9yIiwic2VnbWVudCIsInB1c2giLCJtYXRjaCIsInN1YnN0ciIsIlJlZ0V4cCIsIiQxIiwicGFyc2VGbG9hdCIsIl9jbG9zZWQiLCJ0b0xvd2VyQ2FzZSIsIlJvdWdoUGF0aCIsInBhcnNlZCIsIl9wb3NpdGlvbiIsImJlemllclJlZmxlY3Rpb25Qb2ludCIsInF1YWRSZWZsZWN0aW9uUG9pbnQiLCJfZmlyc3QiLCJ4IiwieSIsImNsb3NlZCIsIl9saW5lYXJQb2ludHMiLCJscCIsInBvaW50cyIsInYiLCJSb3VnaEFyY0NvbnZlcnRlciIsImZyb20iLCJ0byIsInJhZGlpIiwiYW5nbGUiLCJsYXJnZUFyY0ZsYWciLCJzd2VlcEZsYWciLCJyYWRQZXJEZWciLCJQSSIsIl9zZWdJbmRleCIsIl9udW1TZWdzIiwiX3J4IiwiX3J5IiwiX3NpblBoaSIsInNpbiIsIl9jb3NQaGkiLCJjb3MiLCJ4MWRhc2giLCJ5MWRhc2giLCJyb290IiwibnVtZXJhdG9yIiwiY3hkYXNoIiwiY3lkYXNoIiwiX0MiLCJfdGhldGEiLCJjYWxjdWxhdGVWZWN0b3JBbmdsZSIsImR0aGV0YSIsImNlaWwiLCJfZGVsdGEiLCJfVCIsIl9mcm9tIiwiY3AxIiwiY3AyIiwiY29zVGhldGExIiwic2luVGhldGExIiwidGhldGEyIiwiY29zVGhldGEyIiwic2luVGhldGEyIiwidXgiLCJ1eSIsInZ4IiwidnkiLCJ0YSIsImF0YW4yIiwidGIiLCJQYXRoRml0dGVyIiwic2V0cyIsInNpbXBsaWZpY2F0aW9uIiwib3V0U2V0cyIsInNldCIsImVzdExlbmd0aCIsImZsb29yIiwicmVkdWNlIiwicDEiLCJwMiIsInBvdyIsImNvdW50Iiwic2xpY2UiLCJtaW5BcmVhIiwibWluSW5kZXgiLCJkaXN0YW5jZSIsImFyZWEiLCJhcmVhcyIsInNwbGljZSIsIlJvdWdoUmVuZGVyZXIiLCJvIiwib3BzIiwiX2RvdWJsZUxpbmUiLCJjbG9zZSIsImxlbiIsImNvbmNhdCIsImxpbmVhclBhdGgiLCJ3aWR0aCIsImhlaWdodCIsInBvbHlnb24iLCJvMSIsIl9jdXJ2ZVdpdGhPZmZzZXQiLCJyb3VnaG5lc3MiLCJvMiIsImluY3JlbWVudCIsImN1cnZlU3RlcENvdW50IiwicngiLCJyeSIsIl9nZXRPZmZzZXQiLCJfZWxsaXBzZSIsInN0YXJ0Iiwic3RvcCIsInJvdWdoQ2xvc3VyZSIsImN4IiwiY3kiLCJzdHJ0Iiwic3RwIiwiZWxsaXBzZUluYyIsImFyY0luYyIsIl9hcmMiLCJvcCIsInhjIiwieWMiLCJoYWNodXJlRmlsbFNoYXBlIiwieENvb3JkcyIsInlDb29yZHMiLCJvZmZzZXQiLCJtYXhSYW5kb21uZXNzT2Zmc2V0IiwiaGFjaHVyZUFuZ2xlIiwiaGFjaHVyZUdhcCIsInN0cm9rZVdpZHRoIiwidGFuIiwiaXQiLCJyZWN0Q29vcmRzIiwiZ2V0TmV4dExpbmUiLCJsaW5lcyIsIl9nZXRJbnRlcnNlY3RpbmdMaW5lcyIsImZ3ZWlnaHQiLCJmaWxsV2VpZ2h0IiwiYXNwZWN0UmF0aW8iLCJoeXAiLCJzaW5BbmdsZVByaW1lIiwiY29zQW5nbGVQcmltZSIsImdhcFByaW1lIiwiaGFsZkxlbiIsInhQb3MiLCJfYWZmaW5lIiwicGF0aCIsInJlcGxhY2UiLCJwIiwiZml0dGVyIiwibGluZWFyUG9pbnRzIiwiZml0Iiwib3BMaXN0IiwiX3Byb2Nlc3NTZWdtZW50Iiwicm9zIiwiZiIsInNldFBvc2l0aW9uIiwic2VnIiwicHJldlNlZyIsImRlbHRhIiwicm8iLCJvYiIsIl9iZXppZXJUbyIsInByZXZLZXkiLCJyZWYiLCJvZmZzZXQxIiwib2Zmc2V0MiIsImFyY0NvbnZlcnRlciIsImdldE5leHRTZWdtZW50IiwicmFuZG9tIiwiUiIsIkEiLCJCIiwiQyIsIkQiLCJFIiwiRiIsIl9saW5lIiwibW92ZSIsIm92ZXJsYXkiLCJsZW5ndGhTcSIsImhhbGZPZmZzZXQiLCJkaXZlcmdlUG9pbnQiLCJtaWREaXNwWCIsImJvd2luZyIsIm1pZERpc3BZIiwiY2xvc2VQb2ludCIsImN1cnZlVGlnaHRuZXNzIiwiY2FjaGVkVmVydEFycmF5Iiwib3ZlcmxhcCIsInJhZE9mZnNldCIsIl9jdXJ2ZSIsInBzIiwibGluZUNvb3JkcyIsImludGVyc2VjdGlvbnMiLCJzMSIsInMyIiwic2VsZiIsIl9yb3VnaFNjcmlwdCIsImRvY3VtZW50IiwiY3VycmVudFNjcmlwdCIsInNyYyIsIlJvdWdoR2VuZXJhdG9yIiwiY29uZmlnIiwiY2FudmFzIiwiZGVmYXVsdE9wdGlvbnMiLCJvcHRpb25zIiwiX29wdGlvbnMiLCJzaGFwZSIsIl9kcmF3YWJsZSIsImxpYiIsInBhdGhzIiwiZmlsbCIsImZpbGxTdHlsZSIsInNvbGlkRmlsbFNoYXBlIiwicmVjdGFuZ2xlIiwiZWxsaXBzZSIsImhhY2h1cmVGaWxsRWxsaXBzZSIsImRpYW1ldGVyIiwicmV0IiwiYXJjIiwiaGFjaHVyZUZpbGxBcmMiLCJjdXJ2ZSIsInNpemUiLCJfY29tcHV0ZVBhdGhTaXplIiwic3ZnUGF0aCIsImRyYXdhYmxlIiwiZHJhd2luZyIsIm9wc1RvUGF0aCIsInN0cm9rZSIsIl9maWxsU2tldGNoIiwicGF0dGVybiIsInJvdW5kIiwiaXRlbSIsInRyaW0iLCJucyIsInN2ZyIsImNyZWF0ZUVsZW1lbnROUyIsInNldEF0dHJpYnV0ZSIsInBhdGhOb2RlIiwiYXBwZW5kQ2hpbGQiLCJib2R5IiwiYmIiLCJnZXRCQm94IiwicmVtb3ZlQ2hpbGQiLCJlcnIiLCJjYW52YXNTaXplIiwiX2NhbnZhc1NpemUiLCJ2YWwiLCJ3IiwiYmFzZVZhbCIsInZhbHVlIiwiX3JlbmRlcmVyIiwid29ya2x5IiwiYXN5bmMiLCJub1dvcmtlciIsInRvcyIsIkZ1bmN0aW9uIiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJ3b3JrbHlTb3VyY2UiLCJ3b3JrbHlVUkwiLCJyZW5kZXJlclNvdXJjZSIsInJvdWdoVVJMIiwiY29kZSIsIm91cmwiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJCbG9iIiwicHJveHkiLCJSb3VnaEdlbmVyYXRvckFzeW5jIiwiUm91Z2hDYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0IiwiX2luaXQiLCJnZW4iLCJkcmF3IiwiY2lyY2xlIiwic2F2ZSIsInN0cm9rZVN0eWxlIiwibGluZVdpZHRoIiwiX2RyYXdUb0NvbnRleHQiLCJyZXN0b3JlIiwicDJkIiwiUGF0aDJEIiwiaGNhbnZhcyIsImNyZWF0ZUVsZW1lbnQiLCJoY29udGV4dCIsImJib3giLCJfY29tcHV0ZUJCb3giLCJ0cmFuc2xhdGUiLCJjcmVhdGVQYXR0ZXJuIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwiYmV6aWVyQ3VydmVUbyIsInF1YWRyYXRpY0N1cnZlVG8iLCJsaW5lVG8iLCJSb3VnaENhbnZhc0FzeW5jIiwiUm91Z2hTVkciLCJkb2MiLCJvd25lckRvY3VtZW50IiwiZyIsIl9vcHNUb1BhdGgiLCJzdHlsZSIsImlkIiwicGF0dGVyblBhdGgiLCJkZWZzIiwiX2RlZnMiLCJkbm9kZSIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJSb3VnaFNWR0FzeW5jIiwiY3JlYXRlUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFPLFNBQVNBLG9CQUFULEdBQWdDO1NBQzlCO1VBQ0MsQ0FERDtXQUVFLENBRkY7Z0JBR08sQ0FIUDtXQUlFLENBSkY7WUFLRyxDQUxIO2NBTUssQ0FOTDtlQU9NO0dBUGI7OztBQVdGLElBQWFDLFlBQWI7d0JBQ2NDLEdBQVosRUFBaUJDLEdBQWpCLEVBQXNCQyxHQUF0QixFQUEyQkMsR0FBM0IsRUFBZ0M7OztTQUN6QkMseUJBQUwsR0FBaUNOLHNCQUFqQztTQUNLRSxHQUFMLEdBQVdBLEdBQVg7U0FDS0MsR0FBTCxHQUFXQSxHQUFYO1NBQ0tDLEdBQUwsR0FBV0EsR0FBWDtTQUNLQyxHQUFMLEdBQVdBLEdBQVg7U0FDS0UsRUFBTCxHQUFVQyxPQUFPQyxTQUFqQjtTQUNLQyxFQUFMLEdBQVVGLE9BQU9DLFNBQWpCO1NBQ0tFLENBQUwsR0FBU04sTUFBTUYsR0FBZjtTQUNLUyxDQUFMLEdBQVNWLE1BQU1FLEdBQWY7U0FDS1MsQ0FBTCxHQUFTVCxNQUFNRCxHQUFOLEdBQVlELE1BQU1HLEdBQTNCO1NBQ0tTLFVBQUwsR0FBb0IsS0FBS0gsQ0FBTCxJQUFVLENBQVgsSUFBa0IsS0FBS0MsQ0FBTCxJQUFVLENBQTVCLElB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
