import ContributorNavbar from "../../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorChangePassword from "../../../../Contributor-page/Contributor-Profile/Contributor-ChangePassword/ContributorChangePassword";
import ContributorSideBar from "../../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorChangePasswordDashboard.css";

function ContributorChangePasswordDashboard() {
  return (
    <>
      <div>
        <div className="contributorchangepassword-main d-flex">
          <div className="contributorchangepassword-sidebarWrapper">
            <ContributorSideBar />
          </div>

          <div className="contributorchangepassword-content">
            <ContributorNavbar />

            <div className="contributorchangepassword">
              <ContributorChangePassword />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorChangePasswordDashboard;
