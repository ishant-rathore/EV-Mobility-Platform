# ADR-004: MQTT for Device Messaging

**Status:** Accepted

Use MQTT for device telemetry, status, heartbeat, commands, and acknowledgements. The backend is the application gateway. Anonymous Mosquitto configuration is limited to isolated local development; shared environments require authenticated identities and ACLs.
