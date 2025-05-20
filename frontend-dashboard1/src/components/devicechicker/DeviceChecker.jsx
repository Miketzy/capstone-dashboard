import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const DeviceChecker = ({ children }) => {
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileCheck =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    setIsMobile(mobileCheck);
  }, []);

  if (isMobile == null) return null;
  if (isMobile) {
    return <Navigate to="/not-available" replace />;
  }
  return children;
};

export default DeviceChecker;
