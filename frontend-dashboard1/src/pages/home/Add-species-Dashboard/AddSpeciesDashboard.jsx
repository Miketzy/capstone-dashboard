import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import AddSpeciesHome from "../../PagesHome/add-species-home/AddSpeciesHome";

function AddSpeciesDashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />

        <div className="flex flex-col flex-grow p-6">
          <br />
          <br />
          <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center ml-64">
            <h1 className="text-2xl text-white">Add Species</h1>
          </div>
          <div className="mb-60">
            <div className=" rounded-lg">
              <AddSpeciesHome />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSpeciesDashboard;
