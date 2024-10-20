import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./addspeciesdashboard.css";
import AddSpeciesHome from "../../PagesHome/add-species-home/AddSpeciesHome";
function AddSpeciesDashboard() {
  return (
    <>
      <div>
        <div className=" main2 d-flex">
          <div className="sidebarWrapper2">
            <Sidebar />
          </div>

          <div className="content2">
            <Navbar />

            <div className="tit2">
              <h1> Add Species</h1>
            </div>
            <div className="add-species">
              <AddSpeciesHome />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSpeciesDashboard;
