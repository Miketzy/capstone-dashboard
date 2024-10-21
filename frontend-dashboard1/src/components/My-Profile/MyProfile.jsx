import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [userData, setUserData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    gender: "",
    phone_number: "",
    image: "", // Default image path
  });
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/myprofile", {
          withCredentials: true,
        });
        console.log("Fetched profile data:", res.data); // Log response

        // Access the user data from the response
        const user = res.data.user; // Get user object from response

        const imageUrl = user.image
          ? `http://localhost:8080/uploads/avatar/${user.image}`
          : "/images/unknown-person-icon-Image-from_20220304.png"; // Default image

        setUserData({
          firstname: user.firstname || "", // Ensure correct field names
          middlename: user.middlename || "",
          lastname: user.lastname || "",
          email: user.email || "",
          gender: user.gender || "",
          phone_number: user.phone_number || "",
          image: imageUrl,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 401) {
          navigate("/"); // Redirect to login if unauthorized
        }
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUserData(); // Invoke the function to fetch user data
  }, [navigate]);

  const handleEditProfile = () => {
    navigate("/my-profile/edit-profile"); // Route to edit profile
  };

  const handleChangePassword = () => {
    navigate("/my-profile/change-password"); // Route to change password
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator
  }

  return (
    <div className="my-profile-container">
      <div className="profile">
        <div className="profile-cards profile-imgholder">
          {/* Dynamically set the profile image */}
          <img
            src={userData.image} // Uses the fetched image URL
            alt="Profile Avatar"
            width="200"
            height="200"
          />
        </div>
        <div className="edit-button">
          <Button className="Edit-btn" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </div>

        <div className="change-button">
          <Button className="change-btn" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>
      </div>

      <div className="myprofile-inputfield">
        <div className="profile-inputfield-1">
          <div className="my-profile-1">
            <label htmlFor="firstname">Firstname</label>
            <input type="text" value={userData.firstname} readOnly />
          </div>

          <div className="my-profile-1">
            <label htmlFor="middlename">Middle Name</label>
            <input type="text" value={userData.middlename} readOnly />
          </div>
        </div>

        <div className="profile-inputfield-2">
          <div className="my-profile-1">
            <label htmlFor="lastname">Lastname</label>
            <input type="text" value={userData.lastname} readOnly />
          </div>

          <div className="my-profile-1">
            <label htmlFor="email">Email</label>
            <input type="email" value={userData.email} readOnly />
          </div>
        </div>

        <div className="profile-inputfield-2">
          <div className="my-profile-1">
            <label htmlFor="gender">Gender</label>
            <input
              type="text"
              placeholder="Gender"
              value={userData.gender} // Added default value
              readOnly
            />
          </div>

          <div className="my-profile-1">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              className="phone"
              placeholder="Phone number"
              value={userData.phone_number} // Ensure it shows empty if undefined
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
