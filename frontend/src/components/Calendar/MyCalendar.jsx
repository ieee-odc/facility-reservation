import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "./Calendar";
import "./calendarStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const colorsEvent = {
  "En attente": "#fcb96b",
  Annulée: "#fff493",
  Approuvée: "#a3f394",
  Refusée: "#fcacac",
};

export default function MyCalendar() {
  const navigate = useNavigate();
  const [EVENTS, setEVENTS] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userIdLogIn, setUserIdLogIn] = useState([]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {};
    style.backgroundColor = colorsEvent[event.state];
    style.display = "flex";
    style.alignItems = "center";
    style.justifyContent = "center";
    style.textAlign = "center";
    style.padding = "4px";
    style.borderRadius = "8px";
    style.height = "25px";
    return { style };
  };

  useEffect(() => {
    const userIdLogIn = localStorage.getItem("userId");
    console.log(userIdLogIn);
    setUserIdLogIn(userIdLogIn);
    axios
      .get(`http://localhost:5500/reservations`)
      .then((response) => {
        const fetchedEvents = response.data.data
          .map((event) => {
            const { date, time } = event;
            if (time && time.includes("-")) {
              const [startTime, endTime] = time.split("-").map((t) => t.trim());
              const start = moment(
                `${date.split("T")[0]} ${startTime}`,
                "YYYY-MM-DD hh:mm A"
              ).format("YYYY-MM-DDTHH:mm:ss");
              const end = moment(
                `${date.split("T")[0]} ${endTime}`,
                "YYYY-MM-DD hh:mm A"
              ).format("YYYY-MM-DDTHH:mm:ss");
              return {
                start: moment(start).toDate(),
                end: moment(end).toDate(),
                title: event.facility,
                facility: event.facility,
                state: event.state,
                club: event.club,
                id: event._id,
                userId: event.userId,
              };
            }
            return null;
          })
          .filter((event) => event !== null);
        setEVENTS(fetchedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleCancelReservation = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5500/reservations/${selectedEvent.id}/update-state`,
        { state: "Annulée" }
      );
      console.log(response.data.message);
      // Update the local state of the event
      const updatedEvents = EVENTS.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, state: "Annulée" }
          : event
      );
      setEVENTS(updatedEvents);
      handleCloseModal();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const handleSelectEvent = (event) => {
    console.log(event);
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleEditReservation = (event) => {
    const reservationId = event.id;
    console.log(reservationId);
    navigate(`/reserver/edit-reservation/${reservationId}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container">
      <button
        className="reservation-btn"
        onClick={() => {
          navigate("/reserver");
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> Réserver
      </button>
      <Calendar
        events={EVENTS}
        defaultView={"month"}
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />
      {selectedEvent && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="border-b border-red-900 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Salle</span>
                <span className="rounded-full bg-gray-300 p-2" style={{ width: "300px" }}>{selectedEvent.facility}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">État</span>
                <span className="rounded-full bg-gray-300 p-2" style={{ width: "300px" }}>{selectedEvent.state}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Club</span>
                <span className="rounded-full bg-gray-300 p-2" style={{ width: "300px" }}>{selectedEvent.club}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Date de début</span>
                <span className="rounded-full bg-gray-300 p-2" style={{ width: "300px" }}>{moment(selectedEvent.start).format("LLLL")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Date de fin</span>
                <span className="rounded-full bg-gray-300 p-2" style={{ width: "300px" }}>{moment(selectedEvent.end).format("LLLL")}</span>
              </div>
            </div>
            <div className="border-t border-red-900 p-4 flex justify-end space-x-2">
              {selectedEvent.userId === userIdLogIn && selectedEvent.state !== "Approuvée" && (
                <button
                  type="button"
                  className="button-2"
                  onClick={() => handleEditReservation(selectedEvent)}
                >
                  Modifier
                </button>
              )}
              {selectedEvent.userId === userIdLogIn && (selectedEvent.state === "Approuvée" || selectedEvent.state === "En attente") && (
                <button
                className="button-2"
                  type="button"
                  onClick={handleCancelReservation}
                >
                  Annuler
                </button>
              )}
              {/*<button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
                onClick={handleCloseModal}
              >
                Fermer
              </button>*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
