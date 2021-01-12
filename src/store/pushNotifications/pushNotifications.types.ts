import * as Notifications from "expo-notifications";

export interface IPushNotificationsReduxState {
  permissionGranted?: boolean;
  expoToken?: Notifications.ExpoPushToken;
  currentNotificationState?: PushNotificationState;
}

export type PushNotificationState =
  | "sent"
  | "sending"
  | "error"
  | "received"
  | "handled";
