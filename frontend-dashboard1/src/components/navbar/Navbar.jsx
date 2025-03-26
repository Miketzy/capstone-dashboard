import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLeaf, FaUser, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    image: "/images/unknown-person-icon-Image-from_20220304.png",
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://bioexplorer-backend.onrender.com/", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.message === "Profile retrieved successfully") {
          const userData = response.data.user;
          setUser({
            firstname: userData.firstname || "",
            middlename: userData.middlename || "",
            lastname: userData.lastname || "",
            email: userData.email || "",
            image: userData.image
              ? `https://bioexplorer-backend.onrender.com/uploads/avatar/${userData.image}`
              : "/images/unknown-person-icon-Image-from_20220304.png",
          });
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      axios
        .get("https://bioexplorer-backend.onrender.com/logout", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.Message === "Success") {
            setUser({
              firstname: "",
              middlename: "",
              lastname: "",
              email: "",
              image: "/images/unknown-person-icon-Image-from_20220304.png",
            });
            navigate("/");
          }
        })
        .catch((err) => console.error("Logout error:", err));
    }
  };

  const handleProfile = () => navigate("/my-profile");

  return (
    <nav className="bg-green-700 px-6 py-3 flex justify-between items-center fixed top-0 left-0 w-full shadow-md z-50">
      {/* Logo & Title */}
      <div className="flex items-center text-white text-xl font-bold">
        <img
          src="/images/472546830_1138798994617879_5773074804155834205_n-removebg-preview.png"
          alt="BioExplorer Logo"
          className="w-8 h-8 mr-2"
        />
        BioExplorer
      </div>

      {/* Search Bar */}
      <div className="relative w-64 hidden md:block">
        <input
          type="text"
          placeholder="Search species..."
          className="w-full px-4 py-2 pl-10 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          className="focus:outline-none cursor-pointer flex items-center"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <FaRegUserCircle className="w-10 h-10 rounded-full border-2 border-white shadow-lg" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-100 px-4 py-3 border-b">
              <p className="text-gray-800 font-semibold text-sm">
                {`${user.firstname} ${user.middlename} ${user.lastname}`}
              </p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <ul className="text-gray-800">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                onClick={handleProfile}
              >
                <FaUser className="text-gray-600" /> Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 border-t text-red-600"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Log out
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
