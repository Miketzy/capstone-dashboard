import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/login/Login";
import Signup from './components/signup/Signup';
import Dashboard from './pages/home/Dashboard/Dashboard';
import AddSpeciesDashboard from "./pages/home/Add-species-Dashboard/AddSpeciesDashboard";
import ViewAndEditDashboard from "./pages/home/View-Edit-Species-Dashboard/ViewAndEditDashboard";
import MammalsTable from "./pages/home/species--categories-dashboard/mammalstable-dashboard/MammalsTable";
import BirdsTableDashboard from "./pages/home/species--categories-dashboard/birdstable-dashboard/BirdsTableDashboard";
import ReptilesTableDashboard from "./pages/home/species--categories-dashboard/reptilestable-dashboard/ReptilesTableDashboard";
import AmphibianstableDashboard from "./pages/home/species--categories-dashboard/amphibianstable-dashboard/AmphibianstableDashboard";
import InvertebratestableDashboard from "./pages/home/species--categories-dashboard/invertebratestable-dashboard/InvertebratestableDashboard";
import FishtablesDashboard from "./pages/home/species--categories-dashboard/fishtable-dashboard/FishtablesDashboard";
import SpeciesAnalyticsDasboard from "./pages/home/Species-Analytics-Dashboard/SpeciesAnalyticsDasboard";
import CriticalEndengeredDashboard from "./pages/home/Conservation-Status-Home/Critical-Endengered-Dashboard/CriticalEndengeredDashboard";
import EndengeredDashboard from "./pages/home/Conservation-Status-Home/Endengered-Dashboard/EndengeredDashboard";
import VulnerableDashboard from "./pages/home/Conservation-Status-Home/Vulnerable-Dashboard/VulnerableDashboard";
import NearThreatendDashboard from "./pages/home/Conservation-Status-Home/Near-Threatend-Dashboard/NearThreatendDashboard";
import LeastConcernDashboard from "./pages/home/Conservation-Status-Home/Least-Concern-Dashboard/LeastConcernDashboard";
import MyProfileDashboard from "./pages/home/My-Profile-Dashboard/MyProfileDashboard";
import EditProfileDashboard from "./pages/home/Button-Profile-Dashboard/Edit-Profile-Dashboard/EditProfileDashboard";
import ChangePasswordDashboard from "./pages/home/Button-Profile-Dashboard/Change-Password-Dashboard/ChangePasswordDashboard";





function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Login/>} />

        <Route path='/registration' element={<Signup />} />

        <Route path='/species-directory' element={<Dashboard/>} />

        <Route path='/add-species' element={<AddSpeciesDashboard/>} />

        <Route path='/list-of-species' element={<ViewAndEditDashboard/>} />

        <Route path='/species-categories/mammals' element={<MammalsTable/>} />
        <Route path='/species-categories/birds' element={<BirdsTableDashboard/>} />
        <Route path='/species-categories/reptiles' element={<ReptilesTableDashboard/>} />
        <Route path='/species-categories/amphibians' element={<AmphibianstableDashboard/>} />
        <Route path='/species-categories/invertebrates' element={<InvertebratestableDashboard/>} />
        <Route path='/species-categories/fish' element={<FishtablesDashboard/>} />

        <Route path='/species-analytics' element={<SpeciesAnalyticsDasboard/>} />

        <Route path='/conservation-status/critical-endengered' element={<CriticalEndengeredDashboard/>} />
        <Route path='/conservation-status/endengered' element={<EndengeredDashboard/>} />
        <Route path='/conservation-status/vulnerable' element={<VulnerableDashboard/>} />
        <Route path='/conservation-status/near-threatend' element={<NearThreatendDashboard/>} />
        <Route path='/conservation-status/least-concern' element={<LeastConcernDashboard/>} />
        <Route path='/my-profile' element={<MyProfileDashboard/>} />
        <Route path='/my-profile/edit-profile' element={<EditProfileDashboard/>} />
        <Route path='/my-profile/change-password' element={<ChangePasswordDashboard/>} />
      </Routes>
    
   
      
    </BrowserRouter>
  );
}

export default App;
