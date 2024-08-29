import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.css";
import EventModal from "./EventModal";
import ParentComp from "./parentComp";
import ReservationsModal1 from "./ReservationsModal1";
import EventModal1 from "./EventModal1";
import Modal from "react-modal";
import { Panel } from "rsuite";
import { useTranslation } from "react-i18next";
import { getAllFacilities } from "../../apiService";

const localizer = momentLocalizer(moment);

const BigCalendarComponent = ({ events, requests, viewType, currentId }) => {
  //console.log("events",events);

  const { t } = useTranslation();
  const [allEvents, setAllEvents] = useState([]);
  const [eventModalShow, setEventModalShow] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterState, setFilterState] = useState("All");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [facilities, setFacilities] = useState({});

  useEffect(() => {
    const filterEventsByState = (events) => {
      if (filterState === "All") return events;
      return events.filter((event) => event.state === filterState);
    };

    const formattedRequests = filterEventsByState(
      requests.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
    );

    const formattedEvents = filterEventsByState(
      events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
    );

    setAllEvents(viewType === "requests" ? formattedRequests : formattedEvents);
  }, [events, requests, viewType, filterState]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getAllFacilities();
        const facilitiesData = response.data.data.reduce((acc, facility) => {
          acc[facility._id] = facility.label;
          return acc;
        }, {});
        setFacilities(facilitiesData);
      } catch (error) {
        console.error("Error fetching facilities", error);
      }
    };
    fetchFacilities();
  }, [facilities]);

  const handleEventClick = (event) => {
    console.log("i am here");

    setSelectedEvent(event);
    setEventModalShow(true);
  };

  const handleSlotSelect = ({ start, end }) => {
    setSelectedSlot({ start, end });
    viewType === "requests"
      ? setIsReservationModalOpen((prev) => true)
      : setIsEventModalOpen((prev) => true);
  };

  const handleCancel = (eventId) => {
    setAllEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, state: "Cancelled" } : event
      )
    );
  };

  const handleSelectEvent = (event) => {
    console.log("event", event);

    setSelectedEvent(event);
    setModalIsOpen(true); // Open modal when event is selected
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const getStateClass = (state) => {
    switch (state) {
      case "Pending":
        return `state-pending`;
      case "Approved":
        return `state-approved`;
      case "Cancelled":
        return `state-cancelled`;
      case "Rejected":
        return `state-rejected`;
      default:
        return "";
    }
  };

  const eventPropGetter = (event) => {
    let style = {};

    switch (event.state) {
      case "Pending":
        style = {
          backgroundColor: "#fef3e7",
          borderLeft: "6px solid #f39c12",
          color: "#9c6612",
          padding: "4%",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Approved":
        style = {
          backgroundColor: "#e7f7e7",
          borderLeft: "6px solid #28a745",
          color: "#155724",
          padding: "4%",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Rejected":
        style = {
          backgroundColor: "#f8d7da",
          borderLeft: "6px solid #dc3545",
          color: "#721c24",
          padding: "4%",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      case "Cancelled":
        style = {
          backgroundColor: "#d3d3d3",
          borderLeft: "6px solid #808080",
          color: "#333333",
          padding: "4%",
          borderRadius: "4px",
          fontSize: "0.875em",
        };
        break;
      default:
        break;
    }

    return { style };
  };

  const eventComponent = ({ event, viewtype }) => (
    <div>
      {viewtype === "requests" ? (
        <>
          <strong>{event.facility}</strong>
          <br />
          <span style={{ fontSize: "0.75em" }}>{event.facility}</span>
        </>
      ) : (
        <>
          <strong>{event.motive}</strong>
          <br />
          <span style={{ fontSize: "0.75em" }}>{event.facility}</span>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="big-calendar">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSlotSelect}
          selectable
          resizable
          /* components={{
          event: eventComponent,
        }}*/
          className="the-calendar"
        />
      </div>

      {/*selectedEvent && (
  <EventModal
    show={eventModalShow}
    onHide={() => setEventModalShow(false)}
    eventDetails={selectedEvent}
    onCancel={handleCancel}
    viewType={viewType}
  />
)*/}

      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="unique-modal-content" // Content style
          overlayClassName="unique-modal-overlay" // Overlay style
        >
          <h2 className="unique-modal-header">Event Details</h2>
          {viewType === "requests" ? (
            <div className="unique-modal-details">
              <p>
                <strong>Request Name:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Request Date:</strong>{" "}
                {selectedEvent.start.toDateString()}
              </p>
              {/* Additional request-specific details */}
            </div>
          ) : (
            <div className="unique-modal-details">
              <p>
                <strong>Event Name:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Event Date:</strong>{" "}
                {selectedEvent.start.toDateString()}
              </p>
              <Panel
                key={selectedEvent._id}
                header={
                  <div className="event-header">
                    <p className="profile-event-name">{selectedEvent.name}</p>
                    <p>
                      {new Date(selectedEvent.start).toLocaleDateString()} -{" "}
                      {new Date(selectedEvent.end).toLocaleDateString()}
                    </p>
                  </div>
                }
                className="event-panel"
                collapsible
                bordered
              >
                <div>
                  <div className="event-details">
                    <p>
                      <strong>{t("description")}:</strong>{" "}
                      {selectedEvent.description}
                    </p>
                    <p>
                      <strong>{t("start_date")}:</strong>{" "}
                      {new Date(selectedEvent.start).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>{t("end_date")}:</strong>{" "}
                      {new Date(selectedEvent.end).toLocaleDateString()}
                    </p>
                    <p className={getStateClass(selectedEvent.state)}>
                      <strong>{t("state")}:</strong> {selectedEvent.state}
                    </p>
                    <p>
                      <strong>{t("total_participants")}:</strong>{" "}
                      {selectedEvent.totalEffective}
                    </p>
                    <p>
                      <strong>{t("reservations")}:</strong>
                    </p>

                    <div className="event-reservations">
                      {selectedEvent.reservations?.map((reservation) => (
                        <div
                          className="event-reservation-item"
                          key={reservation._id}
                        >
                          <p>
                            <strong>{t("date")}:</strong>{" "}
                            {new Date(reservation.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>{t("time")}:</strong>{" "}
                            {reservation.startTime} - {reservation.endTime}
                          </p>
                          <p>
                            <strong>{t("motive")}:</strong> {reservation.motive}
                          </p>
                          <p>
                            <strong>{t("facility")}:</strong>{" "}
                            {facilities[reservation.facility._id] ||
                              "Unknown Facility"}
                          </p>
                          <p>
                            <strong>{t("effective")}:</strong>{" "}
                            {reservation.effective}
                          </p>
                          <p className={getStateClass(reservation.state)}>
                            <strong>{t("state")}:</strong> {reservation.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
              {/* Additional event-specific details */}
            </div>
          )}
          <button className="unique-modal-close-button" onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}

      {selectedSlot && isReservationModalOpen && viewType === "requests" && (
        <ReservationsModal1
          open={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          slotDetails={selectedSlot}
          numberOfFacilities={1}
          currentId={currentId}
        />
      )}
      {selectedSlot && isEventModalOpen && viewType === "events" && (
        <EventModal1
          open={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          slotDetails={selectedSlot}
          currentId={currentId}
        />
      )}
    </>
  );
};

BigCalendarComponent.propTypes = {
  events: PropTypes.array.isRequired,
  requests: PropTypes.array,
  viewType: PropTypes.string.isRequired,
  currentId: PropTypes.string.isRequired,
};

export default BigCalendarComponent;
