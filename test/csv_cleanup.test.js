const Papa = require("papaparse");

let csv_string;
let headers;

beforeEach(() => {
  csv_string = `
,account,state,postedOn,payee,usage,category,tags,notes,amount,action,security,description,quantity,price,commission
,"BECU Checking","CLEARED","1/31/2024","Bank of America Vi/mc - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$334.14","","","","","",""
,"BECU Checking","CLEARED","1/26/2024","Bank Of America - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$100.00","","","","","",""
,"BECU Checking","CLEARED","7/12/2024","Atm Withdrawal","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Personal Expense:ATM & Pocket Cash","",,"-300.00",,,,,,
,,,,,,"Personal Expense:Fees - Atm & Bank & Finance & Late & Service Charges (personal)","",,"-4.00",,,,,,
,"Citi Visa","CLEARED","8/1/2024","Gas Lite General Store","","Personal Auto & RV Expenses:Propane / LP Gas","","","-$25.43","","","","","",""
,"Citi Visa","CLEARED","7/16/2024","Gas Lite General Store","","Personal Auto & RV Expenses:Propane / LP Gas","","","-$25.43","","","","","",""
,"Citi Visa","CLEARED","4/22/2024","Wal-mart","","SPLIT","","","$0.00","","","","","",""
,,,,,,"Personal Expense:Groceries","",,"-7.98",,,,,,
,,,,,,"Office Supplies & Materials {short-term Operation, Refillable/replacement} (business)","",,"-6.77",,,,,,
,,,,,,"Personal Expense:Adventure & Entertainment & Fitness","",,"-21.97",,,,,,
,,,,,,"Office Supplies & Materials {short-term Operation, Refillable/replacement} (business)","",,"-4.97",,,,,,
,,,,,,"Personal Expense:Groceries","",,"-9.89",,,,,,

  `.trim();

  headers = ["account", "state", "postedOn", "payee", "usage", "category", "tags", "notes", "amount", "action", "security", "description", "quantity", "price", "commission"];
});

test("CSV string should have length greater than zero", () => {
  expect(csv_string.length).toBeGreaterThan(0);
});

test("Can parse CSV string into 2-dimensional array", () => {
  const transactions = Papa.parse(csv_string, { skipEmptyLines: true }).data;

  expect(transactions.length).toBe(14); // Header + 1 data row

  header_count = headers.length
  expect(transactions[0][0]).toBe("");
  expect(transactions[0].slice(1)).toEqual(headers);

  transactions.forEach(row => expect(row.length).toBe(1 + header_count));
});
