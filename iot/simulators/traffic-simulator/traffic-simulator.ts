interface TrafficSegment {
  segmentId: string;
  freeFlowSpeedKph: number;
  observedSpeedKph: number;
  occupancyPercent: number;
  capturedAt: string;
}

const segments = [
  { segmentId: "corridor-north", freeFlowSpeedKph: 80, baseLoad: 60 },
  { segmentId: "corridor-central", freeFlowSpeedKph: 60, baseLoad: 80 },
  { segmentId: "corridor-south", freeFlowSpeedKph: 70, baseLoad: 50 },
  { segmentId: "corridor-east", freeFlowSpeedKph: 65, baseLoad: 55 },
];

function generateSnapshot(segment: (typeof segments)[0]): TrafficSegment {
  const hour = new Date().getHours();
  const isRushHour = (hour >= 7 && hour < 10) || (hour >= 17 && hour < 20);
  const rushFactor = isRushHour ? 1.3 : 1.0;
  const variation = 0.85 + Math.random() * 0.3;
  const load = Math.min(95, segment.baseLoad * rushFactor * variation);
  const speedRatio = Math.max(0.15, 1 - load / 100);
  const observedSpeed = Math.round(segment.freeFlowSpeedKph * speedRatio);

  return {
    segmentId: segment.segmentId,
    freeFlowSpeedKph: segment.freeFlowSpeedKph,
    observedSpeedKph: observedSpeed,
    occupancyPercent: Math.round(load),
    capturedAt: new Date().toISOString(),
  };
}

setInterval(() => {
  const snapshots = segments.map(generateSnapshot);
  console.log(JSON.stringify(snapshots));
}, 5000);

console.log("Traffic simulator started. Generating snapshots every 5 seconds...");