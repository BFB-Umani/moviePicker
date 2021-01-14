import { IReduxState } from "moviepicker/reduxStore/store.types";
import { createSelector } from "reselect";

const alertListSelector = createSelector(
  (state: IReduxState) => state.alert,
  (alertState) => (alertState && alertState.list) || []
);

export default {
  alertListSelector,
};
