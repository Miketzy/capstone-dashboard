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
        aria-labelledby="species-modal-title"
      >
        <Box className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto mt-10 overflow-y-auto max-h-[90vh]">
          {selectedSpecies && (
            <div className="space-y-4 text-gray-700">
              <Typography
                id="species-modal-title"
                variant="h5"
                className="text-green-700 font-bold"
              >
                {selectedSpecies.specificname} Details
              </Typography>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={selectedSpecies.uploadimage}
                  className="w-full md:w-1/3 rounded-lg shadow-lg"
                  alt="species"
                />
                <div className="flex-1 space-y-3">
                  <p>
                    <strong className="text-green-800">Scientific Name:</strong>{" "}
                    {selectedSpecies.scientificname}
                  </p>
                  <p>
                    <strong className="text-green-800">Common Name:</strong>{" "}
                    {selectedSpecies.commonname}
                  </p>
                  <p>
                    <strong className="text-green-800">Habitat:</strong>{" "}
                    {selectedSpecies.habitat}
                  </p>
                  <p>
                    <strong className="text-green-800">Category:</strong>{" "}
                    {selectedSpecies.speciescategory}
                  </p>
                  <p>
                    <strong className="text-green-800">Population:</strong>{" "}
                    {selectedSpecies.population}
                  </p>
                  <p>
                    <strong className="text-green-800">Location:</strong>{" "}
                    {selectedSpecies.location}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p>
                  <strong className="text-green-800">
                    Conservation Status:
                  </strong>{" "}
                  {selectedSpecies.conservationstatus}
                </p>
                <p>
                  <strong className="text-green-800">Threats:</strong>{" "}
                  {selectedSpecies.threats}
                </p>
                <p>
                  <strong className="text-green-800">
                    Conservation Efforts:
                  </strong>{" "}
                  {selectedSpecies.conservationeffort}
                </p>
                <p className="text-justify">
                  <strong className="text-green-800">Description:</strong>{" "}
                  {selectedSpecies.description}
                </p>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={editstyle}>
            <h2>Edit Species</h2>
            <TextField
              label="Scientific Name"
              fullWidth
              margin="normal"
              value={selectedSpecies.scientificname || ""}
              onChange={(e) =>
                setSelectedSpecies({
                  ...selectedSpecies,
                  scientificname: e.target.value,
                })
              }
            />
            <TextField
              label="Common Name"
              fullWidth
              margin="normal"
              value={selectedSpecies.commonname || ""}
              onChange={(e) =>
                setSelectedSpecies({
                  ...selectedSpecies,
                  commonname: e.target.value,
                })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Classification</InputLabel>
              <Select
                value={selectedSpecies.speciescategory || ""}
                onChange={(e) =>
                  setSelectedSpecies({
                    ...selectedSpecies,
                    speciescategory: e.target.value,
                  })
                }
              >
                {speciesCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={selectedSpecies.description || ""}
              onChange={(e) =>
                setSelectedSpecies({
                  ...selectedSpecies,
                  description: e.target.value,
                })
              }
            />
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="mt-2">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Species Preview"
                  width="200"
                  height="200"
                />
              ) : (
                <img
                  src={`/uploads/images/${selectedSpecies.uploadimage}`}
                  alt="Species"
                  width="200"
                  height="200"
                />
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateSpecies}
              >
                Save Changes
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ViewAndEditSpecies;
