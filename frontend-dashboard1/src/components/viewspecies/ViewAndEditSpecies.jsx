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
import { useParams } from "react-router-dom";

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

  const handleIconClick = () => {
    document.getElementById("imginput").click();
  };

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
      .get("http://localhost:8080/listspecies")
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
        data.speciescategories,
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
        data.speciescategories,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / itemsPerPage
  );

  const handleUpdateSpecies = () => {
    if (selectedSpecies) {
      axios
        .put(
          `http://localhost:8080/listspecies/${selectedSpecies.id}`,
          selectedSpecies
        )
        .then((res) => {
          setListspecies((prevList) =>
            prevList.map((item) =>
              item.id === selectedSpecies.id ? selectedSpecies : item
            )
          );
          setPencilOpen(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete-species/${id}`);
      setListspecies(listspecies.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting species:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setSelectedSpecies({
        ...selectedSpecies,
        uploadimage: e.target.files[0],
      });
    }
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
            {currentItems.map((data, i) => (
              <tr key={data.id}>
                <td>{indexOfFirstItem + i + 1}</td>
                <td>{data.specificname}</td>
                <td>{data.scientificname}</td>
                <td>{data.commonname}</td>
                <td>{data.habitat}</td>
                <td>{data.population}</td>
                <td>{data.location}</td>
                <td>{data.conservationstatus}</td>
                <td>{data.threats}</td>
                <td>{data.conservationeffort}</td>
                <td>{data.speciescategories}</td>
                <td>{data.description}</td>
                <td>{data.date}</td>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style} className="modal-content">
          {selectedSpecies && (
            <>
              <Typography id="parent-modal-title" variant="h6" component="h2">
                {selectedSpecies.specificname} Details
              </Typography>
              <Typography id="parent-modal-description" sx={{ mt: 2 }}>
                Scientific Name: {selectedSpecies.scientificname}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Common Name: {selectedSpecies.commonname}
              </Typography>
              <div className="eye-view">
                <div className="images">
                  <img
                    src={selectedSpecies.uploadimage} // Image URL from the backend
                    className="modal-image"
                    alt="species"
                  />
                </div>
                <div className="specific-name1">
                  <h3>Specific Name:</h3>
                  <h4>{selectedSpecies.specificname}</h4>
                </div>
                <div className="scientifi-name1">
                  <h3>Scientific Name:</h3>
                  <h4>{selectedSpecies.scientificname}</h4>
                </div>
                <div className="common-name1">
                  <h3>Common Name:</h3>
                  <h4>{selectedSpecies.commonname}</h4>
                </div>
                <div className="habitat1">
                  <h3>Habitat:</h3>
                  <h4>{selectedSpecies.habitat}</h4>
                </div>
                <div className="species-category1">
                  <h3>Species Categories:</h3>
                  <h4>{selectedSpecies.speciescategories}</h4>
                </div>
                <div className="population1">
                  <h3>Population:</h3>
                  <h4>{selectedSpecies.population}</h4>
                </div>
                <div className="date1">
                  <h3>Date:</h3>
                  <h4>{selectedSpecies.date}</h4>
                </div>
                <div className="location1">
                  <h3>Location:</h3>
                  <h4>{selectedSpecies.location}</h4>
                </div>
                <div className="conservationstatus1">
                  <h3>Conservation Status:</h3>
                  <p>{selectedSpecies.conservationstatus}</p>
                </div>
                <div className="threats1">
                  <h3>Threats:</h3>
                  <p>{selectedSpecies.threats}</p>
                </div>
                <div className="conservation-effort1">
                  <h3>Conservation Effort:</h3>
                  <p>{selectedSpecies.conservationeffort}</p>
                </div>
                <div className="description1">
                  <h3>Description:</h3>
                  <p>{selectedSpecies.description}</p>
                </div>
              </div>
            </>
          )}
        </Box>
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
                            className="file"
                            style={{ display: "none" }} // Hide the file input
                          />
                          <BsPlusCircleDotted
                            className="edit-icon"
                            onClick={handleIconClick} // Trigger file input on click
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              bottom: "20px",
                              right: "48px",
                            }} // Position the icon over the image
                          />
                        </label>
                        {image ? (
                          <img
                            src={image}
                            alt="Uploaded Species"
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
                          <label htmlFor="edit-population">Population</label>
                          <input
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

                        <div className="edit-pencil-specific">
                          <label htmlFor="pencil-species-categories">
                            Species Categories
                          </label>
                          <select
                            id="species-categories"
                            className="edit-species-categories"
                            placeholder="Select species category"
                            value={selectedSpecies.speciescategories || ""}
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

                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-Habitat">Habitat</label>
                          <input
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

                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-threats">Threats</label>
                          <input
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

                        <div className="edit-pencil-specific">
                          <label htmlFor="edit-date"> Date</label>
                          <input
                            type="date"
                            className="edit-date"
                            value={selectedSpecies.date || ""}
                            onChange={(e) =>
                              setSelectedSpecies({
                                ...selectedSpecies,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="edit-pencil-location">
                      <label htmlFor="edit-location" className="location">
                        Location
                      </label>
                      <input
                        className="edit-location"
                        placeholder="Enter Location"
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
                    <div className="edit-pencil-status">
                      <label htmlFor="edit-status" className="status">
                        Conservation Status
                      </label>
                      <textarea
                        className="edit-conservation-status"
                        placeholder="Enter species conservation status"
                        rows="4"
                        value={selectedSpecies.conservationstatus || ""}
                        onChange={(e) =>
                          setSelectedSpecies({
                            ...selectedSpecies,
                            conservationstatus: e.target.value,
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
