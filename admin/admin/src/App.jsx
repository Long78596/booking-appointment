// import React from 'react'
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login"
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import Navabar from "./components/Navabar";
import SliderBar from "./components/SliderBar";
import { Route,Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointment from "./pages/Admin/AllApointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorList";

const App = () => {
  const {aToken}=useContext(AdminContext);
  return aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navabar />
      <div className="flex items-start">
        <SliderBar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllApointment />} />
          <Route path="/add-doctor" element={<AddDoctor/>} />
          <Route path="/doctor-list" element={<DoctorsList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App