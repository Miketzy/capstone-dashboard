import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";

function MyProfile() {
  const [userData, setUserData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    gender: "",
    phone_number: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/myprofile`, {
          withCredentials: true,
        });
        console.log("Fetched profile data:", res.data);

        const user = res.data.user;
        const imageUrl = user.image
          ? `${API_URL}/uploads/avatar/${user.image}`
          : "/images/unknown-person-icon-Image-from_20220304.png";

        setUserData({
          firstname: user.firstname || "",
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
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  }

  return (
    <div>
      <br />
      <b></b>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
        <div className="flex flex-col items-center gap-4">
          <img
            src={userData.image}
            alt="Profile Avatar"
            className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md"
          />
          <div className="flex gap-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/my-profile/edit-profile")}
            >
              Edit Profile
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/my-profile/change-password")}
            >
              Change Password
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Firstname</label>
            <input
              type="text"
              value={userData.firstname}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Middlename</label>
            <input
              type="text"
              value={userData.middlename}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Lastname</label>
            <input
              type="text"
              value={userData.lastname}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              value={userData.email}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Gender</label>
            <input
              type="text"
              value={userData.gender}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Phone Number</label>
            <input
              type="tel"
              value={userData.phone_number}
              readOnly
              className="border rounded-lg p-2 bg-gray-100 text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
