import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { MdMenuOpen } from "react-icons/md";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import "./ContributorNavbar.css";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../pages/Contributor-Home/Contributor-Dashboard/ContributorDashboard";
import { CarContext } from "../../pages/Contributor-Home/Contributor-Image-Gallery-Dashboard/ContributorImageGalleryDashboard";
import { ProfileContext } from "../../pages/Contributor-Home/Contributor-Profile-Dashboard/ContributotMyProfileDashboard/ContributorMyprofileDashboard";
import { EditProfileContext } from "../../pages/Contributor-Home/Contributor-Profile-Dashboard/Contributor-EditProfile-Dashboard/ContributorEditProfileDashboard";
import { ChangeContext } from "../../pages/Contributor-Home/Contributor-Profile-Dashboard/Contributor-ChangePassword-Dashboard/ContributorChangePasswordDashboard";
import API_URL from "../../config"; // Dalawang level up ✅
import { jwtDecode } from "jwt-decode";

function ContributorNavbar() {
  const [user, setUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    image: "/images/unknown-person-icon-Image-from_20220304.png",
  });

  const context = useContext(MyContext);
  const carContext = useContext(CarContext);
  const profileContex = useContext(ProfileContext);
  const editprofileContex = useContext(EditProfileContext);
  const changeContex = useContext(ChangeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleImageClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const fetchUserData = () => {
    axios
      .get(`${API_URL}/contrbutornavbar`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.message === "Profile retrieved successfully") {
          setUser({
            firstname: response.data.user.firstname || "",
            middlename: response.data.user.middlename || "",
            lastname: response.data.user.lastname || "",
            email: response.data.user.email || "",
            image: response.data.user.image
              ? `${API_URL}/uploads/avatar/${response.data.user.image}`
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

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        // Gamitin ang tamang key ng token sa localStorage
        const token = localStorage.getItem("authToken");

        // Decode para makuha ang username (or email)
        const decoded = jwtDecode(token);
        const username = decoded.username; // o decoded.email kung email ang gamit mo

        // Send GET request para i-set inactive si user
        const res = await axios.get(`${API_URL}/contrilogout`, {
          params: { username },
          withCredentials: true,
        });

        if (res.data.Message === "Success") {
          localStorage.removeItem("authToken"); // remove token
          navigate("/");
        } else {
          alert("Logout failed.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout.");
      }
    }
  };

  const handleProfile = () => {
    navigate("/contributor-MyProfile");
  };

  return (
    <header className="flex items-center">
      <div className="container mx-auto w-full">
        <div className="flex items-center w-full">
          {/* Contributor Text */}
          <div className="flex items-center">
            <span className="text-lg font-bold hidden lg:block">
              CONTRIBUTOR
            </span>
          </div>

          <div className="dropdown position-relative">
            <Button
              className="rounded-circle"
              onClick={() => {
                if (context && context.openNave) {
                  context.openNave();
                }
                if (carContext && carContext.someCarFunction) {
                  carContext.someCarFunction();
                }

                if (profileContex && profileContex.someProfileFunction) {
                  profileContex.someProfileFunction();
                }

                if (
                  editprofileContex &&
                  editprofileContex.someEditProfileFunction
                ) {
                  editprofileContex.someEditProfileFunction();
                }

                if (changeContex && changeContex.someChangeFunction) {
                  changeContex.someChangeFunction();
                }
              }}
            >
              <MdMenuOpen />
            </Button>
          </div>

          {/* User Image and Menu (always visible) */}
          <div className="w-10/12 sm:w-12/12 flex items-center justify-end ml-auto">
            <div className="myAcc1 ml-3">
              <div className="userImage">
                <span className="rounded-full user-icon cursor-pointer">
                  <img
                    src={user.image}
                    alt="User"
                    className="user-image"
                    onClick={handleImageClick}
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
                        borderRadius: "8px",
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
    </header>
  );
}

export default ContributorNavbar;
