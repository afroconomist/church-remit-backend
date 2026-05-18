export const createEventBudgetRules = {
  category: "required|string|in:venue,equipment,catering,marketing,staff,transportation,decorations,others",
  itemDescription: "required|string|min:3|max:255",
  budgetedAmount: "required|integer|min:1",
};

export const editEventBudgetRules = {
  category: "string|in:venue,equipment,catering,marketing,staff,transportation,decorations,others",
  itemDescription: "string|min:3|max:255",
  budgetedAmount: "integer|min:1",
  actualAmount: "integer|min:0",
  status: "string|in:pending,paid,partially-paid",
};
