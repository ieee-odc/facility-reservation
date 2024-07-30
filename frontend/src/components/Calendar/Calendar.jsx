import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";
import moment from "moment";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fr from "date-fns/locale/fr";
//const localizer = momentLocalizer(moment);
const locales = {
  fr: fr,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export default function Calendar(props) {
  return (
    <BigCalendar
      {...props}
      localizer={localizer}
      culture="fr"
      messages={{
        next: "Next",
        previous: "Previous",
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        more: "Plus",
      }}
    />
  );
}
