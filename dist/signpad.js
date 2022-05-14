(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SignPad"] = factory();
	else
		root["SignPad"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/signpad.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SmoothSignature": () => (/* binding */ SmoothSignature),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class SmoothSignature {
  constructor(canvas, options) {
    this.canvas = {};
    this.ctx = {};
    this.width = 320;
    this.height = 160;
    this.scale = window.devicePixelRatio || 1;
    this.color = 'black';
    this.bgColor = '';
    this.canDraw = false;
    this.openSmooth = true;
    this.minWidth = 2;
    this.maxWidth = 6;
    this.minSpeed = 1.5;
    this.maxWidthDiffRate = 20;
    this.points = [];
    this.canAddHistory = true;
    this.historyList = [];
    this.maxHistoryLength = 20;

    this.onStart = () => {};

    this.onEnd = () => {};

    this.addListener = () => {
      this.removeListener();
      this.canvas.style.touchAction = 'none';

      if ('ontouchstart' in window || navigator.maxTouchPoints) {
        this.canvas.addEventListener('touchstart', this.onDrawStart);
        this.canvas.addEventListener('touchmove', this.onDrawMove);
        document.addEventListener('touchcancel', this.onDrawEnd);
        document.addEventListener('touchend', this.onDrawEnd);
      } else {
        this.canvas.addEventListener('mousedown', this.onDrawStart);
        this.canvas.addEventListener('mousemove', this.onDrawMove);
        document.addEventListener('mouseup', this.onDrawEnd);
      }
    };

    this.removeListener = () => {
      this.canvas.style.touchAction = 'auto';
      this.canvas.removeEventListener('touchstart', this.onDrawStart);
      this.canvas.removeEventListener('touchmove', this.onDrawMove);
      document.removeEventListener('touchend', this.onDrawEnd);
      document.removeEventListener('touchcancel', this.onDrawEnd);
      this.canvas.removeEventListener('mousedown', this.onDrawStart);
      this.canvas.removeEventListener('mousemove', this.onDrawMove);
      document.removeEventListener('mouseup', this.onDrawEnd);
    };

    this.onDrawStart = e => {
      e.preventDefault();
      this.canDraw = true;
      this.canAddHistory = true;
      this.ctx.strokeStyle = this.color;
      this.initPoint(e);
      this.onStart && this.onStart(e);
    };

    this.onDrawMove = e => {
      e.preventDefault();
      if (!this.canDraw) return;
      this.initPoint(e);
      if (this.points.length < 2) return;
      this.addHistory();
      const point = this.points.slice(-1)[0];
      const prePoint = this.points.slice(-2, -1)[0];

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => this.onDraw(prePoint, point));
      } else {
        this.onDraw(prePoint, point);
      }
    };

    this.onDraw = (prePoint, point) => {
      if (this.openSmooth) {
        this.drawSmoothLine(prePoint, point);
      } else {
        this.drawNoSmoothLine(prePoint, point);
      }
    };

    this.onDrawEnd = e => {
      if (!this.canDraw) return;
      this.canDraw = false;
      this.canAddHistory = true;
      this.points = [];
      this.onEnd && this.onEnd(e);
    };

    this.getLineWidth = speed => {
      const minSpeed = this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed;
      const addWidth = (this.maxWidth - this.minWidth) * speed / minSpeed;
      const lineWidth = Math.max(this.maxWidth - addWidth, this.minWidth);
      return Math.min(lineWidth, this.maxWidth);
    };

    this.getRadianData = (x1, y1, x2, y2) => {
      const dis_x = x2 - x1;
      const dis_y = y2 - y1;

      if (dis_x === 0) {
        return {
          val: 0,
          pos: -1
        };
      }

      if (dis_y === 0) {
        return {
          val: 0,
          pos: 1
        };
      }

      const val = Math.abs(Math.atan(dis_y / dis_x));

      if (x2 > x1 && y2 < y1 || x2 < x1 && y2 > y1) {
        return {
          val,
          pos: 1
        };
      }

      return {
        val,
        pos: -1
      };
    };

    this.getRadianPoints = (radianData, x, y, halfLineWidth) => {
      if (radianData.val === 0) {
        if (radianData.pos === 1) {
          return [{
            x,
            y: y + halfLineWidth
          }, {
            x,
            y: y - halfLineWidth
          }];
        }

        return [{
          y,
          x: x + halfLineWidth
        }, {
          y,
          x: x - halfLineWidth
        }];
      }

      const dis_x = Math.sin(radianData.val) * halfLineWidth;
      const dis_y = Math.cos(radianData.val) * halfLineWidth;

      if (radianData.pos === 1) {
        return [{
          x: x + dis_x,
          y: y + dis_y
        }, {
          x: x - dis_x,
          y: y - dis_y
        }];
      }

      return [{
        x: x + dis_x,
        y: y - dis_y
      }, {
        x: x - dis_x,
        y: y + dis_y
      }];
    };

    this.initPoint = event => {
      const t = Date.now();
      const prePoint = this.points.slice(-1)[0];

      if (prePoint && prePoint.t === t) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const e = event.touches && event.touches[0] || event;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (prePoint && prePoint.x === x && prePoint.y === y) {
        return;
      }

      const point = {
        x,
        y,
        t
      };

      if (this.openSmooth && prePoint) {
        const prePoint2 = this.points.slice(-2, -1)[0];
        point.distance = Math.sqrt(Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2));
        point.speed = point.distance / (point.t - prePoint.t || 0.1);
        point.lineWidth = this.getLineWidth(point.speed);

        if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
          const rate = (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
          let maxRate = this.maxWidthDiffRate / 100;
          maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;

          if (Math.abs(rate) > maxRate) {
            const per = rate > 0 ? maxRate : -maxRate;
            point.lineWidth = prePoint.lineWidth * (1 + per);
          }
        }
      }

      this.points.push(point);
      this.points = this.points.slice(-3);
    };

    this.drawSmoothLine = (prePoint, point) => {
      const dis_x = point.x - prePoint.x;
      const dis_y = point.y - prePoint.y;

      if (Math.abs(dis_x) + Math.abs(dis_y) <= this.scale) {
        point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5;
        point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5;
      } else {
        point.lastX1 = prePoint.x + dis_x * 0.3;
        point.lastY1 = prePoint.y + dis_y * 0.3;
        point.lastX2 = prePoint.x + dis_x * 0.7;
        point.lastY2 = prePoint.y + dis_y * 0.7;
      }

      point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;

      if (typeof prePoint.lastX1 === 'number') {
        this.drawCurveLine(prePoint.lastX2, prePoint.lastY2, prePoint.x, prePoint.y, point.lastX1, point.lastY1, point.perLineWidth);
        if (prePoint.isFirstPoint) return;
        if (prePoint.lastX1 === prePoint.lastX2 && prePoint.lastY1 === prePoint.lastY2) return;
        const data = this.getRadianData(prePoint.lastX1, prePoint.lastY1, prePoint.lastX2, prePoint.lastY2);
        const points1 = this.getRadianPoints(data, prePoint.lastX1, prePoint.lastY1, prePoint.perLineWidth / 2);
        const points2 = this.getRadianPoints(data, prePoint.lastX2, prePoint.lastY2, point.perLineWidth / 2);
        this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
      } else {
        point.isFirstPoint = true;
      }
    };

    this.drawNoSmoothLine = (prePoint, point) => {
      point.lastX = prePoint.x + (point.x - prePoint.x) * 0.5;
      point.lastY = prePoint.y + (point.y - prePoint.y) * 0.5;

      if (typeof prePoint.lastX === 'number') {
        this.drawCurveLine(prePoint.lastX, prePoint.lastY, prePoint.x, prePoint.y, point.lastX, point.lastY, this.maxWidth);
      }
    };

    this.drawCurveLine = (x1, y1, x2, y2, x3, y3, lineWidth) => {
      this.ctx.lineWidth = Number(lineWidth.toFixed(1));
      this.ctx.beginPath();
      this.ctx.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
      this.ctx.quadraticCurveTo(Number(x2.toFixed(1)), Number(y2.toFixed(1)), Number(x3.toFixed(1)), Number(y3.toFixed(1)));
      this.ctx.stroke();
    };

    this.drawTrapezoid = (point1, point2, point3, point4) => {
      this.ctx.beginPath();
      this.ctx.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
      this.ctx.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
      this.ctx.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
      this.ctx.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    };

    this.drawBgColor = () => {
      if (!this.bgColor) return;
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    };

    this.drawByImageUrl = url => {
      const image = new Image();

      image.onload = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(image, 0, 0, this.width, this.height);
      };

      image.crossOrigin = 'anonymous';
      image.src = url;
    };

    this.addHistory = () => {
      if (!this.maxHistoryLength || !this.canAddHistory) return;
      this.canAddHistory = false;
      this.historyList.push(this.canvas.toDataURL());
      this.historyList = this.historyList.slice(-this.maxHistoryLength);
    };

    this.clear = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawBgColor();
      this.historyList.length = 0;
    };

    this.undo = () => {
      const dataUrl = this.historyList.splice(-1)[0];
      dataUrl && this.drawByImageUrl(dataUrl);
    };

    this.toDataURL = (type = 'image/png', quality = 1) => {
      if (this.canvas.width === this.width) {
        return this.canvas.toDataURL(type, quality);
      }

      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL(type, quality);
    };

    this.getPNG = () => {
      return this.toDataURL();
    };

    this.getJPG = (quality = 0.8) => {
      return this.toDataURL('image/jpeg', quality);
    };

    this.isEmpty = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.canvas.width;
      canvas.height = this.canvas.height;

      if (this.bgColor) {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (this.scale !== 1) {
        ctx.scale(this.scale, this.scale);
      }

      return canvas.toDataURL() === this.canvas.toDataURL();
    };

    this.getRotateCanvas = (degree = 90) => {
      if (degree > 0) {
        degree = degree > 90 ? 180 : 90;
      } else {
        degree = degree < -90 ? 180 : -90;
      }

      const canvas = document.createElement('canvas');
      const w = this.width;
      const h = this.height;

      if (degree === 180) {
        canvas.width = w;
        canvas.height = h;
      } else {
        canvas.width = h;
        canvas.height = w;
      }

      const ctx = canvas.getContext('2d');
      ctx.rotate(degree * Math.PI / 180);

      if (degree === 90) {
        // 顺时针90度
        ctx.drawImage(this.canvas, 0, -h, w, h);
      } else if (degree === -90) {
        // 逆时针90度
        ctx.drawImage(this.canvas, -w, 0, w, h);
      } else if (degree === 180) {
        ctx.drawImage(this.canvas, -w, -h, w, h);
      }

      return canvas;
    };

    this.init(canvas, options);
  }

  init(canvas, options = {}) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = options.width || canvas.clientWidth || this.width;
    this.height = options.height || canvas.clientHeight || this.height;
    this.scale = options.scale || this.scale;
    this.color = options.color || this.color;
    this.bgColor = options.bgColor || this.bgColor;
    this.openSmooth = options.openSmooth || this.openSmooth;
    this.minWidth = options.minWidth || this.minWidth;
    this.maxWidth = options.maxWidth || this.maxWidth;
    this.minSpeed = options.minSpeed || this.minSpeed;
    this.maxWidthDiffRate = options.maxWidthDiffRate || this.maxWidthDiffRate;
    this.maxHistoryLength = options.maxHistoryLength || this.maxHistoryLength;
    this.onStart = options.onStart;
    this.onEnd = options.onEnd;

    if (this.scale > 0) {
      this.canvas.height = this.height * this.scale;
      this.canvas.width = this.width * this.scale;

      if (this.scale !== 1) {
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(this.scale, this.scale);
      }
    }

    this.ctx.lineCap = 'round';
    this.drawBgColor();
    this.addListener();
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SmoothSignature);

/******/ 	return __webpack_exports__;
/******/ })()
;
});