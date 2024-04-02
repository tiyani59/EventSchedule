import React, { useState } from "react";
import axios from "axios"; // Import Axios library
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEventForm = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    duration: "",
    description: "",
    category: "",
    price: "",
    courseCode: "",
    examCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Make sure token exists
      if (!token) {
        throw new Error("Token not found in local storage");
      }

      // Check if the start date falls on a Saturday or Sunday
      const startDay = new Date(formData.start).getDay();
      if (startDay === 0 || startDay === 6) { // 0 is Sunday, 6 is Saturday
        throw new Error("Events cannot start on weekend");
      }

      // Set authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Make a POST request using Axios to add the event
     const response =  await axios.post("https://localhost:7171/api/Event", formData, config);
     console.log(response)
      // Optionally, you can handle success response here
      onClose(); // Close the form after successful submission
      toast.success("Event added successfully");
      onAdd();
    } catch (error) {
      console.error("Failed to add event", error);
      toast.error(error.message); // Display error message using toast
    }
  };

  return (
    <div className="absolute top-10 left-0 right-0 max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 z-50">
      <h3 className="text-2xl font-bold mb-4 text-center">Add Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="start"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start"
            name="start"
            value={formData.start}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Duration (Days):
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select category</option>
            <option value="CompTIA">CompTIA</option>
            <option value="Microsoft">Microsoft</option>
            <option value="IBM">IBM</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="courseCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Course Code:
          </label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="examCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Exam Code:
          </label>
          <input
            type="text"
            id="examCode"
            name="examCode"
            value={formData.examCode}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;
