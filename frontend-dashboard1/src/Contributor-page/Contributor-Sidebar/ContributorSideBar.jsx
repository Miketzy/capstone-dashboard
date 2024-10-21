import React, { useState } from "react";
import "./ContributorSideBar.css";
import Button from "@mui/material/Button";

import { IoMdAddCircle } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ContributorSideBar() {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const isOpenSubmenu = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleDirectory = () => {
    axios
      .get("http://localhost:8080/speciesDirectory")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-directory");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleAdd = () => {
    axios
      .get("http://localhost:8080/addSpecies")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/contributor-dashboard");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleGallery = () => {
    axios
      .get("http://localhost:8080/gallery")
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

  return (
    <div className="sidebar ">
      <div className="top">
        <div className="sidebarTitle">
          <h2>Contributor</h2>
        </div>
        <div className="close" id="close-btn">
          <span className="material-icon-sharp">
            <IoCloseSharp />
          </span>
        </div>
      </div>

      <ul>
        <li>
          <Button
            className={`w-100 ${activeTab === 1 ? "active" : ""}`}
            onClick={handleAdd}
          >
            <span className="icon">
              <IoMdAddCircle />
            </span>
            Add Species
          </Button>
        </li>

        <li onClick={handleGallery}>
          <Button
            className={`w-100 ${activeTab === 7 ? "active" : ""}`}
            onClick={() => setActiveTab(7)}
          >
            <span className="icon">
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
