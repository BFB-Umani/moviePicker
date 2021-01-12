import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICompetition, ITrack } from "../store.types";
import { ICompetitionReduxState } from "./competition.types";

const initialState: ICompetitionReduxState = {};

export const competitionReduxSlice = createSlice({
  name: "competition",
  initialState,
  reducers: {
    fetchCompetitionsSuccess: (
      state,
      action: PayloadAction<ICompetition[]>
    ) => {
      state.list = action.payload;
    },
    fetchCompetitionTrackListSuccess: (
      state,
      action: PayloadAction<{
        competitionId: ICompetition["id"];
        tracks: ITrack[];
      }>
    ) => {
      const targetedCompetition =
        state.list &&
        state.list.find((c) => c.id === action.payload.competitionId);
      if (state.list && targetedCompetition) {
        state.list = [
          ...state.list.filter((c) => c.id !== action.payload.competitionId),
          {
            ...targetedCompetition,
            tracks: action.payload.tracks,
          },
        ];
      }
    },
  },
});

export default competitionReduxSlice.reducer;
