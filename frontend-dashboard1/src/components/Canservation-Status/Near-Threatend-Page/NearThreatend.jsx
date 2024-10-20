import React, { useState, useEffect } from "react";
import "./NearThreatend.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";

function NearThreatend() {
  const [nearthreatend, setNearthreatend] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/near-threatend")
      .then((res) => setNearthreatend(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Filter the data based on the search term
  const filteredNearthreatend = nearthreatend.filter((data) =>
    [
      data.specificname,
      data.scientificname,
      data.commonname,
      data.speciescategories,
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNearthreatend.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredNearthreatend.length / itemsPerPage);

  return (
    <div className="nearthreatend-page">
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
      <div className="table-responsive-nearthreatend">
        <table className="table-nearthreatend table-bordered">
          <thead className="thead-dark-nearthreatend">
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
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((data, index) => (
              <tr key={data.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{data.specificname}</td>
                <td>{data.scientificname}</td>
                <td>{data.commonname}</td>
                <td>{data.habitat}</td>
                <td>{data.population}</td>
                <td>{data.locations}</td>
                <td>{data.conservationstatus}</td>
                <td>{data.threats}</td>
                <td>{data.conservationeffort}</td>
                <td>{data.speciescategories}</td>
                <td>{data.description}</td>
                <td>{data.date}</td>
              </tr>
            ))}
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

export default NearThreatend;
