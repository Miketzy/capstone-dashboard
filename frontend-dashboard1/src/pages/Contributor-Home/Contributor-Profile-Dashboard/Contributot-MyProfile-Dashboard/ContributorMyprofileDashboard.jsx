import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorMyProfile from "../../../../Contributor-page/Contributor-Profile/Contributor-MyProfile/ContributorMyProfile";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorMyprofileDashboard.css";

function ContributorMyprofileDashboard() {
  return (
    <>
      <div>
        <div className=" contributorMyProfile-main d-flex">
          <div className="contributorMyProfile-sidebarWrapper">
            <ContributorSideBar />
          </div>

          <div className="contributorMyProfile-content">
            <ContributorNavbar />

            <div className="contributorMyProfile">
              <ContributorMyProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorMyprofileDashboard;
