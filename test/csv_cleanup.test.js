const Papa = require("papaparse");

const  csv_text_original = `
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

const transactions_original = Object.freeze(Papa.parse(csv_text_original, { skipEmptyLines: true }).data);
const headers = Object.freeze(transactions_original[0].slice(1));
const index_of = Object.fromEntries(headers.map((header, index) => [header, index + 1]));


function csv_cleanup_splits(transactions) {
  return transactions;
}



describe("CSV Data", () => {
  test("CSV string should have length greater than zero", () => {
    expect(csv_text_original.length).toBeGreaterThan(0);
  });
});


describe("CSV Parsing", () => {
  test("Parses CSV into a 2D array with correct row count", () => {
    expect(transactions_original.length).toBe(14); // Header + 13 data rows
  });

  describe("Header validation", () => {
    test("First cell should be empty", () => {
      expect(transactions_original[0][0]).toBe("");
    });

    test("Remaining header values should match headers", () => {
      expect(transactions_original[0].slice(1)).toEqual(headers);
    });
  });

  test("Each row should have value for each header (and empty leading header)", () => {
    const expectedColumns = 1 + headers.length;
    transactions_original.forEach(row => expect(row.length).toBe(expectedColumns));
  });
});


describe("Transaction list - Raw", () => {
  let split_parent_records;
  let split_parent_record_count_original;
  let matching_records;

  beforeEach(() => {
    split_parent_records = transactions_original.filter(row =>
      row[index_of['category']] === "SPLIT"
    );
  });

  describe("Raw", () => {
    it("Has some SPLIT parent records...", () => {
      split_parent_record_count_original = split_parent_records.length;
      expect(split_parent_record_count_original).toBeGreaterThan(0);
    });
    
    test("... ALL have non-empty 'account', 'state', 'postedOn', and 'payee'", () => {
      matching_records = split_parent_records.filter(row =>
	row[index_of['account']]  !== "" &&
	  row[index_of['state']]    !== "" &&
	  row[index_of['postedOn']] !== "" &&
	  row[index_of['payee']]    !== ""
      );
      expect(matching_records.length).toBe(split_parent_records.length);
    });

    test("... ALL have zero 'amount'", () => {
      const violators = split_parent_records.filter(row =>
	row[index_of['amount']] !== '$0.00'
      );
      expect(violators.length).toBe(0);
    });
  });


  const transactions_cleaned = Object.freeze(csv_cleanup_splits(transactions_original));


  describe("Cleaned", () => {
    it("Has identical transaction count", () => {
      expect(transactions_cleaned.length).toBeGreaterThan(3);
      expect(transactions_cleaned.length).toBe(transactions_original.length);
    });
    test("... and SPLIT parent count", () => {
      expect(split_parent_records.length).toBe(split_parent_record_count_original);
    });

    it("Is still identical", () => {
      expect(transactions_cleaned).toStrictEqual(transactions_original);
    });

  });
});
