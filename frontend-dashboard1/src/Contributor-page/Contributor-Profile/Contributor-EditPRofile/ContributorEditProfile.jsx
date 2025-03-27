import React, { useState, useEffect } from "react";
import { BsPlusCircleDotted } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../config";

function ContributorEditProfile({ onUpdateProfile }) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/myprofile`, {
          withCredentials: true,
        });
        const user = res.data.user;
        const imageUrl = user.image
          ? `${API_URL}/uploads/avatar/${user.image}`
          : "/images/unknown-person-icon-Image-from_20220304.png";
        setUserData({
          ...userData,
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

    console.log("Sending data:", Object.fromEntries(formData.entries())); // Debugging

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(`${API_URL}/contributor-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className=" flex justify-center items-center py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow">
            <img
              src={selectedImage || userData.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="profile-imgInput"
              className="absolute inset-0 flex justify-center items-center"
            >
              <input
                type="file"
                id="profile-imgInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="bg-blue-500 p-2 rounded-full text-white cursor-pointer mt-20">
                <BsPlusCircleDotted size={20} />
              </div>
            </label>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Firstname
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your Firstname"
                value={userData.firstname}
                onChange={(e) =>
                  setUserData({ ...userData, firstname: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Middlename
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your Middlename"
                value={userData.middlename}
                onChange={(e) =>
                  setUserData({ ...userData, middlename: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lastname
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your Lastname"
                value={userData.lastname}
                onChange={(e) =>
                  setUserData({ ...userData, lastname: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={userData.gender}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter your Phone number"
                value={userData.phone_number}
                onChange={(e) =>
                  setUserData({ ...userData, phone_number: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter Username"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow w-full sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContributorEditProfile;
