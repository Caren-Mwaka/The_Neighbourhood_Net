import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import Navigation from "./Navigation";
import IncidentPage from "./IncidentPage";
import "./App.css";
import About from "./About";
import EventsList from "./EventsList";
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
