function applyFormatting() {
  var sheetName = "Data - Digested";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log('${sheetName}" not found.');
    return;
  }
  console.log("Formatting ${sheetName}");

  // Frozen & Bold
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(4);
  sheet.getRange("1:1").setFontWeight("bold");

  // Number Format
  var amountRange = sheet.getRange("F2:F");
  amountRange.setNumberFormat('"("0.00")";(0.00);0.00');

  // Column Width
  // account	postedOn	payee	category	tags	amount	Type	Parent Category	Chld Category
  sheet.setColumnWidth(1, 70); // A:A - account
  sheet.setColumnWidth(2, 70); // B:B - postedOn
  sheet.setColumnWidth(3, 300); // C:C - payee
  sheet.setColumnWidth(4, 10); // D:D - category
  sheet.setColumnWidth(5, 10); // E:E - tags
  sheet.setColumnWidth(6, 75); // F:F - amount
  sheet.setColumnWidth(7, 75); // G:G - Type
  sheet.setColumnWidth(8, 300); // H:H - Parent Category
  sheet.setColumnWidth(9, 200); // I:I - Child Category

  // Show & Hide
  sheet.showColumns(1, sheet.getMaxColumns());
  sheet.hideColumns(4);
  sheet.hideColumns(5);
  // sheet.hideColumns(7);

  console.log("Formatting ${sheetName}...done");
}

/**
 * Logs all the conditional formatting rules for the 'Data - Digested' sheet.
 */
function logConditionalFormatting() {
  var sheetName = "Data - Digested";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log('${sheetName}" not found.');
    return;
  }

  // Get the conditional formatting rules for the sheet
  var rules = sheet.getConditionalFormatRules();

  if (rules.length === 0) {
    console.log("No conditional formatting rules found.");
    return;
  }

  console.log("// Conditional Formatting Rules");

  rules.forEach(function(rule, index) {
    var ranges = rule.getRanges();
    var criteriaType = rule.getCriteriaType();
    var criteriaValues = rule.getCriteriaValues();
    var format = rule.getBooleanCondition();

    var rangesStr = ranges
      .map((range) => `'${range.getA1Notation()}'`)
      .join(", ");

    console.log(`// Conditional Formatting Rule ${index + 1}`);
    console.log(`var range = sheet.getRange(${rangesStr});`);
    console.log(`var rule = SpreadsheetApp.newConditionalFormatRule()`);

    var criteriaMethod = `when${criteriaType}`;
    var criteriaArgs = criteriaValues.map((value) => `'${value}'`).join(", ");

    console.log(`  .${criteriaMethod}(${criteriaArgs})`);

    // Example for setting background color, adjust based on actual formatting
    console.log(`  .setBackground('${format.getBackground()}')`);

    // Example for setting font color, adjust based on actual formatting
    console.log(`  .setFontColor('${format.getFontColor()}')`);

    console.log(`  .setRanges([range])`);
    console.log(`  .build();`);
    console.log(`sheet.setConditionalFormatRules([rule]);`);
  });
}
