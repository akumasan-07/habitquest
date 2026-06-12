import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import LandingPage from "./pages/LandingPage";

const App = () => (
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/progress" element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      } />
      
      <Route path="/login" element = {
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />

      <Route path="/register" element= {
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>

    <Toaster position="top-right" richColors expand={false} />

  </BrowserRouter>
);

export default App;
