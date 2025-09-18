import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocationProvider } from "./pages/LocationContext";

import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import LocationSelector from "./pages/LocationSelector";
import MarketAnalysis from "./pages/MarketAnalysis";
import CropSuitability from "./pages/CropSuitability";
import CropAdvisor from "./pages/CropAdvisor";
import YieldPredictor from "./pages/YieldPredictor";
import NotificationAlerts from "./pages/NotificationAlerts";
import FertiliserOptimisation from "./pages/FertiliserOptimisation";
import Infrastructure from "./pages/Infrastructure";
import WaterFootprint from "./pages/WaterFootprint";
import Weather from "./pages/Weather";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// New Key Feature Pages
import PesticideVerification from "./pages/PesticideVerification";
import ByproductUtilization from "./pages/ByproductUtilization";
import BlockchainTraceability from "./pages/BlockchainTraceability";
import FarmerSupport from "./pages/FarmerSupport";
import Community from "./pages/Community"; // <-- Added Community page

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LocationProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/market-analysis"
              element={
                <ProtectedRoute>
                  <MarketAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-suitability"
              element={
                <ProtectedRoute>
                  <CropSuitability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-advisor"
              element={
                <ProtectedRoute>
                  <CropAdvisor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/infrastructure"
              element={
                <ProtectedRoute>
                  <Infrastructure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/water-monitor"
              element={
                <ProtectedRoute>
                  <WaterFootprint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <Weather />
                </ProtectedRoute>
              }
            />
            <Route
              path="/government-schemes"
              element={
                <ProtectedRoute>
                  <GovernmentSchemes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/location-selector"
              element={
                <ProtectedRoute>
                  <LocationSelector />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yield-predictor"
              element={
                <ProtectedRoute>
                  <YieldPredictor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification-alerts"
              element={
                <ProtectedRoute>
                  <NotificationAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fertiliser-optimisation"
              element={
                <ProtectedRoute>
                  <FertiliserOptimisation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />

            {/* New Key Feature Pages */}
            <Route
              path="/pesticide-verification"
              element={
                <ProtectedRoute>
                  <PesticideVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/byproduct-utilization"
              element={
                <ProtectedRoute>
                  <ByproductUtilization />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blockchain-traceability"
              element={
                <ProtectedRoute>
                  <BlockchainTraceability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer-support"
              element={
                <ProtectedRoute>
                  <FarmerSupport />
                </ProtectedRoute>
              }
            />

            {/* Community Page */}
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LocationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
