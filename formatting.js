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
    .addItem(
      "2.2 applyFormattingToDataDigestedTab",
      "applyFormattingToDataDigestedTab"
    )
    .addItem(
      "2.1 applyFormattingToPivotTablesTab",
      "applyFormattingToPivotTablesTab"
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

  const a1Formula =
    "=query('Data - Raw'!A:J,\"Select B, D, E, G, H, J order by D DESC, B, E, J\", 1)";
  sheet.getRange("A1").setFormula(a1Formula);

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

function applyFormattingToDataDigestedTab() {
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
  amountRange.setNumberFormat("#,##0.00;(#,##0.00);0.00");

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

function applyFormattingToPivotTablesTab() {
  const sheetName = "Pivot Tables";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log('${sheetName}" not found.');
    return;
  }
  console.log("Formatting ${sheetName}");

  // Frozen & Bold
  sheet.setFrozenRows(1);
  sheet.getRange("1:1").setFontWeight("bold");

  // Number Format
  const numberAccountingFormat = "#,##0;(#,##0);0";

  const amountRange = sheet.getRange("E2:E");
  amountRange.setNumberFormat(numberAccountingFormat);

  const numberFormat = {
    "SUM of amount": numberAccountingFormat,
    amount: numberAccountingFormat,
  };
  // Get the headers from the first row
  const headers = sheet.getRange("1:1").getValues()[0];

  // Column Width
  const columnWidth = {
    Type: 50,
    account: 100,
    "SUM of amount": 75,
    payee: 300,
    amount: 75,
    category: 300,
    "Parent Category": 300 * 0.8,
    "Child Category": 200 * 0.8,
  };

  headers.forEach(function (header, index) {
    const columnNumber = index + 1;

    const width = columnWidth[header];
    if (width) {
      console.log(`Setting column ${columnNumber} width to ${width}`);
      sheet.setColumnWidth(columnNumber, width); // Set the column width based on header lookup
    }

    const format = numberFormat[header];
    if (format) {
      const rangeString = `${columnNumber}2:${columnNumber}`;
      console.log(`Setting column ${columnNumber} numberFormat to ${format}`);
      sheet
        .getRange(2, columnNumber, sheet.getLastRow())
        .setNumberFormat(format);
    }
  });

  // Show & Hide
  // sheet.showColumns(1, sheet.getMaxColumns());
  // sheet.hideColumns(4);
  // sheet.hideColumns(5);
  // sheet.hideColumns(7);

  console.log("Formatting ${sheetName}...done");
}

function applyFormatting() {
  applyFormattingToDataDigestedTab();
  applyFormattingToPivotTablesTab();
}
