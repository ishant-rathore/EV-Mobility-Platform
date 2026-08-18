import mqtt from "mqtt";

const mqttUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";
const chargerId = process.env.CHARGER_ID ?? "charger-demo-1";
const client = mqtt.connect(mqttUrl);

client.on("connect", () => {
  console.log(`Charger simulator connected to ${mqttUrl}`);
  setInterval(() => {
    const telemetry = {
      chargerId,
      status: "AVAILABLE",
      powerKw: Number((45 + Math.random() * 10).toFixed(1)),
      temperatureCelsius: Number((30 + Math.random() * 5).toFixed(1)),
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
  }, 5000);
});
