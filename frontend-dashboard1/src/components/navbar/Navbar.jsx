import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, MenuItem, Avatar, ListItemIcon } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { IoSearchCircle } from "react-icons/io5";
import { FaRegUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import API_URL from "../../config"; // Dalawang level up ✅

function Navbar() {
  const [user, setUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    image: "/images/unknown-person-icon-Image-from_20220304.png",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleImageClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const fetchUserData = () => {
    axios
      .get(`${API_URL}/`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Response data:", response.data); // Log the response for debugging

        if (response.data.message === "Profile retrieved successfully") {
          const user = response.data.user;

          if (user) {
            console.log("User data:s", user); // Log user data
            setUser({
              firstname: user.firstname || "",
              middlename: user.middlename || "",
              lastname: user.lastname || "",
              email: user.email || "",
              image: user.image
                ? `${API_URL}/uploads/avatar/${user.image}`
                : "/images/unknown-person-icon-Image-from_20220304.png",
            });
          } else {
            alert("User data is missing in the response.");
          }
        } else {
          alert("Failed to fetch user data");
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching user data:",
          error.response || error.message || error
        );
        alert("An error occurred while fetching user data. Please try again.");
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      axios
        .get(`${API_URL}/logout`, {
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
          } else {
            alert("Logout failed: " + (res.data.Message || "Unknown error"));
          }
        })
        .catch((err) => {
          console.error("Logout error:", err);
          alert("An error occurred during logout. Please try again.");
        });
    }
  };

  const handleProfile = () => navigate("/my-profile");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-800 px-4 py-3 flex justify-between w-full fixed top-0 left-0 z-50">
      <div className="flex items-center text-xl">
        <MenuIcon className="text-white me-4 cursor-pointer" />
        <span className="text-white font-semibold">BioExplorer-Admin</span>
      </div>
      <div className="flex items-center gap-x-5">
        <div className="relative md:w-65">
          <span className="relative md:absolute inset-y-0 left-0 flex items-center pl-2">
            <button className="p-1 focus:outline-none text-white md:text-black">
              <IoSearchCircle />
            </button>
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block w-full"
          />
        </div>

        {/* Right Side - User Dropdown */}
        <div className="relative">
          <button
            className="text-white focus:outline-none cursor-pointer"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <FaRegUserCircle className="w-8 h-8" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b">
                <p className="text-gray-800 font-semibold text-sm">
                  {" "}
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
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 border-t "
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-red-600" /> Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
