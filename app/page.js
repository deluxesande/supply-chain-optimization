"use client"; // Marking this component as a Client Component

import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const Dashboard = () => {
  const [goods, setGoods] = useState([]);
  const [metrics, setMetrics] = useState({
    totalGoods: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar visibility

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await axios.get("/api/goods.js");
        setGoods(response.data);
        updateMetrics(response.data);
      } catch (error) {
        console.error("Error fetching goods:", error); // Log the error to console
      }
    };

    fetchGoods();
  }, []);

  const updateMetrics = (data) => {
    const total = data.length;
    const inTransit = data.filter((good) => good.status === "on-transit").length;
    const delivered = data.filter((good) => good.status === "delivered").length;
    const pending = data.filter((good) => good.status === "pending").length;

    setMetrics({
      totalGoods: total,
      inTransit: inTransit,
      delivered: delivered,
      pending: pending,
    });
  };

  const chartData = goods.map((good, index) => ({
    name: good.name,
    status: good.status,
    id: index + 1,
  }));

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 bg-light sidebar ${sidebarOpen ? "" : "d-none"} d-md-block`}>
          <h2 className="p-3">Dashboard Menu</h2>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href="#"><i className="fa fa-dashboard"></i> Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i className="fa fa-cube"></i> Goods Overview</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i className="fa fa-file-text"></i> Reports</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#"><i className="fa fa-cog"></i> Settings</a>
            </li>
          </ul>
        </div>

        {/* Main Dashboard Area */}
        <div className={`col-md-${sidebarOpen ? "9" : "12"}`}>
          <button onClick={toggleSidebar} className="btn btn-light btn-lg mt-3">
            <i className={`fa ${sidebarOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'}`}></i>
          </button>

          <div className="p-3">
            <h2>Supply Chain Management Dashboard</h2>

            <div className="row mb-4">
              {/* Metrics Cards with different colors */}
              <div className="col-md-3">
                <div className="card text-white bg-primary mb-3">
                  <div className="card-body text-center">
                    <i className="fa fa-th-large fa-2x mb-2" aria-hidden="true"></i>
                    <h3>Total Goods</h3>
                    <p>{metrics.totalGoods}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-body text-center">
                    <i className="fa fa-truck fa-2x mb-2" aria-hidden="true"></i>
                    <h3>In Transit</h3>
                    <p>{metrics.inTransit}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-success mb-3">
                  <div className="card-body text-center">
                    <i className="fa fa-check-circle fa-2x mb-2" aria-hidden="true"></i>
                    <h3>Delivered</h3>
                    <p>{metrics.delivered}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-white bg-danger mb-3">
                  <div className="card-body text-center">
                    <i className="fa fa-clock fa-2x mb-2" aria-hidden="true"></i>
                    <h3>Pending</h3>
                    <p>{metrics.pending}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3>Goods Status Overview</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="id" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3>Tracked Goods</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.map((good) => (
                    <tr key={good.id}>
                      <td>{good.id}</td>
                      <td>{good.name}</td>
                      <td>{good.status}</td>
                      <td>{good.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
