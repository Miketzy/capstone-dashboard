import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageGallery.css"; // Make sure to import the CSS file for styling

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Fetch images from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/images")
      .then((response) => {
        console.log("Fetched images:", response.data); // Log the fetched images
        setImages(response.data); // Set the fetched images
        console.log(
          "Species Categories:",
          response.data.map((image) => image.speciescategory)
        ); // Print all speciescategories
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const filteredImages = images.filter((image) => {
    const searchTermLower = searchTerm.toLowerCase().trim(); // Clean up the search term
    return (
      (image.specificname &&
        image.specificname.toLowerCase().includes(searchTermLower)) ||
      (image.commonname &&
        image.commonname.toLowerCase().includes(searchTermLower)) ||
      (image.scientificname &&
        image.scientificname.toLowerCase().includes(searchTermLower)) ||
      (image.speciescategory &&
        image.speciescategory.toLowerCase().trim().includes(searchTermLower)) // Ensure the category is clean
    );
  });

  return (
    <div className="image-gallery-container">
      <div className="searchbar-gallery">
        <input
          type="text"
          className="search-input"
          placeholder="Search species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>
      <br />
      <div className="grid-container">
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <div key={index} className="grid-item">
              <img
                src={`http://localhost:8080/uploads/images/${image.uploadimage}`}
                alt={image.commonname}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/path/to/default-image.png"; // Set a fallback image
                }}
              />
              <p>{image.commonname}</p>
            </div>
          ))
        ) : (
          <p>No species found</p>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
