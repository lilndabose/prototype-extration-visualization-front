import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { UserProvider } from "@/contexts/user-context";
import { useUser } from "@/contexts/user-context";
import Index from "./pages/Index";
import Files from "./pages/Files";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Layout wrapper for protected routes (Sidebar is provided by Layout component in pages)
function ProtectedLayout({ children }: { children: ReactNode }) {
  return children;
}

function AppContent() {
  useTheme();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Index />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Files />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Analytics />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </QueryClientProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export const App = () => (
  <AppWrapper />
);
