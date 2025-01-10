import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, MenuItem, Avatar, ListItemIcon } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import SearchBox from "../searchbar/Searchbox";
import { useNavigate } from "react-router-dom";

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
      .get("https://bioexplorer-backend.onrender.com/", {
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
                ? `https://bioexplorer-backend.onrender.com/uploads/avatar/${user.image}`
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

  return (
    <header className="header">
      <div className="container-na mx-auto flex justify-between items-center p-4">
        <div className="mt-[-20px]">
          <h1
            className="font-bold text-M" // Tailwind classes for bold text and font size
            style={{ color: "#00dfc4", fontFamily: "Arial" }} // Custom color and font family
          >
            Admin
          </h1>
        </div>

        <div className="flex items-center space-x-4 ml-[20px] mt-[5px]">
          <SearchBox />
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4 ml-4 mt-[-3vh] ">
          {" "}
          {/* Added ml-4 for margin-left */}
          <img
            src={user.image}
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
            onClick={handleImageClick}
          />
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <div className="p-4 text-center">
              <Avatar src={user.image} className="mx-auto" />
              <h6 className="text-sm font-semibold mt-2">
                {`${user.firstname} ${user.middlename} ${user.lastname}`}
              </h6>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <hr className="my-2" />
            <MenuItem onClick={handleProfile}>
              <Avatar className="mr-2" /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
