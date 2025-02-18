# Tasks

## WIP

- Create AssertTabNames() function that warns if necessary tab names are missing

## TODO

- Modify `parenthesizedCategoryFromCategory` to allow array parameters so that it can be used in ARRAYFORMULA.  See discussion near here.... https://chatgpt.com/c/67b4be23-4cfc-8009-ab77-1367611ccd4a/

- `formatting.js - checkTransfersBalance()` - Do not match transfers
  that are more than N days apart

- Extract method, then loop over all tabs s/^Pivot/

```typescript
function applyFormattingToPivotTablesTab() {
    const sheetName = "Pivot Tables";
```

## DONE

- Make dist/* files read-only to discourage editing.
- Extend "2024" magic number to include 2025, 2026
- Get 'Type' column to update in 'Data - Digested'
