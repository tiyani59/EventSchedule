import React, { useState } from "react";
import Events from "../components/Events";
import Register from "../components/Register";
import Users from "../components/Users";
import UserProfile from "../components/UserProfile";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  const [activeOption, setActiveOption] = useState("events");

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar activeOption={activeOption} setActiveOption={setActiveOption} />

      <div className="w-full md:w-10/12">
        {activeOption === "registerUser" && <Register />}
        {activeOption === "viewUsers" && <Users />}
        {activeOption === "userProfile" && <UserProfile />}
        {activeOption === "events" && <Events />}
      </div>
    </div>
  );
};

export default AdminDashboard;
