import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import SpeciesMonth from "../../../components/species-add-date/SpeciesMonth";
import Card from "../../../components/speciesdirectory/card/Card";
import ListContributor from "../../../list-contributor/ListContributor";

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="">
            <div className=" rounded-lg ml-64  ">
              <Card />
            </div>
            <div className=" rounded-lg ml-64  ">
              <ListContributor />
            </div>
            <div className=" rounded-lg ml-64  ">
              <SpeciesMonth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
