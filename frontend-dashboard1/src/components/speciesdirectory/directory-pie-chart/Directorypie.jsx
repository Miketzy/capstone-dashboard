import React, { useEffect, useState } from "react";
import API_URL from "../../../config";
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

        // Convert object into array format and use percentage instead of count
        const formattedData = Object.entries(rawData).map(([key, value]) => ({
          name: key, // Conservation status
          value: Number(value.percentage), // Use percentage instead of count
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Species Status
        </h1>
        <ResponsiveContainer width="100%" height={540}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value" // Now using 'value' as percentage
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              label={({ name, value }) => `${name}: ${value}%`} // Show percentage on the chart
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Directorypie;
