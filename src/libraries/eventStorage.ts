import {mockEventList} from "@/components/TopPage/data";

const setEventStorage = (
  name: string,
  id: string,
  answered: boolean = false
) => {
  const eventList = JSON.parse(localStorage.getItem("event-list") || "[]");
  eventList.push({
    name,
    id,
    answered
  });
  localStorage.setItem("event-list", JSON.stringify(eventList));
};

const getEventStorage = () => {
  const data = localStorage.getItem("event-list");
  if (!data){
    return process.env.NODE_ENV === "production" ? [] : mockEventList;
  }
  return JSON.parse(data) as {name:string,id:string,answered:boolean}[];
}

export {getEventStorage,setEventStorage}