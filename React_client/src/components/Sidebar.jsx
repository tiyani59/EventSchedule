import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faUsers,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ activeOption, setActiveOption }) => {
  const navigate = useNavigate();
  const [showUserManagementMenu, setShowUserManagementMenu] = useState(false);
  const [role, setRole] = useState("");

 

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.role) {
        setRole(decodedToken.role);
      }
    }
  }, []);

  const toggleUserManagementMenu = () => {
    setShowUserManagementMenu(!showUserManagementMenu);
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
    if (option === "logout") {
      localStorage.removeItem("token");
      toast.success("successfully logged out");
      navigate("/login");
    }
  };

  return (
    <div className="hidden md:block  w-full md:w-fit bg-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        {/* Sidebar items */}
        <ul className="text-base">
          <li
            className={`flex items-center mb-2 cursor-pointer hover:bg-gray-400 hover:text-white p-2 ${
              activeOption === "events" ? "bg-gray-400 text-white" : ""
            }`}
            onClick={() => handleOptionClick("events")}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Events
          </li>

          {role === "admin" && (
            <li className="flex flex-col">
              <span
                className={`flex items-center mb-2 cursor-pointer hover:bg-gray-400  hover:text-white p-2 ${
                  activeOption === "userManagement"
                    ? "bg-gray-400 text-white"
                    : ""
                }`}
                onClick={toggleUserManagementMenu}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                User Management
              </span>
              {showUserManagementMenu && (
                <ul className="pl-4">
                  <li
                    className={`mb-2 cursor-pointer hover:  hover:text-blue-400 p-1 ${
                      activeOption === "registerUser" ? " text-blue-300" : ""
                    }`}
                    onClick={() => handleOptionClick("registerUser")}
                  >
                    Register User
                  </li>
                  <li
                    className={`mb-2 cursor-pointer hover:  hover:text-blue-400 p-1 ${
                      activeOption === "viewUsers" ? " text-blue-300" : ""
                    }`}
                    onClick={() => handleOptionClick("viewUsers")}
                  >
                    View Users
                  </li>
                </ul>
              )}
            </li>
          )}

          <li
            className={`flex items-center mb-2 cursor-pointer hover:bg-gray-400 hover:text-white p-2 ${
              activeOption === "userProfile" ? "bg-gray-400 text-white" : ""
            }`}
            onClick={() => handleOptionClick("userProfile")}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            User Profile
          </li>
          {/* Logout */}
          <li
            className={`flex items-center mb-2 cursor-pointer hover:bg-gray-400  hover:text-white p-2 ${
              activeOption === "logout" ? "bg-gray-400 text-white" : ""
            }`}
            onClick={() => handleOptionClick("logout")}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
