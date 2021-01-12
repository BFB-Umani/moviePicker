import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ICheckpoint,
  ICompetition,
  IQuestionAnswerData,
  ITrack,
  IUserLocation,
} from "../store.types";
import { IIngameReduxState } from "./ingame.types";

export const initialState: IIngameReduxState = {
  initialized: false,
  stats: {
    userLocations: [],
    questionAnswers: [],
    visitedCheckpoints: [],
  },
  currentCheckpointGeofencesEntered: [],
};

export const ingameReduxSlice = createSlice({
  name: "ingame",
  initialState,
  reducers: {
    resetState: () => initialState,
    setSelectedTrackAndCompetition: (
      state,
      action: PayloadAction<{ competition: ICompetition; track: ITrack }>
    ) => {
      state.selectedCompetition = action.payload.competition;
      state.selectedTrack = action.payload.track;
    },
    setInitializingState: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setStartTime: (state, action: PayloadAction<string>) => {
      state.stats.startTime = action.payload;
    },
    setFinishTime: (state, action: PayloadAction<string>) => {
      state.stats.finishTime = action.payload;
    },
    setCurrentCheckpoint: (state, action: PayloadAction<ICheckpoint["id"]>) => {
      state.currentCheckpointId = action.payload;
    },
    addCheckpointVisited: (state, action: PayloadAction<ICheckpoint>) => {
      const checkpoint = state.stats.visitedCheckpoints.find(
        (c) => c.id === action.payload.id
      );

      if (!checkpoint) {
        state.stats.visitedCheckpoints = [
          ...state.stats.visitedCheckpoints,
          action.payload,
        ];
      }
    },
    enterCheckpointGeofence: (
      state,
      action: PayloadAction<ICheckpoint["id"]>
    ) => {
      state.currentCheckpointGeofencesEntered = !state.currentCheckpointGeofencesEntered.includes(
        action.payload
      )
        ? [...state.currentCheckpointGeofencesEntered, action.payload]
        : state.currentCheckpointGeofencesEntered;
    },
    exitCheckpointGeofence: (
      state,
      action: PayloadAction<ICheckpoint["id"]>
    ) => {
      state.currentCheckpointGeofencesEntered = state.currentCheckpointGeofencesEntered.filter(
        (id) => id !== action.payload
      );
    },
    addUserLocation: (state, action: PayloadAction<IUserLocation>) => {
      state.stats.userLocations = [
        ...state.stats.userLocations,
        action.payload,
      ];
    },
    addQuestionAnswer: (state, action: PayloadAction<IQuestionAnswerData>) => {
      state.stats.questionAnswers = [
        ...state.stats.questionAnswers,
        action.payload,
      ];
    },
  },
});

export default ingameReduxSlice.reducer;
