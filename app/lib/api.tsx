import React from "react";
import { AppState } from "react-native";
import { ReactQueryConfigProvider } from "react-query";
import { useAppState } from "./appstate";
import axios from "./axios";

export type DeskResult = {
  id: number;
  uri: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  developer: {
    id: number;
    name: string;
    email: string;
  };
};

export type DesksListResult = {
  total: number;
  results: DeskResult[];
};

export type SignupResult = {
  name: string;
  email: string;
  token: string;
};
export type PostDeskResult = {
  status: string;
};

// These API call functions do not require try/catch because they are used with
// the useAsyncCallback hook in the /api/ folder. This hook catches exceptions from
// axios directly. So no need to catch exceptions and handle them.

export async function fetchDesksList(): Promise<DesksListResult> {
  const response = await axios.get<DesksListResult>(`/desks`);
  return response.data;
}

export async function fetchDesk(id: number): Promise<DeskResult> {
  const response = await axios.get<DeskResult>(`/desks/${id}`);
  return response.data;
}

export async function postDesk(
  title: string,
  uri: string,
  token: string,
  latitude: number,
  longitude: number
): Promise<PostDeskResult> {
  if (!token) {
    throw Error("Not authorized");
  }
  const response = await axios.post<PostDeskResult>(
    "/desks",
    { title, uri, latitude, longitude },
    { headers: { authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<SignupResult> {
  const response = await axios.post<SignupResult>("/auth/signup", {
    email,
    password,
    name,
  });
  return response.data;
}

export async function login(
  email: string,
  password: string
): Promise<SignupResult> {
  const response = await axios.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export function ApiQueryConfigProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ReactQueryConfigProvider
      config={{
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
      }}
    >
      {children}
    </ReactQueryConfigProvider>
  );
}
