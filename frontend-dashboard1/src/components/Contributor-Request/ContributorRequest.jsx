import React, { useState, useEffect } from "react";
import "./ContributorRequest.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";
import API_URL from "../../config"; // Dalawang level up ✅

function ContributorRequest() {
  const [contributor, setContributor] = useState([]); // Store contributor requests
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [message, setMessage] = useState(""); // Message for notifications

  // Fetch contributor requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/request-table`);
        setContributor(res.data); // Set the fetched contributor data
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequests();
  }, []); // Empty dependency array to fetch once when component mounts

  // Filter the data based on the search term
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBirds.slice(indexOfFirstItem, indexOfLastItem);

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredBirds.length / itemsPerPage);

  // Handle approval action
  const handleApprove = (id) => {
    axios
      .put(`${API_URL}/species/approve/${id}`)
      .then((res) => {
        setMessage(res.data.message);
        // Remove the approved entry from the state
        setContributor((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to approve species request.");
      });
  };

  // Handle disapproval action (reject)
  const handleDisapprove = (id) => {
    axios
      .delete(`${API_URL}/species/reject/${id}`)
      .then((res) => {
        setMessage(res.data.message);
        // Remove the rejected entry from the state
        setContributor((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to reject species request.");
      });
  };

  return (
    <div className="contribuor-requestContainer">
      <div className="search-container">
        <CiSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-responsiveRequest">
        <table className="request-table table-bordered">
          <thead className="thead-dark4">
            <tr>
              <th>No.</th>
              <th>Contributor Fullname</th>
              <th>Email</th>
              <th>Specific Name</th>
              <th>Scientific Name</th>
              <th>Common Name</th>
              <th>Species Categories</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((data, i) => (
                <tr key={data.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>
                    <span style={{ marginRight: "5px" }}>
                      {data.contributor_firstname}
                    </span>
                    <span>{data.contributor_lastname}</span>
                  </td>
                  <td>{data.contributor_email}</td>
                  <td>{data.specificname}</td>
                  <td>{data.scientificname}</td>
                  <td>{data.commonname}</td>
                  <td>{data.speciescategory}</td>
                  <td>
                    <div className="approve-disapproved">
                      <button
                        className="contributor-approved"
                        onClick={() => handleApprove(data.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="contributor-disaproved"
                        onClick={() => handleDisapprove(data.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="message">
                  <div>
                    <p>{message || "No Request"}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="tablefooter">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          className="pagination"
        />
      </div>
    </div>
  );
}

export default ContributorRequest;
