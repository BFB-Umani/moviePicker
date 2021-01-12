import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";

const authenticationStateSelector = createSelector(
  (state: IReduxState) => state.auth,
  (authState) => authState.authenticationState
);
const userIdSelector = createSelector(
  (state: IReduxState) => state.auth,
  (authState) => authState.userId
);

const loginCredentialsStateSelector = generateRequestStateSelectors(
  "loginCredentials"
);
const loginGoogleStateSelector = generateRequestStateSelectors("loginGoogle");
const isLoginInProgressSelector = (state: IReduxState) =>
  loginCredentialsStateSelector.isLoading(state) ||
  loginGoogleStateSelector.isLoading(state);
const requestResetPasswordStateSelector = generateRequestStateSelectors(
  "requestResetPassword"
);
const signupStateSelector = generateRequestStateSelectors("signup");

export default {
  authenticationStateSelector,
  userIdSelector,
  loginCredentialsStateSelector,
  loginGoogleStateSelector,
  isLoginInProgressSelector,
  requestResetPasswordStateSelector,
  signupStateSelector,
};
