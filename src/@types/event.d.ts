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
}

export type Schedule = {
  created: string;
  creator: {
    email: string;
    self: boolean;
  };
  end: {
    dateTime:string;
    timeZone: string;
  };
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
  start: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
  summary: string;
  updated: string;
}