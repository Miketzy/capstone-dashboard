import React, { useEffect } from "react";
import "./speciesdirectory.css";
import Card from "../../../components/speciesdirectory/card/Card";
import Card2 from "../../../components/speciesdirectory/card2/Card2";
import Bargraph from "../../../components/speciesdirectory/bar-graph/Bargraph";
import Directorypie from "../../../components/speciesdirectory/directory-pie-chart/Directorypie";
import DirecotoryTable from "../../../components/speciesdirectory/directorytable/DirectoryTable";

function SpeciesDirectoryHome() {
  useEffect(() => {
    // Retrieve the user ID from local storage
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("User ID in Species Directory:", userId);
    } else {
      console.log("No user ID found in local storage.");
    }
  }, []);

  return (
    <div className="right-content w-100">
      <div className="cards">
        <Card />
      </div>
      <div className="card2"></div>
      <div className="tablehome">
        <DirecotoryTable />
      </div>

      <div className="graphhome">
        <Bargraph />
      </div>

      <div className="piehome">
        <Directorypie />
      </div>
    </div>
  );
}

export default SpeciesDirectoryHome;
