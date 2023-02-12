export const setEventToLocalStorage = (
  name: string,
  id: string,
  localStorage: Storage
) => {
  const eventList = JSON.parse(localStorage.getItem("event-list") || "[]");
  eventList.push({
    name,
    id,
  });
  localStorage.setItem("event-list", JSON.stringify(eventList));
};
