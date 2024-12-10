import React from "react";
import "./ContributorRequestDashboard.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import ContributorRequest from "../../../components/Contributor-Request/ContributorRequest";

function ContributorRequestDashboards() {
  return (
    <div>
      <div className="request-main d-flex">
        <div className="request-sidebarWrapper">
          <Sidebar />
        </div>

        <div className="request-content">
          <Navbar />
        </div>

        <div className="request-tit">
          <h1> Contributor Request</h1>
        </div>

        <div className="contributor-request">
          <ContributorRequest />
        </div>
      </div>
    </div>
    //
  );
}

export default ContributorRequestDashboards;
