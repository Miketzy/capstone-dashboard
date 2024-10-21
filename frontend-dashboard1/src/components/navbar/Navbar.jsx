import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import "./navbar.css";
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
      .get("http://localhost:8080/", { withCredentials: true })
      .then((response) => {
        if (response.data.message === "Profile retrieved successfully") {
          setUser({
            firstname: response.data.user.firstname || "",
            middlename: response.data.user.middlename || "",
            lastname: response.data.user.lastname || "",
            email: response.data.user.email || "",
            image: response.data.user.image
              ? `http://localhost:8080/uploads/avatar/${response.data.user.image}`
              : "/images/unknown-person-icon-Image-from_20220304.png",
          });
        } else {
          alert("Failed to fetch user data");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data. Please try again.");
      });
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on component mount
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      axios
        .get("http://localhost:8080/logout", { withCredentials: true })
        .then((res) => {
          if (res.data.Message === "Success") {
            setUser({
              firstname: "",
              middlename: "",
              lastname: "",
              email: "",
              image: "/images/unknown-person-icon-Image-from_20220304.png",
            });
            navigate("/"); // Redirect to home or login page
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

  const handleProfile = () => {
    navigate("/my-profile"); // Navigate to user profile
  };

  return (
    <header className=" header d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row d-flex align-items-center">
          <div className="col d-flex align-items-center">
            <Button className="rounded-circle" id="rounded-circle">
              <MenuOpenIcon />
            </Button>

            <div className="search1" id="search1">
              <SearchBox />{" "}
            </div>

            <div className="ms-auto d-flex align-items-center">
              <div className="myAcc ms-3">
                <div className="userImage">
                  <span className="rounded-circle user-icon">
                    <img
                      src={user.image}
                      alt="User"
                      className="user-image"
                      onClick={handleImageClick}
                      style={{ cursor: "pointer" }}
                    />
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 31,
                            height: 31,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <div className="menu" onClick={handleClose}>
                        <div className="avatarAcc">
                          <img src={user.image} alt="" className="avatar" />
                        </div>
                        <div>
                          <h6 className="fname">{`${user.firstname} ${user.middlename} ${user.lastname}`}</h6>
                          <p className="email">{user.email}</p>
                        </div>
                      </div>
                      <hr />
                      <MenuItem onClick={handleProfile}>
                        <Avatar /> Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
