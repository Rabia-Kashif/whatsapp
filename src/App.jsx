import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "./providers/QueryProvider";
import Home from "./pages/Home";
import { isMobileDevice } from "./utils/deviceCheck";

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return <Navigate to="/" replace />;
    }
    if (isMobileDevice()) {
      return <Navigate to="mobile-not-supported" replace />;
    }

    return children;
  };
  const RedirectToDashboard = () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return <Navigate to="/dashboard" replace />;
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

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* fallback to login for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
