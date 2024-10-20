import React from "react";
import "./ReptilesTableDashboard.css";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import Reptile from "../../../../components/species-categories/reptiles-table/Reptile";

function ReptilesTableDashboard() {
  return (
    <div className="reprilestabledashboard">
      <div className="main8 d-flex">
        <div className="sidebarWrapper8">
          <Sidebar />
        </div>

        <div className="content8">
          <Navbar />
        </div>

        <div className="tit8">
          <h1> Reptiles</h1>
        </div>

        <div className="reptiles">
          <Reptile />
        </div>
      </div>
    </div>
  );
}

export default ReptilesTableDashboard;
