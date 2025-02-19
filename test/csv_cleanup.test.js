const Papa = require("papaparse");

let csv_string;
let headers;

beforeEach(() => {
  csv_string = `
,account,state,postedOn,payee,usage,category,tags,notes,amount,action,security,description,quantity,price,commission
,"BECU Checking","CLEARED","1/31/2024","Bank of America Vi/mc - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$334.14","","","","","",""
  `.trim();

  headers = ["account", "state", "postedOn", "payee", "usage", "category", "tags", "notes", "amount", "action", "security", "description", "quantity", "price", "commission"];
});

test("CSV string should have length greater than zero", () => {
  expect(csv_string.length).toBeGreaterThan(0);
});

test("Can parse CSV string into 2-dimensional array", () => {
  const transactions = Papa.parse(csv_string, { skipEmptyLines: true }).data;

  expect(transactions.length).toBe(2); // Header + 1 data row

  header_count = headers.length
  expect(transactions[0][0]).toBe("");
  expect(transactions[0].slice(1)).toEqual(headers);

  transactions.forEach(row => expect(row.length).toBe(1 + header_count));
});
