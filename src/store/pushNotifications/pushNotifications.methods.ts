import {
  IExpoPushNotification,
  IPushNotification,
  IReduxState,
} from "b3runtime/reduxStore/store.types";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Dispatch } from "redux";

import { addRequestState } from "../requestState";
import { pushNotificationsReduxSlice } from "./pushNotifications";
import pushNotificationsSelectors from "./pushNotifications.selectors";
import { PushNotificationState } from "./pushNotifications.types";

/**
 * Ask for Push Notification Permissions and fetches Expo Push Token
 */
const fetchExpoPushToken = () => async (dispatch: Dispatch) => {
  try {
    // Ask for permissions
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      dispatch(pushNotificationsReduxSlice.actions.setGranted(false));
      return;
    }

    dispatch(pushNotificationsReduxSlice.actions.setGranted(true));
    // Fetch token
    const token = await Notifications.getExpoPushTokenAsync();
    dispatch(pushNotificationsReduxSlice.actions.setExpoToken(token));
  } catch (error) {
    addRequestState({
      name: "fetchExpoPushToken",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * Send a push notification to the user
 */
const sendPushNotification = (data: IPushNotification) => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    dispatch(
      pushNotificationsReduxSlice.actions.setNotificationState("sending")
    );
    const expoToken = pushNotificationsSelectors.expoTokenSelector(getState());
    const hasPermission = pushNotificationsSelectors.hasPermissionSelector(
      getState()
    );

    if (hasPermission && expoToken) {
      const pushNotificationBody: IExpoPushNotification = {
        title: data.title,
        body: data.body,
        to: expoToken,
        sound: data.playSound ? "default" : undefined,
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pushNotificationBody),
      });

      dispatch(
        pushNotificationsReduxSlice.actions.setNotificationState("sent")
      );
    }
  } catch (error) {
    dispatch(pushNotificationsReduxSlice.actions.setNotificationState("error"));
    addRequestState({
      name: "sendPushNotification",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

const setCurrentNotificationState = (newState: PushNotificationState) => (
  dispatch: Dispatch
) =>
  dispatch(pushNotificationsReduxSlice.actions.setNotificationState(newState));

export default {
  fetchExpoPushToken,
  sendPushNotification,
  setCurrentNotificationState,
};
