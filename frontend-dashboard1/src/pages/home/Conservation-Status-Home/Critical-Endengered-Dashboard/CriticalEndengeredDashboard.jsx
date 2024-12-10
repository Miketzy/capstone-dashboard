import React from "react";

import "./CriticalEndengeredDashboard.css";
import CriticalEndengeredPage from "../../../../components/Canservation-Status/Critical-Endegered/CriticalEndengeredPage";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
function CriticalEndengeredDashboard() {
  return (
    //
    <>
      <div>
        <div className=" main-container d-flex">
          <div className="sidebarWrapper-main">
            <Sidebar />
          </div>

          <div className="content-main">
            <Navbar />

            <div className="tit-main">
              <h1> Critically Endangered Species</h1>
            </div>
            <div className="critical-endengered">
              <CriticalEndengeredPage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CriticalEndengeredDashboard;
