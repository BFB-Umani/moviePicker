import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IResult } from "../store.types";
import { IResultReduxState } from "./result.types";

export const initialState: IResultReduxState = {
  user: [],
};

export const resultReduxSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    saveGameResultSuccess: (state, action: PayloadAction<IResult>) => {
      state.postGameResult = action.payload;
      // Add to the user results as well
      state.user = !state.user.find((m) => m.id === action.payload.id)
        ? [...state.user, action.payload]
        : state.user;
    },
    fetchUserResultsSuccess: (state, action: PayloadAction<IResult[]>) => {
      state.user = action.payload;
    },
  },
});

export default resultReduxSlice.reducer;
