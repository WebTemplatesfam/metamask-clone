import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GetStarted from './pages/GetStarted/GetStarted';
import Login from './pages/Login/Login';
import CreatePassword from './pages/CreatePassword/CreatePassword';
import Dashboard from './pages/Dashboard/Dashboard';
import NewSeed from './pages/NewSeed/NewSeed';
import ConfirmSeed from './pages/ConfirmSeed/ConfirmSeed';
import ImportWallet from './pages/ImportWallet/ImportWallet';
import { redirect  } from './utils/auth';
import './App.css';

function App() {

  return (
    <div className="app-container">
        <Router>
          <Routes>  

            <Route 
              path="/"
              element={redirect("/") ? <Navigate to={redirect("/")} /> : <Dashboard />} 
            />

            <Route 
              path="/login" 
              element={redirect("/login") ? <Navigate to={redirect("/login")} /> : <Login />} 
            />

            <Route 
              path="/welcome" 
              element={redirect("/welcome") ? <Navigate to={redirect("/welcome")} /> : <GetStarted />} 
            />

            <Route 
              path="/password" 
              element={redirect("/password") ? <Navigate to={redirect("/password")} /> : <CreatePassword />} 
            />

            <Route 
              path="/seed/new" 
              element={redirect("/seed/new") ? <Navigate to={redirect("/seed/new")} /> : <NewSeed />} 
            />

            <Route 
              path="/seed/confirm" 
              element={redirect("/seed/confirm") ? <Navigate to={redirect("/seed/confirm")} /> : <ConfirmSeed />} 
            />

            <Route 
              path="/wallet/import" 
              element={redirect("/wallet/import") ? <Navigate to={redirect("/wallet/import")} /> : <ImportWallet />} 
            />
          
          </Routes>
        </Router>
    </div>
  );
}

export default App;
