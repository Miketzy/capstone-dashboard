import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import ContributorRequest from "../../../components/Contributor-Request/ContributorRequest";

function ContributorRequestDashboards() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-60">
            <div className="rounded-lg ml-64 ">
              <ContributorRequest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributorRequestDashboards;
