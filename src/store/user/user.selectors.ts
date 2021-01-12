import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";

const fetchProfileStateSelector = generateRequestStateSelectors("fetchProfile");
const updateProfileStateSelector = generateRequestStateSelectors(
  "updateUserProfile"
);
const uploadAvatarStateSelector = generateRequestStateSelectors("uploadAvatar");
const toggleCameraToUpdateAvatarStateSelector = generateRequestStateSelectors(
  "toggleCameraToUpdateAvatar"
);
const openCameraRollToUpdateAvatarStateSelector = generateRequestStateSelectors(
  "openCameraRollToUpdateAvatar"
);

const userProfileSelector = createSelector(
  (state: IReduxState) => state.user,
  (userState) => userState.profile
);

const userFullnameSelector = createSelector(
  userProfileSelector,
  (userProfile) => {
    if (userProfile) {
      if (userProfile.firstname && userProfile.lastname) {
        return `${userProfile.firstname} ${userProfile.lastname}`;
      }
      if (userProfile.firstname) {
        return userProfile.firstname;
      }
      if (userProfile.lastname) {
        return userProfile.lastname;
      }
    }
  }
);

const userNeedsToSetupProfileSelector = createSelector(
  [(state: IReduxState) => state.user, fetchProfileStateSelector.error],
  (userState, fetchProfileError): boolean =>
    !!userState.profile && !!fetchProfileError
);

// Returns the users currently known location
const userLocationSelector = createSelector(
  (state: IReduxState) => state.user.location,
  (locationState) => locationState.data
);
// Any errors related to User Location
const userLocationErrorSelector = createSelector(
  (state: IReduxState) => state.user.location,
  (locationState) => locationState.error
);
// Is user location granted?
const userLocationGranted = createSelector(
  (state: IReduxState) => state.user.location,
  (locationState) => locationState.granted || false
);

export default {
  userProfileSelector,
  userFullnameSelector,
  userNeedsToSetupProfileSelector,
  fetchProfileStateSelector,
  updateProfileStateSelector,
  uploadAvatarStateSelector,
  toggleCameraToUpdateAvatarStateSelector,
  openCameraRollToUpdateAvatarStateSelector,
  userLocationSelector,
  userLocationErrorSelector,
  userLocationGranted,
};
