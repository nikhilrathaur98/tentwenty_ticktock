"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

interface ApiState<T> {
  requestKey: string;
  data?: T;
  error?: string;
}

/**
 * Loads JSON from one of our API routes.
 * Returns the data, a loading flag, an error message and a `refetch` function.
 */
export function useApi<T>(url: string) {
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${url}#${reloadCount}`;
  const [state, setState] = useState<ApiState<T>>({ requestKey: "" });

  useEffect(() => {
    const controller = new AbortController();

    apiFetch<T>(url, { signal: controller.signal })
      .then((data) => setState({ requestKey, data }))
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setState((previous) => ({
          requestKey,
          data: previous.data,
          error: error.message,
        }));
      });

    // Cancel the request if the url changes or the component unmounts.
    return () => controller.abort();
  }, [url, requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    data: state.data,
    error: state.requestKey === requestKey ? state.error : undefined,
    isLoading: state.requestKey !== requestKey,
    refetch,
  };
}
