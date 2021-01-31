import firebase, {
  firebaseStorage,
  firestore,
  firebaseCollections,
} from "moviepicker/firebase";
import { MoviePickerAPI } from "moviepicker/firebase/api.types";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Alert } from "react-native";
import { Dispatch } from "redux";

import authSelectors from "../auth/auth.selectors";
import { addRequestState } from "../requestState";
import {
  IReduxState,
  IEditUserProfile,
  IUserProfile,
} from "../store.types";
import { userReduxSlice } from "./user";

/**
 * Fetches the currently logged in user's profile
 */
export const fetchCurrentUserProfile = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    addRequestState({
      name: "fetchCurrentUserProfile",
      state: "LOADING",
    })(dispatch);

    // Start by fetching the currently logged in user's ID from the state
    const userID = authSelectors.userIdSelector(getState());
    // If we don't find an user ID, the user is not logged in
    if (!userID) {
      throw Error("User currently not logged in");
    }

    const userProfile = await fetchUserProfile(userID)(dispatch);

    if (!userProfile) {
      throw Error("User profile does not exist");
    }

    dispatch(
      userReduxSlice.actions.fetchCurrentUserProfileSuccess(userProfile)
    );
    addRequestState({
      name: "fetchCurrentUserProfile",
      state: "COMPLETE",
    })(dispatch);
    return userProfile;
  } catch (error) {
    addRequestState({
      name: "fetchCurrentUserProfile",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * fetches a user profile by using the userId connected to the user
 * @param userId 
 */
export const fetchUserProfile = (userId: string) => async (dispatch: Dispatch) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.user_accounts)
      .where(firebase.firestore.FieldPath.documentId(), "==", userId)
      .get();

    if (response.docs.length === 0 || !response.docs[0]) {
      throw Error("User profile does not exist");
    }

    // Attempt to fetch the user's avatar
    let avatarUrl;
    try {
      avatarUrl = await firebaseStorage
        .ref()
        .child(`profile_images/${userId}/avatar.jpg`)
        .getDownloadURL();
    } catch (e) {
      // The avatar could not be loaded
    } finally {
      const userProfileData = response.docs[0].data() as MoviePickerAPI.UserData;
      const userProfile: IUserProfile = {
        id: userProfileData.id,
        email: userProfileData.email,
        username: userProfileData.username,
        firstname: userProfileData.firstName,
        lastname: userProfileData.lastName,
        avatarUrl,
      };
      return userProfile;
    }
  } catch (error) {
    addRequestState({
      name: "fetchUserProfile",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * fetches a user by using the email connected to the user
 * @param userEmail 
 */
export const fetchUserProfileByEmail = async (userEmail: string) => {
  try {
    let userProfileData;
    await firestore
      .collection(firebaseCollections.user_accounts)
      .where("email", "==", userEmail)
      .get().then((response) => {
        if (response.docs.length === 0 || !response.docs[0]) {
          throw Error("User profile does not exist");
        }
        userProfileData = response.docs[0].data() as MoviePickerAPI.UserData;
      });

      return userProfileData.id as string;
  } catch (error) {
  }
};

/**
 * Create a new User Profile linked to a given user ID
 */
export const createUserProfile = (profileData: IUserProfile) => async (
  dispatch: Dispatch
) => {
  try {
    if (!profileData.id) {
      throw Error("No User ID provided");
    }

    // First we need to check if the given userID already is linked to a profile
    const userExist = await fetchUserProfile(profileData.id)(dispatch);
    if (userExist) {
      throw Error(
        `There is already a profile linked to user ID: ${profileData.id}`
      );
    }

    addRequestState({
      name: "createUserProfile",
      state: "LOADING",
    })(dispatch);

    // Create the new profile
    await firestore
      .collection(firebaseCollections.user_accounts)
      .doc(profileData.id)
      .set({
        id: profileData.id,
        email: profileData.email || null,
        firstName: profileData.firstname || null,
        lastName: profileData.lastname || null,
        username: profileData.username || null,
      });

    addRequestState({
      name: "createUserProfile",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "createUserProfile",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = (profileData: IEditUserProfile) => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    addRequestState({
      name: "updateUserProfile",
      state: "LOADING",
    })(dispatch);

    // Start by fetching the currently logged in user's ID from the state
    const userID = authSelectors.userIdSelector(getState());
    // If we don't find an user ID, the user is not logged in
    if (!userID) {
      throw Error("User currently not logged in");
    }

    // Update the profile
    await firestore
      .collection(firebaseCollections.user_accounts)
      .doc(userID)
      .update({
        email: profileData.email || null,
        firstName: profileData.firstname || null,
        lastName: profileData.lastname || null,
        username: profileData.username || null,
      });

    dispatch(
      userReduxSlice.actions.updateProfileSuccess({
        ...profileData,
      })
    );
    addRequestState({
      name: "updateUserProfile",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "updateUserProfile",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * starts mobile camera for user to upload a profile picture
 */
export const toggleCameraToUpdateAvatar = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    // Check permissions
    const permission = await Permissions.askAsync(Permissions.CAMERA);
    if (permission.status !== "granted") {
      Alert.alert(
        "No permission",
        "You need to grant permission to use the camera",
        [{ text: "Ok" }]
      );
      throw Error("Camera permission not granted");
    }

    const cameraImage = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (cameraImage.cancelled) {
      throw Error("Camera was cancelled");
    }

    await uploadAvatar(cameraImage.uri)(dispatch, getState);
    return cameraImage.uri;
  } catch (error) {
    addRequestState({
      name: "toggleCameraToUpdateAvatar",
      state: "ERROR",
      error,
    })(dispatch);
  }
};


/**
 * opens mobile camera-roll for user to upload a profile picture
 */
export const openCameraRollToUpdateAvatar = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    // Check permissions
    const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== "granted") {
      Alert.alert(
        "No permission",
        "You need to grant permission to select an image from your device",
        [{ text: "Ok" }]
      );
      throw Error("Camera roll permission not granted");
    }

    const galleryImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (galleryImage.cancelled) {
      throw Error("Select image was cancelled");
    }

    await uploadAvatar(galleryImage.uri)(dispatch, getState);
    return galleryImage.uri;
  } catch (error) {
    addRequestState({
      name: "openCameraRollToUpdateAvatar",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * uploads chosen image from user to database connected to their user account
 * @param imageURI 
 */
export const uploadAvatar = (imageURI: string) => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    addRequestState({
      name: "uploadAvatar",
      state: "LOADING",
    })(dispatch);
    // Start by fetching the currently logged in user's ID from the state
    const userID = authSelectors.userIdSelector(getState());
    // If we don't find an user ID, the user is not logged in
    if (!userID) {
      throw Error("User currently not logged in");
    }

    // Setup image
    const response = await fetch(imageURI);
    const blob = await response.blob();

    await firebaseStorage
      .ref()
      .child(`profile_images/${userID}/avatar.jpg`)
      .put(blob, {
        contentType: "image/jpg",
      });

    const imageURL = await firebaseStorage
      .ref()
      .child(`profile_images/${userID}/avatar.jpg`)
      .getDownloadURL();

    dispatch(userReduxSlice.actions.uploadAvatarSuccess(imageURL));
    addRequestState({
      name: "uploadAvatar",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "uploadAvatar",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

export default {
  fetchCurrentUserProfile,
  fetchUserProfile,
  fetchUserProfileByEmail,
  createUserProfile,
  updateUserProfile,
  toggleCameraToUpdateAvatar,
  openCameraRollToUpdateAvatar,
};
