/// <reference types="google-apps-script" />

const BLACK = "#000000";

function myOnOpen() {
  setupMenus();
  setupDataDigestedSheet();
}

function listTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    console.log(
      `Trigger ID: ${trigger.getUniqueId()}, Function: ${trigger.getHandlerFunction()}`
    );
  }
}

function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const count = triggers.length;

  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }

  console.log(`${count} triggers have been deleted.`);
}

function setupTriggers() {
  ScriptApp.newTrigger("myOnOpen")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onOpen()
    .create();
}

function doNothing() {
  // Do nothing!
}

function setupMenus() {
  const ui = SpreadsheetApp.getUi();

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

    .addItem("X - setupTriggers", "setupTriggers")
    .addItem("deleteAllTriggers", "deleteAllTriggers")
    .addItem("listTriggers", "listTriggers")

    .addItem("----", "doNothing")

    .addItem("myOnOpen", "myOnOpen")

    .addToUi();
}

function getDataDigestedSheet() {
  const sheetName = "Data - Digested";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log('${sheetName}" not found.');
    return;
  }
  return sheet;
}

function setupDataDigestedSheet() {
  setupFormulae();
  applyFormatting();
  recreateConditionalFormattingRules();
}

function setupFormulae() {
  const sheet = getDataDigestedSheet();

  const g1Formula = '={ "Type"; Transaction_Types($A2:$A, H2:H) }';
  sheet.getRange("G1").setFormula(g1Formula);

  const h1Formula =
      '={{"Parent Category", "Child Category"}; splitCategoryRange($D2:$D)}';
  sheet.getRange("H1").setFormula(h1Formula);
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

function recreateConditionalFormattingRules() {
  const sheet = getDataDigestedSheet();
  const rules = [];

  // Consolidate using map --
  // see: https://chatgpt.com/c/9cc333b8-0808-4b27-b1f0-107a1b373bf6
  //   var ruleConfigs = [
  //     { range: "A2:I2499", formula: '=$G2="Income"', backgroundColor: "#e6efdb" },
  //     { range: "A2:I2499", formula: '=$G2="Transfer"', backgroundColor: "#93CCEA" },
  //     { range: "A2:I2499", formula: '=$H2="Transfer"', backgroundColor: "#d9e7fd" }
  //   ];
  //
  //   var rules = ruleConfigs.map(function(config) {
  //     return createConditionalFormattingRule(config);
  //   });
  //
  //   sheet.setConditionalFormatRules(rules);
  // }

  // function createConditionalFormattingRule({ range, formula, backgroundColor }) {
  // var ranges = [getDataDigestedSheet().getRange(range)];
  // var conditionalFormattingBuilder = newConditionalFormattingBuilderFactory(
  //   ranges,
  //   formula,
  //   backgroundColor
  // );

  const incomeRule = newConditionalFormattingRule(
      [getDataDigestedSheet().getRange("A2:I2499")],
      '=$G2="Income"',
      "#e6efdb"
  );
  rules.push(incomeRule);

  const transferTypeRule = newConditionalFormattingRule(
      [getDataDigestedSheet().getRange("A2:I2499")],
      '=$G2="Transfer"',
      "#93CCEA"
  );
  rules.push(transferTypeRule);

  const transferCategoryRule = newConditionalFormattingRule(
      [getDataDigestedSheet().getRange("A2:I2499")],
      '=$H2="Transfer"',
      "#d9e7fd"
  );
  rules.push(transferCategoryRule);

  sheet.setConditionalFormatRules(rules);
}

function newConditionalFormattingRule(ranges, formula, backgroundColor) {
  return newConditionalFormattingBuilderFactory(
    ranges,
    formula,
    backgroundColor
  ).build();
}
function applyFormatting() {
  const sheetName = "Data - Digested";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
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
  const amountRange = sheet.getRange("F2:F");
  amountRange.setNumberFormat('"("#,##0.00")";(#,##0.00);#,##0.00');

  // Column Width
  // account	postedOn	payee	category	tags	amount	Type	Parent Category	Child Category
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
