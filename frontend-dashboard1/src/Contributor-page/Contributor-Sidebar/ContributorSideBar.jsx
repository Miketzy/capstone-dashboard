import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { IoMdAddCircle } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ContributorSideBar.css";
import { MyContext } from "../../pages/Contributor-Home/Contributor-Dashboard/ContributorDashboard";

function ContributorSideBar() {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isOpenSubmenu = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  useEffect(() => {
    setActiveTab(location.pathname); // Update activeTab on path change
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveTab(path); // Set active tab on navigation
  };

  const handleGallery = () => {
    axios
      .get("https://bioexplorer-backend.onrender.com/gallery")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/contributor-Gallery");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const context = useContext(MyContext);

  return (
    <div className="contributorsidebarpages">
      <ul>
        <li>
          <Button
            className={`w-100 ${
              activeTab === "/contributor-dashboard" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/contributor-dashboard")}
          >
            <span className="contributor-icon">
              <IoMdAddCircle />
            </span>
            Add Species
          </Button>
        </li>

        <li onClick={handleGallery}>
          <Button
            className={`w-100 ${
              activeTab === "/contributor-Gallery" ? "active" : ""
            }`}
            onClick={() => handleGallery()} // Corrected to handleGallery
          >
            <span className="contributor-icon">
              <GrGallery />
            </span>
            Image Gallery
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default ContributorSideBar;
