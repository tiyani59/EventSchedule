import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const EventPanel = ({ event, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-72 z-50 font-sans text-base text-gray-800">
      <div className="grid grid-cols-1 justify-between  mb-2">
        <h3 className="text-lg font-bold text-red-700 shadow-lg">
          {event.title}
        </h3>
        <FontAwesomeIcon
          icon={faTimes}
          className="absolute top-[2%] right-[2%]  cursor-pointer text-2xl hover:text-gray-500"
          onClick={handleClose}
        />
      </div>
      <p className="mb-2 text-gray-950 shadow-lg p-2">{event.description}</p>
      {event.category && (
        <div className="flex items-center">
          <p className="text-gray-600 mr-1">Category:</p>
          <p className="text-blue-900 font-bold">{event.category}</p>
        </div>
      )}
      {event.price && (
        <div className="flex items-center">
          <p className="text-gray-600 mr-1">Price:</p>
          <p className="text-blue-900 font-bold">R {event.price}</p>
        </div>
      )}
      {event.courseCode && (
        <div className="flex items-center">
          <p className="text-gray-600 mr-1">Course Code:</p>
          <p className="text-blue-900 font-bold">{event.courseCode}</p>
        </div>
      )}
      {event.examCode && (
        <div className="flex items-center">
          <p className="text-gray-600 mr-1">Exam Code:</p>
          <p className="text-blue-900 font-bold">{event.examCode}</p>
        </div>
      )}
      {event.duration && (
        <div className="flex items-center">
          <p className="text-gray-600 mr-1">Duration:</p>
          <p className="text-blue-900 font-bold">{event.duration} Days</p>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-600">Start Day:</p>
          <p className="text-blue-900 font-bold">
            {moment(event.start).format("YYYY-MM-DD")}
          </p>
        </div>
        <div>
          <p className="text-gray-600">End Day:</p>
          <p className="text-blue-900 font-bold">
            {moment(event.end).format("YYYY-MM-DD")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventPanel;
