// frontend-dashboard1/src/Components/SpeciesMonth.js
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import API_URL from "../../config";

const SpeciesMonth = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/species/monthly`)
      .then((res) => setMonthlyData(res.data))
      .catch((err) => console.error("Error fetching chart data:", err));
  }, []);

  useEffect(() => {
    if (monthlyData.length === 0 || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Number of Species Added",
            data: monthlyData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#333", font: { size: 14 } },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Species Count",
              color: "#333",
              font: { size: 14 },
            },
          },
          x: {
            title: {
              display: true,
              text: "Months",
              color: "#333",
              font: { size: 14 },
            },
          },
        },
      },
    });
  }, [monthlyData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "16px",
            color: "#333",
            fontSize: "18px",
          }}
        >
          Monthly Added Species
        </h2>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SpeciesMonth;
