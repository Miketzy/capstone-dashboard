import React, { useState, useEffect } from "react";
import "./mammals.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { CiSearch } from "react-icons/ci";

function Mammal() {
  const [mammals, setMammals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch species data from the backend API
    axios
      .get("http://localhost:8080/mammal")
      .then((res) => setMammals(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Filter the data based on the search term
  const filteredMammals = mammals.filter((data) =>
    [
      data.specificname,
      data.scientificname,
      data.commonname,
      data.speciescategory,
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMammals.slice(indexOfFirstItem, indexOfLastItem);

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredMammals.length / itemsPerPage);

  return (
    <div className="mammals">
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
      <div className="table-responsive3">
        <table className="table3 table-bordered">
          <thead className="thead-dark3">
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
                <td>{data.speciescategory}</td>
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

export default Mammal;
