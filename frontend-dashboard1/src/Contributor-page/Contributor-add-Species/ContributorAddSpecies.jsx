import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContributorAddSpecies.css";
import API_URL from "../../config";

function ContributorAddSpecies() {
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
  const [speciescategory, setSpeciescategory] = useState("");
  const [location, setLocation] = useState("");
  const [conservationstatus, setConservationstatus] = useState("");
  const [conservationeffort, setConservationeffort] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (setterImage, setterFile) => (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setterImage(URL.createObjectURL(selectedFile));
      setterFile(selectedFile);
    }
  };

  const upload = () => {
    if (!file) {
      setUploadStatus("Please select at least one image to upload");
      toast.error("Please select at least one image to upload", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const contributor_firstname = localStorage.getItem("contributor_firstname");
    const contributor_lastname = localStorage.getItem("contributor_lastname");
    const contributor_email = localStorage.getItem("contributor_email");

    if (!contributor_firstname || !contributor_lastname || !contributor_email) {
      toast.error("❌ Contributor info missing. Please log in again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
    formData.append("location", location);
    formData.append("speciescategory", speciescategory);
    formData.append("conservationstatus", conservationstatus);
    formData.append("conservationeffort", conservationeffort);
    formData.append("description", description);
    formData.append("file", file);
    if (file1) formData.append("file1", file1);
    if (file2) formData.append("file2", file2);
    if (file3) formData.append("file3", file3);
    formData.append("contributor_firstname", contributor_firstname);
    formData.append("contributor_lastname", contributor_lastname);
    formData.append("contributor_email", contributor_email);

    setLoading(true);

    axios
      .post(`${API_URL}/species/pending`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setUploadStatus("Species added successfully! Awaiting admin approval.");
        toast.success(
          "🦄 Species added successfully! Awaiting admin approval.",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
          }
        );
      })
      .catch((error) => {
        if (error.response) {
          setUploadStatus("Failed: " + error.response.data.message);
          toast.error("❌ " + error.response.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
          });
        } else if (error.request) {
          setUploadStatus("No response from server.");
          toast.error("❌ No response from server.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
          });
        } else {
          setUploadStatus("Error: " + error.message);
          toast.error("❌ " + error.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mx-auto p-6 min-h-screen">
      <ToastContainer />
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-4 sm:flex-col md:flex-row justify-center">
            {[
              {
                img: image,
                onChange: handleImageChange(setImage, setFile),
                id: "imginput1",
              },
              {
                img: image1,
                onChange: handleImageChange(setImage1, setFile1),
                id: "imginput2",
              },
              {
                img: image2,
                onChange: handleImageChange(setImage2, setFile2),
                id: "imginput3",
              },
              {
                img: image3,
                onChange: handleImageChange(setImage3, setFile3),
                id: "imginput4",
              },
            ].map(({ img, onChange, id }, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
              >
                <label
                  htmlFor={id}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="file"
                    id={id}
                    className="hidden"
                    onChange={onChange}
                  />
                  {img ? (
                    <img
                      src={img}
                      alt={`Uploaded Species ${idx + 1}`}
                      className="w-32 h-32 mx-auto my-4 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src="/images/animals.jpg"
                      alt="Default Species"
                      className="w-32 h-32 mx-auto my-4 object-cover rounded-md"
                    />
                  )}
                </label>
              </div>
            ))}
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
              className="block font-bold text-xl text-gray-700"
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
              htmlFor="habitat"
              className="block font-bold text-xl text-gray-700"
            >
              Habitat
            </label>
            <input
              type="text"
              id="habitat"
              placeholder="Enter habitat"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setHabitat(e.target.value)}
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
              type="number"
              id="population"
              placeholder="Enter population"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setPopulation(e.target.value)}
              min={0}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="threats"
              className="block font-bold text-xl text-gray-700"
            >
              Threats
            </label>
            <input
              type="text"
              id="threats"
              placeholder="Enter threats"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setThreats(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="species-category"
              className="block font-bold text-xl text-gray-700"
            >
              Category
            </label>
            <select
              id="species-category"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setSpeciescategory(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="mammal">Mammal</option>
              <option value="bird">Bird</option>
              <option value="reptile">Reptile</option>
              <option value="amphibian">Amphibian</option>
              <option value="fish">Fish</option>
              <option value="insect">Insect</option>
              <option value="plant">Plant</option>
            </select>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="location"
              className="block font-bold text-xl text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Enter location"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-span-1">
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
              defaultValue=""
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="endangered">Endangered</option>
              <option value="vulnerable">Vulnerable</option>
              <option value="near threatened">Near Threatened</option>
              <option value="least concern">Least Concern</option>
              <option value="data deficient">Data Deficient</option>
            </select>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="conservation-effort"
              className="block font-bold text-xl text-gray-700"
            >
              Conservation Effort
            </label>
            <input
              type="text"
              id="conservation-effort"
              placeholder="Enter conservation efforts"
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
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
              rows={5}
              placeholder="Enter description"
              className="w-full p-2 border border-gray-300 rounded-md mt-1 resize-none"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={upload}
            disabled={loading}
            className={`py-3 px-8 text-white font-semibold rounded-md transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Uploading..." : "Add Species"}
          </button>
        </div>

        {uploadStatus && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
}

export default ContributorAddSpecies;
