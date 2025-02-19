let csv_string;

beforeEach(() => {
  csv_string = `
,account,state,postedOn,payee,usage,category,tags,notes,amount,action,security,description,quantity,price,commission
,"BECU Checking","CLEARED","1/31/2024","Bank of America Vi/mc - Online Payment","","xx - Alaska Airlines Visa Platinum Plus - 0327","","","-$334.14","","","","","",""
  `.trim();
});

test("CSV string should have length greater than zero", () => {
  expect(csv_string.length).toBeGreaterThan(0);
});

test("CSV string should have length greater than twelve", () => {
  expect(csv_string.length).toBeGreaterThan(12);
});
