import ContributorImageGallery from "../../../Contributor-page/Contributor-image-gallery/ContributorImageGallery";
import ContributorNavbar from "../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorSideBar from "../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";
import "./ContributorImageGalleryDashboard.css";
import { createContext, useEffect, useState } from "react";

// Create context
const CarContext = createContext();

function ContributorImageGalleryDashboard() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to open sidebar
  const someCarFunction = () => {
    setIsToggleSidebar(true);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Context values to be provided
  const values = {
    isToggleSidebar,
    windowWidth,
    someCarFunction,
    setIsToggleSidebar,
  };

  // Function to close the sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsToggleSidebar(false);
  };

  return (
    <CarContext.Provider value={values}>
      <div>
        <div className="contributor-main flex">
          {/* Sidebar overlay */}
          <div
            className={`sidebarOverlay ${isToggleSidebar ? "show" : "hidden"}`}
            onClick={handleOverlayClick}
          ></div>

          <div className="contributordashboard-navbar">
            <ContributorNavbar />
          </div>

          <div
            className={`contributorsidebarWrapper ${
              isToggleSidebar ? "open" : ""
            }`}
          >
            <ContributorSideBar />
          </div>

          <div className="contributor-content p-[85px] mt-[-20px]">
            <div className="contributordashboard">
              <ContributorImageGallery />
            </div>
          </div>
        </div>
      </div>
    </CarContext.Provider>
  );
}

export default ContributorImageGalleryDashboard;
export { CarContext };
