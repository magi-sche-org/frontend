import { EventTimeDuration, HourOfDay } from "../../constants/event";
export type IEvent = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  unitDuration: number;
  yourAnswerId?: string;
  units: IUnit[];
  userAnswers: IUserAnswer[];
};

export type IUnit = {
  id: string;
  startsAt: string;
};

export type IUserAnswer = {
  id: string;
  userId: string;
  userNickname: string;
  isYourAnswer: boolean;
  note: string;
  units: IUserAnswerUnit[];
};

export type IUserAnswerUnit = {
  eventTimeUnitId: string;
  availability: IAvailability;
};

export type IEventResponse = {
  userAnswers: IUserAnswerResponse[];
} & IEvent;

export type IUserAnswerResponse = {
  id: string;
  userId: string;
  userNickname: string;
  isYourAnswer: boolean;
  note: string;
  units: IUserAnswerUnitResponse[];
};

export type IUserAnswerUnitResponse = {
  eventTimeUnitId: string;
  availability: IAvailability;
  startsAt: string;
  endsAt: string;
};

export type IDateAnswersResponse = {
  [startsTime: string]: {
    startsTime: string;
    counts: { [availability in IAvailability | "total"]: number };
    answers: IDateAnswerItem[];
  };
};

export type IAvailability = "available" | "unavailable" | "maybe";

export type IDateAnswers = {
  [startsTime: string]: IDateAnswer;
};

export type IDateAnswer = {
  startsTime: string;
  counts: { [availability in IAvailability | "total"]: number };
  answers: IDateAnswerItem[];
};

export type IDateAnswerItem = {
  userId: string;
  name: string;
  availability: IAvailability;
};
export type IEventTimeDuration = (typeof EventTimeDuration)[number];

export type IHourOfDay = (typeof HourOfDay)[number];
