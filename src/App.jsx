import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
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

  // filters
  const [filters, setFilters] = useState({
    name: "",
    country: "",
    industry: "",
    sortOrder: "",
  });

  const isFetchingRef = useRef(false);
  const cacheRef = useRef({});

  // handle filter changes
  const handleFilters = ({ name, value }) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setCompanies([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedFilters]);

  useEffect(() => {
    isFetchingRef.current = false;
  }, [page]);

  const fetchCompanies = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
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
      const cacheKey = params.toString();
      if (cacheRef.current[cacheKey]) {
        return setCompanies((prev) => [...prev, ...cacheRef.current[cacheKey]]);
      }
      const res = await fetch(`${API_BASE}/companies?${cacheKey}`);
      if (!res.ok) throw new Error("Failed to fetch companies");

      const data = await res.json();
      if (data.length === 0) setHasMore(false);
      setCompanies((prev) => [...prev, ...data]);
      cacheRef.current[cacheKey] = data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [debouncedFilters, page]);

  // Call fetch whenever page or filters change
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Infinite scroll observer
  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    error,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  // Memoized sorting (only runs when data or sort order changes)
  const sortedCompanies = useMemo(() => {
    if (!filters.sortOrder) return companies;
    const sorted = [...companies].sort((a, b) =>
      filters.sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    return sorted;
  }, [companies, filters.sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">
          Companies Directory – Infinite Scroll
        </h1>

        {/* Filters */}
        <FilterSection filters={filters} handleFilters={handleFilters} />

        {/* Companies */}
        {sortedCompanies.length === 0 && !loading && (
          <div className="text-center text-slate-500 mt-10">
            No companies found.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {sortedCompanies.map((item, i) => (
            <Card item={item} key={i} />
          ))}
        </div>

        {/* Load states */}
        {loading && (
          <div className="text-center py-4 text-slate-500">Loading...</div>
        )}
        {error && <div className="text-center text-red-600 mt-4">{error}</div>}
        {!hasMore && !loading && (
          <div className="text-center text-slate-400 mt-4">
            No more results.
          </div>
        )}

        {/* Sentinel */}
        {/* <div ref={lastElementRef} style={{ height: "20px" }} /> */}
        <div ref={lastElementRef} className="h-10 bg-transparent" />
      </div>
    </div>
  );
}
