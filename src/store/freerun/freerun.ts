import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUserLocation } from "../store.types";
import {
  FreerunGameState,
  IFreerunCheckpointTriggerSettings,
  IFreerunReduxState,
} from "./freerun.types";

export const initialState: IFreerunReduxState = {
  state: "INITIAL",
  checkpointTriggerSettings: {
    type: "TIME",
  },
  userLocationList: [],
};

export const freerunReduxSlice = createSlice({
  name: "ingame",
  initialState,
  reducers: {
    resetState: () => initialState,
    setGameState: (state, action: PayloadAction<FreerunGameState>) => {
      state.state = action.payload;
    },
    setCheckpointTriggerSettings: (
      state,
      action: PayloadAction<IFreerunCheckpointTriggerSettings>
    ) => {
      state.checkpointTriggerSettings = action.payload;
    },
    setStartTime: (state, action: PayloadAction<string>) => {
      state.startTime = action.payload;
    },
    addUserLocation: (state, action: PayloadAction<IUserLocation>) => {
      state.userLocationList = [...state.userLocationList, action.payload];
    },
  },
});

export default freerunReduxSlice.reducer;
