import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAlert } from "../store.types";
import { IAlertReduxState } from "./alert.types";

const initialState: IAlertReduxState = {
  list: [],
};

export const alertReduxSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<IAlert>) => {
      state.list = !state.list.find((m) => m.id === action.payload.id)
        ? [...state.list, action.payload]
        : [...state.list];
    },
    animateOut: (state, action: PayloadAction<IAlert["id"]>) => {
      state.list = state.list.map((alert) =>
        alert.id === action.payload
          ? {
              ...alert,
              state: "animating-out",
            }
          : alert
      );
    },
    animateOutByIndex: (state, action: PayloadAction<number>) => {
      state.list = state.list.map((alert, i) =>
        i === action.payload
          ? {
              ...alert,
              state: "animating-out",
            }
          : alert
      );
    },
    close: (state, action: PayloadAction<IAlert["id"]>) => {
      state.list = state.list.filter((modal) => modal.id !== action.payload);
    },
    closeByIndex: (state, action: PayloadAction<number>) => {
      state.list = [
        ...state.list.slice(0, action.payload),
        ...state.list.slice(action.payload + 1),
      ];
    },
    pop: (state) => {
      state.list = [...state.list.slice(0, 0), ...state.list.slice(1)];
    },
    clearAll: (state) => {
      state.list = initialState.list;
    },
  },
});

export default alertReduxSlice.reducer;
