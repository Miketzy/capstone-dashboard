import Navbar from "../../../../components/navbar/Navbar";
import Sidebar from "../../../../components/sidebar/Sidebar";
import EditProfile from "../../../../components/Button-Profile/Edit-Profile/EditProfile";

function EditProfileDashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-60">
            <div className=" rounded-lg ml-64  ">
              <EditProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileDashboard;
