import React from "react";
import Mammal from "../../../../components/species-categories/mammals-table/Mammal";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import "./Mammals.css";

function MammalsTable() {
  return (
    <div>
      <div className="main5 d-flex">
        <div className="sidebarWrapper5">
          <Sidebar />
        </div>

        <div className="content5">
          <Navbar />
        </div>

        <div className="tit5">
          <h1> Mammals</h1>
        </div>

        <div className="mammalshome">
          <Mammal />
        </div>
      </div>
    </div>
  );
}

export default MammalsTable;
