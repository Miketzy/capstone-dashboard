import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ContributorMyProfile.css";

function ContributorMyProfile() {
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
        const res = await axios.get("/cmyprofile", {
          withCredentials: true,
        });
        const user = res.data.user;

        const imageUrl = user.image
          ? `/uploads/avatar/${user.image}`
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

  const handleEditProfile = () => {
    navigate("/contributor-MyProfile/contributor-EditProfile");
  };

  const handleChangePassword = () => {
    navigate("/contributor-MyProfile/contributor-changepassword");
  };

  if (loading) {
    return <p className="text-center">Loading....</p>;
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen mt-[-50px]">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img
            src={userData.image}
            alt="Profile Avatar"
            className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[
            { label: "Firstname", value: userData.firstname },
            { label: "Middle Name", value: userData.middlename },
            { label: "Lastname", value: userData.lastname },
            { label: "Email", value: userData.email },
            { label: "Gender", value: userData.gender },
            { label: "Phone Number", value: userData.phone_number },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="font-semibold text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                readOnly
                className="mt-2 p-2 border rounded-md bg-gray-100 w-full"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <Button
            className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md w-full md:w-auto"
            id="probtn"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          <Button
            className="text-white bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-md w-full md:w-auto"
            id="probtn1"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContributorMyProfile;
