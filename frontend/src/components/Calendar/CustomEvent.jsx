import React from "react";

const CustomEvent = ({ event, title }) => (
  <div className={`rbc-event ${event.state}`}>
    {title}
  </div>
);

export default CustomEvent;
