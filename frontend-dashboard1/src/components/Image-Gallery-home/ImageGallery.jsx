import React, { useState, useEffect } from "react";
import axios from "axios";

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch images from the backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/images")
      .then((response) => {
        const sortedImages = response.data.sort((a, b) =>
          a.commonname.localeCompare(b.commonname)
        );
        setImages(sortedImages);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const filteredImages = images.filter((image) => {
    if (!image) return false;

    const searchTermLower = searchTerm.toLowerCase().trim();

    return (
      image?.specificname?.toLowerCase().includes(searchTermLower) ||
      image?.commonname?.toLowerCase().includes(searchTermLower) ||
      image?.scientificname?.toLowerCase().includes(searchTermLower) ||
      image?.speciescategory?.toLowerCase().includes(searchTermLower) ||
      image?.classification?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="min-h-screen  flex flex-col items-center px-4 py-6">
      {/* Search Bar */}
      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Search species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {filteredImages.length > 0 ? (
          filteredImages.map((image, index) => (
            <div
              key={index}
              className="bg-white relative p-2 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
            >
              <img
                src={`http://localhost:8080/uploads/images/${image.uploadimage}`}
                alt={image.commonname}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/path/to/default-image.png";
                }}
              />
              {/* Centered Text */}
              <p className="text-center mt-2 font-medium text-gray-700 ml-2">
                {image.commonname}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No species found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
