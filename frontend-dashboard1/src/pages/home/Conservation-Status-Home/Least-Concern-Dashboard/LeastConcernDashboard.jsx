import React from "react";
import "./LeastConcernDashboard.css";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import LeastConcern from "../../../../components/Canservation-Status/Least-Consern-Page/LeastConcern";
function LeastConcernDashboard() {
  return (
    //
    <>
      <div>
        <div className=" main-container4 d-flex">
          <div className="sidebarWrapper-main4">
            <Sidebar />
          </div>

          <div className="content-main4">
            <Navbar />

            <div className="tit-main4">
              <h1>Least Concern Species</h1>
            </div>
            <div className="least-concern">
              <LeastConcern />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeastConcernDashboard;
