/**
 * BLOOM.test.js - Tests for client account tracking functions
 * 
 * These tests verify the functionality of the BLOOM.js functions
 * for tracking client account balances.
 */

// Import the functions to test
const {
  accumulateDollars,
  accumulateHours,
  calculateDollarBalances,
  calculateHourBalances,
  calculateDollarBalancesFromRange,
  calculateHourBalancesFromRange
} = require('../src/BLOOM.js');

describe('BLOOM Client Account Tracking', () => {
  
  describe('accumulateDollars', () => {
    test('should add positive amount to balance', () => {
      expect(accumulateDollars(1000, 500)).toBe(1500);
    });

    test('should add negative amount to balance', () => {
      expect(accumulateDollars(1000, -300)).toBe(700);
    });

    test('should handle zero amount', () => {
      expect(accumulateDollars(1000, 0)).toBe(1000);
    });

    test('should handle undefined amount as zero', () => {
      expect(accumulateDollars(1000, undefined)).toBe(1000);
    });

    test('should handle null amount as zero', () => {
      expect(accumulateDollars(1000, null)).toBe(1000);
    });

    test('should handle empty string as zero', () => {
      expect(accumulateDollars(1000, '')).toBe(1000);
    });
  });

  describe('accumulateHours', () => {
    test('should add positive hours to balance', () => {
      expect(accumulateHours(10, 2.5)).toBe(12.5);
    });

    test('should add negative hours to balance', () => {
      expect(accumulateHours(10, -1.5)).toBe(8.5);
    });

    test('should handle zero hours', () => {
      expect(accumulateHours(10, 0)).toBe(10);
    });

    test('should handle undefined hours as zero', () => {
      expect(accumulateHours(10, undefined)).toBe(10);
    });

    test('should handle null hours as zero', () => {
      expect(accumulateHours(10, null)).toBe(10);
    });

    test('should handle empty string as zero', () => {
      expect(accumulateHours(10, '')).toBe(10);
    });
  });

  describe('calculateDollarBalances', () => {
    test('should calculate running totals from zero', () => {
      const transactions = [1000, -500, 2000, -300];
      const expected = [1000, 500, 2500, 2200];
      expect(calculateDollarBalances(0, transactions)).toEqual(expected);
    });

    test('should calculate running totals from non-zero initial balance', () => {
      const transactions = [500, -200, 1000];
      const expected = [1500, 1300, 2300];
      expect(calculateDollarBalances(1000, transactions)).toEqual(expected);
    });

    test('should handle empty array', () => {
      expect(calculateDollarBalances(1000, [])).toEqual([]);
    });

    test('should handle array with zeros and undefined values', () => {
      const transactions = [1000, 0, undefined, -500, null, ''];
      const expected = [1000, 1000, 1000, 500, 500, 500];
      expect(calculateDollarBalances(0, transactions)).toEqual(expected);
    });

    test('should handle decimal amounts', () => {
      const transactions = [1000.50, -250.25, 500.75];
      const expected = [1000.50, 750.25, 1251.00];
      expect(calculateDollarBalances(0, transactions)).toEqual(expected);
    });
  });

  describe('calculateHourBalances', () => {
    test('should calculate running totals from zero', () => {
      const sessions = [2.5, -1.0, 3.0, -0.5];
      const expected = [2.5, 1.5, 4.5, 4.0];
      expect(calculateHourBalances(0, sessions)).toEqual(expected);
    });

    test('should calculate running totals from non-zero initial balance', () => {
      const sessions = [1.5, -0.5, 2.0];
      const expected = [11.5, 11.0, 13.0];
      expect(calculateHourBalances(10, sessions)).toEqual(expected);
    });

    test('should handle empty array', () => {
      expect(calculateHourBalances(10, [])).toEqual([]);
    });

    test('should handle array with zeros and undefined values', () => {
      const sessions = [2.0, 0, undefined, -1.0, null, ''];
      const expected = [2.0, 2.0, 2.0, 1.0, 1.0, 1.0];
      expect(calculateHourBalances(0, sessions)).toEqual(expected);
    });

    test('should handle fractional hours', () => {
      const sessions = [1.25, -0.75, 2.5];
      const expected = [1.25, 0.5, 3.0];
      expect(calculateHourBalances(0, sessions)).toEqual(expected);
    });
  });

  describe('calculateDollarBalancesFromRange', () => {
    test('should handle 2D array from Google Sheets range', () => {
      const range = [[1000], [-500], [2000], [-300]];
      const expected = [1000, 500, 2500, 2200];
      expect(calculateDollarBalancesFromRange(0, range)).toEqual(expected);
    });

    test('should handle mixed 2D array', () => {
      const range = [[1000], [500], [''], [undefined], [-300]];
      const expected = [1000, 1500, 1500, 1500, 1200];
      expect(calculateDollarBalancesFromRange(0, range)).toEqual(expected);
    });
  });

  describe('calculateHourBalancesFromRange', () => {
    test('should handle 2D array from Google Sheets range', () => {
      const range = [[2.5], [-1.0], [3.0], [-0.5]];
      const expected = [2.5, 1.5, 4.5, 4.0];
      expect(calculateHourBalancesFromRange(0, range)).toEqual(expected);
    });

    test('should handle mixed 2D array', () => {
      const range = [[2.0], [1.5], [''], [undefined], [-0.5]];
      const expected = [2.0, 3.5, 3.5, 3.5, 3.0];
      expect(calculateHourBalancesFromRange(0, range)).toEqual(expected);
    });
  });

  describe('Real-world scenarios', () => {
    test('should handle client subscription scenario', () => {
      // Client subscribes to 20 hours for $3000
      const dollarTransactions = [3000];
      const hourTransactions = [20];
      
      const dollarBalances = calculateDollarBalances(0, dollarTransactions);
      const hourBalances = calculateHourBalances(0, hourTransactions);
      
      expect(dollarBalances).toEqual([3000]);
      expect(hourBalances).toEqual([20]);
    });

    test('should handle client payment scenario', () => {
      // Client makes payment of $1000
      const dollarTransactions = [3000, -1000];
      const dollarBalances = calculateDollarBalances(0, dollarTransactions);
      
      expect(dollarBalances).toEqual([3000, 2000]);
    });

    test('should handle session scenario', () => {
      // Client uses 1.25 hours in a session
      const hourTransactions = [20, -1.25];
      const hourBalances = calculateHourBalances(0, hourTransactions);
      
      expect(hourBalances).toEqual([20, 18.75]);
    });

    test('should handle complete client lifecycle', () => {
      // Subscription -> Payment -> Session -> Payment -> Session
      const dollarTransactions = [3000, -1000,  0,   -500,  0];
      const hourTransactions =     [20,     0, -1.25,   0, -2.0];
      
      const dollarBalances = calculateDollarBalances(0, dollarTransactions);
      const hourBalances = calculateHourBalances(0, hourTransactions);
      
      expect(dollarBalances).toEqual([3000, 2000, 2000, 1500, 1500]);
      expect(hourBalances).toEqual([20, 20, 18.75, 18.75, 16.75]);
    });
  });
}); 