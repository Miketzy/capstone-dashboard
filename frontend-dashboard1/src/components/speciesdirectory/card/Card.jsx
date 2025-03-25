import React from "react";

function Card() {
  const categories = [
    { name: "All Species", count: 250, color: "bg-green-600" },
    { name: "Mammals", count: 45, color: "bg-red-500" },
    { name: "Fish", count: 80, color: "bg-blue-500" },
    { name: "Birds", count: 65, color: "bg-yellow-500" },
    { name: "Reptiles", count: 30, color: "bg-green-700" },
    { name: "Amphibians", count: 25, color: "bg-teal-500" },
    { name: "Insects", count: 120, color: "bg-orange-500" },
    { name: "Arachnids", count: 40, color: "bg-gray-700" },
    { name: "Mollusks", count: 15, color: "bg-purple-500" },
    { name: "Echinoderms", count: 10, color: "bg-indigo-500" },
    { name: "Cnidarians", count: 8, color: "bg-pink-500" },
    { name: "Worms", count: 20, color: "bg-amber-700" },
    { name: "Sponges", count: 5, color: "bg-cyan-500" },
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
            <p className="text-2xl font-bold mt-2">{category.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
