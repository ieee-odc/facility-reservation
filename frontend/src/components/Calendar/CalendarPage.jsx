import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../navbar";
import CalendarSidebar from "./CalendarSidebar";
import "./style.css";
import BigCalendarComponent from "./BigCalendarComponent";
import axios from "axios";
import { Dropdown, DatePicker, TagPicker } from "rsuite";
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

  const [filterStates, setFilterStates] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

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
              title: `${
                facilities[reservation.facility] || "Unknown Facility"
              } - ${reservation.motive}`,
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
        const response = await axios.get(
          `http://localhost:3000/api/reservationInitiators/${organizerId}`
        );
        return response.data.name;
      } catch (error) {
        console.error(
          `Error fetching organizer name for ID ${organizerId}`,
          error
        );
        return "Unknown Organizer";
      }
    };

    const fetchEvents = async () => {
      try {
        let url;
        if (currentRole === "Admin")
          url = "http://localhost:3000/api/events/reservations";
        else url = `http://localhost:3000/api/events/reservation/${currentId}`;

        const response = await axios.get(url);
        const eventsData = response.data;

        if (Array.isArray(eventsData)) {
          const formattedEvents = await Promise.all(
            eventsData.map(async (event) => {
              const start = new Date(event.startDate);
              const end = new Date(event.endDate);
              const organizerName = await fetchOrganizerName(event.organizer);

              return {
                id: event._id,
                title: `${event.name}`,
                description: event.description,
                start,
                end,
                totalEffective: event.totalEffective,
                organizer: organizerName,
                entity: organizerName,
                state: event.state,
                facility: facilities[event.facility],
                motive: event.name,
              };
            })
          );

          setEvents(formattedEvents);
        } else {
          console.error("Unexpected response format", eventsData);
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

  /*const filteredRequests = requests.filter((request) => {
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
  });*/

  const filteredRequests = requests.filter((request) => {
    const facilityMatch =
      selectedFacilities.length === 0 ||
      selectedFacilities.includes("All") ||
      selectedFacilities.includes(request.facility);

    const stateMatch =
      filterStates.length === 0 ||
      filterStates.includes("All") ||
      filterStates.includes(request.state);

    const timeMatch =
      (!filterStartTime || new Date(request.start) >= filterStartTime) &&
      (!filterEndTime || new Date(request.end) <= filterEndTime);

    return facilityMatch && stateMatch && timeMatch;
  });

  const filteredEvents = events.filter((event) => {
    const facilityMatch =
      selectedFacilities.length === 0 ||
      selectedFacilities.includes("All") ||
      selectedFacilities.includes(event.facility);

    const stateMatch =
      filterStates.length === 0 ||
      filterStates.includes("All") ||
      filterStates.includes(event.state);

    const timeMatch =
      (!filterStartTime || new Date(event.start) >= filterStartTime) &&
      (!filterEndTime || new Date(event.end) <= filterEndTime);

    return facilityMatch && stateMatch && timeMatch;
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
                <div className="filters">
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

                  <TagPicker
                    data={[
                      { label: "All", value: "All" },
                      { label: "Pending", value: "Pending" },
                      { label: "Approved", value: "Approved" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Cancelled", value: "Cancelled" },
                    ]}
                    value={filterStates}
                    onChange={setFilterStates}
                    placeholder="Filter by State"
                    
                  />

                  <TagPicker
                    data={[
                      { label: "All Facilities", value: "All" },
                      ...Object.keys(facilities).map((facilityId) => ({
                        label: facilities[facilityId],
                        value: facilities[facilityId],
                      })),
                    ]}
                    value={selectedFacilities}
                    onChange={setSelectedFacilities}
                    placeholder="Filter by Facility"
                    
                  />

                  
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
