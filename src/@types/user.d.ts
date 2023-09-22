export type User = {
  id: string;
  name: string;
  isRegistered: boolean;
  providers: UserProvider[];
};

export type UserProvider = {
  name: string;
  registered: boolean;
};

export type UserEventItem = {
  id: string;
  name: string;
  description: string;
  durationAbout: string;
  unitDuration: number;
};
