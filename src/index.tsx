import ModalHandler from "moviepicker/components/Modal/ModalHandler";
import alertMethods from "moviepicker/reduxStore/alert/alert.methods";
import { IAlert, IReduxState } from "moviepicker/reduxStore/store.types";
import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus, Text } from "react-native";
import { connect } from "react-redux";

import Navigation, { navigationRef } from "./navigation/Navigation";
import alertSelectors from "./store/alert/alert.selectors";
import authMethods from "./store/auth/auth.methods";
import authSelectors from "./store/auth/auth.selectors";
import { AuthenticationState } from "./store/auth/auth.types";
import globalMethods from "./store/global/global.methods";
import { IGlobalReduxState } from "./store/global/global.types";
import userMethods from "./store/user/user.methods";
import userSelectors from "./store/user/user.selectors";

const MoviePicker: React.FunctionComponent<IStateProps & IDispatchProps> = (
  props
) => {
  const [currentAppState, setCurrentAppState] = useState<AppStateStatus>();

  useEffect(() => {
    props.checkAuthenticationState();

    /**
     * App background state change handler
     */
    const _handleAppStateChange = (nextAppState) => {
      if (
        currentAppState &&
        currentAppState.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        props.updateAppState("foreground");
        // If the app returns to foreground, we need to
        // check if the user has changed the permissions for location
        props.requestUserLocation();
      } else {
        props.updateAppState("background");
      }
      setCurrentAppState(nextAppState);
    };
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  return (
    <>
      <PushNotificationHandler />
      <ModalHandler />
      <Text>hej</Text>
      <Navigation
        isAuthStateKnown={props.authState !== "INITIAL"}
        isAuthenticated={
          !props.isLoginInProgress && props.authState === "LOGGED_IN"
        }
      />
    </>
  );
};

interface IStateProps {
  authState: AuthenticationState;
  isLoginInProgress: boolean;
  userLocationGranted: boolean;
  alertList: IAlert[];
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  authState: authSelectors.authenticationStateSelector(state),
  isLoginInProgress: authSelectors.isLoginInProgressSelector(state),
  userLocationGranted: userSelectors.userLocationGranted(state),
  alertList: alertSelectors.alertListSelector(state),
});

interface IDispatchProps {
  updateAppState: (newState: IGlobalReduxState["appState"]) => void;
  checkAuthenticationState: () => void;
  requestUserLocation: () => void;
  createAlert: (alert: IAlert) => void;
  closeAlert: (id: IAlert["id"]) => void;
}
const mapDispatchToProps: IDispatchProps = {
  updateAppState: globalMethods.updateAppState,
  checkAuthenticationState: authMethods.checkAuthenticationState,
  requestUserLocation: userMethods.requestUserLocation,
  createAlert: alertMethods.createAlert,
  closeAlert: alertMethods.closeAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviePicker);
