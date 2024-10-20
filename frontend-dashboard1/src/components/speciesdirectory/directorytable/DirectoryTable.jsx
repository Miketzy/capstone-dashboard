import React, { useEffect, useState } from "react";
import "./directorytable.css";
import Button from "@mui/material/Button";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

function DirectoryTable() {
  const [listspecies, setListspecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Changed number of items per page to 5

  useEffect(() => {
    axios
      .get("http://localhost:8080/listspecies")
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
                <th>#</th>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((data, index) => (
                <tr key={data.id}>
                  <td>{indexOfFirstItem + index + 1}</td>{" "}
                  {/* Displays sequential numbers */}
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
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button className="secondary" color="secondary">
                        <FaEye />
                      </Button>
                      <Button className="success" color="success">
                        <FaPencilAlt />
                      </Button>
                      <Button className="error" color="error">
                        <MdDelete />
                      </Button>
                    </div>
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
