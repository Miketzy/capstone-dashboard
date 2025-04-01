import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPaw,
  FaFish,
  FaFeather,
  FaFrog,
  FaBug,
  FaSpider,
  FaSkullCrossbones,
  FaLeaf,
  FaWater,
  FaVirus,
  FaBone,
  FaShapes,
} from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import API_URL from "../../../config"; // Dalawang level up ✅

function Card() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("vertebrates");
  const [isSeeAllOpen, setIsSeeAllOpen] = useState(false);

  //count of species vertebrates
  const [mammalsCount, setMammalsCount] = useState(0);
  const [fishCount, setFishCount] = useState(0);
  const [birdsCount, setBirdsCount] = useState(0);
  const [reptilesCount, setReptilesCount] = useState(0);
  const [amphibiansCount, setAmphibiansCount] = useState(0);

  //count of species Invertebrates countinsects
  const [insectsCount, setInsectsCount] = useState(0);
  const [arachnidsCount, setArachnidsCount] = useState(0);
  const [mollusksCount, setMollusksCount] = useState(0);
  const [echinodermsCount, setEchinodermsCount] = useState(0);
  const [cnidariansCount, setCnidariansCount] = useState(0);
  const [wormsCount, setWormsCount] = useState(0);
  const [spongesCount, setSpongesCount] = useState(0);

  //get image

  //Endpoint of species vertebrates
  useEffect(() => {
    axios
      .get(`${API_URL}/countmammals`)
      .then((response) => {
        setMammalsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countfish`)
      .then((response) => {
        setFishCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countbirds`)
      .then((response) => {
        setBirdsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countreptiles`)
      .then((response) => {
        setReptilesCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countamphibians`)
      .then((response) => {
        setAmphibiansCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  //countsponges

  //Endpoint of species Invertebrates
  useEffect(() => {
    axios
      .get(`${API_URL}/countinsects`)
      .then((response) => {
        setInsectsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countarachnids`)
      .then((response) => {
        setArachnidsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countmollusks`)
      .then((response) => {
        setMollusksCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countechinoderms`)
      .then((response) => {
        setEchinodermsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countcnidarians`)
      .then((response) => {
        setCnidariansCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countworms`)
      .then((response) => {
        setWormsCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/countsponges`)
      .then((response) => {
        setSpongesCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching mammal count:", error);
      });
  }, []);

  const vertebrates = [
    {
      name: "Mammals",
      count: mammalsCount,
      color: "bg-red-500",
      icon: <FaPaw />,
      description: "Warm-blooded vertebrates with hair or fur and live birth.",
    },
    {
      name: "Fish",
      count: fishCount,
      color: "bg-blue-500",
      icon: <FaFish />,
      description:
        "Cold-blooded animals that live in water and breathe through gills.",
    },
    {
      name: "Birds",
      count: birdsCount,
      color: "bg-yellow-500",
      icon: <FaFeather />,
      description: "Warm-blooded vertebrates with feathers and wings.",
    },
    {
      name: "Reptiles",
      count: reptilesCount,
      color: "bg-green-700",
      icon: <FaFrog />,
      description: "Cold-blooded vertebrates with scales, most lay eggs.",
    },
    {
      name: "Amphibians",
      count: amphibiansCount,
      color: "bg-teal-500",
      icon: <FaWater />,
      description: "Cold-blooded vertebrates that live in water and on land.",
    },
  ];

  const invertebrates = [
    {
      name: "Insects",
      count: insectsCount,
      color: "bg-orange-500",
      icon: <FaBug />,
      description:
        "Six-legged invertebrates, the most diverse group of animals.",
    },
    {
      name: "Arachnids",
      count: arachnidsCount,
      color: "bg-gray-700",
      icon: <FaSpider />,
      description:
        "Eight-legged invertebrates including spiders and scorpions.",
    },
    {
      name: "Mollusks",
      count: mollusksCount,
      color: "bg-purple-500",
      icon: <FaSkullCrossbones />,
      description:
        "Soft-bodied animals, many have shells like snails and clams.",
    },
    {
      name: "Echinoderms",
      count: echinodermsCount,
      color: "bg-indigo-500",
      icon: <FaLeaf />,
      description:
        "Marine animals like starfish and sea urchins with radial symmetry.",
    },
    {
      name: "Cnidarians",
      count: cnidariansCount,
      color: "bg-pink-500",
      icon: <FaVirus />,
      description:
        "Marine animals with stinging cells like jellyfish and corals.",
    },
    {
      name: "Worms",
      count: wormsCount,
      color: "bg-amber-700",
      icon: <FaBone />,
      description:
        "Invertebrates with elongated bodies, living in soil and water.",
    },
    {
      name: "Sponges",
      count: spongesCount,
      color: "bg-cyan-500",
      icon: <FaShapes />,
      description: "Simple aquatic animals with porous bodies.",
    },
  ];

  const handleSeeAll = (category) => {
    setSelectedCategory(category.name); // Ensure it's a string
    setIsSeeAllOpen(true);
  };

  const [speciesImages, setSpeciesImages] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`${API_URL}/api/images/${selectedCategory}`) // Ensure selectedCategory is a string
        .then((response) => {
          setSpeciesImages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }
  }, [selectedCategory]); // Runs when selectedCategory changes

  const openSeeAll = (category) => {
    setSelectedCategory(category);
    setIsSeeAllOpen(true);
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  return (
    <div>
      <br />
      <br />
      <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
        <h1 className="text-2xl text-white">Dashboard</h1>
      </div>

      <br />
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 mx-2 rounded-lg text-white ${
            activeTab === "vertebrates" ? "bg-green-600" : "bg-gray-400"
          }`}
          onClick={() => setActiveTab("vertebrates")}
        >
          Vertebrates
        </button>
        <button
          className={`px-6 py-2 mx-2 rounded-lg text-white ${
            activeTab === "invertebrates" ? "bg-green-600" : "bg-gray-400"
          }`}
          onClick={() => setActiveTab("invertebrates")}
        >
          Invertebrates
        </button>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(activeTab === "vertebrates" ? vertebrates : invertebrates).map(
          (category, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-md ${category.color} text-white text-center hover:scale-105 transition-all`}
            >
              <div className="text-3xl">{category.icon}</div>
              <span className="text-lg font-semibold mt-1">
                {category.name}
              </span>
              <p className="text-xl font-bold">{category.count}</p>
              <button
                className="mt-2 bg-white text-black px-2 py-1 rounded cursor-pointer"
                onClick={() => openModal(category)}
              >
                See Details
              </button>
              <button
                className="mt-2 bg-black text-white px-2 py-1 rounded ml-2 cursor-pointer"
                onClick={() => handleSeeAll(category)}
              >
                See All
              </button>
            </div>
          )
        )}
      </div>
      {isOpen && selectedCategory && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory.name}
            </h3>
            <p className="text-gray-600 mt-2">{selectedCategory.description}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}

      {isSeeAllOpen && selectedCategory && (
        <Dialog
          open={isSeeAllOpen}
          onClose={() => setIsSeeAllOpen(false)}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory} Images
            </h3>
            <div className="grid grid-cols-3 gap-2 mt-4 max-h-60 overflow-y-auto">
              {speciesImages.map((image, index) => (
                <img
                  key={index}
                  src={image.image_filename} // ✅ Uses full Cloudinary URL correctly
                  alt={selectedCategory}
                  className="w-24 h-24 rounded"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")} // 🔄 Optional: Prevent broken images
                />
              ))}
            </div>
            <button
              onClick={() => setIsSeeAllOpen(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default Card;
