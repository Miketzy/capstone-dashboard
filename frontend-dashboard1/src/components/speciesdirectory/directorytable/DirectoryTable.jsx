import React, { useEffect, useState } from "react";
import "./directorytable.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

function DirectoryTable() {
  const [listspecies, setListspecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Changed number of items per page to 5

  useEffect(() => {
    axios
      .get("https://bioexplorer-backend.onrender.com/listspecies")
      .then((res) => setListspecies(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listspecies.slice(indexOfFirstItem, indexOfLastItem);

  // Change page handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(listspecies.length / itemsPerPage);

  return (
    <>
      <div className="cardAnime shadow border-0 mt-4">
        <h3 className="hd">Species Table</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
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
              {currentItems.map((data, index) => (
                <tr key={data.id}>
                  <td>{indexOfFirstItem + index + 1}</td>{" "}
                  <td>{data.specificname}</td>
                  <td>{data.scientificname}</td>
                  <td>{data.commonname}</td>
                  <td>{data.habitat}</td>
                  <td>{data.population}</td>
                  <td>{data.locations}</td>
                  <td>{data.conservationstatus}</td>
                  <td>{data.threats}</td>
                  <td>
                    <div className="conservation-effort-cell">
                      {data.conservationeffort}
                    </div>
                  </td>
                  <td>{data.speciescategory}</td>
                  <td>
                    <div className="description-cell">{data.description}</div>
                  </td>
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
    </>
  );
}

export default DirectoryTable;
