import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMovie } from "../store.types";
import { IMoviesReduxState } from "./lists.types";

const initialState: IMoviesReduxState = {};

export const moviesReduxSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
      resetState: () => initialState,
      fetchMoviesSuccess: (
        state,
        action: PayloadAction<IMovie[]>
      ) => {
        state.list = action.payload;
      },
    },
  });

export default moviesReduxSlice.reducer;