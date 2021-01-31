import { IReduxState } from "moviepicker/reduxStore/store.types";
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

export default {
  userProfileSelector,
  userFullnameSelector,
  userNeedsToSetupProfileSelector,
  fetchProfileStateSelector,
  updateProfileStateSelector,
  uploadAvatarStateSelector,
  toggleCameraToUpdateAvatarStateSelector,
  openCameraRollToUpdateAvatarStateSelector,
};
