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
