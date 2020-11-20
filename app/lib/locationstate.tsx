import React, { createContext, useContext, useState } from "react";

// Instead of Redux for global application state, we're using
//  a super simple react context, nothing more.

// This will be less efficient, but also easier to work with
//  as long as the app doesn't grow super big.

// Also, fetching data from the API, and posting to it, is delegated
//  to the library `react-query`, instead of using e.g. thunks
//  in the global application state store. See `app/lib/api.tsx`.

type LocationState = {
  location: null | string;
};

const LocationStateContext = createContext<{
  state: LocationState;
  setState: React.Dispatch<LocationState>;
}>(null as any);

export function LocationStateProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [state, setState] = useState<LocationState>(() => {
    return { location: null };
  });

  return (
    <LocationStateContext.Provider value={{ state, setState }}>
      {children}
    </LocationStateContext.Provider>
  );
}

export function useLocationState<T = LocationState>(
  selector?: (state: LocationState) => T
) {
  const { state } = useContext(LocationStateContext);
  return selector ? selector(state) : state;
}

export function useSetLocationState() {
  return useContext(LocationStateContext).setState;
}
