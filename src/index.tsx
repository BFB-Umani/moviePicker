import React, { useEffect, useState } from "react";
import { IReduxState } from "moviepicker/reduxStore/store.types";
import { AppState, AppStateStatus } from "react-native";
import { connect } from "react-redux";

import Navigation from "./navigation/Navigation";
import authMethods from "./store/auth/auth.methods";
import authSelectors from "./store/auth/auth.selectors";
import { AuthenticationState } from "./store/auth/auth.types";
import globalMethods from "./store/global/global.methods";
import { IGlobalReduxState } from "./store/global/global.types";

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
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  authState: authSelectors.authenticationStateSelector(state),
  isLoginInProgress: authSelectors.isLoginInProgressSelector(state),
});

interface IDispatchProps {
  updateAppState: (newState: IGlobalReduxState["appState"]) => void;
  checkAuthenticationState: () => void;
}
const mapDispatchToProps: IDispatchProps = {
  updateAppState: globalMethods.updateAppState,
  checkAuthenticationState: authMethods.checkAuthenticationState,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviePicker);
