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

            <div className="contributordashboard-tit">
              <h1 className="-contributordashboardtit1">Species Directory</h1>
            </div>
            <div className="contributordashboard"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorDashboard;
