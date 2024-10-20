import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Bargraph from "../../../components/speciesdirectory/bar-graph/Bargraph";
import Directorypie from "../../../components/speciesdirectory/directory-pie-chart/Directorypie";
import "./SpeciesAnalyticsDasboard.css";

function SpeciesAnalyticsDasboard() {
  return (
    <>
      <div>
        <div className=" main10 d-flex">
          <div className="sidebarWrapper10">
            <Sidebar />
          </div>

          <div className="content10">
            <Navbar />

            <div className="tit10">
              <h1 className="tit11">Species Analytics</h1>
            </div>
            <div className="graph1">
              <Bargraph />
            </div>
            <div className="piechart1">
              <Directorypie />
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default SpeciesAnalyticsDasboard;
