/******/ (() => { // webpackBootstrap
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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "MallHistory": () => (/* binding */ MallHistory),
  "MallRecord": () => (/* binding */ MallRecord),
  "MallRecords": () => (/* binding */ MallRecords)
});

;// CONCATENATED MODULE: external "kolmafia"
const external_kolmafia_namespaceObject = require("kolmafia");
;// CONCATENATED MODULE: ./src/MallHistory.ts
function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _createForOfIteratorHelper(o, allowArrayLike) {var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];if (!it) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = it.call(o);}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);Object.defineProperty(Constructor, "prototype", { writable: false });return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

var MallRecord = /*#__PURE__*/function () {
  /**
   * Seconds since epoch
   */

  /**
   * Amount purchased in this record
   */

  /**
   * Amount each item was purchased for
   */


  function MallRecord(date, amount, meat) {_classCallCheck(this, MallRecord);_defineProperty(this, "date", void 0);_defineProperty(this, "amount", void 0);_defineProperty(this, "meat", void 0);
    this.date = date;
    this.amount = amount;
    this.meat = meat;
  }_createClass(MallRecord, [{ key: "getDaysOld", value:

    function getDaysOld() {
      return (Date.now() / 1000 - this.date) / (60 * 60 * 24);
    } }]);return MallRecord;}();


var MallRecords = /*#__PURE__*/function () {

  /**
   * Being seconds since epoch
   */


  function MallRecords(jsonObject) {_classCallCheck(this, MallRecords);_defineProperty(this, "records", []);_defineProperty(this, "lastUpdated", 0);
    if (jsonObject == null) return;

    this.lastUpdated = jsonObject.lastUpdated;var _iterator = _createForOfIteratorHelper(

    jsonObject.records),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var record = _step.value;
        this.records.push(
        new MallRecord(record.date, record.amount, record.meat));

      }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
  }_createClass(MallRecords, [{ key: "getRecords", value:

    function getRecords(overPeriodOfDays) {
      var cutoff = this.lastUpdated - overPeriodOfDays * 60 * 60 * 24;

      return this.records.filter((r) => r.date >= cutoff);
    } }, { key: "getAmountSold", value:

    function getAmountSold(overPeriodOfDays) {
      return this.getRecords(overPeriodOfDays).
      map((record) => record.amount).
      reduce((a, b) => a + b, 0);
    } }, { key: "getPriceSold", value:

    function getPriceSold(overPeriodOfDays) {
      var amount = this.getRecords(overPeriodOfDays).
      map((record) => record.amount).
      reduce((a, b) => a + b, 0);

      if (amount == 0) {
        return 0;
      }

      var totalPrice = this.getRecords(overPeriodOfDays).
      map((record) => record.meat * record.amount).
      reduce((a, b) => a + b, 0);

      return Math.round(totalPrice / amount);
    } }, { key: "getDaysOld", value:

    function getDaysOld() {
      return (Date.now() / 1000 - this.lastUpdated) / (60 * 60 * 24);
    } }]);return MallRecords;}();var


MallAge;(function (MallAge) {MallAge[MallAge["HOURS_12"] = 5] = "HOURS_12";MallAge[MallAge["DAY"] = 1] = "DAY";MallAge[MallAge["HOURS_48"] = 6] = "HOURS_48";MallAge[MallAge["WEEK"] = 2] = "WEEK";MallAge[MallAge["WEEKS_2"] = 7] = "WEEKS_2";MallAge[MallAge["MONTH"] = 3] = "MONTH";MallAge[MallAge["ALL"] = 4] = "ALL";})(MallAge || (MallAge = {}));var









MallUpdater = /*#__PURE__*/function () {function MallUpdater() {_classCallCheck(this, MallUpdater);}_createClass(MallUpdater, [{ key: "parseOldMallRecord", value:
    function parseOldMallRecord(line) {
      var dateString = line.substring(2, line.indexOf(": "));
      var amount = (0,external_kolmafia_namespaceObject.toInt)(
      line.substring(line.indexOf(": ") + 2, line.indexOf(" bought")));

      var price = (0,external_kolmafia_namespaceObject.toInt)(
      line.substring(line.lastIndexOf("@") + 2, line.lastIndexOf(".")));


      //* Oct 7, 12:26pm: 36 bought @ 41,000,000.0
      // Oct 7, 1995 00:00

      var time = dateString.substring(dateString.indexOf(", ") + 2);

      var hour = +time.substring(0, time.indexOf(":")) - 1;

      if (time.endsWith("pm")) {
        hour += 12;
      }

      var min = +time.substring(
      time.lastIndexOf(":") + 1,
      time.lastIndexOf(":") + 3);


      var newDate =
      dateString.substring(0, dateString.indexOf(",")) +
      ", YEAR " +
      hour +
      ":" +
      min;

      var date = Date.parse(
      newDate.replace("YEAR", new Date().getFullYear().toString()));


      if (date > Date.now()) {
        date = Date.parse(
        newDate.replace("YEAR", (new Date().getFullYear() - 1).toString()));

      }

      return new MallRecord(date / 1000, amount, price);
    } }, { key: "parseNewMallRecord", value:

    function parseNewMallRecord(match) {
      return new MallRecord((0,external_kolmafia_namespaceObject.toInt)(match[3]), (0,external_kolmafia_namespaceObject.toInt)(match[2]), (0,external_kolmafia_namespaceObject.toInt)(match[1]));
    } }, { key: "parseMallRecords", value:

    function parseMallRecords(buffer) {
      var records = [];var _iterator2 = _createForOfIteratorHelper(

      buffer.replace("\r", "").split("\n")),_step2;try {for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {var line = _step2.value;
          var match = line.match(
          /<!-- Item \d+ bought @ price (\d+), (\d+) copies, at (\d+) -->/);


          if (match == null) {
            continue;
          }

          records[records.length] = this.parseNewMallRecord(match);
        }} catch (err) {_iterator2.e(err);} finally {_iterator2.f();}

      return records;
    } }, { key: "updateMallRecords", value:

    function updateMallRecords(item, records) {var _records$records;
      (0,external_kolmafia_namespaceObject.print)("Updating mall history for " + item);

      var mallRecords = this.parseMallRecords(
      (0,external_kolmafia_namespaceObject.visitUrl)(
      "https://kol.coldfront.net/newmarket/itemgraph.php?itemid=" +
      (0,external_kolmafia_namespaceObject.toInt)(item) +
      "&timespan=4"));



      var lastDate = records.records.length > 0 ? records.records[0].date : 0;

      (_records$records = records.records).unshift.apply(_records$records, _toConsumableArray(mallRecords.filter((r) => r.date > lastDate)));
      records.lastUpdated = new Date().getTime() / 1000;
    } }]);return MallUpdater;}();


var MallHistory = /*#__PURE__*/function () {


  function MallHistory() {_classCallCheck(this, MallHistory);_defineProperty(this, "items", new Map());
    this.loadMallItems();
  }_createClass(MallHistory, [{ key: "loadMallItems", value:

    function loadMallItems() {
      var string = (0,external_kolmafia_namespaceObject.fileToBuffer)("mallhistory.txt");

      if (string == null || string.length == 0) {
        return;
      }

      var obj = JSON.parse(string);var _iterator3 = _createForOfIteratorHelper(

      obj),_step3;try {for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {var array = _step3.value;
          this.items.set((0,external_kolmafia_namespaceObject.toItem)(array[0]), new MallRecords(array[1]));
        }} catch (err) {_iterator3.e(err);} finally {_iterator3.f();}
    } }, { key: "saveMallItems", value:

    function saveMallItems() {
      var jsonObj = [];var _iterator4 = _createForOfIteratorHelper(

      this.items),_step4;try {for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {var entry = _step4.value;
          jsonObj[jsonObj.length] = [(0,external_kolmafia_namespaceObject.toInt)(entry[0]), entry[1]];
        }} catch (err) {_iterator4.e(err);} finally {_iterator4.f();}

      (0,external_kolmafia_namespaceObject.bufferToFile)(JSON.stringify(jsonObj), "mallhistory.txt");
    } }, { key: "ensureUpToDate", value:

    function ensureUpToDate(item, maxDaysOld) {
      var records = this.items.get(item);

      if (records == null) {
        records = new MallRecords();
        this.items.set(item, records);
      }

      var currentDate = new Date().getTime() / 1000;

      if (records.lastUpdated < currentDate - maxDaysOld * 24 * 60 * 60) {
        new MallUpdater().updateMallRecords(item, records);

        this.saveMallItems();
      }

      return records;
    } }, { key: "getMallRecords", value:

    function getMallRecords(
    item)


    {var maxDaysOldData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;var updateIfMissing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!updateIfMissing) {
        return this.items.get(item);
      }

      if (!this.items.has(item)) {
        return this.ensureUpToDate(item, Math.max(1, maxDaysOldData));
      } else if (maxDaysOldData > 0) {
        return this.ensureUpToDate(item, maxDaysOldData);
      }

      return this.items.get(item);
    } }, { key: "getAmountSold", value:

    function getAmountSold(
    item,
    overPeriodOfDays)

    {var maxDaysOldData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
      var records = this.ensureUpToDate(item, maxDaysOldData);

      return records.getAmountSold(overPeriodOfDays);
    } }, { key: "getPriceSold", value:

    function getPriceSold(
    item,
    overPeriodOfDays)

    {var maxDaysOldData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
      var records = this.ensureUpToDate(item, maxDaysOldData);

      return records.getPriceSold(overPeriodOfDays);
    } }]);return MallHistory;}();
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;