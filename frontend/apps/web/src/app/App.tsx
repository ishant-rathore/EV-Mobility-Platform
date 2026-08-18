import { Route, Routes } from "react-router-dom";
import { PageShell } from "../components/common/PageShell";
import { DemoControls } from "../pages/admin/DemoControls";
import { ChargerDetails } from "../pages/driver/ChargerDetails";
import { JourneyPlanner } from "../pages/driver/JourneyPlanner";
import { JourneyResult } from "../pages/driver/JourneyResult";
import { LiveJourney } from "../pages/driver/LiveJourney";
import { Analytics } from "../pages/operator/Analytics";
import { ChargerMonitor } from "../pages/operator/ChargerMonitor";
import { DigitalTwin } from "../pages/operator/DigitalTwin";

export function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<JourneyPlanner />} />
        <Route path="/journey/result" element={<JourneyResult />} />
        <Route path="/journey/live" element={<LiveJourney />} />
        <Route path="/chargers/:chargerId" element={<ChargerDetails />} />
        <Route path="/operator" element={<DigitalTwin />} />
        <Route path="/operator/chargers" element={<ChargerMonitor />} />
        <Route path="/operator/analytics" element={<Analytics />} />
        <Route path="/admin" element={<DemoControls />} />
      </Routes>
    </PageShell>
  );
}
