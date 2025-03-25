import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import SpeciesDirectoryHome from "../../PagesHome/species-directory-home/SpeciesDirectoryHome";

import "./dashboard.css";
//
function Dashboard() {
  return (
    <>
      <div>
        <div className=" main ">
          <Navbar />
          <div>
            <div className="flex">
              <Sidebar />
            </div>

            <div className="content">
              <div className="tit">
                <h1 className="tit1">Species Directory</h1>
              </div>
              <div className="speciestable">
                <SpeciesDirectoryHome />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
