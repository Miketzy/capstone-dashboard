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

function Bargraph() {
  const [data, setData] = useState([
    { name: "Mammals", count: 0, color: "#FFB3C6" },
    { name: "Birds", count: 0, color: "#B3E0FF" },
    { name: "Reptiles", count: 0, color: "#D9FFCC" },
    { name: "Amphibians", count: 0, color: "#FFDAA6" },
    { name: "Invertebrates", count: 0, color: "#C1A3FF" },
    { name: "Vertebrates", count: 0, color: "#A8E6CF" },
    { name: "Fish", count: 0, color: "#FFE6A6" },
  ]);

  useEffect(() => {
    // Fetch species counts from the backend API
    axios
      .get("https://bioexplorer-backend.onrender.com/speciesCounts")
      .then((res) => {
        const counts = res.data;
        setData([
          { name: "Mammals", count: counts.mammals, color: "#FFB3C6" }, // Light pink
          { name: "Birds", count: counts.birds, color: "#B3E0FF" }, // Light blue
          { name: "Reptiles", count: counts.reptiles, color: "#D9FFCC" }, // Light green
          { name: "Amphibians", count: counts.amphibians, color: "#FFDAA6" }, // Light peach
          {
            name: "Invertebrates",
            count: counts.invertebrates,
            color: "#C1A3FF",
          }, // Light lavender
          { name: "Vertebrates", count: counts.vertebrates, color: "#A8E6CF" }, // Light mint
          { name: "Fish", count: counts.fish, color: "#FFE6A6" }, // Light yellow
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
          height={400}
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

export default Bargraph;
