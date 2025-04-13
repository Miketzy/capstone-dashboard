import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const ListContributor = () => {
  const [contributors, setContributors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contributorsPerPage = 5; // Display 5 contributors per page

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${API_URL}/contributors`)
        .then((res) => setContributors(res.data))
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Pagination logic: only show contributors for the current page
  const indexOfLast = currentPage * contributorsPerPage;
  const indexOfFirst = indexOfLast - contributorsPerPage;
  const currentContributors = contributors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(contributors.length / contributorsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6 md:p-10  min-h-screen w-full">
      <div className="max-w-7xl w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
        <div className="bg-green-600 text-white text-center py-4">
          <h2 className="text-3xl font-bold tracking-wide">
            Contributors List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {currentContributors.map((c, index) => (
                <tr
                  key={c.id}
                  className="hover:bg-green-50 transition duration-200"
                >
                  <td className="px-6 py-4 text-green-900 whitespace-nowrap">
                    {(currentPage - 1) * contributorsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-green-900 whitespace-nowrap">
                    {c.firstname} {c.lastname}
                  </td>
                  <td className="px-6 py-4 text-green-800 whitespace-nowrap">
                    {c.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                        c.is_active
                          ? "bg-green-200 text-green-900"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.is_active ? "🟢 Active" : "⚪ Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {contributors.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No contributors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {contributors.length > contributorsPerPage && (
          <div className="flex justify-center items-center gap-2 py-6 bg-green-50">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 text-sm rounded ${
                  currentPage === i + 1
                    ? "bg-green-500 text-white"
                    : "bg-green-100 hover:bg-green-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-green-200 rounded hover:bg-green-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListContributor;
