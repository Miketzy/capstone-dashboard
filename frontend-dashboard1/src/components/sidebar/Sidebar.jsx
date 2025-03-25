import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { MdEditCalendar } from "react-icons/md";
import { MdCategory, MdAnalytics } from "react-icons/md";
import { GrStatusGood, GrGallery } from "react-icons/gr";
import { IoCloseSharp, IoPeopleOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFileCircleQuestion } from "react-icons/fa6";
import axios from "axios";
//Side bar
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
    <div className="w-64 bg-gray-800 fixed h-full mt-12 text-white">
      <div className="p-4">
        <ul className="space-y-2">
          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg ${
              activeTab === "/species-directory" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/species-directory")}
          >
            <RxDashboard className="w-6 h-6 mr-2" />
            Species Directory
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 ${
              activeTab === "/add-species" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/add-species")}
          >
            <IoMdAddCircle className="w-6 h-6 mr-2" />
            Add Species
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 ${
              activeTab === "/analytics" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/analytics")}
          >
            <MdAnalytics className="w-6 h-6 mr-2" />
            Analytics
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 ${
              activeTab === "/gallery" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/gallery")}
          >
            <GrGallery className="w-6 h-6 mr-2" />
            Gallery
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5 ${
              activeTab === "/contributor-request" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/contributor-request")}
          >
            <IoPeopleOutline className="w-6 h-6 mr-2" />
            Contributor Request
            {requestCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {requestCount}
              </span>
            )}
          </li>

          <li
            className={`flex items-center px-4 py-2 cursor-pointer rounded-lg mt-5${
              activeTab === "/create-question" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/create-question")}
          >
            <FaFileCircleQuestion className="w-6 h-6 mr-2" />
            Create Question
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
