import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

const appStateSelector = createSelector(
  (state: IReduxState) => state.global,
  (globalState) => globalState.appState
);

export default {
  appStateSelector,
};
