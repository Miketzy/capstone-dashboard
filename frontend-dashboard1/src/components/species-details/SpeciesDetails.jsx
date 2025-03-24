import React from "react";

const SpeciesDetails = ({ selectedSpecies }) => {
  if (!selectedSpecies) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
        {selectedSpecies.specificname} Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <img
            src={selectedSpecies.uploadimage}
            className="w-80 h-80 object-cover rounded-lg shadow-md border"
            alt="species"
          />
        </div>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold">Specific Name:</h3>
            <p>{selectedSpecies.specificname}</p>
          </div>
          <div>
            <h3 className="font-semibold">Scientific Name:</h3>
            <p>{selectedSpecies.scientificname}</p>
          </div>
          <div>
            <h3 className="font-semibold">Common Name:</h3>
            <p>{selectedSpecies.commonname}</p>
          </div>
          <div>
            <h3 className="font-semibold">Habitat:</h3>
            <p>{selectedSpecies.habitat}</p>
          </div>
          <div>
            <h3 className="font-semibold">Species Category:</h3>
            <p>{selectedSpecies.speciescategory}</p>
          </div>
          <div>
            <h3 className="font-semibold">Population:</h3>
            <p>{selectedSpecies.population}</p>
          </div>
          <div>
            <h3 className="font-semibold">Location:</h3>
            <p>{selectedSpecies.location}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">
          Conservation Status:
        </h3>
        <p className="text-gray-600">{selectedSpecies.conservationstatus}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Threats:</h3>
        <p className="text-gray-600">{selectedSpecies.threats}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Conservation Effort:
        </h3>
        <p className="text-gray-600">{selectedSpecies.conservationeffort}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
        <p className="text-gray-600">{selectedSpecies.description}</p>
      </div>
    </div>
  );
};

export default SpeciesDetails;
