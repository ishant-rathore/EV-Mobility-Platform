import mqtt from "mqtt";

const mqttUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";
const chargerId = process.env.CHARGER_ID ?? "charger-demo-1-ccs2";
const scenario = process.env.SIMULATOR_SCENARIO ?? "cycle";
const client = mqtt.connect(mqttUrl);
const states = ["AVAILABLE", "CONNECTED_NOT_CHARGING", "CHARGING", "FAULT", "OFFLINE"] as const;
let sequenceNumber = 0;

function statusForSequence() {
  if (scenario === "healthy") return "AVAILABLE" as const;
  if (scenario === "fault") return "FAULT" as const;
  return states[sequenceNumber % states.length] ?? "AVAILABLE";
}

client.on("connect", () => {
  console.log(`Charger simulator connected to ${mqttUrl} (${scenario})`);
  setInterval(() => {
    const status = statusForSequence();
    const telemetry = {
      chargerId,
      status,
      powerKw: status === "CHARGING" ? 48 : 0,
      voltageV: status === "CHARGING" ? 400 : 0,
      currentA: status === "CHARGING" ? 120 : 0,
      energyKwh: Number((sequenceNumber * 0.07).toFixed(2)),
      temperatureCelsius: status === "FAULT" ? 76 : status === "CHARGING" ? 39 : 31,
      deviceUptimeSeconds: sequenceNumber * 5,
      sequenceNumber,
      recordedAt: new Date().toISOString(),
      sourceMode: "SIMULATOR",
      isSimulated: true,
    };
    client.publish(
      `volttwin/chargers/${chargerId}/telemetry`,
      JSON.stringify(telemetry),
      { qos: 1 },
    );
    console.log(telemetry);
    sequenceNumber += 1;
  }, 5000);
});
