const Papa = require("papaparse");

let csv_string;
let headers;

beforeEach(() => {
  csv_string = `
,account,state,postedOn,payee,usage,category,tags,notes,amount,action,security,description,quantity,price,commission


,"BECU Checking","CLEARED","1/26/2024","Bank Of America - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$100.00","","","","","",""

,"BECU Checking","CLEARED","1/31/2024","Bank of America Vi/mc - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$334.14","","","","","",""

,"Citi Visa","CLEARED","4/22/2024","Wal-mart","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Personal Expense:Groceries","",,"-7.98",,,,,,
,,,,,,"Office Supplies & Materials {short-term Operation, Refillable/replacement} (business)","",,"-6.77",,,,,,
,,,,,,"Personal Expense:Adventure & Entertainment & Fitness","",,"-21.97",,,,,,
,,,,,,"Office Supplies & Materials {short-term Operation, Refillable/replacement} (business)","",,"-4.97",,,,,,
,,,,,,"Personal Expense:Groceries","",,"-9.89",,,,,,

,"Chase Visa - Amazon","CLEARED","6/21/2024","Ingles Markets","","Personal Expense:Groceries","","","-$6.48","","","","","",""

,"BECU Checking","CLEARED","7/12/2024","Atm Withdrawal","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Personal Expense:ATM & Pocket Cash","",,"-300.00",,,,,,
,,,,,,"Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","",,"-4.00",,,,,,

,"Citi Visa","CLEARED","7/16/2024","Gas Lite General Store","","Personal Auto & RV Expenses:Propane / LP Gas","","","-$25.43","","","","","",""

  `.trim();

  headers = ["account", "state", "postedOn", "payee", "usage", "category", "tags", "notes", "amount", "action", "security", "description", "quantity", "price", "commission"];
});


describe("CSV Data", () => {
  test("CSV string should have length greater than zero", () => {
    expect(csv_string.length).toBeGreaterThan(0);
  });
});


describe("CSV Parsing", () => {
  let transactions;

  beforeEach(() => {
    transactions = Papa.parse(csv_string, { skipEmptyLines: true }).data;
  });

  test("Parses CSV into a 2D array with correct row count", () => {
    expect(transactions.length).toBe(14); // Header + 13 data rows
  });


  describe("Header validation", () => {
    test("First cell should be empty", () => {
      expect(transactions[0][0]).toBe("");
    });

    test("Remaining header values should match headers", () => {
      expect(transactions[0].slice(1)).toEqual(headers);
    });
  });


  test("Each row should have value for each header (and empty leading header)", () => {
    const expectedColumns = 1 + headers.length;
    transactions.forEach(row => expect(row.length).toBe(expectedColumns));
  });
});


describe("CSV parse/string/parse round-trip", () => {
  let transactions;
  let csv_output;

  test("Can stringify 2D array....", () => {
    transactions = Papa.parse(csv_string, { skipEmptyLines: true }).data;
    csv_output = Papa.unparse(transactions);

    expect(typeof csv_output).toBe("string");
    expect(csv_output.length).toBeGreaterThan(0);
    expect(csv_output.split("\n").length).toBe(transactions.length);
  });

  test("... and recreate original data", () => {
    const transactions2 = Papa.parse(csv_output, { skipEmptyLines: true }).data;
    expect(transactions2).toStrictEqual(transactions);
  });
});


describe("CSV before cleanup", () => {
  let transactions;

  beforeEach(() => {
    transactions = Papa.parse(csv_string, { skipEmptyLines: true }).data;
  });

  let split_parent_records;
  test("Has SPLIT parent records...", () => {
    split_parent_records = transactions.filter(row => row[6] === "SPLIT");
    expect(split_parent_records.length).toBeGreaterThan(0);
    // console.log(split_parent_records);
  });

  test("... ALL of which have non-empty 'account', 'state', 'postedOn', and 'payee'", () => {
    const conformers = split_parent_records.filter(row => row[1] !== "" && row[2] !== "" && row[3] !== "" && row[4] !== "");
    expect(conformers.length).toBe(split_parent_records.length);
  });

  test("... ALL of which have zero 'amount'", () => {
    const violators = split_parent_records.filter(row => row[9] !== '$0.00');
    expect(violators.length).toBe(0)
  });


  // Has SPLIT child records
  // ... ALL of which have empty 'account', 'state', 'postedOn', and 'payee'
  // ... ALL of which have non-zero 'amount'
  // ... ALL of which have non-empty 'category' and not 'SPLIT'


  describe("BECU ATM Split on 7/12/2024", () => {
// ,"BECU Checking","CLEARED","7/12/2024","Atm Withdrawal","","SPLIT","","","$0.00","","","","","",""
// ,,,,,,"Personal Expense:ATM & Pocket Cash","",,"-300.00",,,,,,
// ,,,,,,"Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","",,"-4.

//     filter:
// postedOn 7/12/2024
// account BECU Checking
// payee Atm Withdrawal

//     assert:
// count 1
// category SPLIT
// amount $0.00

//     act & assert
// count 3?
// 1 category SPLIT
// N category non-split
// sum amount = $304.00
  });
  


  
});

