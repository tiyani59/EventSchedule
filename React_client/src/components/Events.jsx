import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EventsTable from "./EventsTable";
import EditEventForm from "./EditEventForm";
import AddEventForm from "./AddEventForm";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("https://localhost:7171/api/Event")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  };

  const handleAdd = () => {
    fetchEvents();
  };

  const handleEdit = (eventId) => {
    setEditEventId(eventId);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEditSuccess = () => {
    fetchEvents();
  };

  const handleDelete = (eventId) => {
    const token = localStorage.getItem("token");

    // Make sure token exists
    if (!token) {
      throw new Error("Token not found in local storage");
    }

    // Set authorization header with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`https://localhost:7171/api/Event/${eventId}`, config)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Event deleted successfully");
          fetchEvents();
        } else {
          console.error("Failed to delete event:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const handleAddButton = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  let sortedEvents = [...events];

  if (sortBy) {
    sortedEvents = sortedEvents.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const filteredEvents = sortedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEventSelection = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const isSelected = (eventId) => selectedEvents.includes(eventId);

  const handleDeleteSelected = () => {
    selectedEvents.forEach((eventId) => {
      handleDelete(eventId);
    });
    setSelectedEvents([]);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            onClick={handleAddButton}
            className="px-3 py-1 mr-2 mt-2 bg-blue-800 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Event
          </button>

          {selectedEvents.length >= 2 && ( // Adjusted condition to show button only if 2 or more events are selected
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 mt-2 bg-red-800 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Delete Selected
            </button>
          )}
        </div>

        <div className="flex items-center bg-white border rounded-md p-1 mt-2 ">
          <FaSearch className="m-2 text-red-500" />
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        </div>
      </div>
      <EventsTable
        filteredEvents={filteredEvents}
        handleSort={handleSort}
        sortOrder={sortOrder}
        sortBy={sortBy}
        isSelected={isSelected}
        toggleEventSelection={toggleEventSelection}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        selectAll={selectAll}
        handleSelectAll={handleSelectAll}
      />
      {editEventId !== null && showEditForm && (
        <EditEventForm
          eventId={editEventId}
          onClose={() => setShowEditForm(false)}
          onEdit={handleEdit}
          onEditSuccess={handleEditSuccess}
        />
      )}
      {showAddForm && (
        <AddEventForm onClose={() => setShowAddForm(false)} onAdd={handleAdd} />
      )}
    </div>
  );
};

export default Events;
