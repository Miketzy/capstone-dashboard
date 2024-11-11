import React, { useState, useEffect } from "react";
import "./Endengered.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";

function Endengered() {
  const [endengered, setEndengered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [message] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/getEndangered") // Ensure the URL matches your backend endpoint
      .then((res) => setEndengered(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Filter the data based on the search term
  const filteredEndengered = endengered.filter((data) =>
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
  const currentItems = filteredEndengered.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredEndengered.length / itemsPerPage);
  // Extract date part from ISO string
  const getDateOnly = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; // Split at 'T' and take the first part
  };
  return (
    <div className="endengered-page">
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
      <div className="table-responsive-endengered">
        <table className="table-endengered table-bordered">
          <thead className="thead-dark-endengered">
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
              <th>Classification</th>
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
                  <td>
                    {" "}
                    <div className="conservation-scroll">
                      {data.conservationeffort}
                    </div>
                  </td>
                  <td>{data.speciescategory}</td>
                  <td>
                    <div className="description-scroll">
                      {" "}
                      {data.description}
                    </div>
                  </td>
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

export default Endengered;
