"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MallHistory = void 0;
const kolmafia_1 = require("kolmafia");
class MallRecord {
    date;
    amount;
    meat;
    constructor(date, amount, meat) {
        this.date = date;
        this.amount = amount;
        this.meat = meat;
    }
}
class MallRecords {
    records = [];
    lastUpdated = 0;
    constructor(jsonObject) {
        if (jsonObject == null)
            return;
        this.lastUpdated = jsonObject.lastUpdated;
        for (let record of jsonObject.records) {
            this.records.push(new MallRecord(record.date, record.amount, record.meat));
        }
    }
    getRecords(days) {
        let cutoff = this.lastUpdated - days * 60 * 60 * 24;
        return this.records.filter((r) => r.date >= cutoff);
    }
}
var MallAge;
(function (MallAge) {
    MallAge[MallAge["HOURS_12"] = 5] = "HOURS_12";
    MallAge[MallAge["DAY"] = 1] = "DAY";
    MallAge[MallAge["WEEK"] = 2] = "WEEK";
    MallAge[MallAge["MONTH"] = 3] = "MONTH";
    MallAge[MallAge["ALL"] = 4] = "ALL";
    MallAge[MallAge["HOURS_48"] = 6] = "HOURS_48";
    MallAge[MallAge["WEEKS_2"] = 7] = "WEEKS_2";
})(MallAge || (MallAge = {}));
class MallUpdater {
    parseMallRecord(line) {
        let dateString = line.substring(2, line.indexOf(": "));
        let amount = (0, kolmafia_1.toInt)(line.substring(line.indexOf(": ") + 2, line.indexOf(" bought")));
        let price = (0, kolmafia_1.toInt)(line.substring(line.lastIndexOf("@") + 2, line.lastIndexOf(".")));
        //* Oct 7, 12:26pm: 36 bought @ 41,000,000.0
        // Oct 7, 1995 00:00
        let time = dateString.substring(dateString.indexOf(", ") + 2);
        let hour = +time.substring(0, time.indexOf(":")) - 1;
        if (time.endsWith("pm")) {
            hour += 12;
        }
        let min = +time.substring(time.lastIndexOf(":") + 1, time.lastIndexOf(":") + 3);
        let newDate = dateString.substring(0, dateString.indexOf(",")) +
            ", YEAR " +
            hour +
            ":" +
            min;
        let date = Date.parse(newDate.replace("YEAR", new Date().getFullYear().toString()));
        if (date > Date.now()) {
            date = Date.parse(newDate.replace("YEAR", (new Date().getFullYear() - 1).toString()));
        }
        return new MallRecord(date / 1000, amount, price);
    }
    parseMallRecords(buffer) {
        let records = [];
        for (let line of buffer.replace("\r", "").split("\n")) {
            if (!line.startsWith("* ")) {
                continue;
            }
            records[records.length] = this.parseMallRecord(line);
        }
        return records;
    }
    updateMallRecords(item, records, mallAge) {
        (0, kolmafia_1.print)("Updating mall history for " + item);
        let mallRecords = this.parseMallRecords((0, kolmafia_1.visitUrl)("https://kol.coldfront.net/newmarket/translist.php?itemid=" +
            (0, kolmafia_1.toInt)(item) +
            "&timespan=" +
            mallAge));
        let lastDate = records.records.length > 0 ? records.records[0].date : 0;
        records.records.unshift(...mallRecords.filter((r) => r.date > lastDate));
        records.lastUpdated = new Date().getTime() / 1000;
    }
}
class MallHistory {
    items = new Map();
    constructor() {
        this.loadMallItems();
    }
    loadMallItems() {
        let string = (0, kolmafia_1.fileToBuffer)("mallhistory.txt");
        if (string == null || string.length == 0) {
            return;
        }
        let obj = JSON.parse(string);
        for (let array of obj) {
            this.items.set((0, kolmafia_1.toItem)(array[0]), new MallRecords(array[1]));
        }
    }
    saveMallItems() {
        let jsonObj = [];
        for (let entry of this.items) {
            jsonObj[jsonObj.length] = [(0, kolmafia_1.toInt)(entry[0]), entry[1]];
        }
        (0, kolmafia_1.bufferToFile)(JSON.stringify(jsonObj), "mallhistory.txt");
    }
    ensureUpToDate(item, daysToCheck) {
        let records = this.items.get(item);
        if (records == null) {
            records = new MallRecords();
            this.items.set(item, records);
        }
        let currentDate = new Date().getTime() / 1000;
        if (records.lastUpdated < currentDate - 7 * 24 * 60 * 60) {
            new MallUpdater().updateMallRecords(item, records, MallAge.MONTH);
            this.saveMallItems();
        }
    }
    getMallRecords(item, daysToCheck, maxDaysOldData = 7) {
        this.ensureUpToDate(item, maxDaysOldData);
        let records = this.items.get(item);
        return records.getRecords(daysToCheck);
    }
    getAmountSold(item, daysToCheck, maxDaysOldData = 7) {
        this.ensureUpToDate(item, maxDaysOldData);
        let records = this.items.get(item);
        return records
            .getRecords(daysToCheck)
            .map((record) => record.amount)
            .reduce((a, b) => a + b, 0);
    }
    getPriceSold(item, daysToCheck, maxDaysOldData = 7) {
        this.ensureUpToDate(item, maxDaysOldData);
        let records = this.items.get(item);
        let amount = records
            .getRecords(daysToCheck)
            .map((record) => record.amount)
            .reduce((a, b) => a + b, 0);
        if (amount == 0) {
            return 0;
        }
        let totalPrice = records
            .getRecords(daysToCheck)
            .map((record) => record.meat * record.amount)
            .reduce((a, b) => a + b, 0);
        return Math.round(totalPrice / amount);
    }
}
exports.MallHistory = MallHistory;
