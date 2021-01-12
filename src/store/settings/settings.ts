import { createSlice } from "@reduxjs/toolkit";

import { ISettingsReduxState } from "./settings.types";

const initialState: ISettingsReduxState = {
  settings: {
    map: {
      type: "standard",
      style: "default",
      drawCheckpointLines: true,
      drawUserPath: true,
    },
    ui: {
      showTime: true,
      showDistanceTravelled: true,
      showPace: false,
      showScore: true,
    },
    general: {
      soundOn: true,
    },
  },
};

export const settingsReduxSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeSetting: (state, action) => {
      state.settings = {
        ...state.settings,
        [action.payload.settingType]: {
          ...state.settings[action.payload.settingType],
          [action.payload.setting]: action.payload.value,
        },
      };
    },
  },
});

export default settingsReduxSlice.reducer;
