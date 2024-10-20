import React, { useState } from "react";
import "./sidebar.css";
import Button from "@mui/material/Button";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { LuClipboardEdit } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { MdAnalytics } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { GrGallery } from "react-icons/gr";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

function Sidebar() {
  const [activeTab, setActiveTab] = useState(null);

  const isOpenSubmenu = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="sidebar ">
      <div className="top">
        <div className="sidebarTitle">
          <img src="/images/logo-design-1.jpg" className="logo" alt="Logo" />
          <h2>Pujada Bay</h2>
        </div>
        <div className="close" id="close-btn">
          <span className="material-icon-sharp">
            <IoCloseSharp />
          </span>
        </div>
      </div>

      <ul>
        <li>
          <Link to="/species-directory" className="link">
            <Button
              className={`w-100 ${activeTab === 0 ? "active" : ""}`}
              onClick={() => setActiveTab(0)}
            >
              <span className="icon">
                <RxDashboard />
              </span>
              Species Directory
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/add-species" className="link">
            <Button
              className={`w-100 ${activeTab === 1 ? "active" : ""}`}
              onClick={() => setActiveTab(1)}
            >
              <span className="icon">
                <IoMdAddCircle />
              </span>
              Add Species
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/list-of-species" className="link">
            <Button
              className={`w-100 ${activeTab === 2 ? "active" : ""}`}
              onClick={() => setActiveTab(2)}
            >
              <span className="icon">
                <LuClipboardEdit />
              </span>
              List of Species
            </Button>
          </Link>
        </li>

        <li>
          <Button
            className={`w-100 ${activeTab === 4 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(4)}
          >
            <span className="icon">
              <MdCategory />
            </span>
            Species categories
            <span className={`arrow ${activeTab === 4 ? "open" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          {activeTab === 4 && (
            <div className="submenuWrapper">
              <ul className="submenu">
                <li>
                  <Link to="/species-categories/mammals" className="link1">
                    Mammals
                  </Link>
                </li>
                <li>
                  <Link to="/species-categories/birds" className="link1">
                    Birds
                  </Link>
                </li>
                <li>
                  <Link to="/species-categories/reptiles" className="link1">
                    Reptiles
                  </Link>
                </li>
                <li>
                  <Link to="/species-categories/amphibians" className="link1">
                    Amphibians
                  </Link>
                </li>
                <li>
                  <Link
                    to="/species-categories/invertebrates"
                    className="link1"
                  >
                    Invertebrates
                  </Link>
                </li>
                <li>
                  <Link to="/species-categories/fish" className="link1">
                    Fish
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li>
          <Link to="/species-analytics" className="link">
            <Button
              className={`w-100 ${activeTab === 5 ? "active" : ""}`}
              onClick={() => setActiveTab(5)}
            >
              <span className="icon">
                <MdAnalytics />
              </span>
              Species Analytics
            </Button>
          </Link>
        </li>
        <li>
          <Button
            className={`w-100 ${activeTab === 6 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(6)}
          >
            <span className="icon">
              <GrStatusGood />
            </span>
            Conservation Status
            <span className={`arrow ${activeTab === 6 ? "open" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          {activeTab === 6 && (
            <div className="submenuWrapper">
              <ul className="submenu">
                <li>
                  <Link
                    to="/conservation-status/critical-endengered"
                    className="link1"
                  >
                    Critically Endangered
                  </Link>
                </li>
                <li>
                  <Link to="/conservation-status/endengered" className="link1">
                    Endangered
                  </Link>
                </li>
                <li>
                  <Link to="/conservation-status/vulnerable" className="link1">
                    Vulnerable
                  </Link>
                </li>
                <li>
                  <Link
                    to="/conservation-status/near-threatend"
                    className="link1"
                  >
                    Near Threatened
                  </Link>
                </li>
                <li>
                  <Link
                    to="/conservation-status/least-concern"
                    className="link1"
                  >
                    Least Concern
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </li>
        <li>
          <Link to="/species-directory" className="link">
            <Button
              className={`w-100 ${activeTab === 7 ? "active" : ""}`}
              onClick={() => setActiveTab(7)}
            >
              <span className="icon">
                <GrGallery />
              </span>
              Image Gallery
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
