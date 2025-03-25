import React, { useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { IoMdAddCircle } from "react-icons/io";
import { MdAnalytics } from "react-icons/md";
import { GrGallery } from "react-icons/gr";
import { IoPeopleOutline } from "react-icons/io5";
import { FaFileCircleQuestion } from "react-icons/fa6";
import axios from "axios";
import { IoCloseSharp, IoMenu } from "react-icons/io5";

function Sidebar({ isOpen, toggleSidebar }) {
  const [activeTab, setActiveTab] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await axios.get(
          "https://bioexplorer-backend.onrender.com/pending-request-count"
        );
        setRequestCount(response.data.count);
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };
    fetchRequestCount();
  }, []);

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed h-full bg-gray-800 text-white z-50 w-64 transition-all duration-300 ${
          isOpen ? "left-0" : "-left-64"
        } md:left-0`}
      >
        {/* Close Button for Mobile */}
        <div className="md:hidden flex justify-end p-3">
          <IoCloseSharp
            className="text-white w-6 h-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <ul className="p-4 space-y-2">
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <RxDashboard className="w-6 h-6 mr-2" />
            Species Directory
          </li>
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <IoMdAddCircle className="w-6 h-6 mr-2" />
            Add Species
          </li>
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <MdAnalytics className="w-6 h-6 mr-2" />
            Analytics
          </li>
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <GrGallery className="w-6 h-6 mr-2" />
            Gallery
          </li>
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <IoPeopleOutline className="w-6 h-6 mr-2" />
            Contributor Request
            {requestCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {requestCount}
              </span>
            )}
          </li>
          <li className="flex items-center px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700">
            <FaFileCircleQuestion className="w-6 h-6 mr-2" />
            Create Question
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
