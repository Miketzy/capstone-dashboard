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
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Species Directory
            </h1>
          </div>
          <div className="shadow-lg rounded-lg p-4 ">
            <Card className="flex flex-col gap-y-4 rounded-lg border " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
