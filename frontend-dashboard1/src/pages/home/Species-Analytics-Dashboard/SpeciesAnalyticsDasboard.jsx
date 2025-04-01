import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Bargraph from "../../../components/speciesdirectory/bar-graph/Bargraph";
import Directorypie from "../../../components/speciesdirectory/directory-pie-chart/Directorypie";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-60">
            <div className=" rounded-lg ml-64  ">
              <Bargraph />
            </div>
            <div className=" rounded-lg ml-64  ">
              <Directorypie />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
