import { Route, Routes } from "react-router";
import AuthLayout from "./components/pages/auth/AuthLayout";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Clients from "./components/pages/admin/Clients";
import RegisterAdmin from "./components/pages/admin/RegisterAdmin";
import UserProvider from "./UserProvider";
import AdminLayout from "./components/pages/admin/AdminLayout";
import AdminPage from "./components/pages/admin/AdminPage";
import TimeSlotsPage from "./components/timeSlots/TimeSlotsPage";
import Home from "./components/pages/home/Home";
import HomeLayout from "./components/pages/home/HomeLayout";
import { Toaster } from "./components/ui/sonner";
import Appointments from "./components/appointments/Appointments";
import Reports from "./components/pages/admin/report/Reports";
import Report from "./components/pages/admin/report/ReportCard";
import ReportLayout from "./components/pages/admin/report/ReportLayout";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="clients" element={<Clients />} />
          <Route path="time-slots" element={<TimeSlotsPage />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports">
            <Route index element={<Reports />} />
            <Route element={<ReportLayout />}>
              <Route path=":reportId" element={<Report />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="registerAdmin" element={<RegisterAdmin />} />
          </Route>
        </Route>

        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="/time-slots" element={<TimeSlotsPage />} />
          <Route path="/appointments" element={<Appointments />} />
        </Route>
      </Routes>
      <Toaster />
    </UserProvider>
  );
}

export default App;
