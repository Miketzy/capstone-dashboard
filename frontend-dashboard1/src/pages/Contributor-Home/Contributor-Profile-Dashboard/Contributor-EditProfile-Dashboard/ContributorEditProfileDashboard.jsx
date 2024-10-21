import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorEditProfile from "../../../../Contributor-page/Contributor-Profile/Contributor-EditPRofile/ContributorEditProfile";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorEditProfileDashboard.css";

function ContributorEditProfileDashboard() {
  return (
    <>
      <div>
        <div className=" contributorEditProfile-main d-flex">
          <div className="contributorEditProfile-sidebarWrapper">
            <ContributorSideBar />
          </div>

          <div className="contributorEditProfile-content">
            <ContributorNavbar />

            <div className="contributorEditProfile">
              <ContributorEditProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorEditProfileDashboard;
