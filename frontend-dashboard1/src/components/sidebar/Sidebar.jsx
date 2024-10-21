import React, { useState, useEffect } from "react";
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
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoPeopleOutline } from "react-icons/io5";
import axios from "axios";

function Sidebar() {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const [requestCount, setRequestCount] = useState(0);

  // Fetch the request count when the component mounts
  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/pending-request-count"
        );
        setRequestCount(response.data.count);
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchRequestCount();
  }, []); // Runs once when the component mounts

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
          navigate("/add-species");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleList = () => {
    axios
      .get("http://localhost:8080/list")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/list-of-species");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleMammals = () => {
    axios
      .get("http://localhost:8080/mammalsTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-categories/mammals");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleBirds = () => {
    axios
      .get("http://localhost:8080/birdsTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-categories/birds");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleReptile = () => {
    axios
      .get("http://localhost:8080/birdsTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-analytics");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleAmphibian = () => {
    axios
      .get("http://localhost:8080/amphibiansTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-categories/amphibians");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleInvertebrates = () => {
    axios
      .get("http://localhost:8080/invertebratesTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-categories/invertebrates");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleFish = () => {
    axios
      .get("http://localhost:8080/fishTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-categories/fish");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleAnalytics = () => {
    axios
      .get("http://localhost:8080/analytics")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/species-analytics");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleCritically = () => {
    axios
      .get("http://localhost:8080/criticallyTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/conservation-status/critical-endengered");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleEndangered = () => {
    axios
      .get("http://localhost:8080/endangeredTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/conservation-status/endengered");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleVulnerable = () => {
    axios
      .get("http://localhost:8080/vulnerableTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/conservation-status/vulnerable");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleLeastconcern = () => {
    axios
      .get("http://localhost:8080/least-concernTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/conservation-status/least-concern");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleNearhreatend = () => {
    axios
      .get("http://localhost:8080/near-threatendTable")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/conservation-status/near-threatend");
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
          navigate("/image-gallery");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  const handleRequest = () => {
    // Fetch the request count when this button is clicked
    const fetchRequestCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/pending-request-count"
        );
        setRequestCount(response.data.count);
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchRequestCount();

    // Navigate to the contributor request page
    axios
      .get("http://localhost:8080/contributor-request")
      .then((res) => {
        if (res.data.Message === "Success") {
          navigate("/contributor-request");
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
          <h2>Admin</h2>
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
            className={`w-100 ${activeTab === 0 ? "active" : ""}`}
            onClick={handleDirectory}
          >
            <span className="icon">
              <RxDashboard />
            </span>
            Species Directory
          </Button>
        </li>

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

        <li>
          <Button
            className={`w-100 ${activeTab === 2 ? "active" : ""}`}
            onClick={handleList}
          >
            <span className="icon">
              <LuClipboardEdit />
            </span>
            List of Species
          </Button>
        </li>

        <li>
          <Button
            className={`w-100 ${activeTab === 3 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(3)}
          >
            <span className="icon">
              <MdCategory />
            </span>
            Species categories
            <span className={`arrow ${activeTab === 3 ? "open" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          {activeTab === 3 && (
            <div className="submenuWrapper">
              <ul className="submenu">
                <li onClick={handleMammals}>Mammals</li>

                <li onClick={handleBirds}>Birds</li>

                <li onClick={handleReptile}>Reptiles</li>

                <li onClick={handleAmphibian}>Amphibians</li>

                <li onClick={handleInvertebrates}>Invertebrates</li>

                <li onClick={handleFish}>Fish</li>
              </ul>
            </div>
          )}
        </li>
        <li onClick={handleAnalytics}>
          <Button
            className={`w-100 ${activeTab === 4 ? "active" : ""}`}
            onClick={() => setActiveTab(4)}
          >
            <span className="icon">
              <MdAnalytics />
            </span>
            Species Analytics
          </Button>
        </li>
        <li>
          <Button
            className={`w-100 ${activeTab === 5 ? "active" : ""}`}
            onClick={() => isOpenSubmenu(5)}
          >
            <span className="icon">
              <GrStatusGood />
            </span>
            Conservation Status
            <span className={`arrow ${activeTab === 5 ? "open" : ""}`}>
              <FaAngleRight />
            </span>
          </Button>
          {activeTab === 5 && (
            <div className="submenuWrapper">
              <ul className="submenu">
                <li onClick={handleCritically}>Critically Endangered</li>

                <li onClick={handleEndangered}>Endangered</li>

                <li onClick={handleVulnerable}>Vulnerable</li>

                <li onClick={handleNearhreatend}>Near Threatened</li>

                <li onClick={handleLeastconcern}>Least Concern</li>
              </ul>
            </div>
          )}
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

        <li onClick={handleRequest}>
          <Button
            className={`sidebar-button ${activeTab === 8 ? "active" : ""}`}
            onClick={() => setActiveTab(8)}
          >
            <span className="icon">
              <IoPeopleOutline />
            </span>
            Contributor Request
            <div
              className={`number-count ${
                requestCount === 0 ? "no-requests" : ""
              }`}
            >
              {requestCount > 0 ? (
                <p className="msg-count">{requestCount}</p>
              ) : (
                <p className="msg-count" style={{ display: "none" }}>
                  0
                </p>
              )}
            </div>
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
