import React, { useState } from "react";
import "./addspecies.css";
import { BsPlusCircleDotted } from "react-icons/bs";
import axios from "axios";

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
        window.alert("Species added successfully!"); // Alert message for successful submission
        console.log(response);
      })
      .catch((error) => {
        setUploadStatus("Failed to add species. Please try again.");
        window.alert("Failed to add species. Please try again."); // Alert message for submission failure
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
                width="200"
                height="200"
              />
            ) : (
              <img
                src="/images/unknown-person-icon-Image-from_20220304.png"
                alt="Default Species"
                width="200"
                height="200"
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
            <label htmlFor="species-categories">Species Categories</label>
            <select
              id="species-categories"
              className="species-categories"
              placeholder="Select species category"
              onChange={(e) => setSpeciescategory(e.target.value)}
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

          <div className="input-box8">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              className="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add9">
          <div className="input-box9">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="location"
              placeholder="Enter species location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="column-add10">
          <div className="input-box10">
            <label htmlFor="conservation-status" className="textarea-label">
              Conservation Status
            </label>
            <textarea
              className="conservation-status"
              placeholder="Enter species conservation status"
              rows="4"
              onChange={(e) => setConservationstatus(e.target.value)}
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

        <br />
        <br />
      </div>
    </div>
  );
}

export default AddSpecies;
