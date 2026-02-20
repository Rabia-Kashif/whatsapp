import "./App.css";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "./providers/QueryProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ChatLayout from "./components/layout/chat-layout/ChatLayout";
import ChatDashboard from "./pages/ChatDashbaord";
import DashboardLayout from "./components/layout/admin-layout/DashboardLayout";
import Agents from "./modules/Agents/pages/Agents";
function App() {
  const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (!token) {
      return <Navigate to="/" replace />;
    }

    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  };
  const RedirectToDashboard = () => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      return <Navigate to="/chat-dashboard" replace />;
    }

    return <Login />;
  };
  return (
    <QueryProvider>
      <BrowserRouter>
        {/* Toast container should be global, outside routes */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />

        <Routes>
          <Route path="/" element={<RedirectToDashboard />} />

          {/* Admin Dashboard Route */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="agents" replace />} />

            <Route path="agents" element={<Agents />} />
          </Route>

          {/* Agent Dashboard Route */}
          <Route
            path="/chat-dashboard"
            element={
              <ProtectedRoute allowedRole="agent">
                <ChatLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="sessions" replace />} />

            <Route path="sessions" element={<ChatDashboard />} />
          </Route>

          {/* fallback to login for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
