import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './index.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/main/data-to-visualize/Electric_Vehicle_Population_Data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setData(results.data.filter(row => row['Model Year']));
            setLoading(false);
          }
        });
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading EV data...</div>;
  }

  // Analytics calculations
  const totalVehicles = data.length;
  const avgRange = Math.round(data.reduce((sum, item) => sum + (parseInt(item['Electric Range']) || 0), 0) / data.length);
  const uniqueMakes = [...new Set(data.map(item => item.Make))].length;
  const bevCount = data.filter(item => item['Electric Vehicle Type'] === 'Battery Electric Vehicle (BEV)').length;

  // Make distribution
  const makeData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.Make] = (acc[item.Make] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([make, count]) => ({ make, count }));

  // Year distribution
  const yearData = Object.entries(
    data.reduce((acc, item) => {
      const year = item['Model Year'];
      if (year >= 2015) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {})
  ).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));

  // Vehicle type distribution
  const typeData = Object.entries(
    data.reduce((acc, item) => {
      const type = item['Electric Vehicle Type'].includes('BEV') ? 'BEV' : 'PHEV';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ type, count }));

  // Top cities
  const cityData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.City] = (acc[item.City] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Electric Vehicle Analytics Dashboard</h1>
        <p>Comprehensive analysis of EV population data in Washington State</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{totalVehicles.toLocaleString()}</div>
          <div className="metric-label">Total Vehicles</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{avgRange}</div>
          <div className="metric-label">Avg Range (miles)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{uniqueMakes}</div>
          <div className="metric-label">Unique Makes</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{Math.round((bevCount/totalVehicles)*100)}%</div>
          <div className="metric-label">BEV Percentage</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Top Vehicle Makes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={makeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="make" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Vehicle Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({type, count}) => `${type}: ${count}`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Registration Trend by Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h3 className="chart-title">Top 10 Cities by EV Count</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>City</th>
              <th>Vehicle Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {cityData.map(([city, count], index) => (
              <tr key={city}>
                <td>{index + 1}</td>
                <td>{city}</td>
                <td>{count.toLocaleString()}</td>
                <td>{((count/totalVehicles)*100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
