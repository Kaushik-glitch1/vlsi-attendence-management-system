import { useCallback, useEffect, useState } from "react";
import { get } from "./client";

export function useApi(path, { enabled = true } = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!enabled || !path) return;
    setLoading(true);
    setError(null);
    get(path)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [path, enabled]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, enabled]);

  return { data, loading, error, refetch, setData };
}
