console.log("App.jsx is being loaded");
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewRequirement from "./pages/NewRequirement";
import ViewRequirement from "./pages/ViewRequirement";
import NotFound from "./pages/NotFound";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();


const ProtectedRoute = () => {
  const { user } = useAuth();
  console.log("ProtectedRoute render:", { user, isAuthenticated: !!user });
  
  if (!user) {
    console.log("ProtectedRoute redirecting to login");
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute rendering content");
  return <Outlet />;
};

// Public route component (for login/register only)
const PublicRoute = () => {
  const { user } = useAuth();
  console.log("PublicRoute render:", { user, isAuthenticated: !!user });
  
  if (user) {
    console.log("PublicRoute redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("PublicRoute rendering login/register");
  return <Outlet />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-requirement" element={<NewRequirement />} />
                <Route path="/requirement/:id" element={<ViewRequirement />} />
              </Route>
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;