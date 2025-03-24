import React, { useEffect, useState } from "react";
import "./viewspecies.css";
import Button from "@mui/material/Button";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { BsPlusCircleDotted } from "react-icons/bs";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file for react-toastify

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  maxHeight: "90vh", // Limits the height to 90% of the viewport height
  overflowY: "auto",
};
const editstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  maxHeight: "90vh", // Limits the height to 90% of the viewport height
  overflowY: "auto",
};

function ViewAndEditSpecies() {
  const [listspecies, setListspecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [pencilOpen, setPencilOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [image, setImage] = useState(null);
  const [message] = useState("");

  const handleOpen = (species) => {
    setSelectedSpecies(species);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePencilOpen = (species) => {
    setSelectedSpecies(species);
    setPencilOpen(true);
  };

  const handlePencilClose = () => setPencilOpen(false);

  useEffect(() => {
    axios
      .get("https://bioexplorer-backend.onrender.com/listspecies")
      .then((res) => setListspecies(res.data))
      .catch((err) => console.log(err));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listspecies
    .filter((data) =>
      [
        data.specificname,
        data.scientificname,
        data.commonname,
        data.speciescategory,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(
    listspecies.filter((data) =>
      [
        data.specificname,
        data.scientificname,
        data.commonname,
        data.speciescategory,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / itemsPerPage
  );

  const handleIconClick = () => {
    document.getElementById("imginput").click();
  };

  // Function to handle file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected file to state
    }
  };

  const extractFileName = (filePath) => {
    return filePath.split("/").pop();
  };

  const handleUpdateSpecies = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("specificname", selectedSpecies.specificname);
    formData.append("scientificname", selectedSpecies.scientificname);
    formData.append("commonname", selectedSpecies.commonname);
    formData.append("habitat", selectedSpecies.habitat);
    formData.append("population", selectedSpecies.population);
    formData.append("location", selectedSpecies.location);
    formData.append("conservationstatus", selectedSpecies.conservationstatus);
    formData.append("threats", selectedSpecies.threats);
    formData.append("date", selectedSpecies.date);
    formData.append("conservationeffort", selectedSpecies.conservationeffort);
    formData.append("speciescategory", selectedSpecies.speciescategory);
    formData.append("description", selectedSpecies.description);

    // Add the existing image file name if no new image is uploaded
    formData.append(
      "existingimage",
      extractFileName(selectedSpecies.uploadimage)
    );

    // Add the image file if it exists
    if (image) {
      formData.append("uploadimage", image); // The file from the input
    }

    try {
      await axios.put(
        `https://bioexplorer-backend.onrender.com/listspecies/${selectedSpecies.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("🦄 Species updated successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce, // Optional transition effect
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
        transition: Bounce, // Optional transition effect
      });
    }
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
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://bioexplorer-backend.onrender.com/delete-species/${id}`
          );
          setListspecies(listspecies.filter((item) => item.id !== id));
          Swal.fire("Species data successfully deleted! 😊"); // Success message with emoji
        } catch (error) {
          console.error("Error deleting species:", error);
          Swal.fire(
            "Error!",
            "There was an error deleting the file. 😢",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Your species data is safe 🙂");
      }
    });
  };

  return (
    <div className="ViewAndEditSpecies">
      <div className="search-container">
        <CiSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Search...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-responsive1">
        <table className="table1 table-bordered">
          <thead className="thead-dark1">
            <tr>
              <th>No.</th>
              <th>Specific Name</th>
              <th>Scientific Name</th>
              <th>Common Name</th>
              <th>Conservation Status</th>
              <th>Classification</th>
              <th>Action</th>
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
                  <td>{data.conservationstatus}</td>

                  <td>{data.speciescategory}</td>

                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button
                        className="secondary"
                        color="secondary"
                        onClick={() => handleOpen(data)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        className="success"
                        color="success"
                        onClick={() => handlePencilOpen(data)}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        className="error"
                        color="error"
                        onClick={() => handleDelete(data.id)}
                      >
                        <MdDelete />
                      </Button>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full overflow-y-auto max-h-[90vh]">
            {selectedSpecies && (
              <>
                <h2
                  id="parent-modal-title"
                  className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4"
                >
                  {selectedSpecies.specificname} Details
                </h2>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <img
                      src={selectedSpecies.uploadimage}
                      className="w-64 h-64 object-cover rounded-lg shadow-md"
                      alt="species"
                    />
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-gray-600 font-medium">
                        Specific Name:
                      </h3>
                      <p className="text-gray-800 font-semibold">
                        {selectedSpecies.specificname}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">
                        Scientific Name:
                      </h3>
                      <p className="text-gray-800 font-semibold">
                        {selectedSpecies.scientificname}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">
                        Common Name:
                      </h3>
                      <p className="text-gray-800 font-semibold">
                        {selectedSpecies.commonname}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">Habitat:</h3>
                      <p className="text-gray-800">{selectedSpecies.habitat}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">
                        Species Category:
                      </h3>
                      <p className="text-gray-800">
                        {selectedSpecies.speciescategory}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">Population:</h3>
                      <p className="text-gray-800">
                        {selectedSpecies.population}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">Location:</h3>
                      <p className="text-gray-800">
                        {selectedSpecies.location}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-medium">
                        Conservation Status:
                      </h3>
                      <p className="text-red-600 font-semibold">
                        {selectedSpecies.conservationstatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-gray-600 font-medium">Threats:</h3>
                    <p className="text-gray-800">{selectedSpecies.threats}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium">
                      Conservation Effort:
                    </h3>
                    <p className="text-gray-800">
                      {selectedSpecies.conservationeffort}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-medium">Description:</h3>
                    <p className="text-gray-800">
                      {selectedSpecies.description}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={pencilOpen}
        onClose={handlePencilClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={pencilOpen}>
          <Box sx={editstyle} className="modal-content">
            {selectedSpecies && (
              <>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Edit Species
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  <di className="pencile-edit-species">
                    <div className="edit-species">
                      <div className="edit-image">
                        <label htmlFor="img-edit-input" className="edit-upload">
                          <input
                            type="file"
                            id="imginput"
                            name="uploadimage"
                            className="file"
                            style={{ display: "none" }}
                            onChange={handleImageUpload} // Handle file upload
                          />

                          <BsPlusCircleDotted
                            className="edit-icon"
                            onClick={handleIconClick}
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              bottom: "20px",
                              right: "48px",
                            }}
                          />
                        </label>

                        {image ? (
                          <img
                            src={
                              image
                                ? URL.createObjectURL(image)
                                : `/uploads/images/${selectedSpecies.uploadimage}`
                            }
                            alt="Species"
                            width="200"
                            height="200"
                          />
                        ) : (
                          <img
                            src={selectedSpecies.uploadimage}
                            alt="Default Species"
                            width="200"
                            height="200"
                          />
                        )}
                      </div>

                      <div className="edit-pencil">
                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-specific">Specific Name</label>
                          <input
                            type="text"
                            placeholder="Enter Specific name"
                            className="edit-specific"
                            value={selectedSpecies.specificname || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                specificname: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-common">Common Name</label>
                          <input
                            type="text"
                            placeholder="Enter common name"
                            className="edit-common"
                            value={selectedSpecies.commonname || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                commonname: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="edit-pencil-specific">
                          <label htmlFor="pencil-species-categories">
                            Classification
                          </label>
                          <select
                            id="species-categories"
                            className="edit-species-categories"
                            placeholder="Select species category"
                            value={selectedSpecies.speciescategory || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                speciescategories: e.target.value,
                              })
                            }
                          >
                            <option value="">Select a category</option>
                            <option value="mammals">Mammals</option>
                            <option value="birds">Birds</option>
                            <option value="reptiles">Reptiles</option>
                            <option value="amphibians">Amphibians</option>
                            <option value="invertebrates">Invertebrates</option>
                            <option value="fish">Fish</option>
                          </select>
                        </div>
                      </div>

                      <div className="edit-pencil">
                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-Scientific">
                            Scientific Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Scientific name"
                            className="edit-Scientific"
                            value={selectedSpecies.scientificname || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                scientificname: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="edit-pencil-location">
                          <label htmlFor="edit-location" className="location">
                            Map
                          </label>
                          <input
                            className="edit-location"
                            placeholder="Mapping"
                            rows="4"
                            value={selectedSpecies.location || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-status">
                            Conservation Status
                          </label>
                          <select
                            id="edit-conservation-status"
                            className="edit-conservation-status"
                            value={selectedSpecies.conservationstatus || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                conservationstatus: e.target.value,
                              })
                            }
                          >
                            <option value="">
                              Select a Conservation Status
                            </option>
                            <option value="critically-endangered">
                              Critically-endangered
                            </option>
                            <option value="endangered">Endangered</option>
                            <option value="vulnerable">Vulnerable</option>
                            <option value="near-threatened">
                              Near-threatened
                            </option>
                            <option value="least-concern">Least-concern</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="edit-pencil-status">
                      <label htmlFor="edit-population">Population</label>
                      <textarea
                        type="text"
                        placeholder="Enter  species population"
                        className="edit-population"
                        value={selectedSpecies.population || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            population: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="edit-pencil-status">
                      <label htmlFor="edit-Habitat">Habitat</label>
                      <textarea
                        type="text"
                        placeholder="Enter species Habitat"
                        className="edit-Habitat"
                        value={selectedSpecies.habitat || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            habitat: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="edit-pencil-status">
                      <label htmlFor="edit-threats">Threats</label>
                      <textarea
                        type="text"
                        placeholder="Enter species threats"
                        className="edit-threats"
                        value={selectedSpecies.threats || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            threats: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="edit-pencil-status">
                      <label htmlFor="edit-status" className="status">
                        Conservation Effort
                      </label>
                      <textarea
                        className="edit-conservation-status"
                        placeholder="Enter species conservation effort"
                        rows="4"
                        value={selectedSpecies.conservationeffort || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            conservationeffort: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="edit-pencil-status">
                      <label htmlFor="edit-description" className="status">
                        Description
                      </label>
                      <textarea
                        className="edit-description"
                        placeholder="Enter species Description"
                        rows="4"
                        value={selectedSpecies.description || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Button id="edit-button" onClick={handleUpdateSpecies}>
                      Save Changes
                    </Button>

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
                  </di>
                </Typography>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ViewAndEditSpecies;
