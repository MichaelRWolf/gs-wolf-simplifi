/**
 * Custom function to determine the transaction type based on the category.
 *
 * @param {string} category - The category for which to determine the transaction type.
 * @return {string} - "Transfer" if the category is in the list of account names, otherwise an empty string.
 * @customfunction
 */
function Transaction_Type(account, category) {
  // Access the 'Account Names' sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Account Names');
  var accountNames = sheet.getRange('A:A').getValues();
  
  // Flatten the 2D array into a 1D array and filter out empty strings
  accountNames = accountNames.flat().filter(String);

  if (account === ''  && category !== '') { 
      return 'Orphan'
  }
  else if (category.indexOf('Uncategorized') !== -1) {
    return "Uncategoriezed";
  }
  else if (accountNames.includes(category)) {
    return "Transfer";
  }
  else if (category.indexOf('Income') !== -1) {
    return "Income";
  }
  else if (category.length !== 0) {
    return "Expense";
  }
  else {
    return ''
  }
}


/**
 * Custom function to handle a range of categories and accounts by combining them and dispatching to Transaction_Type.
 *
 * @param {Array} accounts - The accounts corresponding to the categories.
 * @param {Array} categories - The categories for which to determine the transaction type.
 * @return {Array} - An array of transaction types based on the categories and accounts.
 * @customfunction
 */
function Transaction_Types(accounts, categories) {
  // Flatten the input if necessary
  if (Array.isArray(categories[0])) {
    categories = categories.flat();
    accounts = accounts.flat(); // Ensure accounts is also flattened if necessary
  }
  
  // Ensure both arrays have the same length
  if (categories.length !== accounts.length) {
    throw new Error('The length of categories and accounts must be the same');
  }
  
  // Map each category and corresponding account to the result of Transaction_Type
  return categories.map((category, index) => {
    const account = accounts[index];
    return Transaction_Type(account, category);
  });
}



/**
 * Custom function to handle a range of categories by dispatching to Transaction_Type.
 *
 * @param {Array} categories - The categories for which to determine the transaction type.
 * @return {Array} - An array of transaction types based on the categories.
 * @customfunction
 */
function Former_Transaction_Types(accounts, categories) {
  // Handle both single values and ranges
  if (Array.isArray(categories[0])) {
    // If the input is a 2D array, flatten it
    categories = categories.flat();
  }
  
  // Map each category to the result of Transaction_Type
  return categories.map(function(category) {
    return Transaction_Type(category);
  });
}
