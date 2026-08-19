import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../services/api.client";
import type { DemoControlSnapshot } from "../types/demo-control";

const DEMO_CONTROL_KEY = ["admin", "demo-control"] as const;

interface DemoAction {
  label: string;
  path: string;
  body: Record<string, unknown>;
}

export function useDemoControls() {
  const queryClient = useQueryClient();
  const snapshot = useQuery({
    queryKey: DEMO_CONTROL_KEY,
    queryFn: () => apiRequest<DemoControlSnapshot>("/admin/demo"),
    refetchInterval: 15_000,
  });
  const action = useMutation({
    mutationFn: ({ path, body }: DemoAction) =>
      apiRequest<DemoControlSnapshot>(`/admin/demo${path}`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(DEMO_CONTROL_KEY, data);
      void queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey[0] !== "admin",
      });
    },
  });

  return { snapshot, action };
}
