export const updateAssetRules = {
  group_id: "string",
  assetName: "required|string",
  category: "required|string",
  purchaseValue: "required|numeric",
  purchaseDate: "required|string",
  location: "required|string",
  condition: "required|string|in:excellent,good,fair,needs-repair,retired",
  campusId: "string",
};
