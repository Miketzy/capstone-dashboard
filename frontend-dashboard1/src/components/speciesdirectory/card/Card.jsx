import React, { useState } from "react";
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

function Card() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("vertebrates");

  const vertebrates = [
    {
      name: "Mammals",
      count: 45,
      color: "bg-red-500",
      icon: <FaPaw />,
      description: "Warm-blooded vertebrates with hair or fur and live birth.",
    },
    {
      name: "Fish",
      count: 80,
      color: "bg-blue-500",
      icon: <FaFish />,
      description:
        "Cold-blooded animals that live in water and breathe through gills.",
    },
    {
      name: "Birds",
      count: 65,
      color: "bg-yellow-500",
      icon: <FaFeather />,
      description: "Warm-blooded vertebrates with feathers and wings.",
    },
    {
      name: "Reptiles",
      count: 30,
      color: "bg-green-700",
      icon: <FaFrog />,
      description: "Cold-blooded vertebrates with scales, most lay eggs.",
    },
    {
      name: "Amphibians",
      count: 25,
      color: "bg-teal-500",
      icon: <FaWater />,
      description: "Cold-blooded vertebrates that live in water and on land.",
    },
  ];

  const invertebrates = [
    {
      name: "Insects",
      count: 120,
      color: "bg-orange-500",
      icon: <FaBug />,
      description:
        "Six-legged invertebrates, the most diverse group of animals.",
    },
    {
      name: "Arachnids",
      count: 40,
      color: "bg-gray-700",
      icon: <FaSpider />,
      description:
        "Eight-legged invertebrates including spiders and scorpions.",
    },
    {
      name: "Mollusks",
      count: 15,
      color: "bg-purple-500",
      icon: <FaSkullCrossbones />,
      description:
        "Soft-bodied animals, many have shells like snails and clams.",
    },
    {
      name: "Echinoderms",
      count: 10,
      color: "bg-indigo-500",
      icon: <FaLeaf />,
      description:
        "Marine animals like starfish and sea urchins with radial symmetry.",
    },
    {
      name: "Cnidarians",
      count: 8,
      color: "bg-pink-500",
      icon: <FaVirus />,
      description:
        "Marine animals with stinging cells like jellyfish and corals.",
    },
    {
      name: "Worms",
      count: 20,
      color: "bg-amber-700",
      icon: <FaBone />,
      description:
        "Invertebrates with elongated bodies, living in soil and water.",
    },
    {
      name: "Sponges",
      count: 5,
      color: "bg-cyan-500",
      icon: <FaShapes />,
      description: "Simple aquatic animals with porous bodies.",
    },
  ];

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 ml-[14rem]">
      {/* Buttons for Vertebrates and Invertebrates */}
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

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {(activeTab === "vertebrates" ? vertebrates : invertebrates).map(
          (category, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl shadow-lg ${category.color} text-white text-center hover:scale-105 transition-all cursor-pointer w-full h-40`}
              onClick={() => openModal(category)}
            >
              <div className="text-3xl">{category.icon}</div>
              <span className="text-xl font-semibold mt-2 block">
                {category.name}
              </span>
              <p className="text-2xl font-bold mt-1">{category.count}</p>
            </div>
          )
        )}
      </div>

      {/* Modal for Species Explanation */}
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
    </div>
  );
}

export default Card;
