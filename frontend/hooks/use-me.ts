import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect, useCallback } from "react";

interface Me {
  uuid: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

interface MeResponse {
  user: Me;
  created?: boolean;
  message?: string;
}

interface UseMeReturn {
  me: Me | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isCreated: boolean;
}

export function useMe(): UseMeReturn {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const { user } = usePrivy();

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fluvia/me", {
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

      const data: MeResponse = await response.json();
      setMe(data.user);
      setIsCreated(data.created || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setMe(null);
      setIsCreated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.wallet?.address) {
      fetchMe();
    }
  }, [fetchMe, user]);

  const refetch = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return {
    me,
    loading,
    error,
    refetch,
    isCreated,
  };
}
