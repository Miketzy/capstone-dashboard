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

  useEffect(() => {
    // Fetch user data from the backend
    axios
      .get("http://localhost:8080/", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setUser({
          firstname: response.data.firstname || "",
          middlename: response.data.middlename || "",
          lastname: response.data.lastname || "",
          email: response.data.email || "",
          image: response.data.image
            ? `http://localhost:8080/uploads/avatar/${response.data.image}`
            : "/images/unknown-person-icon-Image-from_20220304.png",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8080/logout")
      .then((res) => {
        console.log("Logout response:", res.data);
        if (res.data.Message === "Success") {
          navigate("/");
        } else {
          alert("Logout failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Logout error:", err);
        alert("An error occurred during logout. Please try again.");
      });
  };

  const handleProfile = () => {
    axios
      .get("http://localhost:8080/profile")
      .then((res) => {
        console.log("Profile response:", res.data);
        if (res.data.Message === "Success") {
          navigate("/my-profile");
        } else {
          alert("Navigate failed: " + (res.data.Message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Navigate error:", err);
        alert("An error occurred during navigation. Please try again.");
      });
  };

  return (
    <header className="d-flex align-items-center">
      <div className="container-fluid w-100">
        <div className="row d-flex align-items-center">
          <div className="col d-flex align-items-center">
            <Button className="rounded-circle" id="rounded-circle">
              <MenuOpenIcon />
            </Button>

            <div className="search1" id="search1">
              <SearchBox />
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
                            width: 32,
                            height: 32,
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
                          <Avatar src={user.image} alt="" className="avatar" />
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
