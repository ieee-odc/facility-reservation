import React, { useEffect, useState } from "react";
import "./AdminView.css";
import { getAllEvents, getAllPureReservations } from "../../apiService";

const AdminView = () => {
  const [filter, setFilter] = useState("mix");
  const [sort, setSort] = useState("startDate");

  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReservations();
    fetchEvents();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllPureReservations();
      setReservations(response.data);
    } catch (error) {
      console.log("error fetching reservations", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.log("error fetching events", error);
    }
  };

  useEffect(() => {
    const combinedData = mergeData(events, reservations);
    setData(combinedData);
  }, [events, reservations, filter, sort]);

  const mergeData = (events, reservations) => {
    let combinedData = [];

    // Include events and their related reservations
    events.forEach((event) => {
      combinedData.push({ ...event, type: "event" });
      if (event.reservations && event.reservations.length > 0) {
        event.reservations.forEach((reservation) =>
          combinedData.push({
            ...reservation,
            type: "reservation",
            parentEvent: event._id,
          })
        );
      }
    });

    // Include reservations not associated with any event
    reservations
      .filter((reservation) => !reservation.event)
      .forEach((reservation) =>
        combinedData.push({ ...reservation, type: "reservation" })
      );

    return combinedData;
  };

  const filteredData = () => {
    let filtered = data;

    // Apply filter
    if (filter === "events") {
      // Keep only events and their associated reservations
      filtered = filtered.filter(
        (item) =>
          item.type === "event" ||
          (item.type === "reservation" && item.parentEvent)
      );
    } else if (filter === "reservations") {
      // Keep only reservations that are not part of any event
      filtered = filtered.filter(
        (item) => item.type === "reservation" && !item.parentEvent
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sort === "startDate") {
        return (
          new Date(a.startDate || a.date) - new Date(b.startDate || b.date)
        );
      } else if (sort === "endDate") {
        return new Date(a.endDate || a.date) - new Date(b.endDate || b.date);
      }
      // Default sort (optional, for flexibility)
      return 0;
    });

    return filtered;
  };

  const renderTable = () => {
    const dataToDisplay = filteredData();

    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Organizer</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Effective</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Facility</th>
            <th>Materials</th>
            <th>Motive</th>
            <th>State</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.map((item, index) => (
            <tr
              key={index}
              className={
                item.type === "event" ? "event-row" : "reservation-row"
              }
            >
              <td>{item.name || ""}</td>
              <td>{item.description || ""}</td>
              <td>{item.organizer || item.entity || ""}</td>
              <td>{item.startDate || item.date || ""}</td>
              <td>{item.endDate || ""}</td>
              <td>{item.totalEffective || item.effective || ""}</td>
              <td>{item.startTime || ""}</td>
              <td>{item.endTime || ""}</td>
              <td>{item.facility || ""}</td>
              <td>{item.materials || ""}</td>
              <td>{item.motive || ""}</td>
              <td>{item.state || ""}</td>
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="admin-view-container">
      <div className="controls">
        <label>
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="mix">Mix</option>
            <option value="events">Events</option>
            <option value="reservations">Reservations</option>
          </select>
        </label>
        <label>
          Sort:
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>
        </label>
      </div>
      {renderTable()}
    </div>
  );
};

export default AdminView;
