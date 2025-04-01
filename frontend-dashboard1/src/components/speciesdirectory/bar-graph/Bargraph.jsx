import React, { useEffect, useState } from "react";
import API_URL from "../../../config";
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
  LabelList, // Import LabelList for positioning labels
} from "recharts";
import axios from "axios";

function Bargraph() {
  const [data, setData] = useState([
    { name: "Mammals", count: 0, color: "#FFB3C6" },
    { name: "Fish", count: 0, color: "#FFE6A6" },
    { name: "Birds", count: 0, color: "#B3E0FF" },
    { name: "Reptiles", count: 0, color: "#D9FFCC" },
    { name: "Amphibians", count: 0, color: "#FFDAA6" },
    { name: "Insects", count: 0, color: "#FFB3C6" },
    { name: "Arachnids", count: 0, color: "#B3E0FF" },
    { name: "Mollusks", count: 0, color: "#D9FFCC" },
    { name: "Echinoderms", count: 0, color: "#FFDAA6" },
    { name: "Cnidarians", count: 0, color: "#FFDAA6" },
    { name: "Worms", count: 0, color: "#C1A3FF" },
    { name: "Sponges", count: 0, color: "#A8E6CF" },
  ]);

  useEffect(() => {
    // Fetch species counts from the backend API
    axios
      .get(`${API_URL}/speciesCounts`)
      .then((res) => {
        const counts = res.data;
        setData([
          { name: "Mammals", count: counts.mammals, color: "#FFB3C6" },
          { name: "Fish", count: counts.fish, color: "#FFE6A6" },
          { name: "Birds", count: counts.birds, color: "#B3E0FF" },
          { name: "Reptiles", count: counts.reptiles, color: "#D9FFCC" },
          { name: "Amphibians", count: counts.amphibians, color: "#FFDAA6" },
          { name: "Insects", count: counts.insects, color: "#FFB3C6" },
          { name: "Arachnids", count: counts.arachnids, color: "#B3E0FF" },
          { name: "Mollusks", count: counts.mollusks, color: "#D9FFCC" },
          { name: "Echinoderms", count: counts.echinoderms, color: "#FFDAA6" },
          { name: "Cnidarians", count: counts.cnidarians, color: "#FFDAA6" },
          { name: "Worms", count: counts.worms, color: "#C1A3FF" },
          { name: "Sponges", count: counts.sponges, color: "#A8E6CF" },
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
    <div className="from-purple-200 via-indigo-200 to-pink-200 min-h-screen py-12">
      <div className="bg-blue-500 shadow-lg rounded-lg p-4 flex items-center justify-between h-12">
        <h1 className="text-xl md:text-2xl text-white font-semibold">
          Analytics
        </h1>
      </div>
      <div className="mt-12 p-8 bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100 rounded-lg shadow-2xl max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Species Comparison
        </h1>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                fontSize={14}
                fill="#4B5563"
              />
              <YAxis
                fontSize={14}
                tickFormatter={formatNumber}
                fill="#4B5563"
              />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                {/* Add LabelList to display the count above each bar */}
                <LabelList
                  dataKey="count"
                  position="top" // Position the label at the top of each bar
                  fill="#4B5563" // Label color
                  fontSize={12} // Font size for the labels
                  formatter={(value) => formatNumber(value)} // Format the numbers
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Bargraph;
