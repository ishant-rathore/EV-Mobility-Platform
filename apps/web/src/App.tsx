import { AppLayout } from "./app/layouts/AppLayout";
import { AppRouter } from "./app/router";

export function App() {
  return (
    <AppLayout>
      <AppRouter />
    </AppLayout>
  );
}
