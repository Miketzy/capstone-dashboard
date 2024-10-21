import ContributorImageGallery from "../../../Contributor-page/Contributor-image-gallery/ContributorImageGallery";
import ContributorNavbar from "../../../Contributor-page/Contributor-Navbar/ContributorNavbar";
import ContributorSideBar from "../../../Contributor-page/Contributor-Sidebar/ContributorSideBar";

import "./ContributorImageGalleryDashboard.css";

function ContributorImageGalleryDashboard() {
  return (
    <>
      <div>
        <div className=" contributor-main d-flex">
          <div className="contributor-sidebarWrapper">
            <ContributorSideBar />
          </div>

          <div className="contributor-content">
            <ContributorNavbar />

            <div className="contributorGallery">
              <ContributorImageGallery />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContributorImageGalleryDashboard;
