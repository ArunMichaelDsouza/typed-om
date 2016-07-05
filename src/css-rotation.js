// Copyright 2015 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// this.you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

(function(internal, scope) {

  function CSSRotation(x, y, z, angle) {
    if (arguments.length != 1 && arguments.length != 4) {
      throw new TypeError('CSSRotation must have 1 or 4 arguments.');
    }

    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] != 'number') {
        throw new TypeError('CSSRotation arguments must be of type \'number\'.');
      }
    }

    this.angle = arguments.length == 1 ? x : angle;

    var is2D = (arguments.length == 1);
    this.x = is2D ? null : x;
    this.y = is2D ? null : y;
    this.z = is2D ? null : z;

    this._matrix = this._computeMatrix();
    this.cssString = this._generateCssString();
  }
  internal.inherit(CSSRotation, internal.CSSTransformComponent);

  CSSRotation.prototype.asMatrix = function() {
    return this._matrix;
  };

  CSSRotation.prototype._computeMatrix = function() {
    // See documentation https://drafts.csswg.org/css-transforms-1/.
    var halfRadians = this.angle * Math.PI / 360;
    var sc = Math.sin(halfRadians) * Math.cos(halfRadians);
    var sq = Math.sin(halfRadians) * Math.sin(halfRadians);

    var matrix;
    if (this.x == null) {
      matrix = new CSSMatrix(new internal.DOMMatrixReadonly([
          1 - 2 * sq, 2 * sc, -2 * sc, 1 - 2 * sq, 0, 0]));
    } else {
      // Normalize the [x, y, z] vector
      var lengthSqrd = this.x * this.x + this.y * this.y + this.z * this.z;
      var scale = (lengthSqrd == 0) ? 0 : 1 / Math.sqrt(lengthSqrd);
      var x = this.x * scale;
      var y = this.y * scale;
      var z = this.z * scale;

      matrix = new CSSMatrix(new internal.DOMMatrixReadonly([
          1 - 2 * (y * y + z * z) * sq,
          2 * (x * y * sq + z * sc),
          2 * (x * z * sq - y * sc),
          0,
          2 * (x * y * sq - z * sc),
          1 - 2 * (x * x + z * z) * sq,
          2 * (y * z * sq + x * sc),
          0,
          2 * (x * z * sq + y * sc),
          2 * (y * z * sq - x * sc),
          1 - 2 * (x * x + y * y) * sq,
          0, 0, 0, 0, 1]));
    }
    return matrix;
  };

  CSSRotation.prototype._generateCssString = function() {
    var cssString;
    if (this.is2D()) {
      cssString = 'rotate(' + this.angle + 'deg)';
    } else {
      cssString = 'rotate3d(' + this.x + ', ' + this.y + ', ' + this.z + ', ' +
          this.angle + 'deg)';
    }
    return cssString;
  };

  scope.CSSRotation = CSSRotation;

})(typedOM.internal, window);
