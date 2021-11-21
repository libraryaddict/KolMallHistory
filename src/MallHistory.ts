import {
  bufferToFile,
  fileToBuffer,
  print,
  toInt,
  toItem,
  visitUrl,
} from "kolmafia";

class MallRecord {
  date: number;
  amount: number;
  meat: number;

  constructor(date: number, amount: number, meat: number) {
    this.date = date;
    this.amount = amount;
    this.meat = meat;
  }
}

class MallRecords {
  records: MallRecord[] = [];
  lastUpdated: number = 0;

  constructor(jsonObject?) {
    if (jsonObject == null) return;

    this.lastUpdated = jsonObject.lastUpdated;

    for (let record of jsonObject.records) {
      this.records.push(
        new MallRecord(record.date, record.amount, record.meat)
      );
    }
  }

  getRecords(days: number): MallRecord[] {
    let cutoff = this.lastUpdated - days * 60 * 60 * 24;

    return this.records.filter((r) => r.date >= cutoff);
  }
}

enum MallAge {
  HOURS_12 = 5,
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
  ALL = 4,
  HOURS_48 = 6,
  WEEKS_2 = 7,
}

class MallUpdater {
  parseMallRecord(line: string): MallRecord {
    let dateString: string = line.substring(2, line.indexOf(": "));
    let amount: number = toInt(
      line.substring(line.indexOf(": ") + 2, line.indexOf(" bought"))
    );
    let price: number = toInt(
      line.substring(line.lastIndexOf("@") + 2, line.lastIndexOf("."))
    );

    //* Oct 7, 12:26pm: 36 bought @ 41,000,000.0
    // Oct 7, 1995 00:00

    let time = dateString.substring(dateString.indexOf(", ") + 2);

    let hour = +time.substring(0, time.indexOf(":")) - 1;

    if (time.endsWith("pm")) {
      hour += 12;
    }

    let min = +time.substring(
      time.lastIndexOf(":") + 1,
      time.lastIndexOf(":") + 3
    );

    let newDate =
      dateString.substring(0, dateString.indexOf(",")) +
      ", YEAR " +
      hour +
      ":" +
      min;

    let date = Date.parse(
      newDate.replace("YEAR", new Date().getFullYear().toString())
    );

    if (date > Date.now()) {
      date = Date.parse(
        newDate.replace("YEAR", (new Date().getFullYear() - 1).toString())
      );
    }

    return new MallRecord(date / 1000, amount, price);
  }

  parseMallRecords(buffer: string): MallRecord[] {
    let records: MallRecord[] = [];

    for (let line of buffer.replace("\r", "").split("\n")) {
      if (!line.startsWith("* ")) {
        continue;
      }

      records[records.length] = this.parseMallRecord(line);
    }

    return records;
  }

  updateMallRecords(item: Item, records: MallRecords, mallAge: MallAge) {
    print("Updating mall history for " + item);

    let mallRecords: MallRecord[] = this.parseMallRecords(
      visitUrl(
        "https://kol.coldfront.net/newmarket/translist.php?itemid=" +
          toInt(item) +
          "&timespan=" +
          mallAge
      )
    );

    let lastDate = records.records.length > 0 ? records.records[0].date : 0;

    records.records.unshift(...mallRecords.filter((r) => r.date > lastDate));
    records.lastUpdated = new Date().getTime() / 1000;
  }
}

export class MallHistory {
  private items: Map<Item, MallRecords> = new Map();

  constructor() {
    this.loadMallItems();
  }

  private loadMallItems() {
    let string = fileToBuffer("mallhistory.txt");

    if (string == null || string.length == 0) {
      return;
    }

    let obj = JSON.parse(string);

    for (let array of obj) {
      this.items.set(toItem(<number>array[0]), new MallRecords(array[1]));
    }
  }

  private saveMallItems() {
    let jsonObj = [];

    for (let entry of this.items) {
      jsonObj[jsonObj.length] = [toInt(entry[0]), entry[1]];
    }

    bufferToFile(JSON.stringify(jsonObj), "mallhistory.txt");
  }

  private ensureUpToDate(item: Item, daysToCheck: number) {
    let records: MallRecords = this.items.get(item);

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

  getMallRecords(
    item: Item,
    daysToCheck: number,
    maxDaysOldData: number = 7
  ): MallRecord[] {
    this.ensureUpToDate(item, maxDaysOldData);

    let records: MallRecords = this.items.get(item);

    return records.getRecords(daysToCheck);
  }

  getAmountSold(
    item: Item,
    daysToCheck: number,
    maxDaysOldData: number = 7
  ): number {
    this.ensureUpToDate(item, maxDaysOldData);

    let records: MallRecords = this.items.get(item);

    return records
      .getRecords(daysToCheck)
      .map((record) => record.amount)
      .reduce((a, b) => a + b, 0);
  }

  getPriceSold(
    item: Item,
    daysToCheck: number,
    maxDaysOldData: number = 7
  ): number {
    this.ensureUpToDate(item, maxDaysOldData);

    let records: MallRecords = this.items.get(item);

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