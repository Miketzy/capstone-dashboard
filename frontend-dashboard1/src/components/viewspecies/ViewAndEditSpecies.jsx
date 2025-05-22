import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import API_URL from "../../config";
import { BsPlusCircleDotted } from "react-icons/bs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file for react-toastify

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

const ViewAndEditSpecies = ({ selectedSpeciesId }) => {
  const [species, setSpecies] = useState([]);
  const [speciesType, setSpeciesType] = useState("All Species");
  const [category, setCategory] = useState("All Categories");
  const [conservationStatus, setConservationStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingSpecies, setViewingSpecies] = useState(null);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [classification, setClassification] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [selectSpecies, setSelectSpecies] = useState({
    specificname: "",
    scientificname: "",
    commonname: "",
    habitat: "",
    population: "",
    location: "",
    conservationstatus: "",
    threats: "",
    date: "",
    conservationeffort: "",
    classification: "",
    speciescategory: "",
    description: "",
    uploadimage: "", // Add any other properties you need
  });
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = () => {
    axios
      .get(`${API_URL}/listspecies`)
      .then((response) => setSpecies(response.data))
      .catch((error) => console.error("Error fetching species:", error));
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/delete-species/${id}`);

          setSpecies((prevSpecies) =>
            prevSpecies.filter((item) => item.id !== id)
          );

          Swal.fire(
            "Deleted!",
            "Species data successfully deleted! 😊",
            "success"
          );
        } catch (error) {
          console.error("Error deleting species:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the file. 😢",
            "error"
          );
        }
      }
    });
  };

  const formatConservationStatus = (status) => {
    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredData = species.filter((sp) => {
    const searchLower = searchTerm.toLowerCase();
    const commonName = sp.commonname ? sp.commonname.toLowerCase() : "";
    const classification = sp.classification
      ? sp.classification.toLowerCase().trim()
      : ""; // ← Gamitin ang classification para sa vertebrates/invertebrates
    const categoryName = sp.speciescategory
      ? sp.speciescategory.toLowerCase().trim()
      : "";
    const status = sp.conservationstatus
      ? formatConservationStatus(sp.conservationstatus).toLowerCase().trim()
      : "";
    const speciesTypeLower = speciesType
      ? speciesType.toLowerCase().trim()
      : "all species"; // Default sa "all species"

    // ✅ Debugging Log - Tingnan ang values sa Console
    console.log(
      "speciesType:",
      speciesTypeLower,
      "| classification:",
      classification
    );

    return (
      (speciesTypeLower === "all species" ||
        classification === speciesTypeLower) && // ← Ginamit ang classification
      (category.toLowerCase() === "all categories" ||
        category.toLowerCase() === categoryName) &&
      (conservationStatus.toLowerCase() === "all statuses" ||
        conservationStatus.toLowerCase() === status) &&
      (commonName.includes(searchLower) ||
        classification.includes(searchLower) ||
        categoryName.includes(searchLower) ||
        status.includes(searchLower))
    );
  });
  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (editingSpecies && editingSpecies.id) {
      setLoading(true);

      axios
        .get(`${API_URL}/api/species/${editingSpecies.id}`)
        .then((response) => {
          const speciesData = response.data;
          setSelectSpecies(speciesData);

          // ✅ Huwag gumamit ng default image kung walang image
          const imgUrl = speciesData.uploadimage?.includes("cloudinary.com")
            ? speciesData.uploadimage
            : speciesData.uploadimage
            ? `https://res.cloudinary.com/dvj4mroel/image/upload/v1742857519/species-images/${speciesData.uploadimage}`
            : ""; // Walang image kapag walang data

          setImageUrl(imgUrl);
        })
        .catch((error) => {
          console.error("Error fetching species data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [editingSpecies]);

  useEffect(() => {
    if (viewingSpecies && viewingSpecies.id) {
      setLoading(true);

      axios
        .get(`${API_URL}/api/species/${viewingSpecies.id}`)
        .then((response) => {
          const speciesData = response.data;
          setSelectSpecies(speciesData);

          // ✅ Set image URL correctly
          const imgUrl = speciesData.uploadimage?.includes("cloudinary.com")
            ? speciesData.uploadimage
            : speciesData.uploadimage
            ? `https://res.cloudinary.com/dvj4mroel/image/upload/v1742857519/species-images/${speciesData.uploadimage}`
            : ""; // No image when there's no data

          setImageUrl(imgUrl);
        })
        .catch((error) => {
          console.error("Error fetching species data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [viewingSpecies]);

  const handleUpdateSpecies = async (e) => {
    e.preventDefault();

    // Check if selectedSpecies.id is available
    if (!selectSpecies.id) {
      toast.error("❌ Species ID is missing. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return; // Exit early if ID is not available
    }

    const formData = new FormData();
    formData.append("specificname", selectSpecies.specificname);
    formData.append("scientificname", selectSpecies.scientificname);
    formData.append("commonname", selectSpecies.commonname);
    formData.append("habitat", selectSpecies.habitat);
    formData.append("population", selectSpecies.population);
    formData.append("location", selectSpecies.location);
    formData.append("conservationstatus", selectSpecies.conservationstatus);
    formData.append("threats", selectSpecies.threats);
    formData.append("date", selectSpecies.date);
    formData.append("classification", selectSpecies.classification);
    formData.append("conservationeffort", selectSpecies.conservationeffort);
    formData.append("speciescategory", selectSpecies.speciescategory);
    formData.append("description", selectSpecies.description);

    // Add existing image file name if no new image is uploaded
    formData.append("existingimage", selectSpecies.uploadimage);

    // Handle new image upload
    if (image) {
      if (typeof image === "string" && image.startsWith("http")) {
        formData.append("imageUrl", image);
      } else {
        formData.append("uploadimage", image);
      }
    }

    try {
      await axios.put(`${API_URL}/listspecies/${selectSpecies.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("🦄 Species updated successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error updating species:", error);
      toast.error("❌ Error updating species. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  // Handle file input change (when user selects a new image)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Set the image URL for preview
      };
      reader.readAsDataURL(file); // Convert the file to a base64 URL
    }
  };

  // uplaod species

  if (viewingSpecies) {
    return (
      <div>
        <br />
        <br />
        <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
          <h1 className="text-2xl text-white">View Species</h1>
        </div>
        <br />
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg space-y-6">
          <h2
            id="species-modal-title"
            className="text-3xl font-bold text-green-700 text-center"
          >
            {selectSpecies?.specificname}
          </h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {loading ? (
              <p>Loading species data...</p>
            ) : selectSpecies ? (
              <div>
                {imageUrl ? (
                  <img
                    src={imageUrl} // ✅ Use the correct `imageUrl`
                    alt={selectSpecies.specificname || "Species Image"}
                    className="w-32 h-32 rounded-lg border"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            ) : (
              <p>No species found.</p>
            )}

            {/* Information Section */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Specific Name:</strong>{" "}
                  {selectSpecies?.specificname || ""}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Scientific Name:</strong>{" "}
                  <span className="italic">
                    {selectSpecies?.scientificname || ""}
                  </span>
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Common Name:</strong>{" "}
                  {selectSpecies?.commonname}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800 text-justify">
                    Habitat:
                  </strong>{" "}
                  {selectSpecies?.habitat}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Category:</strong>{" "}
                  {selectSpecies?.speciescategory}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Type:</strong>{" "}
                  {selectSpecies?.classification}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800 text-justify">
                    Population:
                  </strong>{" "}
                  {selectSpecies?.population}
                </p>
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">Location:</strong>{" "}
                  {selectSpecies?.location}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-lg text-gray-800">
                  <strong className="text-green-800">
                    Conservation Status:
                  </strong>{" "}
                  {selectSpecies?.conservationstatus}
                </p>
                <p className="text-lg text-gray-800 text-justify">
                  <strong className="text-green-800">Threats:</strong>{" "}
                  {selectSpecies?.threats}
                </p>
                <p className="text-lg text-gray-800 text-justify">
                  <strong className="text-green-800">
                    Conservation Efforts:
                  </strong>{" "}
                  {selectSpecies?.conservationeffort}
                </p>
                <p className="text-lg text-gray-800 text-justify">
                  <strong className="text-green-800">Description:</strong>{" "}
                  {selectSpecies?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setViewingSpecies(null)}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
            >
              Back to Table
            </button>
          </div>
        </div>
        <br />
      </div>
    );
  }

  if (editingSpecies) {
    return (
      <div>
        <br />
        <br />
        <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
          <h1 className="text-2xl text-white">Edit Species</h1>
        </div>
        <br />
        <div className="p-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="imginput" className="relative">
              {loading ? (
                <p>Loading species data...</p>
              ) : selectSpecies ? (
                <div>
                  {imageUrl ? ( // ✅ Huwag mag-display ng `<img>` kapag walang image
                    <img
                      src={imageUrl}
                      alt={selectSpecies.specific_name || "Species Image"}
                      className="w-32 h-32 rounded-lg border"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              ) : (
                <p>No species found.</p>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Specific Name</label>
              <input
                type="text"
                placeholder="Enter Specific Name"
                className="w-full p-2 border rounded"
                value={selectSpecies.specificname || ""}
                onChange={(e) =>
                  setSelectSpecies({
                    ...selectSpecies,
                    specificname: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-gray-600">Common Name</label>
              <input
                type="text"
                placeholder="Enter Common Name"
                className="w-full p-2 border rounded"
                value={selectSpecies.commonname || ""}
                onChange={(e) =>
                  setSelectSpecies({
                    ...selectSpecies,
                    commonname: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600">Scientific Name</label>
              <input
                type="text"
                placeholder="Enter Scientific Name"
                className="w-full p-2 border rounded italic"
                value={selectSpecies.scientificname || ""}
                onChange={(e) =>
                  setSelectSpecies({
                    ...selectSpecies,
                    scientificname: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-gray-600">Location (Map)</label>
              <input
                type="text"
                placeholder="Mapping"
                className="w-full p-2 border rounded"
                value={selectSpecies.location || ""}
                onChange={(e) =>
                  setSelectSpecies({
                    ...selectSpecies,
                    location: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-600">Conservation Status</label>
            <select
              className="w-full p-2 border rounded"
              value={selectSpecies.conservationstatus || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  conservationstatus: e.target.value,
                })
              }
            >
              <option value="">Select Conservation Status</option>
              <option value="critically-endangered">
                Critically Endangered
              </option>
              <option value="endangered">Endangered</option>
              <option value="vulnerable">Vulnerable</option>
              <option value="near-threatened">Near Threatened</option>
              <option value="least-concern">Least Concern</option>
            </select>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Classification */}
              <div>
                <label className="block text-gray-600">Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectSpecies.speciescategory || ""}
                  onChange={(e) =>
                    setSelectSpecies({
                      ...selectSpecies,
                      speciescategory: e.target.value,
                    })
                  }
                >
                  <option value="">Select a category</option>
                  <option value="mammals">Mammals</option>
                  <option value="birds">Birds</option>
                  <option value="reptiles">Reptiles</option>
                  <option value="amphibians">Amphibians</option>
                  <option value="fish">Fish</option>
                  <option value="insects">Insects</option>
                  <option value="arachnids">Arachnids</option>
                  <option value="mollusks">Mollusks</option>
                  <option value="echinoderms">Echinoderms</option>
                  <option value="cnidarians">Cnidarians</option>
                  <option value="worms">Worms</option>
                  <option value="sponges">Sponges</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-600">Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectSpecies.classification || ""}
                  onChange={(e) =>
                    setSelectSpecies({
                      ...selectSpecies,
                      classification: e.target.value,
                    })
                  }
                >
                  <option value="">Select Type</option>
                  <option value="vertebrates">Vertebrates</option>
                  <option value="invertebrates">Invertebrates</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600">Population</label>
            <textarea
              placeholder="Enter species population"
              className="w-full p-2 border rounded"
              value={selectSpecies.population || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  population: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600">Habitat</label>
            <textarea
              placeholder="Enter species habitat"
              className="w-full p-2 border rounded h-40"
              value={selectSpecies.habitat || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  habitat: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600">Threats</label>
            <textarea
              placeholder="Enter species threats"
              className="w-full p-2 border rounded h-40"
              value={selectSpecies.threats || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  threats: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600">Conservation Effort</label>
            <textarea
              placeholder="Enter conservation effort"
              className="w-full p-2 border rounded h-40"
              value={selectSpecies.conservationeffort || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  conservationeffort: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600">Description</label>
            <textarea
              placeholder="Enter species description"
              className="w-full p-2 border rounded h-40"
              value={selectSpecies.description || ""}
              onChange={(e) =>
                setSelectSpecies({
                  ...selectSpecies,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>

          <div className="mt-6 flex justify-center gap-5">
            <div>
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={() => setEditingSpecies(null)}
              >
                Back to Table
              </button>
            </div>
            <div>
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={handleUpdateSpecies}
              >
                Save Changes
              </button>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce} // Optional transition effect
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <br />
      <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
        <h1 className="text-2xl text-white">List Of Species</h1>
      </div>
      <br />
      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
        <input
          type="text"
          placeholder="Search species..."
          className="p-2 border rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={speciesType}
          onChange={(e) => setSpeciesType(e.target.value)}
        >
          {speciesTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={conservationStatus}
          onChange={(e) => setConservationStatus(e.target.value)}
        >
          {conservationStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Name</th>
              <th className="p-3">Classification</th>
              <th className="p-3">Category</th>
              <th className="p-3">Conservation Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((sp, index) => (
                <tr key={sp.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{sp.commonname}</td>
                  <td className="p-3">{sp.classification}</td>
                  <td className="p-3">{sp.speciescategory}</td>
                  <td className="p-3">
                    {formatConservationStatus(sp.conservationstatus)}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => setViewingSpecies(sp)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => setEditingSpecies(sp)}
                    >
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
                <td colSpan="6" className="p-5 text-center text-gray-600">
                  No species found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
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
