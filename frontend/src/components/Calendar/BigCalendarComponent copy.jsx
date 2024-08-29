import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import EventModal from './EventModal';
import ParentComp from './parentComp';
import ReservationsModal1 from './ReservationsModal1';
import EventModal1 from "./EventModal1";


const localizer = momentLocalizer(moment);

const BigCalendarComponent = ({ events, requests, viewType, currentId }) => {  
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalShow, setEventModalShow] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterState, setFilterState] = useState("All");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);


  useEffect(() => {
    const filterEventsByState = (events) => {
      if (filterState === "All") return events;
      return events.filter(event => event.state === filterState);
    };
  
    const formattedRequests = filterEventsByState(requests.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })));
  
    const formattedEvents = filterEventsByState(events.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    })));
  
    setAllEvents(viewType === 'requests' ? formattedRequests : formattedEvents);
  }, [events, requests, viewType, filterState]);
  

  const handleEventClick = (event) => {
    console.log("i am here");
    
    setSelectedEvent(event);
    setEventModalShow(true);
  };
  
  const handleSlotSelect = ({ start, end }) => {
    setSelectedSlot({ start, end });
    viewType === "requests" ?setIsReservationModalOpen((prev) => true):setIsEventModalOpen((prev) => true);
  };
  
  const handleCancel = (eventId) => {
    setAllEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, state: 'Cancelled' } : event
      )
    );
  };

  const eventPropGetter = (event) => {
    let style = {};
  
    switch (event.state) {
      case 'Pending':
        style = {
          backgroundColor: '#fef3e7',
          borderLeft: '6px solid #f39c12',
          color: '#9c6612',
          padding: '4%',
          borderRadius: '4px',
          fontSize: '0.875em',
        };
        break;
      case 'Approved':
        style = {
          backgroundColor: '#e7f7e7',
          borderLeft: '6px solid #28a745',
          color: '#155724',
          padding: '4%',
          borderRadius: '4px',
          fontSize: '0.875em',
        };
        break;
      case 'Rejected':
        style = {
          backgroundColor: '#f8d7da',
          borderLeft: '6px solid #dc3545',
          color: '#721c24',
          padding: '4%',
          borderRadius: '4px',
          fontSize: '0.875em',
        };
        break;
      case 'Cancelled':
        style = {
          backgroundColor: '#d3d3d3',
          borderLeft: '6px solid #808080',
          color: '#333333',
          padding: '4%',
          borderRadius: '4px',
          fontSize: '0.875em',
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
          <span style={{ fontSize: '0.75em' }}>{event.facility}</span>
        </>
      ) : (
        <>
          <strong>{event.motive}</strong>
          <br />
          <span style={{ fontSize: '0.75em' }}>{event.facility}</span>
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
        style={{ height: '100%', width: '100%' }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSlotSelect}
        selectable
        resizable
        components={{
          event: eventComponent,
        }}
        className="the-calendar"
      />
    </div>

{selectedEvent && (
  <EventModal
    show={eventModalShow}
    onHide={() => setEventModalShow(false)}
    eventDetails={selectedEvent}
    onCancel={handleCancel}
    viewType={viewType}
  />
)}

{selectedSlot && isReservationModalOpen && viewType==="requests"  && (
  <ReservationsModal1
    open={isReservationModalOpen}
    onClose={() => setIsReservationModalOpen(false)}
    slotDetails={selectedSlot}
    numberOfFacilities={1}
    currentId={currentId}
  />
)}
{selectedSlot && isEventModalOpen && viewType==="events"  && (
  <EventModal1
    open={isEventModalOpen}
    onClose={() => setIsEventModalOpen(false)}
    slotDetails={selectedSlot}
    currentId={currentId}
  />
)}
  </>);
  


};

BigCalendarComponent.propTypes = {
  events: PropTypes.array.isRequired,
  requests: PropTypes.array,
  viewType: PropTypes.string.isRequired,
  currentId: PropTypes.string.isRequired,
};

export default BigCalendarComponent;