import {Transaction} from "../src/Transaction";

"use strict";
describe('Transaction', function () {
    it('should confirm tautology', function () {
        expect(1 + 1 == 2).toBe(true);
    });

    it('should create new object', function () {
        // console.log(globalThis);
        // console.log(globalThis.Transaction);  // Should not be undefined

        var txn = new Transaction();
        expect(txn instanceof Transaction).toBe(true);
        // expect(instance.isSplit()).toBeTruthy();
    });
});
