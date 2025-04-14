import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const SpeciesMonth = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
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
              data: [2, 5, 3, 4, 6, 7, 8, 4, 6, 5, 3, 9], // sample species data
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
                font: {
                  size: 14,
                },
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
                font: {
                  size: 14,
                },
              },
            },
            x: {
              title: {
                display: true,
                text: "Months",
                color: "#333",
                font: {
                  size: 14,
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SpeciesMonth;
