import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

const expoTokenSelector = createSelector(
  (state: IReduxState) => state.pushNotifications,
  (pushNotificationsState) => pushNotificationsState.expoToken
);

const hasPermissionSelector = createSelector(
  (state: IReduxState) => state.pushNotifications,
  (pushNotificationsState) => pushNotificationsState.permissionGranted
);

const currentNotificationStateSelector = createSelector(
  (state: IReduxState) => state.pushNotifications,
  (pushNotificationsState) => pushNotificationsState.currentNotificationState
);

export default {
  expoTokenSelector,
  hasPermissionSelector,
  currentNotificationStateSelector,
};
