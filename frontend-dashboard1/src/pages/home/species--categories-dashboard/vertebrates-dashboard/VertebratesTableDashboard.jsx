import React from "react";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Navbar from "../../../../components/navbar/Navbar";
import "./VertebratesTableDashboard.css";
import Vertebrates from "../../../../components/species-categories/vertebrates-table/Vertebrates";

function VertebratesTableDashboard() {
  return (
    <div>
      <div className="vertebratesmain d-flex">
        <div className="vertebrates-sidebarWrapper">
          <Sidebar />
        </div>

        <div className="vertebrates-content">
          <Navbar />
        </div>

        <div className="vertebrates-tit">
          <h1> Vertebrates</h1>
        </div>

        <div className="vertebrateshome">
          <Vertebrates />
        </div>
      </div>
    </div>
  );
}

export default VertebratesTableDashboard;
