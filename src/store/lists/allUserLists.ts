import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMovieList } from "../store.types";
import { IAllUserListsReduxState } from "./lists.types";

const initialState: IAllUserListsReduxState = {};

export const allUserListsReduxSlice = createSlice({
  name: "allUserLists",
  initialState,
  reducers: {
    resetState: () => initialState,
    fetchAllUserListsSuccess: (
    state,
    action: PayloadAction<IMovieList[]>
    ) => {
        state.list = action.payload;
    },
  },
});

export default allUserListsReduxSlice.reducer;
