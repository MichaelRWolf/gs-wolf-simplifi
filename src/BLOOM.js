/**
 * BLOOM.js - Client Account Tracking Functions
 * 
 * This file contains functions for tracking client account balances
 * including dollars and hours transactions with running totals.
 */

// Simple, pure functions - easily testable
function accumulateDollars(balanceDollars, amountInDollars) {
  return balanceDollars + (amountInDollars || 0);
}

function accumulateHours(balanceHours, timeInHours) {
  return balanceHours + (timeInHours || 0);
}

// Pure functions that work with arrays - testable on MacBook
function calculateDollarBalances(initialBalance, values) {
  let runningTotal = initialBalance;
  return values.map(value => {
    runningTotal = accumulateDollars(runningTotal, value);
    return runningTotal;
  });
}

function calculateHourBalances(initialBalance, values) {
  let runningTotal = initialBalance;
  return values.map(value => {
    runningTotal = accumulateHours(runningTotal, value);
    return runningTotal;
  });
}

// Sheet wrappers - handle the range-to-array conversion
/**
 * @customfunction
 */
function calculateDollarBalancesFromRange(initialBalance, transactionRange) {
  return calculateDollarBalances(initialBalance, transactionRange.flat());
}

/**
 * @customfunction
 */
function calculateHourBalancesFromRange(initialBalance, transactionRange) {
  return calculateHourBalances(initialBalance, transactionRange.flat());
}

// Export functions for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    accumulateDollars,
    accumulateHours,
    calculateDollarBalances,
    calculateHourBalances,
    calculateDollarBalancesFromRange,
    calculateHourBalancesFromRange
  };
} 