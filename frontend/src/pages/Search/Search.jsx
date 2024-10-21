import React, { useEffect, useState } from "react";
import "./Search.css";
import { Link } from "react-router-dom";
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

const Search = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [locationID, setLocationID] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/auth");
        setCars(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCars();
  }, []);

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

  const handleEditClick = (car) => {
    setCarToEdit({ ...car }); // Make a copy of the car object for editing
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

  const filteredCars = cars.filter(car => {
    const matchesSearchQuery = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.locationID.toLowerCase().includes(searchQuery.toLowerCase()) ||  car.number.toLowerCase().includes(searchQuery.toLowerCase()) ||  car.type.toLowerCase().includes(searchQuery.toLowerCase());
    const isSuperadmin = locationID === "Superadmin";
    const matchesLocationID = isSuperadmin || car.locationID === locationID;

    return matchesSearchQuery && matchesLocationID;
  });

  const sortCars = (option) => {
    const sortedCars = [...filteredCars];
    if (option === 'date') {
      sortedCars.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === 'name') {
      sortedCars.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'Intime') {
      sortedCars.sort((a, b) => a.Intime.localeCompare(b.Intime));
    } else if (option === 'LocationID') {
      sortedCars.sort((a, b) => a.locationID.localeCompare(b.locationID));
    }
    return sortedCars;
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedCars = sortCars(sortOption);

  const formatTime = (time) => {
    const timeParts = time.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  };

  return (
    <div className="whole">
      <Navbar />
      <div className="search">
        <Sidebar />
        <div>
          <ToastContainer />
          <div className="contain">
            <div className="container">
              <p>Search Vehicle</p>
            </div>
            <hr />
            <div className="top-table">
              <div className="searchs">
                <p>Search:</p>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input1"
                />
              </div>
              <div className="sort-container">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortOption} onChange={handleSortChange}>
                  <option value="">Select...</option>
                  <option value="date">Date</option>
                  <option value="name">Alphabetical Order</option>
                  <option value="Intime">Time In</option>
                  <option value="LocationID">LocationID</option>
                </select>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vehicle No.</th>
                  <th>Owner's Name</th>
                  <th>Contact</th>
                  <th>Car Type</th>
                  <th>Date</th>
                  <th>Time In</th>
                  {locationID === "Superadmin" && <th>LocID</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCars.map((car, index) => (
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
                          <button className="edit" onClick={() => handleEditClick(car)}>Edit</button>
                          <button className="delete" onClick={() => {
                            setCarIdToDelete(car.id);
                            setIsDeleteModalOpen(true);
                          }}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};

export default Search;