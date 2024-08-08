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
import EventsPage from "./EventsPage";
import AdminDashboard from './AdminDashboard'

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
        <EventsPage />
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
]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
