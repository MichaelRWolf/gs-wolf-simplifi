function distributeSplitParentFieldsToChildren(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [['Error: No data provided']];
  }

  var headers = transactions[0];
  var output = [headers];

  // Add the information transaction row
  var infoTransaction = {
    'postedOn': new Date().toLocaleDateString('en-CA'),
    'state': 'INFO',
    'category': 'SPLIT',
    'amount': 0.00,
    'notes': 'Updated ' + new Date().toISOString(),
    'payee': 'Distribute SPLIT fields from parent to children.'
  };

  output.push(headers.map(header => infoTransaction[header] || ''));

  var parentSplitRecord = null;

  for (var i = 1; i < transactions.length; i++) {
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = transactions[i][j] || '';
    }

    if (record['category'] === 'SPLIT') {
      parentSplitRecord = Object.assign({}, record);
      output.push(transactions[i]);
    } else if (!record['account'] && !record['postedOn']) {
      if (!parentSplitRecord) {
        return [['Error at row ' + (i + 1) + ': Found a child SPLIT before a parent SPLIT record']];
      }
      if (!record['category'] || !record['amount']) {
        return [['Error at row ' + (i + 1) + ': Child SPLIT record is missing "category" or "amount"']];
      }

      for (var key in parentSplitRecord) {
        if (!record[key]) {
          record[key] = parentSplitRecord[key];
        }
      }

      output.push(headers.map(header => record[header]));
    } else {
      parentSplitRecord = null;
      output.push(transactions[i]);
    }
  }

  return output;
}

/**
 * @customfunction
 */
function csv_split_cleanup(transactions) {
  // Filter out empty rows: Keep only rows that have at least one non-empty value
  var filteredData = transactions.filter(row => row.some(cell => cell !== ""));
  var distributedData = distributeSplitParentFieldsToChildren(filteredData);
  return distributedData;
}

/**
 * Splits CSV data while respecting quoted fields.
 * Accepts either a full CSV string or a 1-column range.
 * @param {string|string[][]} input - A CSV string or a range of values (e.g., Raw!A:A)
 * @return {Array<Array<string|Date>>} - Parsed CSV output with strings and Date objects
 * @customfunction
 */
function parseCsvRespectingQuotes(input) {
  let stringy2dArray;
  
  if (!input) {
    stringy2dArray = [['Error: No data provided']];
  } else if (typeof input === 'string') {
    stringy2dArray = Utilities.parseCsv(input);
  } else if (Array.isArray(input) && input.length > 0) {
    stringy2dArray = input.map(row => row[0] ? Utilities.parseCsv(row[0])[0] : []);
  } else {
    stringy2dArray = [['Error: Invalid input type']];
  }
  
  stringy2dArray = stringy2dArray.map(row =>
    row.map(cell =>
      promoteDollarAmountToFloatString(promoteStringToDateMaybe(cell))
    )
);

  let mixedType2dArray = stringy2dArray;
  
  return mixedType2dArray;
}

/**
 * Attempts to convert a string to a Date object if it represents a valid date.
 * Otherwise, returns the original string.
 * @param {string} str - The string to evaluate.
 * @return {Date|string} - The Date object if valid, otherwise the original string.
 */
const validDatePattern = new RegExp(
  "^\\s*(\\d{4}-\\d{2}-\\d{2}|\\d{1,2}\\/\\d{1,2}\\/\\d{4}|[A-Za-z]+ \\d{1,2}, \\d{4})\\s*$"
);
function promoteStringToDateMaybe(str) {
  
  if (!validDatePattern.test(str)) {
    return str; // Reject if it doesn't fully match a valid date format
  }

  let date = new Date(str);
  return isNaN(date.getTime()) ? str : date.toLocaleDateString('en-CA');
}

/**
 * Converts a dollar amount string to a float string by removing the "$" sign.
 * @param {string} str - The dollar amount string.
 * @return {string} - The numeric string representation of the amount.
 */
const dollarAmountPattern = new RegExp("^(-?)[$]([0-9,.]+)$");
function promoteDollarAmountToFloatString(str) {
  const dollarAmountPattern = new RegExp("^(-?)[$]([0-9,.]+)$");
  const match = str.match(dollarAmountPattern);
  return match ? parseFloat(match[1] + match[2].replace(/,/g, "")) : str;
}

/**
 * Runs test cases for promoteStringToDateMaybe and logs the results.
 */
function debugPromoteXXX() {
  const testCases = [
    "Not a date",

    "2024-02-24",
    "12/31/1999",
    "2024-02-28",
    "Feb 24, 2024",

    "junk 7/4/2000 junk",
    "Meals & Dining - @100% (business)",

    "$5.99",
    "-$5.99",
    "$1,005.99",
    "-$2,005.99",
  ];
  
  testCases.forEach(test => {
    let output = promoteStringToDateMaybe(promoteDollarAmountToFloatString(test));
    let outputType = Object.prototype.toString.call(output);
    console.log(`Input: '${test}', Output: '${output}', Type: '${outputType}'`);
  });
}

function debugUtilitiesParseCsv() {
    var csvString = '"John, Doe",25,"New York, NY"';
    var parsed = Utilities.parseCsv(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function debugCustomFunctionParseCsv_With1RowString() {
    var csvString = '"Jane, Doe",23,"Kingston, NY"';
    var parsed = parseCsvRespectingQuotes(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function debugCustomFunctionParseCsv_With3RowString() {
    var csvString = '"Alice, Smith",30,"Los Angeles, CA"\n"Bob, Brown",40,"Chicago, IL"\n"Charlie, Davis",50,"Houston, TX"';
    var parsed = parseCsvRespectingQuotes(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function debugCustomFunctionParseCsv_With2DimensionArray() {
    var csvArray = [
        ['"David, Johnson",35,"Miami, FL"'],
        ['"Eve, White",45,"Denver, CO"']
    ];
    var parsed = parseCsvRespectingQuotes(csvArray);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function debugCsvSplitCleanup() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Split from CSV');
    if (!sheet) {
        Logger.log("Error: Sheet 'Split from CSV' not found.");
        return;
    }

    // Get full range A1:P
    var data = sheet.getRange("A1:P").getValues();

    var result = csv_split_cleanup(data);
    result.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}


function characterizeParseCsvBehaviorForWhitespaceOnlyFields() {
  // Maybe this is helpful figuring out if whitespace is handled correctly
  var csvString = ',,"", "  ", "123", "2024-02-24", "true", "false"';
  var parsed = Utilities.parseCsv(csvString);
  Logger.log(JSON.stringify(parsed)); // Check how empty fields behave
}
