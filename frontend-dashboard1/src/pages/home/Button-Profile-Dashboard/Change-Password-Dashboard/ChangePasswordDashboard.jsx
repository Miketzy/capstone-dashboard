import React from "react";

import "./ChangePasswordDashboard.css";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import ChangePassword from "../../../../components/Button-Profile/Change-Profile/ChangePassword";

function ChangePasswordDashboard() {
  return (
    <>
      <div>
        <div className=" change-main d-flex">
          <div className="sidebarWrapper-change">
            <Sidebar />
          </div>

          <div className="change-content">
            <Navbar />

            <div className="change-password-home">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePasswordDashboard;
