import ContributorAddSpecies from "../../../Contributor-page/Contributor-add-Species/ContributorAddSpecies";
import ContributorNavbar from "../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorSideBar from "../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";
import "./ContributorDashboard.css";
import { createContext, useEffect, useState } from "react";

const MyContext = createContext();

function ContributorDashboard() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const openNave = () => {
    setIsToggleSidebar(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const values = {
    isToggleSidebar,
    windowWidth,
    openNave,
    setIsToggleSidebar,
  };

  // Function to close the sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsToggleSidebar(false);
  };

  return (
    <MyContext.Provider value={values}>
      <div>
        <div className="contributordashboard-main flex">
          {/* Sidebar overlay - make sure it has the correct visibility */}
          <div
            className={`sidebarOverlay ${isToggleSidebar ? "show" : "hidden"}`}
            onClick={handleOverlayClick}
          ></div>
          <div className="contributordashboard-navbar">
            <ContributorNavbar />
          </div>
          <>
            <div
              className={`contributordashboard-sidebar ${
                isToggleSidebar ? "open" : ""
              }`}
            >
              <ContributorSideBar />
            </div>
          </>
          <div className="contributordashboard-content p-[85px] mt-[-20px]">
            <div className="contributordashboard">
              <ContributorAddSpecies />
            </div>
          </div>
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default ContributorDashboard;
export { MyContext };
