import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DemoAccessCommand,
  DemoOccupancyEvent,
  DemoPayment,
  DemoReservation,
} from "@ev-mobility/shared-types";
import { apiRequest } from "../services/api.client";
import type { ReservationListResponse } from "../types/operator";

interface CreateReservationInput {
  recommendationId: string;
  vehicleId: string;
  startsAt: string;
  endsAt: string;
  paymentRequired: boolean;
}

interface OccupancyResponse {
  event: DemoOccupancyEvent;
  reservation: DemoReservation | null;
  history: DemoOccupancyEvent[];
}

export function useBookingFlow() {
  const queryClient = useQueryClient();
  const [reservation, setReservation] = useState<DemoReservation | null>(null);
  const [payment, setPayment] = useState<DemoPayment | null>(null);
  const [access, setAccess] = useState<DemoAccessCommand | null>(null);
  const [occupancy, setOccupancy] = useState<DemoOccupancyEvent | null>(null);
  const [paymentKey] = useState(() => `web-${crypto.randomUUID()}`);

  const history = useQuery({
    queryKey: ["driver", "reservations", "driver-demo"] as const,
    queryFn: () => apiRequest<ReservationListResponse>("/reservations?driverId=driver-demo"),
  });

  const create = useMutation({
    mutationFn: (input: CreateReservationInput) =>
      apiRequest<DemoReservation>("/reservations", {
        method: "POST",
        body: JSON.stringify({
          ...input,
          driverId: "driver-demo",
          assignParkingBay: true,
        }),
      }),
    onSuccess: (created) => {
      setReservation(created);
      setPayment(null);
      setAccess(null);
      setOccupancy(null);
      void queryClient.invalidateQueries({ queryKey: ["driver", "reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["operator", "reservations"] });
    },
  });

  const pay = useMutation({
    mutationFn: ({ reservationId, amount }: { reservationId: string; amount: number }) =>
      apiRequest<DemoPayment>(`/reservations/${reservationId}/payments/simulate`, {
        method: "POST",
        body: JSON.stringify({
          idempotencyKey: paymentKey,
          amount,
          currency: "INR",
          outcome: "APPROVED",
        }),
      }),
    onSuccess: (approved) => {
      setPayment(approved);
      setReservation((current) => current
        ? { ...current, paymentStatus: approved.status, status: "CONFIRMED" }
        : current);
      void queryClient.invalidateQueries({ queryKey: ["driver", "reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["operator", "reservations"] });
    },
  });

  const unlock = useMutation({
    mutationFn: (reservationId: string) =>
      apiRequest<DemoAccessCommand>(`/reservations/${reservationId}/access/unlock`, {
        method: "POST",
      }),
    onSuccess: setAccess,
  });

  const recordOccupancy = useMutation({
    mutationFn: ({ reservationId, occupied }: { reservationId: string; occupied: boolean }) =>
      apiRequest<OccupancyResponse>(`/reservations/${reservationId}/occupancy`, {
        method: "POST",
        body: JSON.stringify({ occupied }),
      }),
    onSuccess: (result) => {
      setOccupancy(result.event);
      if (result.reservation) setReservation(result.reservation);
      void queryClient.invalidateQueries({ queryKey: ["driver", "reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["operator", "reservations"] });
    },
  });

  const errors = [create.error, pay.error, unlock.error, recordOccupancy.error].filter(
    (error): error is Error => error instanceof Error,
  );

  return {
    reservation,
    payment,
    access,
    occupancy,
    history: history.data?.reservations ?? [],
    historyLoading: history.isLoading,
    create,
    pay,
    unlock,
    recordOccupancy,
    error: errors[0] ?? null,
  };
}
