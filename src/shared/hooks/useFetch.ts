import { useEffect, useState } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(url: string) => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const res = await fetch(url, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setState({
            data: null,
            loading: false,
            error: `Error ${res.status}`,
          });
          return;
        }

        const data: T = (await res.json()) as T;

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return state;
};

export default useFetch;
