import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";

interface Fluvia {
  uuid: string;
  userUuid: number;
  contractAddress: string;
  label: string;
  receiverAddress: number;
}

interface FluviaResponse {
  fluvias: Fluvia[];
  message?: string;
}

interface UseFluviaReturn {
  fluvias: Fluvia[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFluvia(): UseFluviaReturn {
  const [fluvias, setFluvias] = useState<Fluvia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = usePrivy();

  const fetchFluvia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fluvias/all", {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data: FluviaResponse = await response.json();
      setFluvias(data.fluvias);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setFluvias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.wallet?.address) {
      fetchFluvia();
    }
  }, [fetchFluvia, user]);

  const refetch = useCallback(async () => {
    await fetchFluvia();
  }, [fetchFluvia]);

  return {
    fluvias,
    loading,
    error,
    refetch,
  };
}
