import React, { useEffect, useState } from "react";
import "./Entry.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Entry = () => {
  const [values, setValues] = useState({
    number: "",
    name: "",
    contact: "",
    type: "",
    date: "",
    time: "",
    locationID: ""
  });

  const [admins, setAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin check

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setValues((prevState) => ({
      ...prevState,
      date: formattedDate,
      time: today.toTimeString().slice(0, 5),
    }));
  }, []);

  useEffect(() => {
    const fetchAdmins = () => {
      axios.get('http://localhost:8081/auth/admin_records', { withCredentials: true })
        .then(result => {
          if (result.data.Status) {
            setAdmins(result.data.Result);
            setIsAdmin(result.data.Result.length > 0); // Check if there are admins
            if (result.data.Result.length > 0) {
              setValues((prevState) => ({
                ...prevState,
                locationID: result.data.Result[0].locationID || "",
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

  const handleReset = () => {
    const today = new Date();
    setValues({
      number: "",
      name: "",
      contact: "",
      type: "",
      date: today.toISOString().split("T")[0],
      time: today.toTimeString().slice(0, 5),
      locationID:""
    });
    console.log("cleared");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8081/auth/add", values)
      .then((res) => {
        handleReset()
        toast.success(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="whole">
      <Navbar />
      <div className="entry">
        <Sidebar />
        <ToastContainer />
        <div className="contain">
          <form className="form" onSubmit={handleSubmit}>
            <p style={{ fontSize: "25px", paddingTop: "10px", marginLeft: "20px" }}>
              Vehicle Entry
            </p>
            <hr style={{ color: "grey" }} />
            <div style={{ marginTop: "18px", marginLeft: "20px" }}>
              <div className="textbox">
                <p style={{ fontWeight: "bold" }}>Registration Number</p>
                <input
                  type="text"
                  placeholder="Car Number"
                  name="plate-number"
                  value={values.number}
                  onChange={(e) => setValues({ ...values, number: e.target.value })}
                />
              </div>
              <div className="textbox">
                <p style={{ fontWeight: "bold" }}>Owner's Full Name</p>
                <input
                  type="text"
                  placeholder="Enter Full Name Here"
                  name="name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>
              <div className="textbox">
                <p style={{ fontWeight: "bold" }}>Contact</p>
                <input
                  type="text"
                  placeholder="Owner's Contact"
                  name="contact"
                  value={values.contact}
                  onChange={(e) => setValues({ ...values, contact: e.target.value })}
                />
              </div>
              <div className="textbox">
                <p style={{ fontWeight: "bold" }}>Vehicle Type</p>
                <input
                  type="text"
                  placeholder="Vehicle Type"
                  name="type"
                  value={values.type}
                  onChange={(e) => setValues({ ...values, type: e.target.value })}
                />
              </div>
              {!isAdmin && ( // Hide date and time for admin
                <>
                  <div className="textbox">
                    <p style={{ fontWeight: "bold" }}>Date</p>
                    <input
                      type="date"
                      name="date"
                      value={values.date}
                      onChange={(e) => setValues({ ...values, date: e.target.value })}
                    />
                  </div>
                  <div className="textbox">
                    <p style={{ fontWeight: "bold" }}>Time</p>
                    <input
                      type="time"
                      name="time"
                      value={values.time}
                      onChange={(e) => setValues({ ...values, time: e.target.value })}
                    />
                  </div>
                </>
              )}
              <button className="submit" type="submit">Submit</button>
              <button className="reset" type="button" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Entry;