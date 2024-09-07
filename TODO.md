DONE
- New function: resetTriggers.  Remove all triggers.  Set onLoad to setupMenus.
- New function: createRule({ranges, condition, backgroundColor})
- Add YYYY column to 'Data - Digested' tab (via arrayformula trigger onLoad)
- Add YYYY-Qn column to 'Data - Digested' tab (via arrayformula trigger onLoad)
- Add YYYY and YYYY-Qn columns to 'Pivot Tables' tab
- Format money formatting to all YYYY columns
- Produce YYYY and YYYY-Qn values only if there is a date field

To Do

- optomize splitCategoryRange() or splitCategory() to avoid exceeding 30 sec limit
- create dateAs_YYYY() helper function
- create dateAs_YYYY-Qn() helper function

- deconstruct pivot table(s) into pivotTableBuilder(s)
- add pivotTableBuilder.build() to 'Pivot Tables' tab (via arrayformula trigger onLoad)

