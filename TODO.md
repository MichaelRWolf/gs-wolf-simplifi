# Tasks

## To Do

- Remove dependency on 'Pivot Tables' as special name
- create dateAs_YYYY() helper function
- create dateAs_YYYY-Qn() helper function

- deconstruct pivot table(s) into pivotTableBuilder(s)
- add pivotTableBuilder.build() to 'Pivot Tables' tab (via arrayformula trigger onLoad)

## DONE

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
