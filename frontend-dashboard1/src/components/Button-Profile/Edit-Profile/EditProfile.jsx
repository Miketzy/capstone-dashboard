import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config";

function EditProfile({ onUpdateProfile }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    gender: "",
    phone_number: "",
    username: "",
    image: "/images/unknown-person-icon-Image-from_20220304.png", // Default image
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/myprofile`, {
          withCredentials: true, // Send cookies if any
        });

        const user = res.data.user;
        console.log("Edit profile: ", user);

        const imageUrl = user.image
          ? `${API_URL}/uploads/avatar/${user.image}`
          : "/images/unknown-person-icon-Image-from_20220304.png";

        console.log(imageUrl);

        // Set user data including the image URL
        setUserData({
          firstname: user.firstname || "",
          middlename: user.middlename || "",
          lastname: user.lastname || "",
          email: user.email || "",
          gender: user.gender || "",
          phone_number: user.phone_number || "",
          username: user.username || "",
          image: imageUrl,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 401) {
          navigate("/"); // Redirect to login if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create a request body (not using FormData because no image update is involved)
    const updatedProfile = {
      firstname: userData.firstname,
      middlename: userData.middlename,
      lastname: userData.lastname,
      email: userData.email,
      gender: userData.gender,
      phone_number: userData.phone_number,
      username: userData.username,
    };

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      console.log("Token:", token); // Debug token

      // Send the PUT request with the updated profile
      const res = await axios.put(
        `${API_URL}/profile`,
        updatedProfile, // Sending updated profile data as JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Change to application/json since no file upload is involved
          },
        }
      );

      // Check for successful response
      if (res.status === 200) {
        console.log("Profile updated:", res.data);
        setUserData(res.data);

        if (onUpdateProfile) {
          onUpdateProfile(res.data);
        }

        alert("Profile updated successfully");
        navigate("/my-profile");
      } else {
        console.error("Failed to update profile:", res.data);
        alert("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      if (err.response) {
        console.error("Status code:", err.response.status);
        console.error("Response data:", err.response.data);
        if (err.response.status === 401) {
          alert("Unauthorized: Please login again.");
          navigate("/"); // Redirect to login if unauthorized
        }
      }

      alert("Failed to update profile. Please check your input.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile">
        <div className="edit-profile-cards edit-profile-imgholder">
          <img src={userData.image} alt="Profile" width="150" height="150" />
        </div>
      </div>

      <div className="edit-profile-inputfield">
        <div className="edit-profile-inputfield-1">
          <div className="edit-profile-1">
            <label htmlFor="firstname">Firstname</label>
            <input
              type="text"
              placeholder="Enter your Firstname"
              value={userData.firstname || ""}
              onChange={(e) =>
                setUserData({ ...userData, firstname: e.target.value })
              }
            />
          </div>

          <div className="edit-profile-1">
            <label htmlFor="middlename">Middle Name</label>
            <input
              type="text"
              placeholder="Enter your Middle Name"
              value={userData.middlename || ""}
              onChange={(e) =>
                setUserData({ ...userData, middlename: e.target.value })
              }
            />
          </div>
        </div>

        <div className="edit-profile-inputfield-2">
          <div className="edit-profile-1">
            <label htmlFor="lastname">Lastname</label>
            <input
              type="text"
              placeholder="Enter your Lastname"
              value={userData.lastname || ""}
              onChange={(e) =>
                setUserData({ ...userData, lastname: e.target.value })
              }
            />
          </div>

          <div className="edit-profile-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={userData.email || ""}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="edit-profile-inputfield-2">
          <div className="edit-profile-1">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={userData.gender || ""}
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="edit-profile-1">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your Phone number"
              value={userData.phone_number || ""}
              onChange={(e) =>
                setUserData({ ...userData, phone_number: e.target.value })
              }
            />
          </div>
        </div>

        <div className="edit-profile-inputfield-3">
          <div className="edit-profile-2">
            <label htmlFor="username" className="username">
              Username
            </label>
            <input
              type="text"
              className="edit-username"
              placeholder="Enter Username"
              value={userData.username || ""}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>
        </div>

        <div className="edit-profile-inputfield-2">
          <div className="save-changes-button">
            <button className="edit-button" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
