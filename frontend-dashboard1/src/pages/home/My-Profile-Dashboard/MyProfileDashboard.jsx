import MyProfile from "../../../components/My-Profile/MyProfile";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";

import "./MyProfileDashboard.css";
//
function MyProfileDashboard() {
  return (
    <>
      <div>
        <div className=" main-profile d-flex">
          <div className="sidebarWrapper-profile">
            <Sidebar />
          </div>

          <div className="content-profile">
            <Navbar />
            <div className="my-profile">
              <MyProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfileDashboard;
