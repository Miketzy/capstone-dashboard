import React from "react";
import "./VulnerableDashboard.css";
import Vulnerable from "../../../../components/Canservation-Status/Vulnerable-Page/Vulnerable";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
function VulnerableDashboard() {
  return (
    <>
      <div>
        <div className=" main-container2 d-flex">
          <div className="sidebarWrapper-main2">
            <Sidebar />
          </div>

          <div className="content-main2">
            <Navbar />

            <div className="tit-main2">
              <h1>Vulnerable Species</h1>
            </div>
            <div className="vulnerable">
              <Vulnerable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VulnerableDashboard;
