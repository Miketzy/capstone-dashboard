import React from "react";
import "./EndengeredDashboard.css";
import Endengered from "../../../../components/Canservation-Status/EndengeredPage/Endengered";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
function EndengeredDashboard() {
  return (
    <>
      <div>
        <div className=" main-container1 d-flex">
          <div className="sidebarWrapper-main1">
            <Sidebar />
          </div>

          <div className="content-main1">
            <Navbar />

            <div className="tit-main1">
              <h1>Endangered Species</h1>
            </div>
            <div className="endengered">
              <Endengered />
            </div>
          </div>
        </div>
      </div>
    </>
    //
  );
}

export default EndengeredDashboard;
