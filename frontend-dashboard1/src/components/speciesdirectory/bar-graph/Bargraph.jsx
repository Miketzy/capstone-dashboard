import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
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
  LabelList,
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
    axios
      .get(`${API_URL}/speciesCounts`)
      .then((res) => {
        const counts = res.data;
        setData([
          { name: "Mammals", count: counts.mammals, color: "#4CAF50" },
          { name: "Fish", count: counts.fish, color: "#4CAF50" },
          { name: "Birds", count: counts.birds, color: "#4CAF50" },
          { name: "Reptiles", count: counts.reptiles, color: "#4CAF50" },
          { name: "Amphibians", count: counts.amphibians, color: "#4CAF50" },
          { name: "Insects", count: counts.insects, color: "#4CAF50" },
          { name: "Arachnids", count: counts.arachnids, color: "#4CAF50" },
          { name: "Mollusks", count: counts.mollusks, color: "#4CAF50" },
          { name: "Echinoderms", count: counts.echinoderms, color: "#4CAF50" },
          { name: "Cnidarians", count: counts.cnidarians, color: "#4CAF50" },
          { name: "Worms", count: counts.worms, color: "#4CAF50" },
          { name: "Sponges", count: counts.sponges, color: "#4CAF50" },
        ]);
      })
      .catch((err) => {
        console.error("Error fetching species counts:", err);
      });
  }, []);

  const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + "K";
    }
    return number;
  };

  // Get the maximum count to set the YAxis domain dynamically
  const maxCount = Math.max(...data.map((entry) => entry.count));

  return (
    <div className="min-h-screen py-12">
      <div className="mt-1 p-8 bg-white rounded-lg shadow-2xl max-w-7xl mx-auto">
        <div className="flex justify-center overflow-x-auto">
          <div
            style={{
              width: data.length > 8 ? `${data.length * 100}px` : "100%",
            }}
          >
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
                  domain={[0, maxCount]} // Dynamically adjust the YAxis domain
                />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    fill="#4B5563"
                    fontSize={12}
                    formatter={(value) => formatNumber(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bargraph;
