import React, { useEffect, useState } from "react";
// css file
import "./directorypie.css";
import API_URL from "../../config"; // Dalawang level up ✅
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
          `${API_URL}/api/conservation-status-count`
        );

        const rawData = response.data;

        // Convert object into array format
        const formattedData = Object.entries(rawData).map(([key, value]) => ({
          name: key, // Conservation status
          value: Number(value), // Count converted to number
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
            label
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
