import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import RedirectingDashboard from "./pages/RedirectingDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ClubDashboard from "./pages/ClubDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import CreateEvent from "./pages/CreateEvents";
import ClubEvents from "./pages/ClubEvents";
import ClubRegistrations from "./pages/ClubRegistrations";
import QRScanner from "./pages/QRScanner";
import QRCodeTicket from "./pages/QRCodeTicket";
import ClubEventStats from "./pages/ClubEventStats";
import ClubEventRegistrations from "./pages/ClubEventRegistrations";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RedirectingDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route  
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/club/events/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/club/events"
            element={
              <ProtectedRoute>
                <ClubEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/club/events/:eventId/registrations"
            element={
              <ProtectedRoute>
                <ClubRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/club/scan"
            element={
              <ProtectedRoute>
                <QRScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
          path="/club/dashboard"
          element={
            <ProtectedRoute>
              <ClubDashboard />
            </ProtectedRoute>
          }
          />
          <Route 
          path="/my-registrations/:regId/qr"
          element={
            <ProtectedRoute>
              <QRCodeTicket />
            </ProtectedRoute>
          }
          />
          <Route
          path="/club/events/:eventId/stats"
          element={
            <ProtectedRoute>
              <ClubEventStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/events/:eventId/registrations"
          element={
            <ProtectedRoute>
              <ClubEventRegistrations />
            </ProtectedRoute>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
