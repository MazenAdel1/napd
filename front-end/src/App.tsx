import { Route, Routes } from "react-router";
import AuthLayout from "./components/pages/auth/AuthLayout";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Clients from "./components/pages/admin/Clients";
import RegisterAdmin from "./components/pages/admin/RegisterAdmin";
import UserProvider from "./UserProvider";
import AdminLayout from "./components/pages/admin/AdminLayout";
import AdminPage from "./components/pages/admin/AdminPage";
import TimeSlotsPage from "./components/TimeSlotsPage";
import Home from "./components/pages/home/Home";
import HomeLayout from "./components/pages/home/HomeLayout";

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
          <Route element={<AuthLayout />}>
            <Route path="registerAdmin" element={<RegisterAdmin />} />
          </Route>
        </Route>

        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="/time-slots" element={<TimeSlotsPage />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
