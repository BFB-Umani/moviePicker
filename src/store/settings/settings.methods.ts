import { IAppSettings } from "b3runtime/reduxStore/store.types";
import { Dispatch } from "redux";

import { settingsReduxSlice } from "./settings";

const editSetting = <
  T extends keyof IAppSettings,
  K extends keyof IAppSettings[T],
  V extends IAppSettings[T][K]
>(
  settingType: T,
  setting: K,
  value: V
) => (dispatch: Dispatch) => {
  dispatch(
    settingsReduxSlice.actions.changeSetting({ settingType, setting, value })
  );
};

export default {
  editSetting,
};
