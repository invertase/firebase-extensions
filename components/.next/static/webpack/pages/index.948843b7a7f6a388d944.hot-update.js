"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./src/interactive-example.tsx":
/*!*************************************!*\
  !*** ./src/interactive-example.tsx ***!
  \*************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\nvar _jsxFileName = \"/Users/darren/projects/invertase/extensions-invertase/firebase-extensions/components/src/interactive-example.tsx\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\n\n\nvar InteractiveExample = function InteractiveExample() {\n  _s();\n\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('https://tinyurl.com/hkeujyyz'),\n      url = _useState[0],\n      setUrl = _useState[1];\n\n  var onChange = function onChange(key, value) {\n    var image = document.getElementById('imgSrc');\n    image.src = image.src.replace('text~value:[a-zA-Z]*/', /text~value:[a-zA-Z]*/, \"text~value:\".concat(target.value));\n  };\n\n  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n    \"class\": \"w-full\",\n    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n      \"class\": \"flex flex-col space-y-4\",\n      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n          src: \"https://tinyurl.com/hkeujyyz\",\n          \"class\": \"w-full\"\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 19,\n          columnNumber: 11\n        }, _this)\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 18,\n        columnNumber: 9\n      }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        \"class\": \"flex justify-around w-full\",\n        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n          \"class\": \"flex flex-col\",\n          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n            \"class\": \"text-sm text-gray-500\",\n            children: \"Image Type\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 23,\n            columnNumber: 13\n          }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n            \"class\": \"border-4 border-blue-500 border-opacity-25 text-sm text-gray-500\",\n            children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n              value: \"create\",\n              children: \"Creation\"\n            }, void 0, false, {\n              fileName: _jsxFileName,\n              lineNumber: 25,\n              columnNumber: 15\n            }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n              value: \"source\",\n              children: \"Exisiting\"\n            }, void 0, false, {\n              fileName: _jsxFileName,\n              lineNumber: 26,\n              columnNumber: 15\n            }, _this)]\n          }, void 0, true, {\n            fileName: _jsxFileName,\n            lineNumber: 24,\n            columnNumber: 13\n          }, _this)]\n        }, void 0, true, {\n          fileName: _jsxFileName,\n          lineNumber: 22,\n          columnNumber: 11\n        }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n          \"class\": \"flex flex-col\",\n          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n            \"class\": \"text-sm text-gray-500\",\n            children: \"Height (px)\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 30,\n            columnNumber: 13\n          }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n            type: \"number\",\n            \"class\": \"border-4 border-blue-500 border-opacity-25\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 31,\n            columnNumber: 13\n          }, _this)]\n        }, void 0, true, {\n          fileName: _jsxFileName,\n          lineNumber: 29,\n          columnNumber: 11\n        }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n          \"class\": \"flex flex-col\",\n          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n            \"class\": \"text-sm text-gray-500\",\n            children: \"Width (px)\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 37,\n            columnNumber: 13\n          }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n            type: \"number\",\n            \"class\": \"border-4 border-blue-500 border-opacity-25\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 38,\n            columnNumber: 13\n          }, _this)]\n        }, void 0, true, {\n          fileName: _jsxFileName,\n          lineNumber: 36,\n          columnNumber: 11\n        }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n          \"class\": \"flex flex-col\",\n          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"label\", {\n            \"class\": \"text-sm text-gray-500\",\n            children: \"Text\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 44,\n            columnNumber: 13\n          }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n            type: \"text\",\n            \"class\": \"border-4 border-blue-500 border-opacity-25\"\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 45,\n            columnNumber: 13\n          }, _this)]\n        }, void 0, true, {\n          fileName: _jsxFileName,\n          lineNumber: 43,\n          columnNumber: 11\n        }, _this)]\n      }, void 0, true, {\n        fileName: _jsxFileName,\n        lineNumber: 21,\n        columnNumber: 9\n      }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        \"class\": \"flex justify-center p-4\",\n        children: url\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 52,\n        columnNumber: 9\n      }, _this)]\n    }, void 0, true, {\n      fileName: _jsxFileName,\n      lineNumber: 17,\n      columnNumber: 7\n    }, _this)\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 16,\n    columnNumber: 5\n  }, _this);\n};\n\n_s(InteractiveExample, \"XvRXeo9Pb186jMbVOMbWcJ11Cj4=\");\n\n_c = InteractiveExample;\n/* harmony default export */ __webpack_exports__[\"default\"] = (InteractiveExample);\n\nvar _c;\n\n$RefreshReg$(_c, \"InteractiveExample\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW50ZXJhY3RpdmUtZXhhbXBsZS50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUEsSUFBTUUsa0JBQWtCLEdBQUcsU0FBckJBLGtCQUFxQixHQUFtQjtBQUFBOztBQUFBLGtCQUN0QkQsK0NBQVEsQ0FBQyw4QkFBRCxDQURjO0FBQUEsTUFDckNFLEdBRHFDO0FBQUEsTUFDaENDLE1BRGdDOztBQUc1QyxNQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFDQyxHQUFELEVBQU1DLEtBQU4sRUFBZ0I7QUFDL0IsUUFBSUMsS0FBSyxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBWjtBQUNBRixJQUFBQSxLQUFLLENBQUNHLEdBQU4sR0FBWUgsS0FBSyxDQUFDRyxHQUFOLENBQVVDLE9BQVYsQ0FDVix1QkFEVSxFQUVWLHNCQUZVLHVCQUdJQyxNQUFNLENBQUNOLEtBSFgsRUFBWjtBQUtELEdBUEQ7O0FBU0Esc0JBQ0U7QUFBSyxhQUFNLFFBQVg7QUFBQSwyQkFDRTtBQUFLLGVBQU0seUJBQVg7QUFBQSw4QkFDRTtBQUFBLCtCQUNFO0FBQUssYUFBRyxFQUFDLDhCQUFUO0FBQXdDLG1CQUFNO0FBQTlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREYsZUFJRTtBQUFLLGlCQUFNLDRCQUFYO0FBQUEsZ0NBQ0U7QUFBSyxtQkFBTSxlQUFYO0FBQUEsa0NBQ0U7QUFBTyxxQkFBTSx1QkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFERixlQUVFO0FBQVEscUJBQU0sa0VBQWQ7QUFBQSxvQ0FDRTtBQUFRLG1CQUFLLEVBQUMsUUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFERixlQUVFO0FBQVEsbUJBQUssRUFBQyxRQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREYsZUFRRTtBQUFLLG1CQUFNLGVBQVg7QUFBQSxrQ0FDRTtBQUFPLHFCQUFNLHVCQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURGLGVBRUU7QUFDRSxnQkFBSSxFQUFDLFFBRFA7QUFFRSxxQkFBTTtBQUZSO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQVJGLGVBZUU7QUFBSyxtQkFBTSxlQUFYO0FBQUEsa0NBQ0U7QUFBTyxxQkFBTSx1QkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFERixlQUVFO0FBQ0UsZ0JBQUksRUFBQyxRQURQO0FBRUUscUJBQU07QUFGUjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFmRixlQXNCRTtBQUFLLG1CQUFNLGVBQVg7QUFBQSxrQ0FDRTtBQUFPLHFCQUFNLHVCQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURGLGVBRUU7QUFDRSxnQkFBSSxFQUFDLE1BRFA7QUFFRSxxQkFBTTtBQUZSO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQXRCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFKRixlQW1DRTtBQUFLLGlCQUFNLHlCQUFYO0FBQUEsa0JBQXNDSjtBQUF0QztBQUFBO0FBQUE7QUFBQTtBQUFBLGVBbkNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQXlDRCxDQXJERDs7R0FBTUQ7O0tBQUFBO0FBdUROLCtEQUFlQSxrQkFBZiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvaW50ZXJhY3RpdmUtZXhhbXBsZS50c3g/NTZjYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IEludGVyYWN0aXZlRXhhbXBsZSA9ICgpOiBKU1guRWxlbWVudCA9PiB7XG4gIGNvbnN0IFt1cmwsIHNldFVybF0gPSB1c2VTdGF0ZSgnaHR0cHM6Ly90aW55dXJsLmNvbS9oa2V1anl5eicpO1xuXG4gIGNvbnN0IG9uQ2hhbmdlID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1nU3JjJyk7XG4gICAgaW1hZ2Uuc3JjID0gaW1hZ2Uuc3JjLnJlcGxhY2UoXG4gICAgICAndGV4dH52YWx1ZTpbYS16QS1aXSovJyxcbiAgICAgIC90ZXh0fnZhbHVlOlthLXpBLVpdKi8sXG4gICAgICBgdGV4dH52YWx1ZToke3RhcmdldC52YWx1ZX1gLFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzPVwidy1mdWxsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbCBzcGFjZS15LTRcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vdGlueXVybC5jb20vaGtldWp5eXpcIiBjbGFzcz1cInctZnVsbFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBqdXN0aWZ5LWFyb3VuZCB3LWZ1bGxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+SW1hZ2UgVHlwZTwvbGFiZWw+XG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiYm9yZGVyLTQgYm9yZGVyLWJsdWUtNTAwIGJvcmRlci1vcGFjaXR5LTI1IHRleHQtc20gdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY3JlYXRlXCI+Q3JlYXRpb248L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNvdXJjZVwiPkV4aXNpdGluZzwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQtc20gdGV4dC1ncmF5LTUwMFwiPkhlaWdodCAocHgpPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJib3JkZXItNCBib3JkZXItYmx1ZS01MDAgYm9yZGVyLW9wYWNpdHktMjVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+V2lkdGggKHB4KTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiYm9yZGVyLTQgYm9yZGVyLWJsdWUtNTAwIGJvcmRlci1vcGFjaXR5LTI1XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQtc20gdGV4dC1ncmF5LTUwMFwiPlRleHQ8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJib3JkZXItNCBib3JkZXItYmx1ZS01MDAgYm9yZGVyLW9wYWNpdHktMjVcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgganVzdGlmeS1jZW50ZXIgcC00XCI+e3VybH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJhY3RpdmVFeGFtcGxlO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJJbnRlcmFjdGl2ZUV4YW1wbGUiLCJ1cmwiLCJzZXRVcmwiLCJvbkNoYW5nZSIsImtleSIsInZhbHVlIiwiaW1hZ2UiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3JjIiwicmVwbGFjZSIsInRhcmdldCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/interactive-example.tsx\n");

/***/ })

});