import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";

import "./SearchbarDashboard.css";
import SearchFunction from "../../../components/Search-Function/SearchFunction";

function SearchbarDashboard() {
  return (
    <div className="search-main d-flex">
      <div className="search-sidebarWrapper">
        <Sidebar />
      </div>
      <div className="search-content">
        <Navbar />
      </div>

      <div className="results-container">
        <SearchFunction />
      </div>
    </div>
  );
}

export default SearchbarDashboard;
