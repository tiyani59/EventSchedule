import React, { useState } from "react";

const UserTable = ({ users, handleDelete, handleSaveEdit }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedUserData({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleChange = (field, value) => {
    setEditedUserData({ ...editedUserData, [field]: value });
  };

  const handleSave = () => {
    handleSaveEdit(editedUserData);
    setEditingUser(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "100px" }}
            >
              First Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "100px" }}
            >
              Last Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "100px" }}
            >
              Username
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "150px" }}
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "100px" }}
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: "150px" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "100px" }}
              >
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    className="bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 px-2 py-1 rounded"
                  />
                ) : (
                  user.firstname
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "100px" }}
              >
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    className="bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 px-2 py-1 rounded"
                  />
                ) : (
                  user.lastname
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "100px" }}
              >
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 px-2 py-1 rounded"
                  />
                ) : (
                  user.username
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "100px" }}
              >
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 px-2 py-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "100px" }}
              >
                {editingUser === user.id ? (
                  <select
                    value={editedUserData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="bg-blue-100 border-b-2 border-blue-400 focus:border-blue-600 px-2 py-1 rounded"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="user">user</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap"
                style={{ width: "150px" }}
              >
                {editingUser === user.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-900 ml-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 ml-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
