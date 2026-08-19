import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiDataRequest, getAuthToken, setAuthToken } from "../../services/api.client";

export type OperatorRole = "INFRASTRUCTURE_OPERATOR" | "OPERATOR" | "PARKING_OPERATOR" | "ADMIN";

export interface OperatorUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: string;
}

interface OperatorAuthContextValue {
  user: OperatorUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const OperatorAuthContext = createContext<OperatorAuthContextValue | null>(null);

export const INFRASTRUCTURE_ROLES = new Set<string>([
  "INFRASTRUCTURE_OPERATOR",
  "OPERATOR",
  "PARKING_OPERATOR",
  "ADMIN",
]);

export function OperatorAuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<OperatorUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getAuthToken()));

  const refresh = async () => {
    if (!getAuthToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiDataRequest<OperatorUser>("/users/me");
      setUser(response.data);
    } catch {
      setAuthToken(null);
      queryClient.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo<OperatorAuthContextValue>(() => ({
    user,
    isLoading,
    login: async (email, password) => {
      const response = await apiDataRequest<{ user: OperatorUser; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      queryClient.clear();
      setAuthToken(response.data.token);
      setUser(response.data.user);
    },
    logout: () => {
      setAuthToken(null);
      queryClient.clear();
      setUser(null);
    },
    refresh,
  }), [user, isLoading, queryClient]);

  return <OperatorAuthContext.Provider value={value}>{children}</OperatorAuthContext.Provider>;
}

export function useOperatorAuth() {
  const context = useContext(OperatorAuthContext);
  if (!context) throw new Error("useOperatorAuth must be used inside OperatorAuthProvider");
  return context;
}
