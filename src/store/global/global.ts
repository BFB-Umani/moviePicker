import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IGlobalReduxState } from "./global.types";

const initialState: IGlobalReduxState = {
  appState: "foreground",
};

export const globalReduxSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAppState: (
      state,
      action: PayloadAction<IGlobalReduxState["appState"]>
    ) => {
      state.appState = action.payload;
    },
  },
});

export default globalReduxSlice.reducer;
