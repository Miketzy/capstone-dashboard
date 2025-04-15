import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import API_URL from "../../config";
import { BsPlusCircleDotted } from "react-icons/bs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const speciesTypes = ["All Species", "Invertebrates", "Vertebrates"];
const categories = [
  "All Categories",
  "Mammals",
  "Fish",
  "Birds",
  "Reptiles",
  "Amphibians",
  "Insects",
  "Arachnids",
  "Mollusks",
  "Echinoderms",
  "Cnidarians",
  "Worms",
  "Spongers",
];
const conservationStatuses = [
  "All Statuses",
  "Critically Endangered",
  "Endangered",
  "Vulnerable",
  "Near Threatened",
  "Least Concern",
];

const ViewAndEditSpecies = () => {
  const [species, setSpecies] = useState([]);
  const [speciesType, setSpeciesType] = useState("All Species");
  const [category, setCategory] = useState("All Categories");
  const [conservationStatus, setConservationStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = () => {
    axios
      .get(`${API_URL}/listspecies`)
      .then((res) => setSpecies(res.data))
      .catch((err) => console.error("Fetch Error:", err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/delete-species/${id}`)
          .then(() => {
            setSpecies((prev) => prev.filter((sp) => sp.id !== id));
            Swal.fire("Deleted!", "Species deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to delete species.", "error");
          });
      }
    });
  };

  const formatStatus = (status) =>
    status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const filteredData = species.filter((sp) => {
    const term = searchTerm.toLowerCase();
    const common = sp.commonname?.toLowerCase() || "";
    const classification = sp.classification?.toLowerCase().trim() || "";
    const categoryName = sp.speciescategory?.toLowerCase().trim() || "";
    const status = formatStatus(sp.conservationstatus || "").toLowerCase();
    return (
      (speciesType === "All Species" ||
        classification === speciesType.toLowerCase()) &&
      (category === "All Categories" ||
        category.toLowerCase() === categoryName) &&
      (conservationStatus === "All Statuses" ||
        conservationStatus.toLowerCase() === status) &&
      (common.includes(term) ||
        classification.includes(term) ||
        categoryName.includes(term) ||
        status.includes(term))
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <ToastContainer autoClose={3000} transition={Bounce} />
      <h1 className="text-2xl font-bold text-blue-600 mb-4">List of Species</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search species..."
          className="p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={speciesType}
          onChange={(e) => setSpeciesType(e.target.value)}
          className="p-2 border rounded"
        >
          {speciesTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={conservationStatus}
          onChange={(e) => setConservationStatus(e.target.value)}
          className="p-2 border rounded"
        >
          {conservationStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Name</th>
              <th className="p-2">Classification</th>
              <th className="p-2">Category</th>
              <th className="p-2">Conservation Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((sp, index) => (
                <tr key={sp.id} className="border-b">
                  <td className="p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2">{sp.commonname}</td>
                  <td className="p-2">{sp.classification}</td>
                  <td className="p-2">{sp.speciescategory}</td>
                  <td className="p-2">{formatStatus(sp.conservationstatus)}</td>
                  <td className="p-2 flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEye />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(sp.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No species found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
};

export default ViewAndEditSpecies;
