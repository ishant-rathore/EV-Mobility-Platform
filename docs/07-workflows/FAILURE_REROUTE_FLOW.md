# Failure recomputation flow

```text
REST/MQTT telemetry event
→ normalized charger telemetry
→ Module 6 reliability recomputation
→ faulted/offline charger becomes unusable
→ Module 5 candidate filtering and backup promotion
→ Module 8 recomposes recommendation
→ UI displays the new primary and explanation
```

The current implementation recomputes on the next journey/recommendation request. Automatic WebSocket-driven client refresh is a remaining Module 7 real-time UI task.
