const segments = ["corridor-north", "corridor-central", "corridor-south"];

setInterval(() => {
  const snapshots = segments.map((segmentId) => ({
    segmentId,
    freeFlowSpeedKph: 60,
    observedSpeedKph: Math.round(15 + Math.random() * 45),
    occupancyPercent: Math.round(20 + Math.random() * 70),
    capturedAt: new Date().toISOString(),
  }));
  console.log(JSON.stringify(snapshots));
}, 5000);
