import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Bar, Pie } from "react-chartjs-2";
import c1 from "../../assets/c1.jpg";
import c2 from "../../assets/c2.jpg";
import c3 from "../../assets/c3.jpg";
import c4 from "../../assets/c4.jpg";

import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Chart from "react-apexcharts"; // Import ApexCharts
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [dailyData, setDailyData] = useState({ labels: [], counts: [] });
  const [weeklyData, setWeeklyData] = useState({ labels: [], counts: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], counts: [] });
  const [frequentCarsData, setFrequentCarsData] = useState({
    labels: [],
    counts: [],
  });
  const [cars, setCars] = useState([]);
  const [locationID, setLocationID] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8081/auth/admin_records",
          { withCredentials: true }
        );
        if (result.data.Status) {
          setLocationID(result.data.Result[0].locationID);
          setIsSuperAdmin(result.data.Result[0].locationID === "Superadmin");
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
    axios
      .get("http://localhost:8081/auth/alladmin_records")
      .then((res) => {
        setAdmins(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8081/auth");
        console.log("Fetched cars:", response.data);
        setCars(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCars();
  }, []);

  // Filter cars based on locationID
  const filteredCars = isSuperAdmin
    ? cars
    : cars.filter((car) => car.locationID === locationID);

  useEffect(() => {
    if (filteredCars.length > 0) {
      console.log("Filtered cars:", filteredCars);
      prepareDailyData(filteredCars);
      prepareWeeklyData(filteredCars);
      prepareMonthlyData(filteredCars);
      prepareFrequentCarsData(filteredCars);
    }
  }, [filteredCars]);

  const prepareDailyData = (data) => {
    const dailyCount = {};
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    dayNames.forEach((day) => (dailyCount[day] = 0)); // Initialize counts for each day

    data.forEach((car) => {
      const carDate = new Date(car.date);
      const dayName = carDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (dayNames.includes(dayName)) {
        dailyCount[dayName] += 1;
      }
    });

    const labels = Object.keys(dailyCount);
    const counts = Object.values(dailyCount);
    setDailyData({ labels, counts });
    console.log("Daily Data:", { labels, counts });
  };

  const prepareWeeklyData = (data) => {
    const weeklyCount = {};
    data.forEach((car) => {
      const date = new Date(car.date);
      const weekNumber = Math.ceil((date.getDate() + 1 - date.getDay()) / 7);
      const year = date.getFullYear();
      const label = `Wk- ${weekNumber} ${year}`;
      weeklyCount[label] = (weeklyCount[label] || 0) + 1;
    });

    const labels = Object.keys(weeklyCount);
    const counts = Object.values(weeklyCount);
    setWeeklyData({ labels, counts });
    console.log("Weekly Data:", { labels, counts });
  };

  const prepareMonthlyData = (data) => {
    const monthlyCount = {};
    data.forEach((car) => {
      const date = new Date(car.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const label = `${month} ${year}`;
      monthlyCount[label] = (monthlyCount[label] || 0) + 1;
    });

    const labels = Object.keys(monthlyCount);
    const counts = Object.values(monthlyCount);
    setMonthlyData({ labels, counts });
    console.log("Monthly Data:", { labels, counts });
  };

  const prepareFrequentCarsData = (data) => {
    const carCount = {};
    data.forEach((car) => {
      const name = car.name;
      carCount[name] = (carCount[name] || 0) + 1;
    });

    const labels = Object.keys(carCount);
    const counts = Object.values(carCount);
    setFrequentCarsData({ labels, counts });
    console.log("Frequent Cars Data:", { labels, counts });
  };

  // Calculate total cars for today, yesterday, and last 7 days
  const getTotalCarsToday = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Get the YYYY-MM-DD format

    return filteredCars.filter((visitor) => {
      const visitorDate = new Date(visitor.date);
      const visitorDateString = visitorDate.toISOString().split("T")[0]; // Convert to same format
      return visitorDateString === todayString;
    }).length;
  };

  const getTotalCarsYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    return filteredCars.filter(
      (visitor) =>
        new Date(visitor.date).toLocaleDateString() ===
        yesterday.toLocaleDateString()
    ).length;
  };

  const getTotalCarsLast7Days = () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    return filteredCars.filter((visitor) => new Date(visitor.date) >= last7Days)
      .length;
  };

  const totalCars = isSuperAdmin ? cars.length : filteredCars.length;

  return (
    <div className="whole">
      <Navbar />
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h1>Dashboard Overview</h1>
          <p>
            Welcome to the dashboard! Here you can manage all your vehicle
            entries and other related tasks.
          </p>
          {/* Additional content can be added here */}

          <div className="line-cards">
            <div className="image-container">
              <div
                className="image"
                style={{
                  width: "220px",
                  height: "60px",
                }}
              >
                <div className="values">{getTotalCarsToday()}</div>

                <div className="overlay-text">
                  <Link to="/allcars?type=today">Today's Vehicles</Link>
                </div>
              </div>
            </div>

            <div className="image-container">
              <div className="image" style={{ width: "220px", height: "60px" }}>
                <div className="values">{getTotalCarsYesterday()}</div>
                <div className="overlay-text">
                  <Link to="/allcars?type=yesterday">Yesterday </Link>
                </div>
              </div>
            </div>

            <div className="image-container">
              <div className="image" style={{ width: "220px", height: "60px" }}>
                <div className="values">{getTotalCarsLast7Days()}</div>
                <div className="overlay-text">
                  <Link to="/allcars?type=last7days">Last 7 Days</Link>
                </div>
              </div>
            </div>

            <div className="image-container">
              <div className="image" style={{ width: "220px", height: "60px" }}>
              <div className="values">{totalCars}</div>
                <div className="overlay-text">
                  <Link to="/allcars?type=total">Total Vehicles</Link>
                </div>
              </div>
            </div>
          </div>

          {locationID && locationID !== "Superadmin" && (
            <div className="box">
              <div className="row2">
                <div className="col">
                  <div className="chart-containers-graph1">
                    <h3>{locationID} Daily Vehicles</h3>
                    {dailyData.labels.length > 0 &&
                      dailyData.counts.length > 0 && (
                        <Chart
                          options={{
                            chart: {
                              type: "bar",
                              height: 250,
                            },
                            plotOptions: {
                              bar: {
                                horizontal: false,
                                endingShape: "flat",
                                columnWidth: "50%",
                                dataLabels: {
                                  enabled: false,
                                },
                                borderRadius: 5,
                              },
                            },
                            dataLabels: {
                              enabled: true,
                            },
                            xaxis: {
                              categories: dailyData.labels,
                            },
                            title: {
                              align: "center",
                            },
                            colors: ["#4caf50", "green"],

                            legend: {
                              position: "top",
                            },
                          }}
                          series={[
                            {
                              name: "Number of Vehicles",
                              data: dailyData.counts,
                            },
                          ]}
                          type="area"
                          height="250"
                        />
                      )}
                  </div>
                </div>
              </div>
              <div className="chart-container-pied">
                <h3>{locationID} Most Frequent Vehicles</h3>
                {frequentCarsData.labels && frequentCarsData.counts && (
                  <div className="wrapper">
                    <Pie
                      data={{
                        labels: frequentCarsData.labels,
                        datasets: [
                          {
                            label: "Frequency of Vehicles",
                            data: frequentCarsData.counts,
                            backgroundColor: ["#4caf50", "#043da5", "green"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                          title: {
                            display: true,
                            text: "Most Frequent Vehicles",
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {locationID === "Superadmin" && (
            <div className="box">
              <div className="row2">
                <div className="chart-containers-graph1">
                  <h3> Daily Vehicles</h3>
                  {dailyData.labels.length > 0 &&
                    dailyData.counts.length > 0 && (
                      <Chart
                        options={{
                          chart: {
                            type: "bar",
                            height: 250,
                          },
                          plotOptions: {
                            bar: {
                              horizontal: false,
                              endingShape: "flat",
                              columnWidth: "55%",
                            },
                          },
                          dataLabels: {
                            enabled: true,
                          },
                          xaxis: {
                            categories: dailyData.labels,
                          },
                          title: {
                            align: "center",
                          },
                          colors: ["#043da5"],
                          legend: {
                            position: "top",
                          },
                        }}
                        series={[
                          {
                            name: "Number of Vehicles",
                            data: dailyData.counts,
                          },
                        ]}
                        type="area"
                        height="200"
                      />
                    )}
                </div>
              </div>
              <div className="chart-container-pied">
                <h3>Most Frequent Vehicles</h3>
                {frequentCarsData.labels && frequentCarsData.counts && (
                  <Pie
                    data={{
                      labels: frequentCarsData.labels,
                      datasets: [
                        {
                          label: "Frequency of Vehicles",
                          data: frequentCarsData.counts,
                          backgroundColor: [
                            "#032461",
                            "#043da5",
                            "green",
                            "#3b7df7",
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: "left",
                        },
                        title: {
                          display: true,
                          text: "Most Frequent Vehicles",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
