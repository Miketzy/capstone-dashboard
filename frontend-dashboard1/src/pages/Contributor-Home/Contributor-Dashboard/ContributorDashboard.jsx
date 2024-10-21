import ContributorAddSpecies from "../../../Contributor-page/Contributor-add-Species/ContributorAddSpecies";
import ContributorNavbar from "../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorSideBar from "../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorDashboard.css";

function ContributorDashboard() {
  return (
    <>
      <div>
        <div className=" contributordashboard-main d-flex">
          <div className="contributordashboard-sidebarWrapper">
            <ContributorSideBar />
          </div>

          <div className="contributordashboard-content">
            <ContributorNavbar />

            <div className="contributordashboard">
              <ContributorAddSpecies />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorDashboard;
