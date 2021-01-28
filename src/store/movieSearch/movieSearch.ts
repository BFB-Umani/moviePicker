import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IMovieResults,
} from "../store.types";
import { IMovieSearchReduxState } from "./movieSearch.types";

const initialState: IMovieSearchReduxState = {};

export const movieSearchReduxSlice = createSlice({
  name: "movieSearch",
  initialState,
  reducers: {
    resetState: () => initialState,
    fetchMovieSuccess: (
      state,
      action: PayloadAction<IMovieResults[]>
    ) => {
      state.searchResult = action.payload;
    },
  },
});

export default movieSearchReduxSlice.reducer;
