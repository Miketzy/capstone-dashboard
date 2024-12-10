import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorMyProfile from "../../../../Contributor-page/Contributor-Profile/Contributor-MyProfile/ContributorMyProfile";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorMyprofileDashboard.css";
import { createContext, useEffect, useState } from "react";

// Create context
const ProfileContext = createContext();

function ContributorMyprofileDashboard() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to open sidebar
  const someProfileFunction = () => {
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
    someProfileFunction,
    setIsToggleSidebar,
  };

  // Function to close the sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsToggleSidebar(false);
  };

  return (
    <ProfileContext.Provider value={values}>
      <div>
        <div className="contributorprfofilemain flex">
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
              <ContributorMyProfile />
            </div>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}

export default ContributorMyprofileDashboard;
export { ProfileContext };
