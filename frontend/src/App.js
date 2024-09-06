import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";
import Login from "./components/login/Login";
import CreateTicket from "./components/CreateTicket/CreateTicket";
import ChangePassword from "./components/changePassword/ChangePassword";
import Layout from "./components/header/Layout";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminTickets from "./components/admin/tickets/AdminTicket";
import UserTickets from "./components/user/UserTickets";
import Agents from "./components/admin/Agents";
import NotFound from "./components/NotFound";
import Allowance from "./components/allowance/Allowance";
import AllowanceApprove from "./components/allowance/AllowanceApprove";
import AssignedTickets from "./components/user/staff/AssignedTickets";
import UserAllowance from "./components/user/UserAllowance";
import AdminAllowance from "./components/admin/AdminAllowance";

function App() {
  const { user } = useAuth();
  console.log("user", user);
  const userName = user ? user.empname : "";
  const isAdmin = user?.role === "SystemAdmin";

  return (
    <div className="App">
      <Router>
        <Routes>
          {user ? (
            isAdmin ? (
              // Admin Routes
              <>
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/tickets" element={<AdminTickets />} />
                <Route path="/createTicket" element={<CreateTicket />} />
                <Route path="/allowance" element={<Allowance />} />
                <Route path="/allAllowance" element={<AllowanceApprove />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/adminAllowance" element={<UserAllowance />} />
                <Route path="/" element={<Navigate to="/adminDashboard" />} />
                <Route path="/login" element={<Navigate to="/adminDashboard" />} />
                <Route element={<Layout userName={userName} />} />
              </>
            ) : (
              // User Routes
              <>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/tickets" element={<UserTickets />} />
                <Route path="/createTicket" element={<CreateTicket />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/allowance" element={<Allowance />} />
                <Route path="/userallowance" element={<UserAllowance />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Navigate to="/dashboard" />} />

                {user.role === "TPM" && (
                  <Route path="/allAllowance" element={<AllowanceApprove />} />
                )}

                {user.role !== "TPM" && user.role !== "Employee" && (
                  <Route path="/assignedTickets" element={<AssignedTickets />} />
                )}

                <Route element={<Layout userName={userName} />} />
              </>
            )
          ) : (
            // Public Routes
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
