import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import SpeciesDirectoryHome from "../../PagesHome/species-directory-home/SpeciesDirectoryHome";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Species Directory
            </h1>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <SpeciesDirectoryHome />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
