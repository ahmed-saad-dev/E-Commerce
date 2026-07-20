import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { ALL_CATEGORY } from "../components/Navbar/navCategories";
import { getSlugsForCategory } from "../utils/categoryTree";
import { getCategorySlug } from "../utils/categoryUtils";

const DEBOUNCE_MS = 400;
const SUGGESTION_LIMIT = 6;

async function fetchSuggestions(term) {
  const { data } = await api.get("/products/search", { params: { q: term } });
  return data?.products || [];
}

/**
 * Debounces a raw search term, fetches matching products through the
 * shared api.js instance (cached/deduped by react-query), and narrows
 * the results down to the selected category, if any.
 */
export function useDebouncedSearch(term, category = ALL_CATEGORY) {
  const [debouncedTerm, setDebouncedTerm] = useState(term.trim());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [term]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["productSearchSuggestions", debouncedTerm],
    queryFn: () => fetchSuggestions(debouncedTerm),
    enabled: debouncedTerm.length > 0,
    staleTime: 60 * 1000,
  });

  const filtered =
    category === ALL_CATEGORY
      ? results
      : results.filter((product) => getSlugsForCategory(category).includes(getCategorySlug(product)));

  return {
    suggestions: filtered.slice(0, SUGGESTION_LIMIT),
    isLoading: debouncedTerm.length > 0 && isFetching,
  };
}
