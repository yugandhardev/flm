import { useCallback, useEffect, useRef } from "react";

export default function useInfiniteScroll({
  loading,
  hasMore,
  error,
  isResetting,
  onLoadMore,
}) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || error || !hasMore || isResetting) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && hasMore && !loading && !isResetting) {
            onLoadMore();
          }
        },
        {
          threshold: 0.5,
          rootMargin: "200px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore, error, isResetting]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  //When reset starts, disconnect observer immediately
  useEffect(() => {
    if (isResetting && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [isResetting]);

  return { lastElementRef };
}
