import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    gender: "",
    phone_number: "",
    username: "",
    image: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://bioexplorer-backend.onrender.com/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data) {
          setUserData({
            firstname: res.data.firstname || "",
            middlename: res.data.middlename || "",
            lastname: res.data.lastname || "",
            email: res.data.email || "",
            gender: res.data.gender || "",
            phone_number: res.data.phone_number || "",
            username: res.data.username || "", // Ensure username is set
            image: res.data.image || null,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username || userData.username.trim() === "") {
      alert("Username is required.");
      return;
    }

    const formData = new FormData();
    formData.append("firstname", userData.firstname);
    formData.append("middlename", userData.middlename);
    formData.append("lastname", userData.lastname);
    formData.append("email", userData.email);
    formData.append("gender", userData.gender);
    formData.append("phone_number", userData.phone_number);
    formData.append("username", userData.username); // Ensure username is included
    if (userData.image) {
      formData.append("image", userData.image);
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        "https://bioexplorer-backend.onrender.com/contributor-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          value={userData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="middlename"
          value={userData.middlename}
          onChange={handleChange}
          placeholder="Middle Name"
        />
        <input
          type="text"
          name="lastname"
          value={userData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="gender"
          value={userData.gender}
          onChange={handleChange}
          placeholder="Gender"
          required
        />
        <input
          type="text"
          name="phone_number"
          value={userData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="text"
          name="username"
          value={userData.username}
          readOnly
          placeholder="Username (Cannot be changed)"
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
