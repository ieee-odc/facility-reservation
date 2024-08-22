import React, { useEffect, useState } from "react";
import { Panel, SelectPicker, DatePicker, TagPicker } from "rsuite";
import "./AdminView.css";
import {
  getAllEvents,
  getAllPureReservations,
  getAllOrganizers,
  getAllFacilities,
} from "../../apiService";
import Navbar from "../navbar";
import { useTranslation } from "react-i18next";

const AdminView = () => {
  const { t } = useTranslation();

  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState({});
  const [facilities, setFacilities] = useState({});

  const [filter, setFilter] = useState({
    state: [],
    organizer: [],
    facility: [],
    startDate: null,
    endDate: null,
    day: [],
    motive: "",
  });
  const [sort, setSort] = useState("startDate");
  const [viewType, setViewType] = useState("Event&Reservations");

  useEffect(() => {
    fetchReservations();
    fetchEvents();
    fetchOrganizers();
    fetchFacilities();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllPureReservations();
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchOrganizers = async () => {
    try {
      const response = await getAllOrganizers();
      const organizersData = response.data.reduce((acc, organizer) => {
        acc[organizer._id] = organizer.name;
        return acc;
      }, {});
      setOrganizers(organizersData);
    } catch (error) {
      console.error("Error fetching organizers", error);
    }
  };

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

  const getWeekdayFromDate = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getUTCDay()];
  };

  const filteredEvents = events
    .filter(
      (event) =>
        (filter.state.length === 0 || filter.state.includes(event.state)) &&
        (filter.organizer.length === 0 ||
          filter.organizer.includes(event.organizer)) &&
        (filter.startDate === null ||
          new Date(event.startDate) >= new Date(filter.startDate)) &&
        (filter.endDate === null ||
          new Date(event.endDate) <= new Date(filter.endDate)) &&
        (filter.motive === "" ||
          event.reservations.some((r) => r.motive.includes(filter.motive)))
    )
    .sort((a, b) => {
      if (sort === "startDate") {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      if (sort === "endDate") {
        return new Date(a.endDate) - new Date(b.endDate);
      }
      return 0;
    });

  const filteredReservations = reservations
    .filter(
      (reservation) =>
        (filter.state.length === 0 ||
          filter.state.includes(reservation.state)) &&
        (filter.organizer.length === 0 ||
          filter.organizer.includes(reservation.entity)) &&
        (filter.facility.length === 0 ||
          filter.facility.includes(reservation.facility)) &&
        (filter.startDate === null ||
          new Date(reservation.date) >= new Date(filter.startDate)) &&
        (filter.endDate === null ||
          new Date(reservation.date) <= new Date(filter.endDate)) &&
        (filter.day.length === 0 ||
          filter.day.includes(getWeekdayFromDate(reservation.date))) &&
        (filter.motive === "" || reservation.motive.includes(filter.motive))
    )
    .sort((a, b) => {
      if (sort === "date") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sort === "time") {
        return (
          new Date(`1970-01-01T${a.startTime}`) -
          new Date(`1970-01-01T${b.startTime}`)
        );
      }
      return 0;
    });

  return (
    <div>
      <Navbar />
      <div className="admin-view">
        <div className="filters">
          <TagPicker
            placeholder="State"
            data={["Pending", "Approved", "Cancelled", "Rejected"].map(
              (state) => ({ label: state, value: state })
            )}
            value={filter.state}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, state: value }))
            }
          />
          <TagPicker
            placeholder="Organizer"
            data={Object.keys(organizers).map((id) => ({
              label: organizers[id],
              value: id,
            }))}
            value={filter.organizer}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, organizer: value }))
            }
          />
          <TagPicker
            placeholder="Facility"
            data={Object.keys(facilities).map((id) => ({
              label: facilities[id],
              value: id,
            }))}
            value={filter.facility}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, facility: value }))
            }
          />
          <DatePicker
            placeholder="Start Date"
            value={filter.startDate ? new Date(filter.startDate) : null}
            onChange={(date) =>
              setFilter((prev) => ({
                ...prev,
                startDate: date ? date.toISOString() : null,
              }))
            }
          />
          <DatePicker
            placeholder="End Date"
            value={filter.endDate ? new Date(filter.endDate) : null}
            onChange={(date) =>
              setFilter((prev) => ({
                ...prev,
                endDate: date ? date.toISOString() : null,
              }))
            }
          />
          <TagPicker
            placeholder="Day"
            data={[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => ({ label: day, value: day }))}
            value={filter.day}
            onChange={(value) => setFilter((prev) => ({ ...prev, day: value }))}
          />

          <SelectPicker
            placeholder="Sort By"
            data={[
              { label: "Start Date", value: "startDate" },
              { label: "End Date", value: "endDate" },
              { label: "Date", value: "date" },
              { label: "Time", value: "time" },
            ]}
            value={sort}
            onChange={(value) => setSort(value)}
          />
          <SelectPicker
            placeholder="View"
            data={[
              { label: "Events", value: "events" },
              { label: "Reservations", value: "reservations" },
              { label: "Event&Reservations", value: "Event&Reservations" },
            ]}
            value={viewType}
            onChange={(value) => setViewType(value)}
          />
        </div>
        <div className="content-container">
          {viewType !== "reservations" && (
            <div className="section events-section">
              <h2>{t('events')}</h2>
              {filteredEvents.map((event) => (
                <Panel
                  key={event._id}
                  header={
                    <div className="event-header">
                      <h5>
                        {organizers[event.organizer] || "Unknown Organizer"}
                      </h5>
                      <h6>{event.name}</h6>
                    </div>
                  }
                  className="event-panel"
                  collapsible
                  bordered
                >
                  <div>
                    <div className="event-details">
                      <p>
                        <strong>{t('description')}:</strong> {event.description}
                      </p>
                      <p>
                        <strong>{t('start_date')}:</strong>{" "}
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>{t('end_date')}:</strong>{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      <p className={getStateClass(event.state)}>
                      <strong>{t('state')}:</strong> {event.state}
                      </p>
                      <p>
                        <strong>{t('total_participants')}:</strong> {event.totalEffective}
                      </p>
                      <p>
                        <strong>{t('reservations')}:</strong>
                      </p>

                      <div className="event-reservations">
                        {event.reservations.map((reservation) => (
                          <div
                            className="event-reservation-item"
                            key={reservation._id}
                          >
                            <p>
                            <strong>{t('date')}:</strong>{" "}
                              {new Date(reservation.date).toLocaleDateString()}
                            </p>
                            <p>
                            <strong>{t('time')}:</strong> {reservation.startTime} -{" "}
                              {reservation.endTime}
                            </p>
                            <p>
                              <strong>{t('motive')}:</strong> {reservation.motive}
                            </p>
                            <p>
                              <strong>{t('facility')}:</strong>{" "}
                              {facilities[reservation.facility] ||
                                "Unknown Facility"}
                            </p>
                            <p>
                              <strong>{t('effective')}:</strong>{" "}
                              {reservation.effective}
                            </p>
                            <p className={getStateClass(reservation.state)}>
                              <strong>{t('state')}:</strong> {reservation.state}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}
          {viewType !== "events" && (
            <div className="section reservations-section">
              <h2>{t('reservations')}</h2>
              {filteredReservations.map((reservation) => (
                <div key={reservation._id} className="reservation-item">
                  <h3>
                    {organizers[reservation.entity] || "Unknown Organizer"}
                  </h3>
                  <p>
                    <strong>{t('motive')}:</strong> {reservation.motive}
                  </p>
                  <p>
                    <strong>{t('date')}:</strong>{" "}
                    {new Date(reservation.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>{t('time')}:</strong> {reservation.startTime} -{" "}
                    {reservation.endTime}
                  </p>
                  <p>
                    <strong>{t('facility')}:</strong>{" "}
                    {facilities[reservation.facility] || "Unknown Facility"}
                  </p>
                  <p>
                    <strong>{t('effective')}:</strong> {reservation.effective}
                  </p>
                  <p className={getStateClass(reservation.state)}>
                    <strong>{t('state')}:</strong> {reservation.state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
