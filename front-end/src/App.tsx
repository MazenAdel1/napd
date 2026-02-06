import { Route, Routes } from "react-router";
import { AuthLayout, Login, Register } from "./components/auth";
import {
  AdminLayout,
  AdminDashboard,
  AdminTimeSlotsPage,
  AdminAppointments,
  Clients,
  Reports,
  ReportCard,
  ReportLayout,
  RegisterAdmin,
} from "./components/admin";

import {
  ClientLayout,
  Home,
  ClientTimeSlotsPage,
  ClientAppointments,
  Profile,
} from "./components/client";

import UserProvider from "./UserProvider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Auth routes - public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin routes - protected */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="time-slots" element={<AdminTimeSlotsPage />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="reports">
            <Route index element={<Reports />} />
            <Route element={<ReportLayout />}>
              <Route path=":reportId" element={<ReportCard />} />
            </Route>
          </Route>
          <Route
            element={
              <AuthLayout className="min-h-[calc(100dvh-1.5rem)] px-0" />
            }
          >
            <Route path="registerAdmin" element={<RegisterAdmin />} />
          </Route>
        </Route>

        {/* Client routes - protected */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/time-slots" element={<ClientTimeSlotsPage />} />
          <Route path="/appointments" element={<ClientAppointments />} />
        </Route>
      </Routes>
      <Toaster />
    </UserProvider>
  );
}

export default App;
