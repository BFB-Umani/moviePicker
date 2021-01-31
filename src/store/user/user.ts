import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  IEditUserProfile,
  IError,
  IUserProfile,
} from "../store.types";
import { IUserReduxState } from "./user.types";

const initialState: IUserReduxState = {
  location: {},
};

export const userReduxSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: () => initialState,
    fetchCurrentUserProfileSuccess: (
      state,
      action: PayloadAction<IUserProfile>
    ) => {
      state.profile = action.payload;
    },
    updateProfileSuccess: (state, action: PayloadAction<IEditUserProfile>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
    uploadAvatarSuccess: (state, action: PayloadAction<string>) => {
      state.profile = state.profile
        ? {
            ...state.profile,
            avatarUrl: action.payload,
          }
        : undefined;
    },
    setGranted: (state, action: PayloadAction<boolean>) => {
      state.location.granted = action.payload;
      state.location.error = undefined;
    },
    error: (state, action: PayloadAction<IError>) => {
      state.location.error = action.payload;
    },
  },
});

export default userReduxSlice.reducer;
