export type UserLocation = {
  latitude: number;
  longitude: number;
};

export type DeveloperCard = {
  createdAt: string;
  distance: number | undefined;
  developer: Developer;
  developerId: number;
  latitude: number;
  longitude: number;
  title: string | null;
  updatedAt: string;
  uri: string;
};

type Developer = {
  email: string;
  id: number;
  name: string;
};
