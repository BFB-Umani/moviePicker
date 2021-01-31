import { Dispatch } from "redux";

import { globalReduxSlice } from "./global";
import { IGlobalReduxState } from "./global.types";

/**
 * updates applications state after user grants permissons outside of app
 * @param newState 
 */
const updateAppState = (newState: IGlobalReduxState["appState"]) => (
  dispatch: Dispatch
) => dispatch(globalReduxSlice.actions.setAppState(newState));

export default {
  updateAppState,
};
