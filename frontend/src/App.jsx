import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/authContext/AuthProvider";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import Navbar from "./components/navbar";
import "./App.css";
import Profile from "./components/Profile";
import GiveFeedback from "./components/feedback";
import ReservationDetails from "./components/reservationDetails";
import ReserverSalleform from "./components/reservationForm2";
import ReserverTimeDate from "./components/reservationForm1";
import ParentComponent from "./components/ParentComponent";
import EventForm from "./components/event/eventForm1";
import CalendarPage from "./components/Calendar/CalendarPage";
import ParentComp from "./components/Calendar/parentComp";
import ManageUsers from "./components/User/ManageUsers";
import ManageFacilities from "./components/Facility/ManageFacilities";
import AdminView from "./components/adminDashboard/AdminView";

const AuthStatus = () => {
  const { currentUser, userLoggedIn, loading, currentId ,currentRole} = useAuth();

  useEffect(() => {
    console.log(currentUser, userLoggedIn, loading, currentId,currentRole);
    console.log("currentUser, userLoggedIn, loading,", currentRole);
  }, [currentUser, userLoggedIn, loading, currentId]);

  return null;
};

const AppRoutes = () => {
  const { userLoggedIn, currentId, currentRole, currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      <Route path="/manage-facilities" element={<ManageFacilities/>} />
      <Route path="/manage-requests" element={<AdminView/>} />
      <Route
        exact
        path="/calendar"
        element={<CalendarPage currentId={currentId}   currentRole={currentRole}/>}
      />

      {currentId ? (
        <>
          <Route exact path="/feedback" element={<GiveFeedback />} />

          <Route
            exact
            path="/event"
            element={<EventForm currentId={currentId} />}
          />
          <Route
            exact
            path="/profile"
            element={<Profile currentId={currentId} currentUser={currentUser}/>}
          />
          <Route exact path="/navbar" element={<Navbar currentId={currentId} currentUser={currentUser}/>} />
          <Route
            exact
            path="/reserver"
            element={<ParentComponent currentId={currentId} />}
          />
                
          <Route exact path="/reservation" element={<ParentComp />} />

          <Route
            exact
            path="/reserver/ReserverTimeDate"
            element={<ReserverTimeDate />}
          />
          <Route
            exact
            path="/reserver/ReserverSalleform"
            element={<ReserverSalleform />}
          />
          <Route
            exact
            path="/reserver/DetailsReservation"
            element={<ReservationDetails />}
          />

          <Route path="*" element={<Navigate to="/profile" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthStatus />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
