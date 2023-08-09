export type IEvent = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  unitDuration: number;
  units: IUnit[];
  userAnswers: IUserAnswer[];
};

export type IUnit = {
  id: string;
  startAt: string;
};

export type IUserAnswer = {
  id: string;
  userId: string;
  userNickname: string;
  note: string;
  units: IUserAnswerUnit[];
};

export type IUserAnswerUnit = {
  eventTimeUnitId: string;
  availability: IAvailability;
};

export type IAvailability = "available" | "unavailable" | "maybe";
