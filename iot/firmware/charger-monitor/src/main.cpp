#include <Arduino.h>
#include <ArduinoJson.h>
#include <DallasTemperature.h>
#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <PubSubClient.h>

#include "device_config.h"

namespace {
constexpr uint8_t kTemperaturePin = D2;
constexpr uint8_t kFaultButtonPin = D5;
constexpr unsigned long kPublishIntervalMs = 5000;

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
OneWire oneWire(kTemperaturePin);
DallasTemperature temperatureSensors(&oneWire);
unsigned long lastPublishAt = 0;
uint32_t sequenceNumber = 0;

String telemetryTopic() {
  return String("volttwin/chargers/") + CHARGER_ID + "/telemetry";
}

String offlinePayload() {
  JsonDocument document;
  document["chargerId"] = CHARGER_ID;
  document["status"] = "OFFLINE";
  document["sourceMode"] = "HARDWARE_DEMO";
  document["isSimulated"] = true;
  String payload;
  serializeJson(document, payload);
  return payload;
}

void connectWifi() {
  if (WiFi.status() == WL_CONNECTED) return;

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println(" connected");
}

void connectMqtt() {
  while (!mqttClient.connected()) {
    const String clientId = String("volttwin-charger-") + CHARGER_ID;
    const String topic = telemetryTopic();
    const String willPayload = offlinePayload();
    const bool connected = mqttClient.connect(
        clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD, topic.c_str(), 1, true,
        willPayload.c_str());

    if (!connected) {
      Serial.printf("MQTT connection failed (%d); retrying\n", mqttClient.state());
      delay(2000);
    }
  }
}

void publishTelemetry() {
  temperatureSensors.requestTemperatures();
  const float temperatureCelsius = temperatureSensors.getTempCByIndex(0);
  const bool demoFault = digitalRead(kFaultButtonPin) == LOW;

  JsonDocument document;
  document["chargerId"] = CHARGER_ID;
  document["status"] = demoFault ? "FAULT" : "AVAILABLE";
  document["sourceMode"] = "HARDWARE_DEMO";
  document["isSimulated"] = true;
  document["deviceUptimeSeconds"] = millis() / 1000;
  document["sequenceNumber"] = sequenceNumber++;

  // A disconnected DS18B20 is omitted rather than reported as a real reading.
  if (temperatureCelsius != DEVICE_DISCONNECTED_C) {
    document["temperatureCelsius"] = temperatureCelsius;
  }

  String payload;
  serializeJson(document, payload);
  const String topic = telemetryTopic();
  mqttClient.publish(topic.c_str(), payload.c_str(), false);
  Serial.println(payload);
}
}  // namespace

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(kFaultButtonPin, INPUT_PULLUP);
  temperatureSensors.begin();
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  connectWifi();
}

void loop() {
  connectWifi();
  connectMqtt();
  mqttClient.loop();

  if (millis() - lastPublishAt >= kPublishIntervalMs) {
    lastPublishAt = millis();
    publishTelemetry();
  }

  digitalWrite(LED_BUILTIN, mqttClient.connected() ? LOW : HIGH);
  delay(10);
}
