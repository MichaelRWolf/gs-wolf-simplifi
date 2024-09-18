
# Project: Simplifi Google Apps Script - Transaction Splits Inheritance

## Overview
This project focuses on cleaning up and backfilling transaction splits in Google Sheets that are exported from Simplifi personal finance software. The primary goal is to process rows related to split transactions by inheriting the relevant attributes from their parent transaction.

## Requirements

### 1. Function: `inheritSplitAttributesFromParent(data)`
This function is responsible for backfilling empty fields in split transactions with values inherited from the parent transaction in the Google Sheets dataset.

#### Parameters:
- **`data`**: A 2D array where the first row contains the column headers, and the subsequent rows contain transaction data.

#### Functionality:
- **Headers**: 
    - The column positions of `category`, `account`, `state`, `postedOn`, and `payee` should be inferred from the first row (headers).
- **Parent Transaction**: 
    - Any row that has `SPLIT` in the `category` column is considered a parent transaction.
    - The values of `account`, `state`, `postedOn`, and `payee` from the parent transaction should be stored.
- **Split Transactions**: 
    - Rows immediately following a parent transaction (with `SPLIT` in `category`) are considered split rows.
    - If **all** of the relevant fields (`account`, `state`, `postedOn`, `payee`) in a split row are empty, these fields should be backfilled with the values from the parent transaction.
    - Split rows retain their own values for other fields (e.g., `category`, `amount`, etc.).
- **Processing**: 
    - The function processes all rows in the dataset.
    - Rows that are not split rows (i.e., they have non-empty values in the relevant fields) remain unchanged.

#### Return:
- Returns the modified `backfilledData` (a 2D array) with inherited attributes for split rows.

### 2. Example Usage
```javascript
function exampleUsage() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('YourSheetName'); // Replace with your sheet name
  
  // Get all data from the sheet
  var data = sheet.getDataRange().getValues();
  
  // Pass the data to the function and get back the modified (backfilled) data
  var backfilledData = inheritSplitAttributesFromParent(data);
  
  // Write the modified data back to the sheet
  sheet.getRange(1, 1, backfilledData.length, backfilledData[0].length).setValues(backfilledData);
}
```

## Important Notes:
- The function will only backfill fields if **all** of the relevant fields (`account`, `state`, `postedOn`, `payee`) are empty in a split row.
- The sheet's data will be passed into the function as a 2D array (`data`) and returned as `backfilledData` for further use.
- The `category` column is used to identify parent transactions and split transactions. Only split rows following a parent will be modified.

## Column Requirements:
Ensure the following column headers are present:
- **`account`**
- **`state`**
- **`postedOn`**
- **`payee`**
- **`category`**

If any of these are missing, the function will throw an error.

## Expected Dataset Size:
The function is optimized for datasets of less than 4,000 rows. It may need optimization for larger datasets.

## Future Considerations:
- Additional functionality could be added to process different types of transactions or to extend support for other fields.

