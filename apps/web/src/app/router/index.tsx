import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../../pages/system/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
