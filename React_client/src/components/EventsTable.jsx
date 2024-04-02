import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faSortUp,
  faSortDown,
  faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const EventsTable = ({
  filteredEvents,
  handleSort,
  sortOrder,
  sortBy,
  isSelected,
  toggleEventSelection,
  handleEdit,
  handleDelete,
  selectAll,
  handleSelectAll,
}) => {
  const [showDescription, setShowDescription] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table style={{ whiteSpace: 'nowrap' }} className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title{" "}
              {sortBy === "title" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("description")}
            >
              
              Description{" "}
              {sortBy === "description" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("start")}
            >
              Start Day{" "}
              {sortBy === "start" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("duration")}
            >
              Duration{" "}
              {sortBy === "duration" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category{" "}
              {sortBy === "category" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price{" "}
              {sortBy === "price" && (
                <FontAwesomeIcon
                  icon={sortOrder === "asc" ? faSortUp : faSortDown}
                  className="ml-1"
                />
              )}
            </th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Updated At</th>
            <th className="px-4 py-2 text-left">Updated By</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={isSelected(event.id)}
                  onChange={() => toggleEventSelection(event.id)}
                />
              </td>
              <td className="px-4 py-2">{event.title}</td>
              <td
                className="px-4 py-2 relative"
                onMouseEnter={() => setShowDescription(event.id)}
                onMouseLeave={() => setShowDescription(null)}
              >
                <FontAwesomeIcon icon={faAlignLeft} className="mr-1 text-gray-600" />
                {showDescription === event.id && (
                  <div className="absolute top-0 w-10 h-10 bg-white border rounded p-2 shadow-md z-50">
                    <p className="">  {event.description}</p>
                  </div>
                )}
              </td>
              <td className="px-4 py-2">
                {moment(event.start).format("DD-MMM-YY")}
              </td>
              <td className="px-4 py-2">{event.duration} days</td>
              <td className="px-4 py-2">{event.category}</td>
              <td className="px-4 py-2">R{Number(event.price).toFixed(2)}</td>
              <td className="px-4 py-2">{moment(event.createdAt).format("DD-MMM-YY HH:mm:ss")}</td>
              <td className="px-4 py-2">{event.createdBy}</td>
              <td className="px-4 py-2">{moment(event.updatedAt).format("DD-MMM-YY HH:mm:ss")}</td>
              <td className="px-4 py-2">{event.updatedBy}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(event.id)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
