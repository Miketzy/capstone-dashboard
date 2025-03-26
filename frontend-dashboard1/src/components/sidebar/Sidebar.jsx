import React, { useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa";
import axios from "axios";
function Sidebar() {
  const [activeTab, setActiveTab] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveTab(path);
  };

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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="w-64 bg-green-900 shadow-lg fixed h-full mt-12 text-white">
      <div className="p-4">
        <ul className="space-y-2">
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg transition duration-300${
              activeTab === "/species-directory"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/species-directory")}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Species Directory
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 transition duration-300${
              activeTab === "/add-species"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/add-species")}
          >
            <IoMdAddCircle className="w-6 h-6 mr-2" />
            Add Species
          </li>
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 transition duration-300${
              activeTab === "/list-of-species"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/list-of-species")}
          >
            <FaListUl className="w-6 h-6 mr-2" />
            List of Species
          </li>
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 transition duration-300${
              activeTab === "/species-analytics"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/species-analytics")}
          >
            <MdAnalytics className="w-6 h-6 mr-2" />
            Analytics
          </li>
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 transition duration-300${
              activeTab === "/createQuestion"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/createQuestion")}
          >
            <FaFileCircleQuestion className="w-6 h-6 mr-2" />
            Create Question
          </li>
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 transition duration-300 ${
              activeTab === "/image-gallery"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/image-gallery")}
          >
            <GrGallery className="w-6 h-6 mr-2" />
            Gallery
          </li>
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg transition duration-300 ${
              activeTab === "/contributor-requests"
                ? "bg-green-700"
                : "hover:bg-green-800"
            }`}
            onClick={() => handleNavigation("/contributor-requests")}
          >
            <IoPeopleOutline className="w-6 h-6 mr-3" />
            Contributor Requests
            {requestCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {requestCount}
              </span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
