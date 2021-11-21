declare class MallRecord {
    date: number;
    amount: number;
    meat: number;
    constructor(date: number, amount: number, meat: number);
}
export declare class MallHistory {
    private items;
    constructor();
    private loadMallItems;
    private saveMallItems;
    private ensureUpToDate;
    getMallRecords(item: Item, daysToCheck: number, maxDaysOldData?: number): MallRecord[];
    getAmountSold(item: Item, daysToCheck: number, maxDaysOldData?: number): number;
    getPriceSold(item: Item, daysToCheck: number, maxDaysOldData?: number): number;
}
export {};
