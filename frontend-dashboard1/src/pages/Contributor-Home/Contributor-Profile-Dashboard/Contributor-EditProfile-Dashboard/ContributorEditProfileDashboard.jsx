import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorEditProfile from "../../../../Contributor-page/Contributor-Profile/Contributor-EditPRofile/ContributorEditProfile";
import ContributorMyProfile from "../../../../Contributor-page/Contributor-Profile/Contributor-MyProfile/ContributorMyProfile";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorEditProfileDashboard.css";
import { createContext, useEffect, useState } from "react";

// Create context
const EditProfileContext = createContext();

function ContributorEditProfileDashboard() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to open sidebar
  const someEditProfileFunction = () => {
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
    someEditProfileFunction,
    setIsToggleSidebar,
  };

  // Function to close the sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsToggleSidebar(false);
  };

  return (
    <EditProfileContext.Provider value={values}>
      <div>
        <div className="contributorpeditemain flex">
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
              <ContributorEditProfile />
            </div>
          </div>
        </div>
      </div>
    </EditProfileContext.Provider>
  );
}

export default ContributorEditProfileDashboard;
export { EditProfileContext };
