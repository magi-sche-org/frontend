export type ScheduleResponse = {
  accessRole: string;
  defaultReminders: {
    method: string;
    minutes: number;
  }[];
  etag: string;
  items: Schedule[];
  kind: string;
  summary: string;
  timeZone: string;
  updated: string;
};

export type Schedule = DateTimeSchedule | DateSchedule;

type DateTimeSchedule = {
  created: string;
  creator: {
    email: string;
    self: boolean;
  };
  end: EventDateTime;
  etag: string;
  eventType: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: {
    email: string;
    self: boolean;
  };
  reminders: {
    useDefault: boolean;
  };
  sequence: number;
  start: EventDateTime;
  status: string;
  summary: string;
  updated: string;
};

type DateSchedule = {
  created: string;
  creator: {
    email: string;
    self: boolean;
  };
  end: EventDate;
  etag: string;
  eventType: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: {
    email: string;
    self: boolean;
  };
  reminders: {
    useDefault: boolean;
  };
  sequence: number;
  start: EventDate;
  status: string;
  summary: string;
  updated: string;
};

type EventDateTime = {
  dateTime: string;
  timeZone: string;
};
type EventDate = {
  date: string;
};
