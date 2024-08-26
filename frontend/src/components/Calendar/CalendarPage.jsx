import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";
import axios from "axios";
import { Dropdown, DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useNavigate } from "react-router-dom";
import ParentComponent from "./parentComp";
import EventModal1 from "./EventModal1";
import ResizableSplitter from "../splitter/ResizableSplitter";

const CalendarPage = ({ currentId, currentRole }) => {
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [facilities, setFacilities] = useState({});
  const [viewType, setViewType] = useState("requests");
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [filterState, setFilterState] = useState("All");
  const [selectedFacility, setSelectedFacility] = useState("All");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");

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
        let url;
        if (currentRole === "Admin")
          url = "http://localhost:3000/api/reservations/pure";
        else url = `http://localhost:3000/api/reservations/pure/${currentId}`;
        const response = await axios.get(url);
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
              title: `${facilities[reservation.facility] || "Unknown Facility"} - ${reservation.motive}`,
              date: reservation.date,
              participants: reservation.effective,
              start,
              end,
              entity: reservation.entity,
              allDay: false,
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
              motive: reservation.motive,
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
    const fetchOrganizerName = async (organizerId) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reservationInitiators/${organizerId}`);
        return response.data.name; // Assuming the API response has a `name` field
      } catch (error) {
        console.error(`Error fetching organizer name for ID ${organizerId}`, error);
        return "Unknown Organizer";
      }
    };
  
    const fetchEvents = async () => {
      try {
        let url;
        if (currentRole === "Admin")
          url = "http://localhost:3000/api/events/reservations";
        else url = `http://localhost:3000/api/events/reservations/${currentId}`;

        const response = await axios.get(url);
        const reservations = response.data;

        if (Array.isArray(reservations)) {
          const formattedEvents = await Promise.all(reservations.map(async (reservation) => {
            const start = new Date(reservation.startDate);
            const end = new Date(reservation.endDate);
            const organizerName = await fetchOrganizerName(reservation.organizer);

            return {
              id: reservation._id,
              title: `${reservation.name}`,
              description: reservation.description,
              start,
              end,
              totalEffective: reservation.totalEffective,
              organizer: organizerName,
              entity: organizerName, // assuming you want to display the name here too
              state: reservation.state,
              facility: facilities[reservation.facility] || "Unknown Facility",
              motive: reservation.name,
            };
          }));

          setEvents(formattedEvents);
        } else {
          console.error("Unexpected response format", reservations);
        }
      } catch (error) {
        console.error("Error fetching events from calendar page", error);
      }
    };

    fetchFacilities();
    fetchEvents();
    fetchReservations();
  }, [currentId, currentRole, facilities]);
  

  const handleDropdownChange = (key) => {
    setViewType(key);
  };

  const handleDropdownChangeState = (key) => {
    setFilterState(key);
  };

  const handleFacilityFilterChange = (key) => {
    setSelectedFacility(key);
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

  const filteredRequests = requests.filter((request) => {
    const facilityMatch =
      selectedFacility === "All" || request.facility === selectedFacility;
    const timeMatch =
      (!filterStartTime || new Date(request.start) >= filterStartTime) &&
      (!filterEndTime || new Date(request.end) <= filterEndTime);

    return (
      facilityMatch &&
      timeMatch &&
      (filterState === "All" || request.state === filterState)
    );
  });

  const filteredEvents = events.filter((event) => {
    const timeMatch =
      (!filterStartTime || new Date(event.start) >= filterStartTime) &&
      (!filterEndTime || new Date(event.end) <= filterEndTime);

    return timeMatch && (filterState === "All" || event.state === filterState);
  });

  return (
    <div>
      <Navbar />
      <div className="calendar-page">
        <div className="calendar-page__content">
          <ResizableSplitter
            leftComponent={
              <div className="calendar-page__sidebar">
                <CalendarSidebar
                  setViewType={setViewType}
                  events={filteredEvents}
                  requests={filteredRequests}
                />
              </div>
            }
            rightComponent={
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
                  <Dropdown
                    className="the-button"
                    title="Filter by Facility"
                    activeKey={selectedFacility}
                    onSelect={handleFacilityFilterChange}
                  >
                    <Dropdown.Item className="the-item" eventKey="All">
                      All Facilities
                    </Dropdown.Item>
                    {Object.keys(facilities).map((facilityId) => (
                      <Dropdown.Item
                        key={facilityId}
                        className="the-item"
                        eventKey={facilities[facilityId]}
                      >
                        {facilities[facilityId]}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                  <DatePicker
                    className="the-button"
                    format="HH:mm"
                    placeholder="Start Time"
                    onChange={(value) => setFilterStartTime(value)}
                    ranges={[]}
                    showMeridian={false}
                    style={{ width: 120, marginRight: 10 }}
                  />
                  <DatePicker
                    className="the-button"
                    format="HH:mm"
                    placeholder="End Time"
                    onChange={(value) => setFilterEndTime(value)}
                    ranges={[]}
                    showMeridian={false}
                    style={{ width: 120, marginRight: 10 }}
                  />
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
            }
          />
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
