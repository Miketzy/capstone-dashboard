import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios"; // Import axios to make the API request
import API_URL from "../../config"; // Adjust with your backend URL

const SpeciesMonth = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [monthlyCounts, setMonthlyCounts] = useState(new Array(12).fill(0)); // Initialize with zero counts

  // Fetch the monthly species count from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/month`); // Adjust with your backend URL
        setMonthlyCounts(response.data.monthlyCounts); // Update state with the fetched counts
      } catch (error) {
        console.error("Error fetching species data:", error);
      }
    };

    fetchData(); // Call the function to fetch the data

    // Create the chart once the data is fetched
    if (chartRef && chartRef.current && !chartInstance.current) {
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
              data: monthlyCounts, // Use the dynamic data from the state
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
              labels: {
                color: "#333",
                font: { size: 14 },
              },
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
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup the chart when component unmounts
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Re-render the chart when monthlyCounts is updated (this is the only place you update chart data)
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = monthlyCounts;
      chartInstance.current.update(); // Update the chart with new data
    }
  }, [monthlyCounts]);

  return (
    <div className="container mx-auto px-4 py-8 mt-[-100px] sm:mt-[-100px] md:mt-[-298px] lg:mt-[-300px] xl:mt-[-350px] 2xl:mt-[-350px]">
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
