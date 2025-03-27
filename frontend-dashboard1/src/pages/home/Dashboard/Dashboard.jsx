import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Card from "../../../components/speciesdirectory/card/Card";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-64 text-center ml-64">
            <h1 className="text-3xl font-bold text-gray-800">
              Species Directory
            </h1>
          </div>
          <div className=" rounded-lg ml-64 ">
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
