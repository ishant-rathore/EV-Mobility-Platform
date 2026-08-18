export interface RouteCandidate {
  routeId: string;
  durationMinutes: number;
  congestionScore: number;
}

export function diversifyRoutes(routes: RouteCandidate[]): RouteCandidate[] {
  return [...routes].sort(
    (a, b) =>
      a.durationMinutes * (1 + a.congestionScore / 100) -
      b.durationMinutes * (1 + b.congestionScore / 100),
  );
}
