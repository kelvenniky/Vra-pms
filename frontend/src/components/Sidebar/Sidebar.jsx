import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import vra from '../../assets/VRA.png';
import axios from 'axios';






const Sidebar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("dashboard");
  const [locationID, setLocationID] = useState(null); // State for admin's locationID


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await axios.get('http://localhost:8081/auth/admin_records', { withCredentials: true });
        if (result.data.Status) {
          setLocationID(result.data.Result[0].locationID); // Assuming there's only one admin record
        } else {
          alert(result.data.Error);
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    fetchAdmins();
  }, []);



  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <div className='title'>
        <img className='logo' style={{ width: "200px", height: "90px",  }} src={vra} alt="logo" />

          
        </div>
        <hr />

        <hr />
        <div className='top'>
          <div onClick={() => setLocation("dashboard")} className={location === "dashboard" ? "active" : ""}>
            <NavLink to='/dashboard' className="sidebar-option">
              <i style={{ color: 'white', marginRight: "8px" }} className='icon fa-solid fa-square-poll-vertical'></i>
              <p>Dashboard</p>
            </NavLink>
          </div>
          <div onClick={() => setLocation("entry")} className={location === "entry" ? "active" : ""}>
            <NavLink to='/entry' className="sidebar-option">
              <i style={{ color: 'white', marginRight: "8px" }} className="fa-solid fa-square-plus"></i>
              <p>Vehicle Entry</p>
            </NavLink>
          </div>

          {locationID === "Superadmin" &&
           <div onClick={() => setLocation("allcars")} className={location === "allcars" ? "active" : ""}>
           <NavLink to='/allcars' className="sidebar-option">
             <i style={{ color: 'white', marginRight: "8px" }} className="fa-solid fa-car"></i>
             <p>All Vehicles</p>
           </NavLink>
         </div>

          }
         
          <div onClick={() => setLocation("search")} className={location === "search" ? "active" : ""}>
            <NavLink to='/search' className="sidebar-option">
              <i style={{ color: 'white', marginRight: "8px" }} className='icon fa-solid fa-magnifying-glass'></i>
              <p>Vehicle Search</p>
            </NavLink>
          </div>
          <div onClick={() => setLocation("reports")} className={location === "reports" ? "active" : ""}>
            <NavLink to='/reports' className="sidebar-option" >
              <i style={{ color: 'white', marginRight: "8px" }}  class="fa-solid fa-calendar-days"></i>
              <p>Reports</p>
            </NavLink>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Sidebar;