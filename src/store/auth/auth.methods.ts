import { firebaseAuth } from "moviepicker/firebase";
import { Dispatch } from "redux";

import { alertReduxSlice } from "../alert/alert";
import { addRequestState } from "../requestState";
import { IReduxState } from "../store.types";
import { userReduxSlice } from "../user/user";

import { allUserListsReduxSlice } from "../lists/allUserLists";
import { contributersListReduxSlice } from "../lists/contributersList";
import { moviesReduxSlice } from "../lists/movies";
import { movieListReduxSlice } from "../lists/lists";

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

/**
 * checks if user is logged in
 */
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
      await userMethods.fetchCurrentUserProfile()(dispatch, getState);
    } catch (e) {
      // We ended up here because there was an error or that the user isn't logged in
      dispatch(authReduxSlice.actions.logoutSuccess());
    }
  });
};

/**
 * log the user in to the app using credentials
 * @param credentials 
 */
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

/**
 * log the user out from the application and resets the different states used
 */
const logout = () => async (dispatch: Dispatch) => {
  try {
    await firebaseAuth.signOut();
    dispatch(userReduxSlice.actions.resetState());
    dispatch(allUserListsReduxSlice.actions.resetState());
    dispatch(contributersListReduxSlice.actions.resetState());
    dispatch(moviesReduxSlice.actions.resetState());
    dispatch(movieListReduxSlice.actions.resetState());
    dispatch(alertReduxSlice.actions.clearAll());
  } catch (error) {
    addRequestState({
      name: "logout",
      state: "ERROR",
      error: { message: error },
    })(dispatch);
  }
};

/**
 * Sends user an email to reset their password using built in firebase function
 * @param email 
 */
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

/**
 * creates an user account connected to firebase and then creates a user profile connected to the credentials given by the user
 * @param fields 
 */
const signup = (fields: ISignupFields) => async (dispatch: Dispatch, getState: () => IReduxState) => {
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

    await userMethods.fetchCurrentUserProfile()(dispatch, getState);

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
  logout,
  requestResetPassword,
  signup,
};
