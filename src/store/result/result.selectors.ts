import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";
import { IReduxState } from "../store.types";

const currentUserResultFeedSelector = createSelector(
  (state: IReduxState) => state.result,
  (resultState) => resultState.user
);

const postgameResultSelector = createSelector(
  (state: IReduxState) => state.result,
  (resultState) => resultState.postGameResult
);

const fetchUserResultsStateSelector = generateRequestStateSelectors(
  "fetchUserResults"
);

export default {
  currentUserResultFeedSelector,
  postgameResultSelector,
  fetchUserResultsStateSelector,
};
