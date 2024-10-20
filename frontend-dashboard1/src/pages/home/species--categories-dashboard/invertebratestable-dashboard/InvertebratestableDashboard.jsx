import React from "react";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import "./InvertebratestableDashboard.css";
import Invertebrate from "../../../../components/species-categories/invertebrates-table/Invertebrate";

function InvertebratestableDashboard() {
  return (
    <div>
      <div className="main7 d-flex">
        <div className="sidebarWrapper7">
          <Sidebar />
        </div>

        <div className="content7">
          <Navbar />
        </div>

        <div className="tit7">
          <h1> Invertebrates</h1>
        </div>

        <div className="invertebrateshome">
          <Invertebrate />
        </div>
      </div>
    </div>
  );
}

export default InvertebratestableDashboard;
