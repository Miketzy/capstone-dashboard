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
        <Route path="/" element={<Login/>} />
        <Route path='/registration' element={<Signup />} />
        <Route path='/species-directory' element={
          <>
            <CheckAuth />
            <Dashboard />
          </>
      } />

        <Route path='/search' element={<SearchbarDashboard/>} />
        <Route path='/add-species' element={<AddSpeciesDashboard/>} />
        <Route path='/contributor-request' element={<ContributorRequestDashboards/>} />
        <Route path='/list-of-species' element={<ViewAndEditDashboard/>} />
        <Route path='/createQuestion' element={<CreateQuizesDashboard/>} />
        <Route path='/species-analytics' element={<SpeciesAnalyticsDasboard/>} />
        <Route path='/my-profile' element={<MyProfileDashboard/>} />
        <Route path='/my-profile/edit-profile' element={<EditProfileDashboard/>} />
        <Route path='/my-profile/change-password' element={<ChangePasswordDashboard/>} />
        <Route path='/image-gallery' element={<ImageGallerDashboard/>} />
        <Route path='/new-password' element={<ForgotPassword/>} />
        <Route path='/email-request' element={<Email/>} />
        <Route path='/otp' element={<Otphome/>} />
        <Route path='/contributor-dashboard' element={<ContributorDashboard/>} />
        <Route path='/contributor-Gallery' element={<ContributorImageGalleryDashboard/>} />
        <Route path='/contributor-MyProfile' element={<ContributorMyprofileDashboard/>} />
        <Route path='/contributor-MyProfile/contributor-EditProfile' element={<ContributorEditProfileDashboard/>} />
        <Route path='/contributor-MyProfile/contributor-changepassword' element={<ContributorChangePasswordDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
