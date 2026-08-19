import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { OperatorLayout, RequireInfrastructureOperator } from "../layouts/OperatorLayout";
import { DemoControls } from "../../pages/admin/DemoControls";
import { ChargerDetails } from "../../pages/driver/ChargerDetails";
import { BookingFlow } from "../../pages/driver/BookingFlow";
import { JourneyPlanner } from "../../pages/driver/JourneyPlanner";
import { JourneyResult } from "../../pages/driver/JourneyResult";
import { LiveJourney } from "../../pages/driver/LiveJourney";
import { OperatorLogin } from "../../pages/operator/OperatorLogin";
import { NotFoundPage } from "../../pages/system/NotFoundPage";

const StationsPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.StationsPage })));
const ChargersPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.ChargersPage })));
const ChargerStatusPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.ChargerStatusPage })));
const ParkingLocationsPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.ParkingLocationsPage })));
const ParkingBaysPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.ParkingBaysPage })));
const OccupancyPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.OccupancyPage })));
const DevicesPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.DevicesPage })));
const SmartLocksPage = lazy(() => import("../../pages/operator/InfrastructureAssets").then((module) => ({ default: module.SmartLocksPage })));
const ChargingReservationsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.ChargingReservationsPage })));
const ChargingSessionsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.ChargingSessionsPage })));
const PricingPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.PricingPage })));
const ParkingReservationsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.ParkingReservationsPage })));
const ParkingSessionsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.ParkingSessionsPage })));
const AlertsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.AlertsPage })));
const SettingsPage = lazy(() => import("../../pages/operator/InfrastructureOperations").then((module) => ({ default: module.SettingsPage })));
const InfrastructureOverview = lazy(() => import("../../pages/operator/InfrastructurePerformance").then((module) => ({ default: module.InfrastructureOverview })));
const RevenuePage = lazy(() => import("../../pages/operator/InfrastructurePerformance").then((module) => ({ default: module.RevenuePage })));
const UtilizationPage = lazy(() => import("../../pages/operator/InfrastructurePerformance").then((module) => ({ default: module.UtilizationPage })));
const OperatorAnalyticsPage = lazy(() => import("../../pages/operator/InfrastructurePerformance").then((module) => ({ default: module.OperatorAnalyticsPage })));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/operator/login" element={<OperatorLogin />} />
      <Route path="/operator" element={<RequireInfrastructureOperator><OperatorLayout /></RequireInfrastructureOperator>}>
        <Route index element={<InfrastructureOverview />} />
        <Route path="stations" element={<StationsPage />} />
        <Route path="chargers" element={<ChargersPage />} />
        <Route path="charger-status" element={<ChargerStatusPage />} />
        <Route path="charging-reservations" element={<ChargingReservationsPage />} />
        <Route path="charging-sessions" element={<ChargingSessionsPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="parking-locations" element={<ParkingLocationsPage />} />
        <Route path="parking-bays" element={<ParkingBaysPage />} />
        <Route path="occupancy" element={<OccupancyPage />} />
        <Route path="parking-reservations" element={<ParkingReservationsPage />} />
        <Route path="parking-sessions" element={<ParkingSessionsPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="device-health" element={<DevicesPage healthOnly />} />
        <Route path="smart-locks" element={<SmartLocksPage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="utilization" element={<UtilizationPage />} />
        <Route path="analytics" element={<OperatorAnalyticsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="traffic" element={<Navigate to="/operator/analytics" replace />} />
      </Route>
      <Route element={<AppLayout><Outlet /></AppLayout>}>
        <Route path="/" element={<JourneyPlanner />} />
        <Route path="/journey/result" element={<JourneyResult />} />
        <Route path="/journey/booking" element={<BookingFlow />} />
        <Route path="/journey/live" element={<LiveJourney />} />
        <Route path="/chargers/:chargerId" element={<ChargerDetails />} />
        <Route path="/admin" element={<DemoControls />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
