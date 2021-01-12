import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";

import {
  IPushNotificationsReduxState,
  PushNotificationState,
} from "./pushNotifications.types";

const initialState: IPushNotificationsReduxState = {};

export const pushNotificationsReduxSlice = createSlice({
  name: "pushNotifications",
  initialState,
  reducers: {
    setExpoToken: (
      state,
      action: PayloadAction<Notifications.ExpoPushToken>
    ) => {
      state.expoToken = action.payload;
    },
    setGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    setNotificationState: (
      state,
      action: PayloadAction<PushNotificationState>
    ) => {
      state.currentNotificationState = action.payload;
    },
  },
});

export default pushNotificationsReduxSlice.reducer;
