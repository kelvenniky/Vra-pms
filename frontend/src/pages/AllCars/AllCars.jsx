import React, { useEffect, useState } from "react";
import "./AllCars.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

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

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [locationID, setLocationID] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [carToEdit, setCarToEdit] = useState({});
  const [refresh, setRefresh] = useState(false);


  const location = useLocation();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await axios.get('http://localhost:8081/auth/admin_records', { withCredentials: true });
        if (result.data.Status) {
          setLocationID(result.data.Result[0].locationID);
        } else {
          alert(result.data.Error);
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8081/auth")
      .then((res) => {
        setCars(res.data);
        filterCars(res.data, selectedType);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    if (type) {
      setSelectedType(type);
      filterCars(cars, type);
    }
  }, [cars, location]);

  const filterCars = (data, type) => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    let filtered = [];
    switch (type) {
      case 'today':
        filtered = data.filter(car => new Date(car.date).toDateString() === today.toDateString());
        break;
      case 'yesterday':
        filtered = data.filter(car => new Date(car.date).toDateString() === yesterday.toDateString());
        break;
      case 'last7days':
        filtered = data.filter(car => new Date(car.date) >= last7Days);
        break;
      case 'total':
        filtered = data;
        break;
      default:
        filtered = data;
    }

    if (locationID && locationID !== "Superadmin") {
      filtered = filtered.filter(car => car.locationID === locationID);
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredCars(filtered);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/auth/delete/${id}`)
      .then((res) => {
        setCars(cars.filter(car => car.id !== id));
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "An error occurred during deletion");
      });
  };


  const handleDeleteClick = (id) => {
    setCarIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (car) => {
    setCarToEdit({ ...car });
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/auth/update/${carToEdit.id}`, carToEdit);
      setCars(cars.map(car => (car.id === carToEdit.id ? carToEdit : car)));
      toast.success(response.data.message);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during update");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarToEdit({ ...carToEdit, [name]: value });
  };

  const getDisplayName = (type) => {
    switch (type) {
      case 'today':
        return "LIST OF TODAY'S cars";
      case 'yesterday':
        return "LIST OF YESTERDAY'S cars";
      case 'last7days':
        return "LIST OF LAST 7 DAYS cars";
      case 'total':
        return "LIST OF ALL cars";
      default:
        return "cars";
    }
  };

  // Helper function to format time
  const formatTime = (time) => {
    const timeParts = time.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  return (
    <div className="whole">
      <Navbar />
      <div className="allcars">
        <Sidebar />
        <ToastContainer />
        <div className="view">
          <div className="top">
            {/* <h2>{getDisplayName(selectedType)}</h2> */}
          </div>
          <div className="contain">
            <div className="container">
              <p>All Vehicles</p>
            </div>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehicle No.</th>
                  <th>Owners Name</th>
                  <th>Contact</th>
                  <th>Vehicle Type</th>
                  <th>Date</th>
                  <th>Time In</th>
                  {locationID === "Superadmin" && <th>LocID</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, index) => (
                  <tr key={car.id}>
                    <td>{index + 1}</td>
                    {isEditing && carToEdit.id === car.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="number"
                            value={carToEdit.number}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={carToEdit.name}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="contact"
                            value={carToEdit.contact}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="type"
                            value={carToEdit.type}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="date"
                            value={carToEdit.date.split('T')[0]} // Format date
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            name="time"
                            value={carToEdit.time}
                            onChange={handleChange}
                          />
                        </td>
                        {locationID === "Superadmin" && <td>{carToEdit.locationID}</td>}
                        <td className="buttons">
                          <button className="edit" onClick={handleSaveChanges}>Save</button>
                          <button className="delete" onClick={() => setIsEditing(false)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{car.number}</td>
                        <td>{car.name}</td>
                        <td>{car.contact}</td>
                        <td>{car.type}</td>
                        <td>{car.date}</td>
                        <td>{formatTime(car.time)}</td>
                        {locationID === "Superadmin" && <td>{car.locationID}</td>}
                        <td className="buttons">
                          <button className="edit" onClick={() => handleEditClick(car)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => handleDeleteClick(car.id)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDelete(carIdToDelete);
          setIsDeleteModalOpen(false);
        }}
        message={{ title: "Delete Confirmation", text: "Are you sure you want to delete this record?", confirmText: "Delete" }}
      />
    </div>
  );
};

export default AllCars;