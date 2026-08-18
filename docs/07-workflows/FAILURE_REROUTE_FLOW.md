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

Module 7 emits WebSocket telemetry and fault events immediately. While the Module 10 live
journey view is active, a primary-charger fault automatically replays the last authoritative
journey request, Module 8 recomposes the recommendation, and the UI explains whether the
backup was promoted. The client never invents a replacement charger locally.
