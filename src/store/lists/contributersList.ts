import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMovieList } from "../store.types";
import { IContributersReduxState } from "./lists.types";

const initialState: IContributersReduxState = {};

export const contributersListReduxSlice = createSlice({
  name: "contributersList",
  initialState,
  reducers: {
    resetState: () => initialState,
    fetchContributersListsSuccess: (
    state,
    action: PayloadAction<IMovieList[]>
    ) => {
        state.list = action.payload;
    },
  },
});

export default contributersListReduxSlice.reducer;
