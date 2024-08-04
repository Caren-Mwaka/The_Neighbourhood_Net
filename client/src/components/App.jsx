import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import LandingPage from './LandingPage';  
import Navigation from './Navigation';
import IncidentPage from './IncidentPage'; 
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,  
  },
  {
    path: '/login',
    element: <LoginPage />,  
  },
  {
    path: '/home',
    element: (
      <>
        <Navigation />
        <HomePage />
      </>
    ),
  },
  {
    path: '/incident-page', 
    element: (
      <>
        <Navigation />
        <IncidentPage />
      </>
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
