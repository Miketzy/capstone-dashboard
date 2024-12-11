import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { BsPlusCircleDotted } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile({ onUpdateProfile }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    gender: "",
    phone_number: "",
    username: "",
    image: "/images/unknown-person-icon-Image-from_20220304.png",
  });
  const navigate = useNavigate();

  // Handle image input and set the preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the selected image
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://bioexplorer-backend.onrender.com/myprofile", {
          withCredentials: true,
        });

        const user = res.data.user;
        const imageUrl = user.image
          ? `https://bioexplorer-backend.onrender.com/uploads/avatar/${user.image}`
          : "/images/unknown-person-icon-Image-from_20220304.png";

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
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData();
    formData.append("firstname", userData.firstname);
    formData.append("middlename", userData.middlename);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    formData.append("gender", userData.gender);
    formData.append("phone_number", userData.phone_number);
    formData.append("username", userData.username);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const res = await axios.put("https://bioexplorer-backend.onrender.com/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Check for successful response
      if (res.status === 200) {
        console.log("Profile updated:", res.data);
        setUserData(res.data);
        setSelectedImage(
          res.data.image
            ? `https://bioexplorer-backend.onrender.com/uploads/avatar/${res.data.image}`
            : "/images/unknown-person-icon-Image-from_20220304.png"
        );

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
      }
      alert("Failed to update profile. Please check your input.");
    }
  };
  return (
    <div className="edit-profile-container">
      <div className="edit-profile">
        <div className="edit-profile-cards edit-profile-imgholder">
          <label htmlFor="profile-imgInput" className="profile-upload">
            <input
              type="file"
              id="profile-imgInput"
              accept="image/*"
              onChange={handleImageChange}
            />
            <BsPlusCircleDotted className="profile-icon" />
          </label>
          <img
            src={selectedImage ? selectedImage : userData.image}
            alt="Profile"
            width="150"
            height="150"
          />
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
