import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMovieList } from "../store.types";
import { IMovieListsReduxState } from "./lists.types";

const initialState: IMovieListsReduxState = {};

export const movieListReduxSlice = createSlice({
  name: "movieList",
  initialState,
  reducers: {
    resetState: () => initialState,
    fetchListsSuccess: (
      state,
      action: PayloadAction<IMovieList[]>
    ) => {
      state.list = action.payload;
    },
  },
});

export default movieListReduxSlice.reducer;
