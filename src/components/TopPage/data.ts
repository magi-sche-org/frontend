import { IEventResponse } from "@/@types/api/event";

export const mockEventList: IEventResponse[] = [
  {
    id: "01h74qm81vvtkbbqdmtmdwq2td",
    ownerId: "01h74qkv36jgrg7k33ys6ft7kd",
    name: "mock1",
    description: "aaa",
    unitDuration: 1800,
    yourAnswerId: "01h752125sk4myyvymbkf1vfv8",
    units: [
      {
        id: "01h74qm81ysq1x6jn548mw15jc",
        startsAt: "2023-08-05T10:00:00Z",
      },
      {
        id: "01h74qm81ym6bg48ppe2a2q6b3",
        startsAt: "2023-08-05T10:30:00Z",
      },
      {
        id: "01h74qm81y8534vv2ewg15yn3y",
        startsAt: "2023-08-05T11:00:00Z",
      },
      {
        id: "01h74qm81ywgv2pnchqgdb3vrv",
        startsAt: "2023-08-05T11:30:00Z",
      },
    ],
    userAnswers: [
      {
        id: "01h752125sk4myyvymbkf1vfv8",
        userId: "01h74qkv36jgrg7k33ys6ft7kd",
        userNickname: "はろ太郎",
        note: "遅れそう",
        isYourAnswer: false,
        units: [
          {
            eventTimeUnitId: "01h74qm81y8534vv2ewg15yn3y",
            availability: "available",
            startsAt: "1",
            endsAt: "2",
          },
          {
            eventTimeUnitId: "01h74qm81ym6bg48ppe2a2q6b3",
            availability: "unavailable",
            startsAt: "1",
            endsAt: "2",
          },
          {
            eventTimeUnitId: "01h74qm81ysq1x6jn548mw15jc",
            availability: "available",
            startsAt: "1",
            endsAt: "2",
          },
          {
            eventTimeUnitId: "01h74qm81ywgv2pnchqgdb3vrv",
            availability: "maybe",
            startsAt: "1",
            endsAt: "2",
          },
        ],
      },
    ],
  },
  {
    id: "01h74qm81vvtkbbqdmtmdwq2td",
    ownerId: "01h74qkv36jgrg7k33ys6ft7kd",
    name: "mock2",
    description: "aaa",
    unitDuration: 1800,
    units: [
      {
        id: "01h74qm81ysq1x6jn548mw15jc",
        startsAt: "2023-08-05T10:00:00Z",
      },
      {
        id: "01h74qm81ym6bg48ppe2a2q6b3",
        startsAt: "2023-08-05T10:30:00Z",
      },
      {
        id: "01h74qm81y8534vv2ewg15yn3y",
        startsAt: "2023-08-05T11:00:00Z",
      },
      {
        id: "01h74qm81ywgv2pnchqgdb3vrv",
        startsAt: "2023-08-05T11:30:00Z",
      },
    ],
    userAnswers: [],
  },
];
