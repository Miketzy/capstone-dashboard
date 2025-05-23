import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config"; // Dalawang level up ✅

// Custom hook para sa debouncing input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // debounce with 500ms delay

  useEffect(() => {
    // Fetch images mula sa backend
    axios
      .get(`${API_URL}/api/images`)
      .then((response) => {
        console.log("Fetched Images:", response.data); // Debugging
        setImages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        alert("Unable to fetch images. Please check the server status.");
        setLoading(false);
      });
  }, []);

  // Filter images based on the search term
  const filteredImages = images.filter((image) => {
    if (!image) return false;

    const searchTermLower = debouncedSearchTerm.toLowerCase().trim();

    return (
      image?.specificname?.toLowerCase().includes(searchTermLower) ||
      image?.commonname?.toLowerCase().includes(searchTermLower) ||
      image?.scientificname?.toLowerCase().includes(searchTermLower) ||
      image?.speciescategory?.toLowerCase().includes(searchTermLower) ||
      image?.classification?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div>
      <br />
      <br />
      <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
        <h1 className="text-2xl text-white">Gallery</h1>
      </div>
      <br />
      <div className="min-h-screen flex flex-col items-center px-4 py-6">
        {/* Search Input */}
        <div className="w-full max-w-2xl mb-6">
          <input
            type="text"
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading images...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
            {/* Display Filtered Images */}
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-white relative p-2 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  {image.uploadimage ? (
                    <img
                      src={image.uploadimage} // Cloudinary URL directly
                      alt={image.commonname || "No image available"}
                      className="w-full h-40 rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image"; // Default image if broken
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
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
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
