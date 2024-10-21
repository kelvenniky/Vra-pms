import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Entry from "./pages/Entry/Entry";
import Search from "./pages/Search/Search";
import Reports from "./pages/Reports/Reports";
import AllCars from "./pages/AllCars/AllCars";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/adminlogin" />} />
        <Route path="/auth/adminlogin" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/entry" element={<Entry />} />
        <Route path="/allcars" element={<AllCars />} />
        <Route path="/search" element={<Search />} />
        <Route path='/reports' element={<Reports/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
