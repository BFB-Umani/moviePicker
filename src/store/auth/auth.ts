import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAuthReduxState } from "./auth.types";

const initialState: IAuthReduxState = {
  authenticationState: "INITIAL",
};

export const authReduxSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.authenticationState = "LOGGED_IN";
      state.userId = action.payload;
    },
    logoutSuccess: (state) => {
      state.authenticationState = "LOGGED_OUT";
      state.userId = undefined;
    },
  },
});

export default authReduxSlice.reducer;
