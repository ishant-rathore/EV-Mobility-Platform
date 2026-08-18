# MQTT Payloads

<<<<<<< HEAD
Document versioned JSON payload contracts here.
=======
Payloads are UTF-8 JSON with `deviceId`, ISO-8601 `timestamp`, `source`, and `isSimulated`. Domain-specific fields are validated by backend telemetry handlers before use. Unknown fields may be ignored; invalid required fields must not be persisted as trustworthy telemetry.
>>>>>>> junior/main
