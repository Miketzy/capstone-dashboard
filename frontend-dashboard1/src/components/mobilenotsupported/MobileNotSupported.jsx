import React from "react";

const MobileNotSupported = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-red-600">
          Page Not Available on Mobile Devices
        </h2>
        <p className="mt-2 text-gray-600">
          Please use a desktop or laptop to access this system.
        </p>
      </div>
    </div>
  );
};

export default MobileNotSupported;
