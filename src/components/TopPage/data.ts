import { IEvent } from "@/@types/api/event";

export const mockEventList: IEvent[] = [
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
        units: [
          {
            eventTimeUnitId: "01h74qm81y8534vv2ewg15yn3y",
            availability: "available",
          },
          {
            eventTimeUnitId: "01h74qm81ym6bg48ppe2a2q6b3",
            availability: "unavailable",
          },
          {
            eventTimeUnitId: "01h74qm81ysq1x6jn548mw15jc",
            availability: "available",
          },
          {
            eventTimeUnitId: "01h74qm81ywgv2pnchqgdb3vrv",
            availability: "maybe",
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
