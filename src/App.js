import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Calendar from "./components/calendar";
import SignIn from "./components/form";
import AdminSignIn from "./components/adminSigIn";
import Dashboard from "./components/adminDashboard";
import "./App.css";

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const isAdminAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    return token !== null;
  };

  // Function to remove tokens and redirect user to sign-in page
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  useEffect(() => {
    const signOutTimer = setTimeout(() => {
      signOut();
    }, 1800000); // 30 minutes in milliseconds

    // Clear timeout on unmount
    return () => clearTimeout(signOutTimer);
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const [newEvents, setNewEvents] = useState([]);

  const handleClearNotifications = () => {
    setNewEvents([]);
    localStorage.removeItem("notifications");
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/adminsignin" element={<AdminSignIn />} />
            {/* Render Calendar if user is authenticated */}
            <Route
              path="/*"
              element={isAuthenticated() ? <Calendar newEvents={newEvents} /> : <Navigate to="/signin" replace />}
            />
            {/* Render Dashboard if admin is authenticated */}
            <Route
              path="/admin/*"
              element={isAdminAuthenticated() ? <Dashboard newEvents={newEvents} onClearNotifications={handleClearNotifications} /> : <Navigate to="/adminsignin" replace />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
