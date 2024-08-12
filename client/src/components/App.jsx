import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import Navigation from "./Navigation";
import IncidentPage from "./IncidentPage";
import Forum from "./Forum"
import Profile from "./Profile";
import "./App.css";
import About from "./About";
import EventsList from "./EventsList";
import ContactSection from "./ContactSection"; // Import the ContactSection component
import NotificationList from "./NotificationList";
import AdminDashboard from './AdminDashboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MainLayout = ({ children }) => (
  <>
    <Navigation />
    {children}
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/community-forum",
    element: <Forum />,
  },
  {
    path: "/profile",
    element: (
      <MainLayout>
        <Profile />
      </MainLayout>
    ),
  },
  {
    path: "/events",
    element: (
      <MainLayout>
        <EventsList />
      </MainLayout>
    ),
  },
  {
    path: "/home",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/incident-page",
    element: (
      <MainLayout>
        <IncidentPage />
      </MainLayout>
    ),
  },
  {
    path: "/notifications",
    element: (
      <MainLayout>
        <NotificationList/>
      </MainLayout>
    ),
  },
  {
    path: "/contact", // Add the route for the contact section
    element: <ContactSection />, 
  },
]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};

export default App;
