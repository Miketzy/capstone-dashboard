import React from "react";
import ImageGallery from "../../../components/Image-Gallery-home/ImageGallery";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import "./ImageGalleryDashboard.css";

function ImageGallerDashboard() {
  return (
    <>
      <div>
        <div className="gallery-main d-flex">
          <div className="gallery-sidebarWrapper">
            <Sidebar />
          </div>

          <div className="gallery-content">
            <Navbar />

            <div className="gallery-tit">
              <h1 className="gallery-tit1">Image Gallery</h1>
            </div>

            <div className="images-gallery">
              <ImageGallery />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageGallerDashboard;
