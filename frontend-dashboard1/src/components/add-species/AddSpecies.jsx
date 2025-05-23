import React, { useState } from "react";
import { BsPlusCircleDotted } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import API_URL from "../../config"; // Dalawang level up ✅

function AddSpecies() {
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [specificname, setSpecificname] = useState("");
  const [scientificname, setScientificname] = useState("");
  const [commonname, setCommonname] = useState("");
  const [habitat, setHabitat] = useState("");
  const [population, setPopulation] = useState("");
  const [threats, setThreats] = useState("");
  const [classification, setClassification] = useState("");
  const [speciescategory, setSpeciescategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [conservationstatus, setConservationstatus] = useState("");
  const [conservationeffort, setConservationeffort] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); // For user feedback
  const [type, setType] = useState(""); // ✅ Idinefine ang setType

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);
      setFile(selectedFile); // Set the file object
    }
  };
  const handleImageChange1 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage1(imageUrl);
      setFile1(selectedFile); // Set the file object
    }
  };

  const handleImageChange2 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage2(imageUrl);
      setFile2(selectedFile); // Set the file object
    }
  };

  const handleImageChange3 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage3(imageUrl);
      setFile3(selectedFile); // Set the file object
    }
  };

  const upload = () => {
    if (!file) {
      setUploadStatus("Please select an image to upload");
      toast.error("Please select an image to upload", {
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
      return;
    }

    const formData = new FormData();
    formData.append("specificname", specificname);
    formData.append("scientificname", scientificname);
    formData.append("commonname", commonname);
    formData.append("habitat", habitat);
    formData.append("population", population);
    formData.append("threats", threats);
    formData.append("speciescategory", speciescategory);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("conservationstatus", conservationstatus);
    formData.append("conservationeffort", conservationeffort);
    formData.append("description", description);
    formData.append("classification", classification);
    formData.append("file", file); // Main image
    formData.append("file", file1); // Additional image 1
    formData.append("file", file2); // Additional image 2
    formData.append("file", file3); // Additional image 3

    axios
      .post(`${API_URL}/create`, formData)
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
          transition: Bounce,
        });
        console.log(error);
      });
  };

  return (
    <div className="mx-auto p-6 mb-[80px]">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-1 sm:col-span-2">
            {/* Responsive layout: flex on medium and up, stacked on small screens */}
            <div className="flex flex-wrap gap-4 sm:flex-col md:flex-row">
              {/* Image Upload 1 */}
              <div className="relative">
                <label
                  htmlFor="imginput1"
                  className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md"
                >
                  <input
                    type="file"
                    id="imginput1"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {image ? (
                    <img
                      src={image}
                      alt="Uploaded Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  ) : (
                    <img
                      src="/images/animals.jpg"
                      alt="Default Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  )}
                </label>
              </div>

              {/* Image Upload 2 */}
              <div className="relative">
                <label
                  htmlFor="imginput2"
                  className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md"
                >
                  <input
                    type="file"
                    id="imginput2"
                    className="hidden"
                    onChange={handleImageChange1}
                  />
                  {image1 ? (
                    <img
                      src={image1}
                      alt="Uploaded Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  ) : (
                    <img
                      src="/images/animals.jpg"
                      alt="Default Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  )}
                </label>
              </div>

              {/* Image Upload 3 */}
              <div className="relative">
                <label
                  htmlFor="imginput3"
                  className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md"
                >
                  <input
                    type="file"
                    id="imginput3"
                    className="hidden"
                    onChange={handleImageChange2}
                  />
                  {image2 ? (
                    <img
                      src={image2}
                      alt="Uploaded Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  ) : (
                    <img
                      src="/images/animals.jpg"
                      alt="Default Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  )}
                </label>
              </div>

              {/* Image Upload 4 */}
              <div className="relative">
                <label
                  htmlFor="imginput4"
                  className="cursor-pointer w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md"
                >
                  <input
                    type="file"
                    id="imginput4"
                    className="hidden"
                    onChange={handleImageChange3}
                  />
                  {image3 ? (
                    <img
                      src={image3}
                      alt="Uploaded Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  ) : (
                    <img
                      src="/images/animals.jpg"
                      alt="Default Species"
                      className="w-32 h-32 mx-auto my-4"
                    />
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="specific-name"
              className="block font-bold text-xl text-gray-700"
            >
              Specific Name
            </label>
            <input
              type="text"
              id="specific-name"
              placeholder="Enter specific name"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setSpecificname(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="scientific-name"
              className="block font-bold text-xl text-gray-700 italic"
            >
              Scientific Name
            </label>
            <input
              type="text"
              id="scientific-name"
              placeholder="Enter scientific name"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setScientificname(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="common-name"
              className="block font-bold text-xl text-gray-700"
            >
              Common Name
            </label>
            <input
              type="text"
              id="common-name"
              placeholder="Enter common name"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setCommonname(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="population"
              className="block font-bold text-xl text-gray-700"
            >
              Population
            </label>
            <input
              type="text"
              id="population"
              placeholder="Enter species population"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setPopulation(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex space-x-6">
            <div className="w-full">
              <label
                htmlFor="species-categories"
                className="block font-bold text-xl text-gray-700"
              >
                Category
              </label>
              <select
                id="species-categories"
                className="w-full p-2 border border-gray-300 rounded-md mt-1 max-h-20 overflow-y-auto "
                onChange={(e) => setSpeciescategory(e.target.value)}
              >
                <option value="">Select classification</option>
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

            <div className="w-full">
              <label
                htmlFor="conservation-status"
                className="block font-bold text-xl text-gray-700"
              >
                Conservation Status
              </label>
              <select
                id="conservation-status"
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
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

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="type"
              className="block font-bold text-xl text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setClassification(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="vertebrates">Vertebrates</option>
              <option value="invertebrates">Invertebrates</option>
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="location"
              className="block font-bold text-xl text-gray-700"
            >
              Mapping
            </label>
            <input
              type="text"
              id="location"
              placeholder="Enter location"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="habitat"
              className="block font-bold text-xl text-gray-700"
            >
              Habitat
            </label>
            <textarea
              id="habitat"
              placeholder="Enter habitat"
              className="w-full h-[32vh] p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setHabitat(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="threats"
              className="block font-bold text-xl text-gray-700"
            >
              Threats
            </label>
            <textarea
              id="threats"
              placeholder="Enter threats"
              className="w-full h-[32vh] p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setThreats(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="conservation-effort"
              className="block font-bold text-xl text-gray-700"
            >
              Conservation Effort
            </label>
            <textarea
              id="conservation-effort"
              placeholder="Enter conservation effort"
              className="w-full h-[32vh] p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setConservationeffort(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label
              htmlFor="description"
              className="block font-bold text-xl text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              className="w-full h-[32vh] p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 mt-6 flex justify-center">
            <button
              onClick={upload}
              className="w-full sm:w-48 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
              <BsPlusCircleDotted className="inline-block mr-2" />
              Add Species
            </button>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AddSpecies;
