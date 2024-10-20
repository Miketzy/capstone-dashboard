import React from "react";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import "./fishtableDashboard.css";
import Fish from "../../../../components/species-categories/fish-table/Fish";

function FishtablesDashboard() {
  return (
    <div>
      <div className="main9 d-flex">
        <div className="sidebarWrapper9">
          <Sidebar />
        </div>

        <div className="content9">
          <Navbar />
        </div>

        <div className="tit9">
          <h1> Fish</h1>
        </div>

        <div className="fishHome">
          <Fish />
        </div>
      </div>
    </div>
  );
}

export default FishtablesDashboard;
