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

  const categories = [
    {
      name: "All Species",
      count: 250,
      color: "bg-green-600",
      icon: <FaPaw size={30} />,
      description: "All species across different classifications.",
    },
    {
      name: "Mammals",
      count: 45,
      color: "bg-red-500",
      icon: <FaPaw size={30} />,
      description: "Warm-blooded vertebrates with hair or fur and live birth.",
    },
    {
      name: "Fish",
      count: 80,
      color: "bg-blue-500",
      icon: <FaFish size={30} />,
      description:
        "Cold-blooded animals that live in water and breathe through gills.",
    },
    {
      name: "Birds",
      count: 65,
      color: "bg-yellow-500",
      icon: <FaFeather size={30} />,
      description: "Warm-blooded vertebrates with feathers and wings.",
    },
    {
      name: "Reptiles",
      count: 30,
      color: "bg-green-700",
      icon: <FaFrog size={30} />,
      description: "Cold-blooded vertebrates with scales, most lay eggs.",
    },
    {
      name: "Insects",
      count: 120,
      color: "bg-orange-500",
      icon: <FaBug size={30} />,
      description:
        "Six-legged invertebrates, the most diverse group of animals.",
    },
    {
      name: "Arachnids",
      count: 40,
      color: "bg-gray-700",
      icon: <FaSpider size={30} />,
      description:
        "Eight-legged invertebrates including spiders and scorpions.",
    },
    {
      name: "Mollusks",
      count: 15,
      color: "bg-purple-500",
      icon: <FaSkullCrossbones size={30} />,
      description:
        "Soft-bodied animals, many have shells like snails and clams.",
    },
    {
      name: "Worms",
      count: 20,
      color: "bg-amber-700",
      icon: <FaBone size={30} />,
      description:
        "Invertebrates with elongated bodies, living in soil and water.",
    },
  ];

  const openModal = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
        Species Categories
      </h2>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-center">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`w-40 h-40 p-4 flex flex-col items-center justify-center rounded-2xl shadow-lg ${category.color} text-white text-center hover:scale-105 transition-all cursor-pointer`}
            onClick={() => openModal(category)}
          >
            <div className="text-2xl">{category.icon}</div>
            <span className="text-lg font-semibold mt-2">{category.name}</span>
            <p className="text-xl font-bold">{category.count}</p>
          </div>
        ))}
      </div>

      {/* Modal for Species Explanation */}
      {isOpen && selectedCategory && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
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
