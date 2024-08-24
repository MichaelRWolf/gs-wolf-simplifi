function foo() {
  var sheet = getDataDigestedSheet();
  var rules = [];

  // https://developers.google.com/apps-script/reference/spreadsheet/conditional-format-rule-builder
  var rule1 = createIncomeConditionalFormattingRuleForIncome();
  rules.push(rule1);

  var rule2 = createConditionalFormattingRuleForTransferInColumnG();
  rules.push(rule2);

  var rule3 = createConditionalFormattingRuleForTransferInColumnH();
  rules.push(rule3);

  // Set the rules back on the sheet
  sheet.setConditionalFormatRules(rules);
}

function getDataDigestedSheet() {
  var sheetName = "Data - Digested";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log('${sheetName}" not found.');
    return;
  }
  return sheet;
}

const BLACK = "#000000";

function createIncomeConditionalFormattingRuleForIncome() {
  var sheet = getDataDigestedSheet();
  var formula = '=$G2="Income"';
  var ranges = [sheet.getRange("A2:I2499")];
  var backgroundColor = "#e6efdb";
  var rule = newConditionalFormattingBuilderFactory(
    backgroundColor,
    ranges,
    formula
  ).build();

  return rule;
}

function newConditionalFormattingBuilderFactory(
  backgroundColor,
  ranges,
  formula
) {
  return SpreadsheetApp.newConditionalFormatRule()
    .setBackground(backgroundColor)
    .setFontColor(BLACK)
    .setBold(true)
    .setRanges(ranges)
    .whenFormulaSatisfied(formula);
}

function createConditionalFormattingRuleForTransferInColumnG() {
  var sheet = getDataDigestedSheet();
  var formula = '=$G2="Transfer"';
  var ranges = [sheet.getRange("A2:I2499")];
  var backgroundColor = "#93CCEA";
  var rule = newConditionalFormattingBuilderFactory(
    backgroundColor,
    ranges,
    formula
  ).build();

  return rule;
}

function createConditionalFormattingRuleForTransferInColumnH() {
  var sheet = getDataDigestedSheet();
  var formula = '=$H2="Transfer"';
  var backgroundColor = "#d9e7fd";
  var ranges = [sheet.getRange("A2:I2499")];
  var rule = newConditionalFormattingBuilderFactory(
    backgroundColor,
    ranges,
    formula
  ).build();

  return rule;
}

function logConditionalFormatting() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets(); // Get all sheets in the spreadsheet

  // Iterate through all sheets
  sheets.forEach(function (thisSheet) {
    console.log("Sheet: " + thisSheet.getName());

    var rules = thisSheet.getConditionalFormatRules(); // Get all conditional formatting rules for the sheet

    // Iterate through all conditional formatting rules
    rules.forEach(function (rule, index) {
      console.log("Rule #" + (index + 1) + ":");

      var ranges = rule.getRanges(); // Get the ranges to which the rule applies
      console.log(rule);
      console.log(".toString(): ${rule.toString()}");
      console.log(rule.getBooleanCondition().toString());
      console.log(rule.getGradientCondition().toString());
      console.log(JSON.stringify(rule, null, 2));
      // Logger.log(rule);
      // console.log(JSON.stringify(ranges, null, 2));

      // // Log details for each range
      // ranges.forEach(function(range) {
      //   console.log("  Range: " + range.getA1Notation());
      // });

      // var criteria = rule.getCriteriaType(); // Get the type of criteria used in the rule
      // console.log("  Criteria Type: " + criteria);

      // var conditionValues = rule.getCriteriaValues(); // Get the criteria values
      // console.log("  Criteria Values: " + conditionValues.join(", "));

      // var formatting = rule.getTextStyle(); // Get text formatting details
      // console.log("  Text Style: " + JSON.stringify(formatting));

      // formatting = rule.getBackground(); // Get background color
      // console.log("  Background Color: " + formatting);
    });
  });
}

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

// /**
//  * Logs all the conditional formatting rules for the 'Data - Digested' sheet.
//  */
// function logConditionalFormatting() {
//   var sheetName = "Data - Digested";
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
//   if (!sheet) {
//     console.log('${sheetName}" not found.');
//     return;
//   }

//   // Get the conditional formatting rules for the sheet
//   var rules = sheet.getConditionalFormatRules();

//   if (rules.length === 0) {
//     console.log("No conditional formatting rules found.");
//     return;
//   }

//   console.log("// Conditional Formatting Rules");

//   rules.forEach(function(rule, index) {
//     var ranges = rule.getRanges();
//     var criteriaType = rule.getCriteriaType();
//     var criteriaValues = rule.getCriteriaValues();
//     var format = rule.getBooleanCondition();

//     var rangesStr = ranges
//       .map((range) => `'${range.getA1Notation()}'`)
//       .join(", ");

//     console.log(`// Conditional Formatting Rule ${index + 1}`);
//     console.log(`var range = sheet.getRange(${rangesStr});`);
//     console.log(`var rule = SpreadsheetApp.newConditionalFormatRule()`);

//     var criteriaMethod = `when${criteriaType}`;
//     var criteriaArgs = criteriaValues.map((value) => `'${value}'`).join(", ");

//     console.log(`  .${criteriaMethod}(${criteriaArgs})`);

//     // Example for setting background color, adjust based on actual formatting
//     console.log(`  .setBackground('${format.getBackground()}')`);

//     // Example for setting font color, adjust based on actual formatting
//     console.log(`  .setFontColor('${format.getFontColor()}')`);

//     console.log(`  .setRanges([range])`);
//     console.log(`  .build();`);
//     console.log(`sheet.setConditionalFormatRules([rule]);`);
//   });
// }
