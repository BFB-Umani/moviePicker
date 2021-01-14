import firebase, { firebaseAuth } from "moviepicker/firebase";
import * as Google from "expo-google-app-auth";
import { Dispatch } from "redux";

import { alertReduxSlice } from "../alert/alert";
import alertMethods from "../alert/alert.methods";
import { addRequestState } from "../requestState";
import { IReduxState } from "../store.types";
import { userReduxSlice } from "../user/user";
import userMethods from "../user/user.methods";
import { authReduxSlice } from "./auth";
import { ILoginCredentials, ISignupFields } from "./auth.types";

const formatFirebaseErrors = (errorCode: string) => {
  console.log(errorCode);
  switch (errorCode) {
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/invalid-password":
    case "auth/wrong-password":
      return "The email or password is invalid";
    case "auth/invalid-email-verified":
      return "The email has not yet been verified";
    case "auth/email-already-exists":
      return "The email already exists";
    case "auth/email-already-in-use":
      return "The email is already in use";
    case "auth/weak-password":
      return "The password is not strong enough";
    default:
      return "Unknown error";
  }
};

const checkAuthenticationState = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  firebaseAuth.onAuthStateChanged(async (user) => {
    try {
      if (!user) {
        throw Error("Not logged in");
      }

      dispatch(authReduxSlice.actions.loginSuccess(user.uid));

      // Check if the user has a game in progress, otherwise make sure to clean the state
      const hasAnOngoingGame = ingameSelectors.gameIsOngoingSelector(
        getState()
      );
      if (!hasAnOngoingGame) {
        dispatch(ingameReduxSlice.actions.resetState());
      }

      await userMethods.fetchCurrentUserProfile()(dispatch, getState);
    } catch (e) {
      // We ended up here because there was an error or that the user isn't logged in
      dispatch(authReduxSlice.actions.logoutSuccess());
    }
  });
};

const loginCredentials = (credentials: ILoginCredentials) => async (
  dispatch: Dispatch
) => {
  try {
    // Make sure we have the necessary data
    if (!credentials.email) {
      throw Error("No email provided");
    }
    if (!credentials.password) {
      throw Error("No password provided");
    }
    addRequestState({
      name: "loginCredentials",
      state: "LOADING",
    })(dispatch);
    // Send the request
    const response = await firebaseAuth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    if (!response.user) {
      throw Error("User not found");
    }
    // All great!
    addRequestState({
      name: "loginCredentials",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    const formattedError = error.code
      ? formatFirebaseErrors(error.code)
      : error.toString();

    addRequestState({
      name: "loginCredentials",
      state: "ERROR",
      error: { message: formattedError, stack: error },
    })(dispatch);
  }
};

const loginGoogle = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    addRequestState({
      name: "loginGoogle",
      state: "LOADING",
    })(dispatch);
    // Login to Google and retrieve the necessary tokens
    const googleLoginResponse = await Google.logInAsync({
      androidClientId:
        "792814669342-jv82g4o0u9l65r0498qpe6754g33td3r.apps.googleusercontent.com",
      iosClientId:
        "792814669342-j8lvfe55kemrk97ocoagvtkqbec2mfhg.apps.googleusercontent.com",
      androidStandaloneAppClientId:
        "792814669342-a2jm536hpaj6i0uk4in91i27ruimogii.apps.googleusercontent.com",
      iosStandaloneAppClientId:
        "792814669342-j8lvfe55kemrk97ocoagvtkqbec2mfhg.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });
    // If the login at Google was interrupted
    if (googleLoginResponse.type !== "success") {
      throw Error("Google login was cancelled");
    }
    // Retrieve credentials based on Google tokens we got from the previous step
    const googleCredentials = await firebase.auth.GoogleAuthProvider.credential(
      googleLoginResponse.idToken,
      googleLoginResponse.accessToken
    );
    // Login
    const loginResponse = await firebaseAuth.signInWithCredential(
      googleCredentials
    );
    // The user does not exist
    if (!loginResponse.user) {
      throw Error("User not found");
    }

    // Check if the user has a profile
    const userExist = await userMethods.fetchUserProfile(
      loginResponse.user.uid
    )(dispatch);
    if (!userExist) {
      // If there is no profile, we need to set one up
      userMethods.createUserProfile({
        id: loginResponse.user.uid,
        email: loginResponse.user.email || undefined,
      });
    }

    // All done!
    addRequestState({
      name: "loginGoogle",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    const formattedError = error.code
      ? formatFirebaseErrors(error.code)
      : error.toString();

    alertMethods.createAlert({
      text: formattedError,
      color: "danger",
      icon: "exclamation-circle",
      closable: true,
      closeAfter: 5000,
    })(dispatch, getState);
    addRequestState({
      name: "loginGoogle",
      state: "ERROR",
      error: { message: formattedError, stack: error },
    })(dispatch);
  }
};

const logout = () => async (dispatch: Dispatch) => {
  try {
    await firebaseAuth.signOut();
    dispatch(userReduxSlice.actions.resetState());
    dispatch(ingameReduxSlice.actions.resetState());
    dispatch(alertReduxSlice.actions.clearAll());
  } catch (error) {
    addRequestState({
      name: "logout",
      state: "ERROR",
      error: { message: error },
    })(dispatch);
  }
};

const requestResetPassword = (email: string) => async (dispatch: Dispatch) => {
  try {
    addRequestState({
      name: "requestResetPassword",
      state: "LOADING",
    })(dispatch);
    await firebaseAuth.sendPasswordResetEmail(email);
    addRequestState({
      name: "requestResetPassword",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "requestResetPassword",
      state: "ERROR",
      error: { message: error },
    })(dispatch);
  }
};

const signup = (fields: ISignupFields) => async (dispatch: Dispatch) => {
  try {
    // Make sure we have the necessary data
    if (!fields.email) {
      throw Error("No email provided");
    }
    if (!fields.password) {
      throw Error("No password provided");
    }
    addRequestState({
      name: "signup",
      state: "LOADING",
    })(dispatch);
    // Create User
    const createdUserResponse = await firebaseAuth.createUserWithEmailAndPassword(
      fields.email,
      fields.password
    );
    if (!createdUserResponse.user) {
      throw Error("Unknown error");
    }
    // Create a User Profile
    await userMethods.createUserProfile({
      id: createdUserResponse.user.uid,
      ...fields,
    })(dispatch);

    // Automatically log the user in
    await loginCredentials({
      email: fields.email,
      password: fields.password,
    })(dispatch);

    addRequestState({
      name: "signup",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    const formattedError = error.code
      ? formatFirebaseErrors(error.code)
      : error.toString();

    addRequestState({
      name: "signup",
      state: "ERROR",
      error: { message: formattedError, stack: error },
    })(dispatch);
  }
};

export default {
  checkAuthenticationState,
  loginCredentials,
  loginGoogle,
  logout,
  requestResetPassword,
  signup,
};
