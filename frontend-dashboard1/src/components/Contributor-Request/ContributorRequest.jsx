import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";
import API_URL from "../../config";

function ContributorRequest() {
  const [contributor, setContributor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/request-table`);
        setContributor(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequests();
  }, []);

  const filteredBirds = contributor.filter((data) =>
    [
      data.specificname,
      data.scientificname,
      data.commonname,
      data.speciescategory,
    ].some((field) =>
      field ? field.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBirds.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(filteredBirds.length / itemsPerPage);

  const handleApprove = (id) => {
    axios
      .put(`${API_URL}/species/approve/${id}`)
      .then((res) => {
        setMessage(res.data.message);
        setContributor((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to approve species request.");
      });
  };

  const handleDisapprove = (id) => {
    axios
      .delete(`${API_URL}/species/reject/${id}`)
      .then((res) => {
        setMessage(res.data.message);
        setContributor((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to reject species request.");
      });
  };

  return (
    <div className="mb-20">
      <br />
      <br />
      <div className="p-4 min-h-screen">
        <div className="bg-blue-500 shadow-lg rounded-lg p-4 flex items-center justify-between h-12">
          <h1 className="text-xl md:text-2xl text-white font-semibold">
            Contributor Request
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex items-center bg-white shadow-md rounded-lg p-3 w-full max-w-lg mx-auto">
          <CiSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            className="ml-2 w-full border-none focus:outline-none text-sm md:text-base"
            placeholder="Search species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto mt-4 bg-white shadow-md rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-600 text-white text-sm md:text-base">
              <tr>
                <th className="p-2 md:p-3">No.</th>
                <th className="p-2 md:p-3">Contributor</th>
                <th className="p-2 md:p-3">Email</th>
                <th className="p-2 md:p-3">Specific Name</th>
                <th className="p-2 md:p-3 italic">Scientific Name</th>
                <th className="p-2 md:p-3">Common Name</th>
                <th className="p-2 md:p-3">Category</th>
                <th className="p-2 md:p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((data, i) => (
                  <tr
                    key={data.id}
                    className="border-b hover:bg-gray-100 text-sm md:text-base"
                  >
                    <td className="p-2 md:p-3">{indexOfFirstItem + i + 1}</td>
                    <td className="p-2 md:p-3">
                      {data.contributor_firstname} {data.contributor_lastname}
                    </td>
                    <td className="p-2 md:p-3">{data.contributor_email}</td>
                    <td className="p-2 md:p-3">{data.specificname}</td>
                    <td className="p-2 md:p-3">{data.scientificname}</td>
                    <td className="p-2 md:p-3">{data.commonname}</td>
                    <td className="p-2 md:p-3">{data.speciescategory}</td>
                    <td className="p-2 md:p-3 flex flex-col md:flex-row gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 text-xs md:text-sm"
                        onClick={() => handleApprove(data.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 text-xs md:text-sm"
                        onClick={() => handleDisapprove(data.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="p-5 text-center text-gray-600 text-sm md:text-base"
                  >
                    {message || "No requests available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default ContributorRequest;
