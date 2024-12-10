import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorChangepass from "../../../../Contributor-page/Contributor-Profile/Contributor-ChangePassword/ContributorChangepass";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorChangePasswordDashboard.css";
import { createContext, useEffect, useState } from "react";

// Create context
const ChangeContext = createContext();

function ContributorChangePasswordDashboard() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to open sidebar
  const someChangeFunction = () => {
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
    someChangeFunction,
    setIsToggleSidebar,
  };

  // Function to close the sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsToggleSidebar(false);
  };

  return (
    <ChangeContext.Provider value={values}>
      <div>
        <div className="contributorchangeemain flex">
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
              <ContributorChangepass />
            </div>
          </div>
        </div>
      </div>
    </ChangeContext.Provider>
  );
}

export default ContributorChangePasswordDashboard;
export { ChangeContext };
