import React from "react";

function Card() {
  const categories = [
    { name: "All Species", color: "bg-green-600" },
    { name: "Mammals", color: "bg-red-500" },
    { name: "Fish", color: "bg-blue-500" },
    { name: "Birds", color: "bg-yellow-500" },
    { name: "Reptiles", color: "bg-green-700" },
    { name: "Amphibians", color: "bg-teal-500" },
    { name: "Insects", color: "bg-orange-500" },
    { name: "Arachnids", color: "bg-gray-700" },
    { name: "Mollusks", color: "bg-purple-500" },
    { name: "Echinoderms", color: "bg-indigo-500" },
    { name: "Cnidarians", color: "bg-pink-500" },
    { name: "Worms", color: "bg-brown-500" },
    { name: "Sponges", color: "bg-cyan-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
        Species Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg ${category.color} text-white flex flex-col items-center justify-center hover:scale-105 transition-all`}
          >
            <span className="text-xl font-semibold">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
