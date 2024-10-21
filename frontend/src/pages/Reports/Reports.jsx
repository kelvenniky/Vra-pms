import React, { useEffect, useState } from "react";
import "./Reports.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "react-apexcharts"; // Import ApexCharts

import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
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

  

  // Filter Vehicles based on locationID
  const filteredCars = isSuperAdmin
    ? cars
    : cars.filter((car) => car.locationID === locationID);

  useEffect(() => {
    if (filteredCars.length > 0) {
      console.log("Filtered Vehicles:", filteredCars);
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

 

  return (
    <div className="whole">
      <Navbar />
      <div className="reports">
        <Sidebar />
        <div className="card">
          {locationID && locationID !== "Superadmin" && (
          <div className="contains">
            <div className="charts">
              <div className="first">
                <div className="chart-container-table">
                  <h3>{locationID} Daily Cars Distribution</h3>
                  {dailyData.labels.length > 0 &&
                    dailyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyData.labels.map((day, index) => (
                            <tr key={index}>
                              <td>{day}</td>
                              <td>{dailyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
                <div className="chart-container-table">
                  <h3>{locationID} Weekly Vehicles Distribution</h3>
                  {weeklyData.labels.length > 0 &&
                    weeklyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Week</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weeklyData.labels.map((week, index) => (
                            <tr key={index}>
                              <td>{week}</td>
                              <td>{weeklyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
                <div className="chart-container-table">
                  <h3>{locationID} Monthly Vehicles Distribution</h3>
                  {monthlyData.labels.length > 0 &&
                    monthlyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.labels.map((month, index) => (
                            <tr key={index}>
                              <td>{month}</td>
                              <td>{monthlyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              </div>
              <div className="row2">
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
                        type="bar"
                        height="200"
                      />
                    )}
                </div>
                {/* Add Weekly Vehicles Chart */}
                <div className="chart-containers-graph2">
                  <h3>{locationID} Weekly Vehicles</h3>
                  {weeklyData.labels.length > 0 &&
                    weeklyData.counts.length > 0 && (
                      <div className="chart-wrapper">
                        <Bar
                          data={{
                            labels: weeklyData.labels,
                            datasets: [
                              {
                                label: "Number of Vehicles",
                                data: weeklyData.counts,
                                backgroundColor: "#043da5",
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: true,
                                position: "top",
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                </div>
              </div>
              
            </div>
           
          </div>
          )}

          {/* Super Admin Section */}
          {locationID === "Superadmin" && (
            <>
             

              <div className="total">
              
              <div className="sec-sidebar2">
              <div className="chart-container-table">
                  <h3>All Daily Vehicles</h3>
                  {dailyData.labels.length > 0 &&
                    dailyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyData.labels.map((day, index) => (
                            <tr key={index}>
                              <td>{day}</td>
                              <td>{dailyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
                <div className="chart-container-table">
                  <h3> All Weekly Vehicles </h3>
                  {weeklyData.labels.length > 0 &&
                    weeklyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Week</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weeklyData.labels.map((week, index) => (
                            <tr key={index}>
                              <td>{week}</td>
                              <td>{weeklyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
                <div className="chart-container-table">
                  <h3>All Monthly Vehicles</h3>
                  {monthlyData.labels.length > 0 &&
                    monthlyData.counts.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Vehicles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.labels.map((month, index) => (
                            <tr key={index}>
                              <td>{month}</td>
                              <td>{monthlyData.counts[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              </div>
             

              </div>

              <div className="char">
                <div className="chart-containers-graph3">
                  <h3>Daily Vehicles</h3>
                  {dailyData.labels.length > 0 &&
                    dailyData.counts.length > 0 && (
                      <Bar
                        data={{
                          labels: dailyData.labels,
                          datasets: [
                            {
                              label: "Number of Vehicles",
                              data: dailyData.counts,
                              backgroundColor: "#043da5",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "Vehicles per Day",
                            },
                          },
                        }}
                      />
                    )}
                </div>
                <div className="chart-containers-graph3">
                
                  <h3>Monthly Vehicles</h3>
                  {monthlyData.labels.length > 0 &&
                    monthlyData.counts.length > 0 && (
                      <Bar
                        data={{
                          labels: monthlyData.labels,
                          datasets: [
                            {
                              label: "Number of Vehicles",
                              data: monthlyData.counts,
                              backgroundColor: "#043da5",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "Vehicles per Month",
                            },
                          },
                        }}
                      />
                    )}
                </div>
              </div>

              <div className="char">
                <div className="chart-containers-graph3">
                  <h3>Weekly Vehicles</h3>
                  {weeklyData.labels.length > 0 &&
                    weeklyData.counts.length > 0 && (
                      <Bar
                        data={{
                          labels: weeklyData.labels,
                          datasets: [
                            {
                              label: "Number of Vehicles",
                              data: weeklyData.counts,
                              backgroundColor: "#043da5",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "Vehicles per Week",
                            },
                          },
                        }}
                      />
                    )}
                </div>
                <div className="chart-containers-graph3">
                <h3>List of all Administrators</h3>
                <table style={{ width: "50%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Loc</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, index) => (
                      <tr key={admin.id}>
                        <td>{index + 1}</td>
                        <td>{admin.locationID}</td>
                        <td>{admin.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                
              </div>
            </>
          )}
        </div>
       
        
      </div>
    </div>
  );
};

export default Reports;
