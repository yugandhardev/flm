import { useCallback, useEffect, useRef } from "react";

export default function useInfiniteScroll({
  loading,
  hasMore,
  error,
  onLoadMore,
}) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || error) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold: 1.0 }
      ); // fully in view

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore, error]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { lastElementRef };
}
