import { IReduxState } from "moviepicker/reduxStore/store.types";
import { createSelector } from "reselect";

const appStateSelector = createSelector(
  (state: IReduxState) => state.global,
  (globalState) => globalState.appState
);

export default {
  appStateSelector,
};
