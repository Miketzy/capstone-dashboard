import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/login/Login";
import Signup from './components/signup/Signup';
import Dashboard from './pages/home/Dashboard/Dashboard';
import AddSpeciesDashboard from "./pages/home/Add-species-Dashboard/AddSpeciesDashboard";
import ViewAndEditDashboard from "./pages/home/View-Edit-Species-Dashboard/ViewAndEditDashboard";
import MyProfileDashboard from "./pages/home/My-Profile-Dashboard/MyProfileDashboard";
import EditProfileDashboard from "./pages/home/Button-Profile-Dashboard/Edit-Profile-Dashboard/EditProfileDashboard";
import ChangePasswordDashboard from "./pages/home/Button-Profile-Dashboard/Change-Password-Dashboard/ChangePasswordDashboard";
import ForgotPassword from "./components/forgot-password/Forgot-password-page/ForgotPassword";
import Email from "./components/forgot-password/phone-number-and-email/Email";
import ImageGallerDashboard from "./pages/home/Image-Gallery-Dashboard/ImageGallerDashboard";
import Otphome from "./components/forgot-password/otp-code/Otphome";
import SearchbarDashboard from "./pages/home/Searchbar-dashboard/SearchbarDashboard";
import ContributorDashboard from "./pages/Contributor-Home/Contributor-Dashboard/ContributorDashboard";
import ContributorImageGalleryDashboard from "./pages/Contributor-Home/Contributor-Image-Gallery-Dashboard/ContributorImageGalleryDashboard";

import ContributorEditProfileDashboard from "./pages/Contributor-Home/Contributor-Profile-Dashboard/Contributor-EditProfile-Dashboard/ContributorEditProfileDashboard";
import ContributorChangePasswordDashboard from "./pages/Contributor-Home/Contributor-Profile-Dashboard/Contributor-ChangePassword-Dashboard/ContributorChangePasswordDashboard";
import ContributorRequestDashboards from "./pages/home/Contributor-Request-Dashboard/ContributorRequestDashboards";
import CreateQuizesDashboard from "./pages/home/Create-Quizes-Dashboard/CreateQuizesDashboard";
import ContributorMyprofileDashboard from "./pages/Contributor-Home/Contributor-Profile-Dashboard/ContributotMyProfileDashboard/ContributorMyprofileDashboard";
import CheckAuth from "./checkAuth/CheckAuth";
import { useEffect } from 'react';
import SpeciesAnalyticsDasboard from "./pages/home/Species-Analytics-Dashboard/SpeciesAnalyticsDasboard";
import API_URL from "./config";
import MobileNotSupported from "./components/mobilenotsupported/MobileNotSupported";
import DeviceChecker from "./components/devicechicker/DeviceChecker";







function App() {

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/keep-alive`)
      .then(res => console.log("keeping backend awake..."))
      .catch(err => console.error("Failed to ping backend:", err));
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
     <Routes>
      <Route path="/not-available" element={<MobileNotSupported />} />
        <Route path="/" element={ <DeviceChecker><Login/></DeviceChecker> } />
        <Route path='/registration' element={ <DeviceChecker><Signup /></DeviceChecker>} />
        
        <Route path='/species-directory' element={
          <>
          <DeviceChecker>
            <CheckAuth />
            <Dashboard />
          </DeviceChecker>
          </>
      } />

        <Route path='/search' element={ <DeviceChecker><SearchbarDashboard/></DeviceChecker>} />
        <Route path='/add-species' element={ <DeviceChecker><AddSpeciesDashboard/></DeviceChecker>  } />
        <Route path='/contributor-request' element={ <DeviceChecker><ContributorRequestDashboards/></DeviceChecker>} />
        <Route path='/list-of-species' element={<DeviceChecker><ViewAndEditDashboard/></DeviceChecker>} />
        <Route path='/createQuestion' element={<DeviceChecker><CreateQuizesDashboard/></DeviceChecker>} />
        <Route path='/species-analytics' element={<DeviceChecker><SpeciesAnalyticsDasboard/></DeviceChecker>} />
        <Route path='/my-profile' element={<DeviceChecker><MyProfileDashboard/></DeviceChecker>} />
        <Route path='/my-profile/edit-profile' element={ <DeviceChecker><EditProfileDashboard/></DeviceChecker>} />
        <Route path='/my-profile/change-password' element={<DeviceChecker><ChangePasswordDashboard/></DeviceChecker>} />
        <Route path='/image-gallery' element={<DeviceChecker><ImageGallerDashboard/></DeviceChecker>} />
        <Route path='/new-password' element={<DeviceChecker><ForgotPassword/></DeviceChecker>} />
        <Route path='/email-request' element={<DeviceChecker><Email/></DeviceChecker>} />
        <Route path='/otp' element={<DeviceChecker><Otphome/></DeviceChecker>} />
        <Route path='/contributor-dashboard' element={<DeviceChecker><ContributorDashboard/></DeviceChecker>} />
        <Route path='/contributor-Gallery' element={<DeviceChecker><ContributorImageGalleryDashboard/></DeviceChecker>} />
        <Route path='/contributor-MyProfile' element={<DeviceChecker><ContributorMyprofileDashboard/></DeviceChecker>} />
        <Route path='/contributor-MyProfile/contributor-EditProfile' element={<DeviceChecker><ContributorEditProfileDashboard/></DeviceChecker>} />
        <Route path='/contributor-MyProfile/contributor-changepassword' element={<DeviceChecker><ContributorChangePasswordDashboard/></DeviceChecker>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
