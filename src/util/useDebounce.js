import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 400) {
  debugger;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer when component unmounts
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
