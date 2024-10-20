import React, { useEffect, useState } from "react";
import "./bargraph.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios"; // Import axios for making HTTP requests

function SpeciesComparisonGraph() {
  const [data, setData] = useState([
    { name: "Mammals", count: 0, color: "#8884d8" },
    { name: "Birds", count: 0, color: "#82ca9d" },
    { name: "Reptiles", count: 0, color: "#ffc658" },
    { name: "Amphibians", count: 0, color: "#ff8042" },
    { name: "Invertebrates", count: 0, color: "#8dd1e1" },
    { name: "Fish", count: 0, color: "#a4de6c" },
  ]);

  useEffect(() => {
    // Fetch species counts from the backend API
    axios
      .get("http://localhost:8080/speciesCounts")
      .then((res) => {
        const counts = res.data;
        setData([
          { name: "Mammals", count: counts.mammals, color: "#8884d8" },
          { name: "Birds", count: counts.birds, color: "#82ca9d" },
          { name: "Reptiles", count: counts.reptiles, color: "#ffc658" },
          { name: "Amphibians", count: counts.amphibians, color: "#ff8042" },
          {
            name: "Invertebrates",
            count: counts.invertebrates,
            color: "#8dd1e1",
          },
          { name: "Fish", count: counts.fish, color: "#a4de6c" },
        ]);
      })
      .catch((err) => {
        console.error("Error fetching species counts:", err);
      });
  }, []);

  // Helper function to format large numbers
  const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + "M"; // Show in millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + "K"; // Show in thousands
    }
    return number;
  };

  return (
    <div className="chart-container">
      <h1 className="chart-title">Species Comparison</h1>
      <div className="chart-background">
        <ResponsiveContainer
          className="custom-responsive-container"
          width="100%"
          height={600}
        >
          <BarChart
            className="custom-bar-chart"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 50,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              fontSize={16}
            />
            <YAxis fontSize={16} tickFormatter={formatNumber} />{" "}
            {/* Use tickFormatter to format large numbers */}
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SpeciesComparisonGraph;
