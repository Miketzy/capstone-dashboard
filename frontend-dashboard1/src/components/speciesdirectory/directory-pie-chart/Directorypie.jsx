import React, { useEffect, useState } from "react";
// css file
import "./directorypie.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#c62828", "#ad1457", "#6a1b9a", "#283593", "#0277bd"];

function Directorypie() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://bioexplorer-backend.onrender.com/api/conservation-status-count"
        );

        const rawData = response.data;

        // Compute total count
        const total = Object.values(rawData).reduce(
          (sum, value) => sum + value,
          0
        );

        // Convert to percentage
        const formattedData = Object.entries(rawData).map(([key, value]) => ({
          name: key, // Conservation status
          value: total > 0 ? ((value / total) * 100).toFixed(2) : 0, // Percentage with 2 decimal places
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pie-chart-container">
      <h1 className="pie-chart-title">Species Status</h1>
      <ResponsiveContainer width="100%" height={540} className="pie">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={200}
            label={(entry) => `${entry.name}: ${entry.value}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Directorypie;
