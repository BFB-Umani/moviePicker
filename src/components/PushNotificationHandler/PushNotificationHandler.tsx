import pushNotificationsMethods from "b3runtime/reduxStore/pushNotifications/pushNotifications.methods";
import pushNotificationsSelectors from "b3runtime/reduxStore/pushNotifications/pushNotifications.selectors";
import { PushNotificationState } from "b3runtime/reduxStore/pushNotifications/pushnotifications.types";
import { IReduxState } from "b3runtime/reduxStore/store.types";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { connect } from "react-redux";

interface Props extends IStateProps, IDispatchProps {}

const PushNotificationHandler: React.FC<Props> = (props) => {
  useEffect(() => {
    props.fetchExpoPushToken();
    const notificationSubscription = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );
    return () => {
      notificationSubscription.remove();
    };
  }, []);

  const onNotificationReceived = (notification) => {
    /**
     * Received a notification while the app is in the backgound
     * and the notification has been clicked
     */
    if (notification.origin === "selected") {
      props.setNotificationState("handled");
      /**
       * Received a notification while the app is in the foreground
       */
    } else if (notification.origin === "received") {
      props.setNotificationState("received");
    }
  };

  return <>{props.children}</>;
};

interface IStateProps {
  currentNotificationState?: PushNotificationState;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  currentNotificationState: pushNotificationsSelectors.currentNotificationStateSelector(
    state
  ),
});

interface IDispatchProps {
  fetchExpoPushToken: () => void;
  setNotificationState: (state: PushNotificationState) => void;
}
const mapDispatchToProps: IDispatchProps = {
  fetchExpoPushToken: pushNotificationsMethods.fetchExpoPushToken,
  setNotificationState: pushNotificationsMethods.setCurrentNotificationState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PushNotificationHandler);
