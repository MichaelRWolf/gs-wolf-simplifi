# Tasks

## To Do

### Test

- Redirect tab `Data - Digested` away from `Data - Raw` and to `Data - Split Fields Distributed`. There seems to be a problem with sorting by date. Probably because former was created with 'split' that auto-created numbers and dates, and later was created with @CustomFunction that did not.
  - Add logic after Utilities.parseCsv() to detect/convert Date() (and maybe Number()) objects.

-- Before
splitCategory(${1:categoryString})$0

- Use identifier name instead of string to build menus (e.g. myOnOpen.name or checkTransfersBalance.name)

###

- create dateAs_YYYY() helper function
- create dateAs_YYYY-Qn() helper function

- deconstruct pivot table(s) into pivotTableBuilder(s)
- add pivotTableBuilder.build() to 'Pivot Tables' tab (via arrayformula trigger onLoad)

### AutoConvertAfterCsvParse

```javascript
function parseCsvRespectingQuotes(input) {
	if (!input) {
		return [["Error: No data provided"]];
	}

	function convertValue(value) {
		if (!value.trim()) return ""; // Preserve empty fields
		if (!isNaN(value) && value.trim() !== "") return Number(value); // Convert to number
		if (!isNaN(Date.parse(value))) return new Date(value); // Convert to Date
		if (value.toLowerCase() === "true") return true; // Convert to Boolean true
		if (value.toLowerCase() === "false") return false; // Convert to Boolean false
		return value; // Return original string
	}

	if (typeof input === "string") {
		return Utilities.parseCsv(input).map((row) => row.map(convertValue));
	} else if (Array.isArray(input) && input.length > 0) {
		return input.map((row) =>
			row[0] ? Utilities.parseCsv(row[0])[0].map(convertValue) : [],
		);
	} else {
		return [["Error: Invalid input type"]];
	}
}
```

## DONE

- Create formula to call csv_split_cleanup()
- Create JS CustomFunction csv_split_cleanup()
- Create JS function distributeSplitParentFieldsToChildren();
- Create JS function parseCsvRespectingQuotes(input) - string or array
- Remove 'applyFormatting', a deprecated aggregator
- Create onSelectionChange() to prevent expensive (and wasteful) action onLoad.
- Remove dependency on 'Pivot Tables' as special name
- New function: resetTriggers. Remove all triggers. Set onLoad to setupMenus.
- New function: createRule({ranges, condition, backgroundColor})
- Add YYYY column to 'Data - Digested' tab (via arrayformula trigger onLoad)
- Add YYYY-Qn column to 'Data - Digested' tab (via arrayformula trigger onLoad)
- Add YYYY and YYYY-Qn columns to 'Pivot Tables' tab
- Format money formatting to all YYYY columns
- Produce YYYY and YYYY-Qn values only if there is a date field
- optomize splitCategoryRange() or splitCategory() to avoid exceeding 30 sec limit

## `Transfers' Tab

- Add `float` column with this formula
  `=if(and((not(isblank(A2))), A2=A3),abs(E2-E3),"")`

- Format `amount` as accounting number

- Conditional formatting based on `float` column

```typescript
float < 1 ? "green" : float < 2 ? "yellow" : "red";
```

`xxx = AND(ISNUMBER($F2), $F2 <= 1)`

## Emacs

;; Local Variables:
;; eval: (apheleia-mode 1)
;; End:
