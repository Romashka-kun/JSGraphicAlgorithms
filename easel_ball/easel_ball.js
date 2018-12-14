var mylib =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./easel_ball/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./easel_ball/src/example.js":
/*!***********************************!*\
  !*** ./easel_ball/src/example.js ***!
  \***********************************/
/*! exports provided: x, sum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"x\", function() { return x; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sum\", function() { return sum; });\nlet x = 2 * 3;\r\n\r\nfunction sum(x, y) {\r\n    return x + y;\r\n}\n\n//# sourceURL=webpack://mylib/./easel_ball/src/example.js?");

/***/ }),

/***/ "./easel_ball/src/index.js":
/*!*********************************!*\
  !*** ./easel_ball/src/index.js ***!
  \*********************************/
/*! exports provided: init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony import */ var _example__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./example */ \"./easel_ball/src/example.js\");\n\r\n\r\nfunction init() {\r\n    console.log(Object(_example__WEBPACK_IMPORTED_MODULE_0__[\"sum\"])(_example__WEBPACK_IMPORTED_MODULE_0__[\"x\"], _example__WEBPACK_IMPORTED_MODULE_0__[\"x\"]));\r\n    console.info(\"page loaded\");\r\n    var stage = new createjs.Stage(\"game\");\r\n\r\n    //хотим добавить спрайт на сцену. Спрайт Sprite - это объект, который показывает анимацию. Анимация настраивается\r\n    //с помощью объекта SpriteSheet\r\n\r\n    var earthSpriteSheet = new createjs.SpriteSheet({ //объект с настройками\r\n        images: [\"earth_and_explosion.png\"], //набор картинок\r\n        frames: { //объект с описанием размеров и положений кадров. Можно вместо объекта указать массив, и перечислить\r\n            //каждый спрайт по-отдельности (см. документацию)\r\n            width: 100,\r\n            height: 100,\r\n            regX: 50, //опорная точка. Эта точка картинки (центр) будет рисоваться в координатах (0, 0) спрайта.\r\n            regY: 50\r\n            //margin: границы картинки\r\n            //spaces: пропуски между спрайтами\r\n        },\r\n        animations: { //набор анимаций, названия придумаем сами\r\n            rotate: [0, 47, \"rotate\"], //с 0 по 47, а после этого перейти к анимации rotate\r\n            explode: [48, 83, null] //с 48 по 83, и остановиться.\r\n            //можно можно указать вручную последовательность кадров (см. документацию)\r\n        }\r\n        , framerate: 20 //частота кадров\r\n    });\r\n\r\n    var WIDTH = 400;\r\n    var HEIGHT = 280;\r\n    var R = 50;\r\n\r\n    var field = new createjs.Container();\r\n    var background = new createjs.Shape();\r\n    background.graphics\r\n        .beginStroke(\"blue\")\r\n        .beginFill(\"#EEE\")\r\n        .drawRect(0, 0, WIDTH, HEIGHT);\r\n\r\n    stage.addChild(field);\r\n    field.addChild(background);\r\n\r\n    function ball_tick(e) {\r\n        var ball = e.target; //e - информация о событии, e.target - для кого вызвано\r\n        ball.x += ball.dx;\r\n        ball.y += ball.dy;\r\n\r\n        if (ball.x > WIDTH - R || ball.x < R)\r\n            ball.dx *= -1;\r\n        if (ball.y > HEIGHT - R || ball.y < R)\r\n            ball.dy *= -1;\r\n    }\r\n\r\n    function ball_click(e) {\r\n        var ball = e.target;\r\n\r\n        if (ball.exploded)\r\n            return;\r\n\r\n        ball.gotoAndPlay(\"explode\");\r\n        ball.dx = 0;\r\n        ball.dy = 0;\r\n        ball.exploded = true;\r\n        ball.addEventListener('animationend', function () {\r\n            field.removeChild(ball);\r\n        });\r\n    }\r\n\r\n    function add_ball(x, y, dx, dy) {\r\n        if (x > WIDTH - R || x < R || y > HEIGHT - R || y < R)\r\n            return;\r\n\r\n        var ball = new createjs.Sprite(earthSpriteSheet);\r\n        ball.gotoAndPlay(\"rotate\");\r\n        field.addChild(ball);\r\n        ball.x = x; //параметры ball.x, .y задают положение шарика на родителе\r\n        ball.y = y;\r\n        ball.dx = dx; //у спрайта нет параметров dx, dy, но это JavaScript, поэтому что хотим, то и дописываем\r\n        ball.dy = dy;\r\n        ball.addEventListener('tick', ball_tick);\r\n        ball.addEventListener('click', ball_click);\r\n    }\r\n\r\n    field.addEventListener('click', function (e) {\r\n        //Это событие ловит все нажатия на содержимое контейнера: фон и шарики\r\n        if (e.target === background) {\r\n            //нажали на фон\r\n            var random_angle = Math.random() * 2 * Math.PI;\r\n            add_ball(e.localX, e.localY, Math.cos(random_angle), Math.sin(random_angle));\r\n        }\r\n    });\r\n\r\n    add_ball(50, 50, 1, 1);\r\n    add_ball(100, 100, 1, 1);\r\n    add_ball(200, 150, 1, 1);\r\n\r\n    createjs.Ticker.addEventListener(\"tick\", stage);\r\n    createjs.Ticker.framerate = 60;\r\n    createjs.Ticker.timerMode = createjs.Ticker.RAF_SYNCHED;\r\n}\n\n//# sourceURL=webpack://mylib/./easel_ball/src/index.js?");

/***/ })

/******/ });