import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

const alertListSelector = createSelector(
  (state: IReduxState) => state.alert,
  (alertState) => (alertState && alertState.list) || []
);

export default {
  alertListSelector,
};
