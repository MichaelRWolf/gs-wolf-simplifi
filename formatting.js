const BLACK = "#000000";

function setupMenus() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu("Custom Menu")
    .addItem(
      "3.c createConditionalFormattingRuleForTransferInColumnH",
      "createConditionalFormattingRuleForTransferInColumnH"
    )
    .addItem(
      "3.b createConditionalFormattingRuleForTransferInColumnG",
      "createConditionalFormattingRuleForTransferInColumnG"
    )
    .addItem(
      "3.a createIncomeConditionalFormattingRuleForIncome",
      "createIncomeConditionalFormattingRuleForIncome"
    )
    .addItem(
      "3. recreateConditionalFormattingRules",
      "recreateConditionalFormattingRules"
    )
    .addItem("2. applyFormatting", "applyFormatting")
    .addItem("1. setupFormulae", "setupFormulae")
    .addItem("0. setupDataDigestedSheet", "setupDataDigestedSheet")
    .addItem("-. setupMenus", "setupMenus")
    .addItem("----", "doNothing")

    // .addItem("X - setupTriggers", "setupTriggers")
    // .addItem("deleteAllTriggers", "deleteAllTriggers")
    // .addItem("listTriggers", "listTriggers")

    // .addItem("----", "doNothing")
    // .addItem("myOnOpen", "myOnOpen")

    .addToUi();
}

function setupDataDigestedSheet() {
  setupFormulae();
  applyFormatting();
  recreateConditionalFormattingRules();
}

function setupFormulae() {
  var sheet = getDataDigestedSheet();

  var g1Formula = '={ "Type"; Transaction_Types($A2:$A, H2:H) }';
  sheet.getRange("G1").setFormula(g1Formula);

  var h1Formula =
    '={{"Parent Category", "Chld Category"}; splitCategoryRange($D2:$D)}';
  sheet.getRange("H1").setFormula(h1Formula);
}

function recreateConditionalFormattingRules() {
  var sheet = getDataDigestedSheet();
  var rules = [];

  var rule1 = createIncomeConditionalFormattingRuleForIncome();
  rules.push(rule1);

  var rule2 = createConditionalFormattingRuleForTransferInColumnG();
  rules.push(rule2);

  var rule3 = createConditionalFormattingRuleForTransferInColumnH();
  rules.push(rule3);

  sheet.setConditionalFormatRules(rules);
}

function newConditionalFormattingBuilderFactory(
  ranges,
  formula,
  backgroundColor
) {
  // https://developers.google.com/apps-script/reference/spreadsheet/conditional-format-rule-builder
  return SpreadsheetApp.newConditionalFormatRule()
    .setRanges(ranges)
    .whenFormulaSatisfied(formula)
    .setFontColor(BLACK)
    .setBackground(backgroundColor)
    .setBold(false);
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

function createIncomeConditionalFormattingRuleForIncome() {
  var ranges = [getDataDigestedSheet().getRange("A2:I2499")];
  var formula = '=$G2="Income"';
  var backgroundColor = "#e6efdb";
  var conditionalFormattingBuilder = newConditionalFormattingBuilderFactory(
    ranges,
    formula,
    backgroundColor
  );

  var rule = conditionalFormattingBuilder.build();

  return rule;
}

function createConditionalFormattingRuleForTransferInColumnG() {
  var ranges = [getDataDigestedSheet().getRange("A2:I2499")];
  var formula = '=$G2="Transfer"';
  var backgroundColor = "#93CCEA";
  var conditionalFormattingBuilder = newConditionalFormattingBuilderFactory(
    ranges,
    formula,
    backgroundColor
  );

  var rule = conditionalFormattingBuilder.build();

  return rule;
}

function createConditionalFormattingRuleForTransferInColumnH() {
  var ranges = [getDataDigestedSheet().getRange("A2:I2499")];
  var formula = '=$H2="Transfer"';
  var backgroundColor = "#d9e7fd";
  var conditionalFormattingBuilder = newConditionalFormattingBuilderFactory(
    ranges,
    formula,
    backgroundColor
  );

  var rule = conditionalFormattingBuilder.build();

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
