import React from "react";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import "./AmphibianstableDashboard.css";
import Amphibian from "../../../../components/species-categories/amphibians-table/Amphibian";

function AmphibianstableDashboard() {
  return (
    <div>
      <div className="main6 d-flex">
        <div className="sidebarWrapper6">
          <Sidebar />
        </div>

        <div className="content6">
          <Navbar />
        </div>

        <div className="tit6">
          <h1> Amphibians</h1>
        </div>

        <div className="amphibianshome">
          <Amphibian />
        </div>
      </div>
    </div>
  );
}

export default AmphibianstableDashboard;
