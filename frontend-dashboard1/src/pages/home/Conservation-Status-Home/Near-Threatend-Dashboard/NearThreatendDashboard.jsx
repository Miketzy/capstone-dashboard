import React from "react";
import "./NearThreatendDashboard.css";

import NearThreatend from "../../../../components/Canservation-Status/Near-Threatend-Page/NearThreatend";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
function NearThreatendDashboard() {
  return (
    //
    <>
      <div>
        <div className=" main-container3 d-flex">
          <div className="sidebarWrapper-main3">
            <Sidebar />
          </div>

          <div className="content-main3">
            <Navbar />

            <div className="tit-main3">
              <h1>Near Threatend Species</h1>
            </div>
            <div className="near-theatend">
              <NearThreatend />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NearThreatendDashboard;
