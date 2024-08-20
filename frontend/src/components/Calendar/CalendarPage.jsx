import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";
import axios from "axios";
import { Dropdown } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useNavigate } from "react-router-dom";
import ParentComponent from "./parentComp";
import EventModal1 from "./EventModal1";

const CalendarPage = ({ currentId }) => {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [facilities, setFacilities] = useState({});
  const [viewType, setViewType] = useState("requests");
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [filterState, setFilterState] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/facilities"
        );
        const facilitiesArray = response.data.data;
        if (Array.isArray(facilitiesArray)) {
          const facilitiesData = facilitiesArray.reduce((acc, facility) => {
            acc[facility._id] = facility.label;
            return acc;
          }, {});
          setFacilities(facilitiesData);
        } else {
          console.error(
            "Unexpected response format for facilities",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reservations/pure/${currentId}`
        );
        const reservations = response.data;

        if (Array.isArray(reservations)) {
          const formattedRequests = reservations.map((reservation) => {
            const start = new Date(
              `${reservation.date.split("T")[0]} ${reservation.startTime}`
            );
            const end = new Date(
              `${reservation.date.split("T")[0]} ${reservation.endTime}`
            );

            return {
              id: reservation._id,
              title: reservation.motive,
              date: reservation.date,
              participants: reservation.effective,
              start,
              end,
              allDay: false,
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
              equipment: reservation.equipment || [],
            };
          });

          setRequests(formattedRequests);
        } else {
          console.error("Unexpected response format", reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations from calendar page", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/reservation/${currentId}`
        );
        const reservations = response.data;
        if (Array.isArray(reservations)) {
          const formattedEvents = reservations.map((reservation) => {
            const start = new Date(reservation.startDate)
              .toISOString()
              .split("T")[0];
            const end = new Date(reservation.endDate)
              .toISOString()
              .split("T")[0];

            return {
              id: reservation._id,
              title: reservation.name,
              description: reservation.description,
              start,
              end,
              totalEffective: reservation.totalEffective,
              organizer: reservation.organizer,
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
            };
          });

          setEvents(formattedEvents);
        } else {
          console.error("Unexpected response format", reservations);
        }
      } catch (error) {
        console.error("Error fetching reservations from calendar page", error);
      }
    };

    fetchFacilities();
    fetchEvents();
    fetchReservations();
  }, [currentId, facilities]);

  const handleDropdownChange = (key) => {
    setViewType(key);
  };
  const handleDropdownChangeState = (key) => {
    setFilterState(key);
  };

  const handleNewReservation = () => {
    setIsParentModalOpen(true);
  };

  const handleNewEvent = () => {
    setIsEventModalOpen(true);
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  // Apply the filter before passing the data to BigCalendarComponent
  const filteredRequests = requests.filter((request) => {
    return filterState === "All" || request.state === filterState;
  });

  const filteredEvents = events.filter((event) => {
    return filterState === "All" || event.state === filterState;
  });

  return (
    <div>
      <Navbar />
      <div className="calendar-page">
        <div className="calendar-page__content">
          <div className="calendar-page__sidebar">
            <CalendarSidebar
              setViewType={setViewType}
              events={filteredEvents}
              requests={filteredRequests}
            />
          </div>

          <div className="calendar-page_calendar">
            <div className="calendar-header custom-dropdown">
              <Dropdown
                className="the-button"
                title="Select View"
                activeKey={viewType}
                onSelect={handleDropdownChange}
              >
                <Dropdown.Item className="the-item" eventKey="requests">
                  Requests
                </Dropdown.Item>
                <Dropdown.Item className="the-item" eventKey="events">
                  Events
                </Dropdown.Item>
              </Dropdown>
              <Dropdown
                className="the-button"
                title="Filter by State"
                activeKey={filterState}
                onSelect={handleDropdownChangeState}
              >
                <Dropdown.Item className="the-item" eventKey="All">
                  All
                </Dropdown.Item>
                <Dropdown.Item className="the-item" eventKey="Pending">
                  Pending
                </Dropdown.Item>
                <Dropdown.Item className="the-item" eventKey="Approved">
                  Approved
                </Dropdown.Item>
                <Dropdown.Item className="the-item" eventKey="Rejected">
                  Rejected
                </Dropdown.Item>
                <Dropdown.Item className="the-item" eventKey="Cancelled">
                  Cancelled
                </Dropdown.Item>
              </Dropdown>
              <div className="add-button">
                <button type="button" onClick={handleNewReservation}>
                  + Add reservation
                </button>
                <button type="button" onClick={handleNewEvent}>
                  + Add event
                </button>
              </div>
            </div>
            <div className="main-calendar">
              <BigCalendarComponent
                events={filteredEvents}
                requests={filteredRequests}
                viewType={viewType}
                filterState={filterState}
                currentId={currentId}
              />
            </div>
          </div>
        </div>
      </div>
      <ParentComponent
        isOpen={isParentModalOpen}
        onRequestClose={() => setIsParentModalOpen(false)}
        currentId={currentId}
      />
      <EventModal1
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        currentId={currentId}
      />
    </div>
  );
};

CalendarPage.propTypes = {
  currentId: PropTypes.string.isRequired,
};

export default CalendarPage;
