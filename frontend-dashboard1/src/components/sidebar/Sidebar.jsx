import React, { useState, useEffect } from "react";
import "./sidebar.css";
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
          "https://capstone-dashboard-d30v.onrender.com/pending-request-count"
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
    <div className="sidebar">
      <div className="top">
        <div className="sidebarTitle"></div>
        <div className="close" id="close-btn">
          <span className="material-icon-sharp">
            <IoCloseSharp />
          </span>
        </div>
      </div>

      <ul>
        <li>
          <Button
            className={`w-100 ${
              activeTab === "/species-directory" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/species-directory")}
          >
            <span className="icon">
              <RxDashboard />
            </span>
            Species Directory
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${activeTab === "/add-species" ? "active" : ""}`}
            onClick={() => handleNavigation("/add-species")}
          >
            <span className="icon">
              <IoMdAddCircle />
            </span>
            Add Species
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/list-of-species" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/list-of-species")}
          >
            <span className="icon">
              <MdEditCalendar />
            </span>
            List of Species
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/species-categories" ? "active" : ""
            }`}
            onClick={() => toggleDropdown("species-categories")}
          >
            <span className="icon">
              <MdCategory />
            </span>
            Classification
            <span
              className={`arrow ${
                activeDropdown === "species-categories" ? "rotate" : ""
              }`}
            >
              <FaAngleRight />
            </span>
          </Button>
          {activeDropdown === "species-categories" && (
            <ul className="submenu">
              <li
                onClick={() => handleNavigation("/species-categories/mammals")}
              >
                Mammals
              </li>
              <li onClick={() => handleNavigation("/species-categories/birds")}>
                Birds
              </li>
              <li
                onClick={() => handleNavigation("/species-categories/reptiles")}
              >
                Reptiles
              </li>
              <li
                onClick={() =>
                  handleNavigation("/species-categories/amphibians")
                }
              >
                Amphibians
              </li>
              <li
                onClick={() =>
                  handleNavigation("/species-categories/invertebrates")
                }
              >
                Invertebrates
              </li>
              <li
                onClick={() =>
                  handleNavigation("/species-categories/vertebrates")
                }
              >
                Vertebrates
              </li>
              <li onClick={() => handleNavigation("/species-categories/fish")}>
                Fish
              </li>
            </ul>
          )}
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/conservation-status" ? "active" : ""
            }`}
            onClick={() => toggleDropdown("conservation-status")}
          >
            <span className="icon">
              <GrStatusGood />
            </span>
            Conservation Status
            <span
              className={`arrow ${
                activeDropdown === "conservation-status" ? "rotate" : ""
              }`}
            >
              <FaAngleRight />
            </span>
          </Button>
          {activeDropdown === "conservation-status" && (
            <ul className="submenu">
              <li
                onClick={() =>
                  handleNavigation("/conservation-status/critical-endengered")
                }
              >
                Critically Endangered
              </li>
              <li
                onClick={() =>
                  handleNavigation("/conservation-status/endengered")
                }
              >
                Endangered
              </li>
              <li
                onClick={() =>
                  handleNavigation("/conservation-status/vulnerable")
                }
              >
                Vulnerable
              </li>
              <li
                onClick={() =>
                  handleNavigation("/conservation-status/least-concern")
                }
              >
                Least Concern
              </li>
              <li
                onClick={() =>
                  handleNavigation("/conservation-status/near-threatend")
                }
              >
                Near Threatened
              </li>
            </ul>
          )}
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/species-analytics" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/species-analytics")}
          >
            <span className="icon">
              <MdAnalytics />
            </span>
            Analytics
          </Button>
        </li>
        <li>
          <Button
            className={`w-100 ${
              activeTab === "/createQuestion" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/createQuestion")}
          >
            <span className="icon">
              <FaFileCircleQuestion />
            </span>
            Create Question
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/image-gallery" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/image-gallery")}
          >
            <span className="icon">
              <GrGallery />
            </span>
            Gallery
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${
              activeTab === "/contributor-request" ? "active" : ""
            }`}
            onClick={() => handleNavigation("/contributor-request")}
          >
            <span className="icon">
              <IoPeopleOutline />
            </span>
            Contributor Request
            {requestCount > 0 && <span className="badge">{requestCount}</span>}
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
