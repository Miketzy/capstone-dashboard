import React from "react";
import "./BirdsTableDashboard.css";
import Birds from "../../../../components/species-categories/birds-table/Birds";
import Navbar from "../../../../components/navbar/Navbar";
import Sidebar from "../../../../components/sidebar/Sidebar";

function BirdsTableDashboard() {
  return (
    <div className="birdstabledashboard">
      <div className="main6 d-flex">
        <div className="sidebarWrapper6">
          <Sidebar />
        </div>

        <div className="content6">
          <Navbar />
        </div>

        <div className="tit6">
          <h1> Birds</h1>
        </div>

        <div className="birdshome">
          <Birds />
        </div>
      </div>
    </div>
  );
}

export default BirdsTableDashboard;
