import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromCookies = Cookies.get("token");
    const tokenFromLocalStorage = localStorage.getItem("authToken");

    if (!tokenFromCookies && !tokenFromLocalStorage) {
      // Redirect to login if no token found
      navigate("/");
    }
  }, [navigate]);

  return null; // This component is just used for checking the auth state
};

export default CheckAuth;
