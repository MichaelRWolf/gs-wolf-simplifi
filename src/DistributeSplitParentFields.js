function distributeSplitParentFieldsToChildren(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [['Error: No data provided']];
  }

  var headers = transactions[0];
  var output = [headers];

  // Add the information transaction row
  var infoTransaction = {
    'postedOn': new Date().toLocaleDateString('en-US'),
    'state': 'INFO',
    'category': 'SPLIT',
    'amount': '$0.00',
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
  return distributeSplitParentFieldsToChildren(transactions);
}

/**
 * Splits CSV data while respecting quoted fields.
 * Accepts either a full CSV string or a 1-column range.
 * @param {string|string[][]} input - A CSV string or a range of values (e.g., Raw!A:A)
 * @return {string[][]} - Parsed CSV output
 * @customfunction
 */
function parseCsvRespectingQuotes(input) {
  if (!input) {
    return [['Error: No data provided']];
  }
  
  if (typeof input === 'string') {
    return Utilities.parseCsv(input);
  } else if (Array.isArray(input) && input.length > 0) {
    return input.map(row => row[0] ? Utilities.parseCsv(row[0])[0] : []);
  } else {
    return [['Error: Invalid input type']];
  }
}

function testUtilitiesParseCsv() {
    var csvString = '"John, Doe",25,"New York, NY"';
    var parsed = Utilities.parseCsv(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function testCustomFunctionParseCsv_With1RowString() {
    var csvString = '"Jane, Doe",23,"Kingston, NY"';
    var parsed = parseCsvRespectingQuotes(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function testCustomFunctionParseCsv_With3RowString() {
    var csvString = '"Alice, Smith",30,"Los Angeles, CA"\n"Bob, Brown",40,"Chicago, IL"\n"Charlie, Davis",50,"Houston, TX"';
    var parsed = parseCsvRespectingQuotes(csvString);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}

function testCustomFunctionParseCsv_With2DimensionArray() {
    var csvArray = [
        ['"David, Johnson",35,"Miami, FL"'],
        ['"Eve, White",45,"Denver, CO"']
    ];
    var parsed = parseCsvRespectingQuotes(csvArray);
    parsed.forEach((row, rowIndex) => {
        Logger.log(`Row ${rowIndex + 1}: [${row.join(" | ")}]`);
    });
}
