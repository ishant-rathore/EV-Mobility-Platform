export const chargerTopics = {
  telemetry: (chargerId: string) => `volttwin/chargers/${chargerId}/telemetry`,
  status: (chargerId: string) => `volttwin/chargers/${chargerId}/status`,
  heartbeat: (chargerId: string) => `volttwin/chargers/${chargerId}/heartbeat`,
};
