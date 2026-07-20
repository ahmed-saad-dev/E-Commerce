import { ALL, getCategoryLabels } from "../../utils/categoryTree";

// Arabic display label for each top-level category coming from CATEGORY_TREE.
// Kept in one place so the search dropdown and the bottom category bar can
// never drift apart again.
const ARABIC_LABELS = {
  Electronics: "إلكترونيات",
  Fashion: "أزياء",
  Beauty: "الجمال والعناية",
  Home: "المنزل والمطبخ",
  Sports: "رياضة",
  Vehicles: "المركبات",
};

export const ALL_CATEGORY = ALL;

// [{ value: "All", label: "الكل" }, { value: "Electronics", label: "إلكترونيات" }, ...]
export const NAV_CATEGORIES = [
  { value: ALL, label: "الكل" },
  ...getCategoryLabels().map((value) => ({
    value,
    label: ARABIC_LABELS[value] || value,
  })),
];
