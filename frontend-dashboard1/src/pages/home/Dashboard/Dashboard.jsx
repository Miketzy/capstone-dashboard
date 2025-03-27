import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Card from "../../../components/speciesdirectory/card/Card";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6 mb-6">
          <div className=" rounded-lg ml-64 ">
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
