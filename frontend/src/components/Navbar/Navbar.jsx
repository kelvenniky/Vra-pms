import React, { useEffect, useState } from 'react';
import './Navbar.css';
import account1 from '../../assets/account1.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{message.title}</h3>
        <p>{message.text}</p>
        <button style={{ marginLeft: "110px", marginTop: "20px" }} onClick={onClose}>Cancel</button>
        <button style={{ marginTop: "20px" }} onClick={onConfirm}>{message.confirmText}</button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [locationID, setLocationID] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [values, setValues] = useState({ locationID: "" });
  const [popupOpen, setPopupOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleLogout = () => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:8081/auth/logout")
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/auth/adminlogin');
        }
      });
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCreateUserClick = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleSignUp = () => {
    navigate('/SignUp');
  };

  useEffect(() => {
    const fetchAdmins = () => {
      axios.get('http://localhost:8081/auth/admin_records', { withCredentials: true })
        .then(result => {
          if (result.data.Status) {
            setAdmins(result.data.Result);
            if (result.data.Result.length > 0) {
              setValues(prevState => ({
                ...prevState,
                locationID: result.data.Result[0].locationID,
              }));
            }
          } else {
            alert(result.data.Error);
          }
        })
        .catch(error => {
          alert("An error occurred: " + error.message);
        });
    };

    fetchAdmins();
  }, []);

  return (
    <div className='navbar'>
      <div className='nav-left'>
        <h1 className='logo'> VRA -PMS</h1> {/* Logo Element */}
      </div>
      <div className="nav-right">
      <div style={{fontSize:"15px", fontWeight:"400px", display:"flex", flexDirection:"column"}}>
        {values.locationID}
        <span style={{display:"flex", flexDirection:"row", textAlign:"center",}}><div className='circle'></div><p style={{fontSize:"10px",fontWeight:"bolder", marginLeft:"5px"}}>online</p></span>
        
        </div>
        <img style={{ width: "35px", height: "35px", marginRight: "5px" }} src={account1} alt="account" />
        <i className="fa-solid fa-caret-down" onClick={togglePopup} style={{ cursor: 'pointer' }}></i>
        {popupOpen && (
          <div className="popup-menu">
            <div className="popup-item" onClick={handleCreateUserClick}>
              <i style={{ color: 'black', marginRight: "8px" }} className='icon fa-solid fa-key'></i>
              <span>User</span>
            </div>
            <div className="popup-item" onClick={handleLogoutClick}>
              <i style={{ color: 'black', marginRight: "8px" }} className='icon fa-solid fa-power-off'></i>
              Logout
            </div>
          </div>
        )}
      </div>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsLogoutModalOpen(false);
        }}
        message={{ title: "Logout Confirmation", text: "Are you sure you want to logout?", confirmText: "Logout" }}
      />
      {/* Create New User Confirmation Modal */}
      <Modal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onConfirm={() => {
          handleSignUp();
          setIsCreateUserModalOpen(false);
        }}
        message={{ title: "Create New User", text: "Are you sure you want to create another user?", confirmText: "Create" }}
      />
    </div>
  );
};

export default Navbar;