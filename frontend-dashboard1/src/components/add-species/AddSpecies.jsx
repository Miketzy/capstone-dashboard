import React, { useState } from "react";
import "./addspecies.css";
import { BsPlusCircleDotted } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify

function AddSpecies() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // Corrected file state initialization
  const [specificname, setSpecificname] = useState("");
  const [scientificname, setScientificname] = useState("");
  const [commonname, setCommonname] = useState("");
  const [habitat, setHabitat] = useState("");
  const [population, setPopulation] = useState("");
  const [threats, setThreats] = useState("");
  const [speciescategory, setSpeciescategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [conservationstatus, setConservationstatus] = useState("");
  const [conservationeffort, setConservationeffort] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); // For user feedback

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);
      setFile(selectedFile); // Set the file object
    }
  };

  const upload = () => {
    if (!file) {
      setUploadStatus("Please select an image to upload");
      window.alert("Please select an image to upload"); // Alert message for missing file
      return;
    }

    const formData = new FormData();
    formData.append("specificname", specificname);
    formData.append("scientificname", scientificname);
    formData.append("commonname", commonname);
    formData.append("habitat", habitat);
    formData.append("population", population);
    formData.append("threats", threats);
    formData.append("speciescategory", speciescategory); // Correct field name
    formData.append("date", date);
    formData.append("location", location);
    formData.append("conservationstatus", conservationstatus);
    formData.append("conservationeffort", conservationeffort);
    formData.append("description", description);
    formData.append("file", file);

    axios
      .post("http://localhost:8080/create", formData)
      .then((response) => {
        setUploadStatus("Species added successfully!");
        toast.success("🦄 Species added successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          // Add transition effect
        });
        console.log(response);
      })
      .catch((error) => {
        setUploadStatus("Failed to add species. Please try again.");
        toast.error("❌ Failed to add species. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce, // Add transition effect
        });
        console.log(error);
      });
  };

  return (
    <div className="container-body">
      <div className="form addspecies">
        <div className="column-add">
          <div className="card imgholder">
            <label htmlFor="imginput" className="upload">
              <input
                type="file"
                id="imginput"
                className="file"
                onChange={handleImageChange}
              />
              <BsPlusCircleDotted className="icon" />
            </label>
            {image ? (
              <img
                src={image}
                alt="Uploaded Species"
                width="150"
                height="150"
              />
            ) : (
              <img
                src="/images/animals.jpg"
                alt="Default Species"
                width="150"
                height="150"
              />
            )}
          </div>

          <div className="input-box1">
            <label htmlFor="specific-name">Specific Name</label>
            <input
              type="text"
              id="specific-name"
              placeholder="Enter specific name"
              onChange={(e) => setSpecificname(e.target.value)}
            />
          </div>

          <div className="input-box1">
            <label htmlFor="scientific-name">Scientific Name</label>
            <input
              type="text"
              id="scientific-name"
              placeholder="Enter scientific name"
              onChange={(e) => setScientificname(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add1">
          <div className="input-box2">
            <label htmlFor="common-name">Common Name</label>
            <input
              type="text"
              className="common-name"
              placeholder="Enter common name"
              onChange={(e) => setCommonname(e.target.value)}
            />
          </div>
          <div className="input-box3">
            <label htmlFor="habitat">Habitat</label>
            <input
              type="text"
              className="habitat"
              placeholder="Enter species habitat"
              onChange={(e) => setHabitat(e.target.value)}
            />
          </div>
        </div>
        <div className="column-add2">
          <div className="input-box4">
            <label htmlFor="population">Population</label>
            <input
              type="text"
              className="population"
              placeholder="Enter species population"
              onChange={(e) => setPopulation(e.target.value)}
            />
          </div>
          <div className="input-box5">
            <label htmlFor="threats">Threats</label>
            <input
              type="text"
              className="threats"
              placeholder="Enter species threats"
              onChange={(e) => setThreats(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add3">
          <div className="input-box7">
            <label htmlFor="species-categories">Classification</label>
            <select
              id="species-categories"
              className="species-categories"
              placeholder="Select species category"
              onChange={(e) => setSpeciescategory(e.target.value)}
            >
              <option value="">Select classification</option>
              <option value="mammals">Mammals</option>
              <option value="birds">Birds</option>
              <option value="reptiles">Reptiles</option>
              <option value="amphibians">Amphibians</option>
              <option value="invertebrates">Invertebrates</option>
              <option value="fish">Fish</option>
            </select>
          </div>

          <div className="input-box8">
            <label htmlFor="conservation-status">Conservation Status</label>
            <select
              id="conservation-status"
              className="conservation-status"
              onChange={(e) => setConservationstatus(e.target.value)}
            >
              <option value="">Select a Conservation Status</option>
              <option value="critically-endangered">
                Critically-endangered
              </option>
              <option value="endangered">Endangered</option>
              <option value="vulnerable">Vulnerable</option>
              <option value="near-threatened">Near-threatened</option>
              <option value="least-concern">Least-concern</option>
            </select>
          </div>
        </div>

        <div className="column-add9">
          <div className="input-box9">
            <label htmlFor="location">Map</label>
            <input
              type="text"
              className="location"
              placeholder="Mapping"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add11">
          <div className="input-box11">
            <label htmlFor="conservation-effort" className="effort-label">
              Conservation Effort
            </label>
            <textarea
              className="conservation-effort"
              placeholder="Enter species conservation effort"
              rows="4"
              onChange={(e) => setConservationeffort(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add12">
          <div className="input-box12">
            <label htmlFor="description" className="description-label">
              Description
            </label>
            <textarea
              className="description"
              placeholder="Enter species description"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="input-box13">
          <button className="submit" onClick={upload}>
            Submit
          </button>
          {uploadStatus && <p>{uploadStatus}</p>}{" "}
          {/* Display feedback message */}
        </div>
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
          transition={Bounce}
          toastClassName="custom-toast" // Use the custom class
        />
        <br />
        <br />
      </div>
    </div>
  );
}

export default AddSpecies;
