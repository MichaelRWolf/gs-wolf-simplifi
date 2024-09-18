// const { verify } = require('approvaltests');
const { verify } = require("approvals");
const { expect } = require("chai");
const inheritSplitAttributesFromParent = require("../src/inheritSplitAttributesFromParent");

describe("inheritSplitAttributesFromParent with inline CSV", function () {
  it("should process inline CSV input and compare output using ApprovalTests", function () {
    // Inline CSV input data as a string
    const inputCsv = `
    account,state,postedOn,payee,category
    BECU,WA,2024-07-01,Amazon,SPLIT
    ,,,,Split Category 1
    ,,,,Split Category 2
    `.trim(); // Ensure no extra whitespace

    // Convert CSV to array
    const inputData = csvToArray(inputCsv);

    // Process the input data
    const result = inheritSplitAttributesFromParent(inputData);

    // Convert the result back to CSV format
    const resultCsv = arrayToCsv(result);

    // Verify the result using ApprovalTests
    verify(resultCsv);
  });
});

/**
 * Helper function to convert CSV text to a 2D array
 */
function csvToArray(csvString) {
  return csvString.split("\n").map((row) => row.split(","));
}

/**
 * Helper function to convert 2D array to CSV text
 */
function arrayToCsv(arrayData) {
  return arrayData.map((row) => row.join(",")).join("\n");
}
