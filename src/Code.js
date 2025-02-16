// function splitCategory(categoryString) {
//   // if (typeof categoryString !== "string" || categoryString.length === 0) {
//   //   return ["", ""];
//   // }

//   try {
//     var parts = categoryString.split(":");
//     return [parts[0] || "", parts[1] || ""];
//   } catch (e) {
//     console.log("splitCategory could not split ${categoryString}");
//     return ["", ""];
//   }
// }

/**
 * Splits a category string into two parts based on the ':' delimiter.
 * Returns an array with two elements, defaulting to empty strings if parts are missing.
 *
 * @param {string} categoryString - The string to split.
 * @return {Array} - An array with the split category components.
 */
function splitCategory(categoryString) {
  if (typeof categoryString !== "string" || categoryString.length === 0) {
    return ["", ""];
  }

  // Split the string once and handle undefined parts with defaults
  var parts = categoryString.split(":");
  return [parts[0] || "", parts[1] || ""];
}

// /**
//  * @param {Array} range - A 2D array of category strings.
//  * @return {Array} - A 2D array where each row contains the split results.
//  * @customfunction
//  */
// function splitCategoryRange(range) {
//   return range.map(function(row) {
//     var categoryString = row[0]; // Access the first cell in the row
//     return splitCategory(categoryString);
//   });
// }
/**
 * Processes a range of category strings, splitting each string into components.
 *
 * @param {Array} range - A 2D array of category strings.
 * @return {Array} - A 2D array where each row contains the split results.
 * @customfunction
 */
function splitCategoryRange(range) {
  // Use flatMap if you are certain there will always be rows with data,
  // else map might be more appropriate if empty rows are a possibility.
  return range.map((row) => {
    var categoryString = row[0] || ""; // Handle undefined or empty values safely
    return splitCategory(categoryString);
  });
}

// /**
//  * @param {Array} range - A 2D array of category strings.
//  * @return {Array} - A 2D array where each row contains the split results.
//  * @customfunction
//  */
// function processCategoryRange(range) {
//   return splitCategoryRange(range);
// }

let accountNames = null;
function initializeAccountNames() {
  if (!accountNames) {
    // Access the 'Account Names' sheet
    var accountNamesSheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Account Names");
    var accountNamesValues = accountNamesSheet.getRange("A:A").getValues();

    // Flatten the 2D array into a 1D array and filter out empty strings
    accountNames = accountNamesValues.flat().filter(String);
  }
}

/**
 * Custom function to determine the transaction type based on the category.
 *
 * @param {string} category - The category for which to determine the transaction type.
 * @return {string} - "Transfer" if the category is in the list of account names, otherwise an empty string.
 * @customfunction
 */
function Transaction_Type(account, category) {
  initializeAccountNames();

  if (account === "" && category !== "") {
    return "Orphan";
  } else if (category.indexOf("Uncategorized") !== -1) {
    return "Uncategoriezed";
  } else if (accountNames.includes(category)) {
    return "Transfer";
  } else if (category.indexOf("Income") !== -1) {
    return "Income";
  } else if (category.length !== 0) {
    return "Expense";
  } else {
    return "";
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
    console.log("Had to flatten 'categories' parameter");
    categories = categories.flat();
    accounts = accounts.flat(); // Ensure accounts is also flattened if necessary
  }

  // Ensure both arrays have the same length
  if (categories.length !== accounts.length) {
    throw new Error("The length of categories and accounts must be the same");
  }

  console.log(`Identical lengths for 'categories' and 'accounts': ${categories.length}`);

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
