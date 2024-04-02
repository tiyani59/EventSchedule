import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventPanel from "./EventPanel";
import { FaSearch } from "react-icons/fa";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filterStartDate, setFilterStartDate] = useState(null);

  useEffect(() => {
    // Fetch events data from the backend API
    axios
      .get("https://localhost:7171/api/Event")
      .then((response) => {
        // Update state with fetched events
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []); // Empty dependency array to run the effect only once

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventPanel = () => {
    setSelectedEvent(null);
  };

  const handleFilterChange = (event) => {
    const filterText = event.target.value.toLowerCase();
    setFilterText(filterText);
  };

  // Function to split multi-day events into separate entries for each day
  const splitEvents = events.flatMap((event) => {
    const endDate = moment(event.start).add(event.duration - 1, "days");
    const eventDates = [];
    let currentDate = moment(event.start);
    while (currentDate.isSameOrBefore(endDate)) {
      // Check if the current day is Saturday
      if (currentDate.day() === 6) {
        // Shift Saturday events by 2 days to Monday
        currentDate = currentDate.clone().add(2, "days");
        // Adjust end date accordingly
        endDate.add(2, "days");
      }
      eventDates.push(currentDate.clone());
      currentDate = currentDate.clone().add(1, "day");
    }
    return eventDates.map((date) => ({
      ...event,
      start: date.toDate(),
      end: date.toDate(), // Set end to start for single-day events
      duration: moment.duration(endDate.diff(date)).asDays() + 1, // Adjust duration
    }));
  });

  // Filter the split events based on user input
  const filteredEvents = splitEvents.filter((event) => {
    const isTitleMatch = event.title.toLowerCase().includes(filterText);
    const isCourseCodeMatch =
      event.courseCode && event.courseCode.toLowerCase().includes(filterText);
    const isExamCodeMatch =
      event.examCode && event.examCode.toLowerCase().includes(filterText);
    const isDateMatch =
      !filterStartDate || moment(event.start).isSameOrAfter(filterStartDate);

    return (
      (isTitleMatch || isCourseCodeMatch || isExamCodeMatch) && isDateMatch
    );
  });

  return (
    <div className=" h-screen">
      {/* Filter inputs */}
      <div className="absolute top-[3%]  md:top-[5%] left-[25%] right-1  md:left-[25%] md:right-[25%] md:mx-[10%]  flex items-center justify-center  bg-gray-100 rounded-full p-2">
        <div>
          <FaSearch className="m-2 text-red-500" /> {/* Search icon */}
        </div>
        <input
          type="text"
          placeholder="Search events by title, course code, or exam code"
          value={filterText}
          onChange={handleFilterChange}
          className="w-full outline-none bg-transparent"
        />
      </div>

      {/* Calendar component */}
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        className="md:mx-10 mx-0 md:pb-[5%]"
        onSelectEvent={handleEventClick}
        date={selectedEvent ? moment(selectedEvent.start).toDate() : undefined}
        eventPropGetter={(event) => {
          let backgroundColor;
          // Set different colors based on the category
          switch (event.category.toLowerCase()) {
            case "comptia":
              backgroundColor = "#FF5733"; // Bright orange
              break;
            case "microsoft":
              backgroundColor = "#FFA933"; // Bright yellow-orange
              break;
            case "IBM":
              backgroundColor = "#33FFD6"; // Bright turquoise
              break;
            case "soft skills":
              backgroundColor = "#FF33E6"; // Bright pink
              break;
            default:
              backgroundColor = "blue"; // Default color for unknown categories
          }

          return { style: { backgroundColor } };
        }}
      />

      {/* Selected event panel */}
      {selectedEvent && (
        <EventPanel event={selectedEvent} onClose={handleCloseEventPanel} />
      )}
    </div>
  );
};

export default BigCalendar;
