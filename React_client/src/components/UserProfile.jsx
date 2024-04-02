import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserProfile = () => {
  const initialUser = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
  };

  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const nameIdentifier = decodedToken["UserId"];
      setUserId(nameIdentifier);
    } else {
      setError("Token not found in local storage");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `https://localhost:7171/api/User/${userId}`
          );
          setUser(response.data);
          setLoading(false);
        }
      } catch (error) {
        setError("Error fetching user");
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`https://localhost:7171/api/User/${id}`, user);
      console.log("User details updated successfully");
      setEditMode(false);
    } catch (error) {
      setError("Error updating user");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && (
          <>
            <div className="mb-4">
              <label htmlFor="firstname" className=" ">
                First Name:
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                className={`form-input p-1 mt-1 block w-full ${
                  editMode ? "border" : "border-none"
                }`}
                disabled={!editMode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className=" ">
                Last Name:
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                className={`form-input mt-1 p-1 block w-full ${
                  editMode ? "border" : "border-none"
                }`}
                disabled={!editMode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className=" ">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className={`form-input mt-1 p-1 block w-full ${
                  editMode ? "border" : "border-none"
                }`}
                disabled={!editMode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className=" ">
                Email:
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className={`form-input mt-1 p-1 border block w-full ${
                  editMode ? "border" : "border-none"
                }`}
                disabled={!editMode}
              />
            </div>
            {editMode && (
              <div className="mb-4">
                <label htmlFor="password" className=" ">
                  New Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  className="form-input mt-1 border block w-full"
                />
              </div>
            )}
            <div className="flex justify-end">
              {editMode ? (
                <>
                  <button
                    onClick={() => handleSave(userId)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
