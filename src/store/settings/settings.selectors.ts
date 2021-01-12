import { IAppSettings, IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

const allSettings = createSelector(
  (state: IReduxState) => state.settings,
  (settingsState): IAppSettings => settingsState.settings || {}
);

const mapSettingsSelector = createSelector(
  (state: IReduxState) => state.settings,
  (settingsState) => settingsState.settings.map
);

const uiSettingsSelector = createSelector(
  (state: IReduxState) => state.settings,
  (settingsState) => settingsState.settings.ui
);

/**
 * A boolean check that returns whether the map is dark or bright
 * primarily used to determine the brightness of the map content
 */
const isMapDarkSelector = createSelector(mapSettingsSelector, (mapSettings) => {
  if (mapSettings.type === "satellite" || mapSettings.type === "hybrid") {
    return true;
  }
  if (mapSettings.type === "standard") {
    if (mapSettings.style === "dark" || mapSettings.style === "night") {
      return true;
    }
  }
  return false;
});

export default {
  allSettings,
  mapSettingsSelector,
  uiSettingsSelector,
  isMapDarkSelector,
};
