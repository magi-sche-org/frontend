import { IEvent } from "@/@types/api/event";
import { mockEventList } from "@/components/TopPage/data";

const setEventStorage = (event: IEvent) => {
  const eventList = JSON.parse(
    localStorage.getItem("event-list") ?? "[]",
  ) as IEvent[];
  const indexToOverwrite = eventList
    .map((event) => event.id)
    .findIndex((eid: string) => {
      return eid === event.id;
    });

  if (indexToOverwrite !== -1) {
    // update
    eventList[indexToOverwrite] = event;
  } else {
    eventList.push(event);
  }
  localStorage.setItem("event-list", JSON.stringify(eventList));
};

const getEventStorage = () => {
  const data = localStorage.getItem("event-list");
  if (!data) {
    return process.env.NODE_ENV === "production" ? [] : mockEventList;
  }
  return JSON.parse(data) as IEvent[];
};

export { getEventStorage, setEventStorage };
