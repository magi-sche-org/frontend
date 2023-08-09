import { mockEventList } from "@/components/TopPage/data";
import { Event } from "@/components/TopPage/EventList";

const setEventStorage = (
  name: string,
  id: string,
  answered: boolean = false,
) => {
  const eventList: Event[] = JSON.parse(
    localStorage.getItem("event-list") || "[]",
  );
  const indexToChange = eventList
    .map((event) => event.id)
    .findIndex((eid: string) => {
      return eid === id;
    });

  if (indexToChange !== -1) {
    // update
    eventList[indexToChange] = { name, id, answered };
  } else {
    eventList.push({
      name,
      id,
      answered,
    });
  }
  localStorage.setItem("event-list", JSON.stringify(eventList));
};

const getEventStorage = () => {
  const data = localStorage.getItem("event-list");
  if (!data) {
    return process.env.NODE_ENV === "production" ? [] : mockEventList;
  }
  return JSON.parse(data) as Event[];
};

export { getEventStorage, setEventStorage };
