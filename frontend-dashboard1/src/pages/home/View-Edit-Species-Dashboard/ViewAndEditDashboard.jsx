import React from "react";
import "./vieweditdashboard.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import ViewAndEditSpecies from "../../../components/viewspecies/ViewAndEditSpecies";

function ViewAndEditDashboard() {
  return (
    <div>
      <div className="main3 d-flex">
        <div className="sidebarWrapper3">
          <Sidebar />
        </div>

        <div className="content3">
          <Navbar />
        </div>

        <div className="tit3">
          <h1> LIST OF SPECIES</h1>
        </div>

        <div className="view-edit-species">
          <ViewAndEditSpecies />
        </div>
      </div>
    </div>
  );
}

export default ViewAndEditDashboard;
