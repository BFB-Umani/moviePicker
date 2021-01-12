import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IModal } from "../store.types";
import { IModalReduxState } from "./modal.types";

const initialState: IModalReduxState = {
  list: [],
};

export const modalReduxSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<IModal>) => {
      state.list = !state.list.find((m) => m.id === action.payload.id)
        ? [...state.list, action.payload]
        : state.list;
    },
    animateOut: (state, action: PayloadAction<IModal["id"]>) => {
      state.list = state.list.map((modal) =>
        modal.id === action.payload
          ? {
              ...modal,
              state: "animating-out",
            }
          : modal
      );
    },
    close: (state, action: PayloadAction<IModal["id"]>) => {
      state.list = state.list.filter((modal) => modal.id !== action.payload);
    },
    pop: (state) => {
      state.list = [...state.list.slice(0, 0), ...state.list.slice(1)];
    },
  },
});

export default modalReduxSlice.reducer;
