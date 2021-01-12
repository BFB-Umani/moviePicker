import { Dispatch } from "redux";

import { globalReduxSlice } from "./global";
import { IGlobalReduxState } from "./global.types";

const updateAppState = (newState: IGlobalReduxState["appState"]) => (
  dispatch: Dispatch
) => dispatch(globalReduxSlice.actions.setAppState(newState));

export default {
  updateAppState,
};
