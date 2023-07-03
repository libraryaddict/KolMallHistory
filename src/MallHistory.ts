import {
  bufferToFile,
  fileToBuffer,
  print,
  toInt,
  visitUrl,
  Item,
} from "kolmafia";

export class MallRecord {
  /**
   * Seconds since epoch
   */
  date: number;
  /**
   * Amount purchased in this record
   */
  amount: number;
  /**
   * Amount each item was purchased for
   */
  meat: number;

  constructor(date: number, amount: number, meat: number) {
    this.date = date;
    this.amount = amount;
    this.meat = meat;
  }

  getDaysOld(): number {
    return (Date.now() / 1000 - this.date) / (60 * 60 * 24);
  }
}

export class MallRecords {
  records: MallRecord[] = [];
  /**
   * Being seconds since epoch
   */
  lastUpdated: number = 0;

  constructor(jsonObject?: MallRecords) {
    if (jsonObject == null) {
      return;
    }

    this.lastUpdated = jsonObject.lastUpdated;

    this.records = jsonObject.records.map(
      (r) => new MallRecord(r.date, r.amount, r.meat)
    );
  }

  getRecords(overPeriodOfDays: number): MallRecord[] {
    const cutoff = this.lastUpdated - overPeriodOfDays * 60 * 60 * 24;

    return this.records.filter((r) => r.date >= cutoff);
  }

  getAmountSold(overPeriodOfDays: number): number {
    return this.getRecords(overPeriodOfDays)
      .map((record) => record.amount)
      .reduce((a, b) => a + b, 0);
  }

  getPriceSold(overPeriodOfDays: number): number {
    const amount = this.getRecords(overPeriodOfDays)
      .map((record) => record.amount)
      .reduce((a, b) => a + b, 0);

    if (amount == 0) {
      return 0;
    }

    const totalPrice = this.getRecords(overPeriodOfDays)
      .map((record) => record.meat * record.amount)
      .reduce((a, b) => a + b, 0);

    return Math.round(totalPrice / amount);
  }

  getDaysOld(): number {
    return (Date.now() / 1000 - this.lastUpdated) / (60 * 60 * 24);
  }
}

enum MallAge {
  HOURS_12 = 5,
  DAY = 1,
  HOURS_48 = 6,
  WEEK = 2,
  WEEKS_2 = 7,
  MONTH = 3,
  ALL = 4,
}

class MallUpdater {
  parseOldMallRecord(line: string): MallRecord {
    const dateString: string = line.substring(2, line.indexOf(": "));
    const amount: number = toInt(
      line.substring(line.indexOf(": ") + 2, line.indexOf(" bought"))
    );
    const price: number = toInt(
      line.substring(line.lastIndexOf("@") + 2, line.lastIndexOf("."))
    );

    //* Oct 7, 12:26pm: 36 bought @ 41,000,000.0
    // Oct 7, 1995 00:00

    const time = dateString.substring(dateString.indexOf(", ") + 2);

    let hour = +time.substring(0, time.indexOf(":")) - 1;

    if (time.endsWith("pm")) {
      hour += 12;
    }

    const min = +time.substring(
      time.lastIndexOf(":") + 1,
      time.lastIndexOf(":") + 3
    );

    const newDate =
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

    return new MallRecord(Math.round(date / 1000), amount, price);
  }

  parseNewMallRecord(match: string[]): MallRecord {
    return new MallRecord(toInt(match[3]), toInt(match[2]), toInt(match[1]));
  }

  parseMallRecords(buffer: string): MallRecord[] {
    const records: MallRecord[] = [];

    for (const line of buffer.split(/(\n|\r)+/)) {
      const match = line.match(
        /<!-- Item \d+ bought @ price (\d+), (\d+) copies, at (\d+) -->/
      );

      if (match == null) {
        continue;
      }

      records[records.length] = this.parseNewMallRecord(match);
    }

    return records;
  }

  updateMallRecords(item: Item, records: MallRecords) {
    print("Updating mall history for " + item);

    const mallRecords: MallRecord[] = this.parseMallRecords(
      visitUrl(
        "https://kol.coldfront.net/newmarket/itemgraph.php?itemid=" +
          toInt(item) +
          "&timespan=4"
      )
    );

    const lastDate = records.records.length > 0 ? records.records[0].date : 0;

    records.records.push(...mallRecords.filter((r) => r.date > lastDate));
    records.lastUpdated = Math.round(new Date().getTime() / 1000);
    records.records.sort((r1, r2) => r1.date - r2.date);
  }
}

export class MallHistory {
  private items: Map<Item, MallRecords> = new Map();

  constructor() {
    this.loadMallItems();
  }

  private loadMallItems() {
    const string = fileToBuffer("mallhistory.txt");

    if (string == null || string.length == 0) {
      return;
    }

    const obj = JSON.parse(string);

    for (const array of obj) {
      const records = new MallRecords(array[1]);

      if (
        records.records.length > 1 &&
        records.records[0].date >
          records.records[records.records.length - 1].date
      ) {
        records.records.sort((r1, r2) => r1.date - r2.date);
      }

      if (array[0] < 0) {
        continue;
      }

      this.items.set(Item.get(array[0] as number), records);
    }
  }

  private saveMallItems() {
    const jsonObj = [];

    for (const entry of this.items) {
      jsonObj[jsonObj.length] = [toInt(entry[0]), entry[1]];
    }

    bufferToFile(JSON.stringify(jsonObj), "mallhistory.txt");
  }

  ensureUpToDate(item: Item, maxDaysOld: number): MallRecords {
    let records: MallRecords = this.items.get(item);

    if (records == null) {
      records = new MallRecords();
      this.items.set(item, records);
    }

    const currentDate = new Date().getTime() / 1000;

    if (records.lastUpdated < currentDate - maxDaysOld * 24 * 60 * 60) {
      new MallUpdater().updateMallRecords(item, records);

      this.saveMallItems();
    }

    return records;
  }

  getMallRecords(
    item: Item,
    maxDaysOldData: number = 7,
    updateIfMissing: boolean = true
  ): MallRecords {
    if (!updateIfMissing) {
      return this.items.get(item);
    }

    if (!this.items.has(item)) {
      return this.ensureUpToDate(item, Math.max(1, maxDaysOldData));
    } else if (maxDaysOldData > 0) {
      return this.ensureUpToDate(item, maxDaysOldData);
    }

    return this.items.get(item);
  }

  getAmountSold(
    item: Item,
    overPeriodOfDays: number,
    maxDaysOldData: number = 7
  ): number {
    const records: MallRecords = this.ensureUpToDate(item, maxDaysOldData);

    return records.getAmountSold(overPeriodOfDays);
  }

  getPriceSold(
    item: Item,
    overPeriodOfDays: number,
    maxDaysOldData: number = 7
  ): number {
    const records: MallRecords = this.ensureUpToDate(item, maxDaysOldData);

    return records.getPriceSold(overPeriodOfDays);
  }
}
