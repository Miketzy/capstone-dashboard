<div className="container py-8 ml-[14rem]">
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

  {/* Grid Layout for Cards */}
  <div className="flex flex-col gap-y-4">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {/* Mammals */}
      {activeTab === "vertebrates" && (
        <div
          className="p-4 rounded-lg shadow-md bg-red-500 text-white text-center hover:scale-105 transition-all cursor-pointer w-[20%]"
          onClick={() =>
            openModal({
              name: "Mammals",
              description:
                "Warm-blooded vertebrates with hair or fur and live birth.",
            })
          }
        >
          <div className="text-3xl">
            <FaPaw />
          </div>
          <span className="text-lg font-semibold mt-1">Mammals</span>
          <p className="text-xl font-bold">45</p>
        </div>
      )}

      {/* Fish */}
      {activeTab === "vertebrates" && (
        <div
          className="p-4 rounded-lg shadow-md bg-blue-500 text-white text-center hover:scale-105 transition-all cursor-pointer w-[20%]"
          onClick={() =>
            openModal({
              name: "Fish",
              description:
                "Cold-blooded animals that live in water and breathe through gills.",
            })
          }
        >
          <div className="text-3xl">
            <FaFish />
          </div>
          <span className="text-lg font-semibold mt-1">Fish</span>
          <p className="text-xl font-bold">80</p>
        </div>
      )}

      {/* Birds */}
      {activeTab === "vertebrates" && (
        <div
          className="p-4 rounded-lg shadow-md bg-yellow-500 text-white text-center hover:scale-105 transition-all cursor-pointer w-[20%]"
          onClick={() =>
            openModal({
              name: "Birds",
              description: "Warm-blooded vertebrates with feathers and wings.",
            })
          }
        >
          <div className="text-3xl">
            <FaFeather />
          </div>
          <span className="text-lg font-semibold mt-1">Birds</span>
          <p className="text-xl font-bold">65</p>
        </div>
      )}

      {/* Reptiles */}
      {activeTab === "vertebrates" && (
        <div
          className="p-4 rounded-lg shadow-md bg-green-700 text-white text-center hover:scale-105 transition-all cursor-pointer w-[20%]"
          onClick={() =>
            openModal({
              name: "Reptiles",
              description:
                "Cold-blooded vertebrates with scales, most lay eggs.",
            })
          }
        >
          <div className="text-3xl">
            <FaFrog />
          </div>
          <span className="text-lg font-semibold mt-1">Reptiles</span>
          <p className="text-xl font-bold">30</p>
        </div>
      )}
    </div>
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
</div>;
