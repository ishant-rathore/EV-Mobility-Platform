# ESP8266 charger monitor (low-voltage demo)

This firmware publishes the same normalized telemetry contract as the simulator.
It supports an optional DS18B20 on `D2` and a low-voltage fault-demo button on
`D5` (active low). The dashboard therefore needs no device-specific code.

1. Copy `include/config.example.h` to the ignored `include/config.h`.
2. Set local Wi-Fi, MQTT, and charger ID values.
3. Build and upload with PlatformIO: `pio run --target upload`.
4. Hold the `D5` button to publish `FAULT`; release it to publish `AVAILABLE`.

Published messages use `sourceMode: "HARDWARE_DEMO"` and
`isSimulated: true`. They are prototype observations, not certified charger
measurements. MQTT Last Will publishes `OFFLINE` when the connection is lost.

Never connect the ESP8266, DS18B20, hobby wiring, or breadboards directly to an
energized EV charger or mains conductor. PZEM integration is intentionally not
enabled here; use only isolated, supervised, low-voltage demonstration inputs.
