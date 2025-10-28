import React, { useEffect, useState, useMemo, useCallback } from "react";
import Card from "./components/Card";
import FilterSection from "./components/FilterSection";
import useInfiniteScroll from "./util/useInfiniteScroll";
import useDebounce from "./util/useDebounce";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    country: "",
    industry: "",
    sortOrder: "",
  });

  // Debounced filter updates
  const debouncedFilters = useDebounce(filters, 500);

  // Handle filter changes
  const handleFilters = useCallback(({ name, value }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Reset when filters change
  useEffect(() => {
    setIsResetting(true);
    setCompanies([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, [debouncedFilters]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const { name, country, industry } = debouncedFilters;
        const params = new URLSearchParams({
          page,
          limit: 10,
          ...(name && { name }),
          ...(country && { country }),
          ...(industry && { industry }),
        });

        const res = await fetch(`${API_BASE}/companies?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();

        if (data.length === 0) setHasMore(false);
        else {
          setCompanies((prev) => [...prev, ...data]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsResetting(false);
      }
    };

    fetchCompanies();
  }, [page, debouncedFilters]);

  const onLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    error,
    isResetting,
    onLoadMore,
  });

  const sortedCompanies = useMemo(() => {
    if (!filters.sortOrder) return companies;
    return [...companies].sort((a, b) =>
      filters.sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [companies, filters.sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          Companies Directory – Infinite Scroll
        </h1>

        {/* Filters */}
        <FilterSection filters={filters} handleFilters={handleFilters} />

        {sortedCompanies.length === 0 && !loading && (
          <div className="text-center text-slate-500 mt-10">
            No companies found.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {sortedCompanies.map((item, i) => (
            <Card item={item} key={i} />
          ))}
        </div>

        {loading && (
          // <div className="text-center py-4 text-slate-500">Loading...</div>
          <div className="grid gap-5 md:grid-cols-3">
            {sortedCompanies.map((item, i) => (
              <Card item={item} key={i} />
            ))}
          </div>
        )}
        {error && <div className="text-center text-red-600 mt-4">{error}</div>}
        {!hasMore && !loading && (
          <div className="text-center text-slate-400 mt-4">
            No more results.
          </div>
        )}

        <div ref={lastElementRef} className="h-10 bg-transparent" />
      </div>
    </div>
  );
}
