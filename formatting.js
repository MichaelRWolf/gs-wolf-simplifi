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

    .addItem("4. checkTransfersBalance", "checkTransfersBalance")

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

function checkTransfersBalance() {
  var sheet = getDataDigestedSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();

  var accountIndex = headers.indexOf("account");
  var categoryIndex = headers.indexOf("category");
  var amountIndex = headers.indexOf("amount");
  var postedOnIndex = headers.indexOf("postedOn");
  var typeIndex = headers.indexOf("Type");

  var transfers = data.filter((row) => row[typeIndex] === "Transfer"); // Filter transfers
  var unmatchedTransfers = [];
  var matchingTransfers = [];

  let matchingTransferId = 0;

  // Create a map to track matched transactions
  var transferMap = {};

  transfers.forEach((row) => {
    var account = row[accountIndex];
    var category = row[categoryIndex];
    var amount = row[amountIndex];
    var postedOn = row[postedOnIndex];

    // Create unique key for the transfer
    var key = `${account}-${category}-${Math.abs(amount)}`;

    // Create reverse key for finding the opposite transaction
    var reverseKey = `${category}-${account}-${Math.abs(amount)}`;

    if (transferMap[reverseKey]) {
      matchingTransferId++;
      // If the reverse transaction is already recorded, remove it as it's balanced
      var matchedRow = transferMap[reverseKey];
      var matchingTransfer = [
        matchingTransferId,
        matchedRow[accountIndex],
        matchedRow[categoryIndex],
        matchedRow[amountIndex],
        matchedRow[postedOnIndex],
      ];
      matchingTransfers.push(matchingTransfer);

      // Add the current row as the reverse match as well
      matchingTransfers.push([
        matchingTransferId,
        account,
        category,
        amount,
        postedOn,
      ]);

      delete transferMap[reverseKey];
    } else {
      // Add the current transaction to the map
      transferMap[key] = row;
    }
  });

  // Any remaining transactions in transferMap are unbalanced or unmatched
  unmatchedTransfers = Object.values(transferMap);

  // Create the report
  if (unmatchedTransfers.length > 0) {
    Logger.log("Unmatched or Unbalanced Transfers:");
    unmatchedTransfers.forEach((transfer) => {
      Logger.log(
        `Account: ${transfer[accountIndex]}, Category: ${transfer[categoryIndex]}, Amount: ${transfer[amountIndex]}, postedOn: ${transfer[postedOnIndex]}`
      );
      matchingTransfers.push([
        "",
        transfer[accountIndex],
        transfer[categoryIndex],
        transfer[amountIndex],
        transfer[postedOnIndex],
      ]);
    });
  } else {
    Logger.log("All transfers are balanced.");
  }
  updateTransfersSheet(matchingTransfers, [
    "ID",
    "account",
    "category",
    "amount",
    "postedOn",
  ]);
}

/**
 * Updates the 'Transfers' sheet with matching transfers data.
 * Clears existing data and populates with new data.
 *
 * @param {Array} matchingTransfers - List of matched transfer records.
 * @param {Array} headers - Headers of the main data set.
 */
function updateTransfersSheet(matchingTransfers, headers) {
  var transferSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transfers");

  // Clear existing data
  transferSheet.clear();

  // Set headers for the Transfers sheet
  transferSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // If there are matching transfers, set the data in the sheet
  if (matchingTransfers.length > 0) {
    transferSheet
      .getRange(2, 1, matchingTransfers.length, headers.length)
      .setValues(matchingTransfers);
  }
}

function getDataDigestedSheet() {
  const sheetName = "Data - Digested";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log(`${sheetName}" not found.`);
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

  const j1Formula =
    '={"YYYY"; ARRAYFORMULA(IF(ISBLANK($B$2:$B), "", TEXT($B$2:$B, "yyyy")))}';
  sheet.getRange("J1").setFormula(j1Formula);

  const k1Formula =
    '={"YYYY-Qn"; ARRAYFORMULA(IF(ISBLANK($B$2:$B), "", TEXT($B$2:$B, "yyyy") & "-Q" & ROUNDUP(MONTH($B$2:$B)/3, 0)))}';
  sheet.getRange("K1").setFormula(k1Formula);
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
    console.log(`${sheetName}" not found.`);
    return;
  }
  console.log(`Formatting sheet:  ${sheetName}`);

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

  console.log(`Formatting sheet:  ${sheetName}...done`);
}

function applyFormattingToPivotTablesTab() {
  const sheetName = "Pivot Tables";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    console.log(`${sheetName}" not found.`);
    return;
  }
  console.log(`Formatting sheet:  ${sheetName}`);

  // Frozen & Bold
  sheet.setFrozenRows(2);
  sheet.getRange("1:2").setFontWeight("bold");

  // Number Format
  const numberAccountingFormat = "#,##0;(#,##0);0";

  // const amountRange = sheet.getRange("E3:E");
  // amountRange.setNumberFormat(numberAccountingFormat);

  const numberFormat = {
    "": numberAccountingFormat,
    "Grand Total": numberAccountingFormat,
    "SUM of amount": numberAccountingFormat,
    1899: numberAccountingFormat,
    2022: numberAccountingFormat,
    2023: numberAccountingFormat,
    2024: numberAccountingFormat,
    amount: numberAccountingFormat,
  };
  // Get the headers
  const headers = sheet.getRange("2:2").getValues()[0];

  // Column Width
  const columnWidth = {
    Type: 50,
    account: 100,
    payee: 300,
    category: 300,
    "Parent Category": 300 * 0.8,
    "Child Category": 200 * 0.8,

    "": 75,
    "Grand Total": 75,
    "SUM of amount": 75,
    1899: 75,
    2022: 75,
    2023: 75,
    2024: 75,
    amount: 75,
  };

  headers.forEach(function (header, index) {
    const columnNumber = index + 1;

    const width = columnWidth[header];
    if (width) {
      console.log(
        `Setting '${header}' (${columnNumber}) columnWidth to ${width}`
      );
      sheet.setColumnWidth(columnNumber, width); // Set the column width based on header lookup
    }

    const format = numberFormat[header];
    if (format) {
      console.log(
        `Setting '${header}' (${columnNumber}) numberFormat to ${format}`
      );
      sheet
        .getRange(3, columnNumber, sheet.getLastRow())
        .setNumberFormat(format);
    }
  });

  // Show & Hide
  // sheet.showColumns(1, sheet.getMaxColumns());
  // sheet.hideColumns(4);
  // sheet.hideColumns(5);
  // sheet.hideColumns(7);

  console.log(`Formatting sheet:  ${sheetName}...done`);
}

function applyFormatting() {
  applyFormattingToDataDigestedTab();
  applyFormattingToPivotTablesTab();
}
