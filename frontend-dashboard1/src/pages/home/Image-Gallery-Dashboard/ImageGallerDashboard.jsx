import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import ImageGallery from "../../../components/Image-Gallery-home/ImageGallery";

function ImageGallerDashboard() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow p-6">
          <div className="mb-60">
            <div className=" rounded-lg ml-64  ">
              <ImageGallery />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageGallerDashboard;
