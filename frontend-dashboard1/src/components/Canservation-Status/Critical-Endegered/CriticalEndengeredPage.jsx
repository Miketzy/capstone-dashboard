import React, { useState, useEffect } from "react";
import "./CriticalEndengeredPage.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";

function CriticalEndengeredPage() {
  const [critically, setCritically] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [message] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/getCritically-endangered")
      .then((res) => setCritically(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Filter the data based on the search term
  const filteredCritically = critically.filter((data) =>
    [
      data.specificname,
      data.scientificname,
      data.commonname,
      data.speciescategories,
    ].some((field) =>
      field ? field.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCritically.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredCritically.length / itemsPerPage);
  // Extract date part from ISO string
  const getDateOnly = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; // Split at 'T' and take the first part
  };
  return (
    <div className="critical-endengered-page">
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
      <div className="table-responsive-critical">
        <table className="table-critical table-bordered">
          <thead className="thead-dark-critical">
            <tr>
              <th>No.</th>
              <th>Specific Name</th>
              <th>Scientific Name</th>
              <th>Common Name</th>
              <th>Habitat</th>
              <th>Population</th>
              <th>Locations</th>
              <th>Conservation Status</th>
              <th>Threats</th>
              <th>Conservation Effort</th>
              <th>Species Categories</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((data, i) => (
                <tr key={data.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{data.specificname}</td>
                  <td>{data.scientificname}</td>
                  <td>{data.commonname}</td>
                  <td>{data.habitat}</td>
                  <td>{data.population}</td>
                  <td>{data.locations}</td>
                  <td>{data.conservationstatus}</td>
                  <td>{data.threats}</td>
                  <td>{data.conservationeffort}</td>
                  <td>{data.speciescategory}</td>
                  <td>{data.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="message">
                  <div>
                    <p>{message || "No species data"}</p>
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

export default CriticalEndengeredPage;
