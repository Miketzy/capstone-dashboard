import React from "react";

import "./EditProfileDashboard.css";
import EditProfile from "../../../../components/Button-Profile/Edit-Profile/EditProfile";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";

function EditProfileDashboard() {
  return (
    <>
      <div>
        <div className=" edit-main d-flex">
          <div className="sidebarWrapper-edit">
            <Sidebar />
          </div>

          <div className="edit-content">
            <Navbar />

            <div className="edit-home">
              <EditProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfileDashboard;
