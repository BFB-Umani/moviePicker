import Utils from "b3runtime/utils/index";
import { createSelector } from "reselect";

import { IReduxState } from "../store.types";
import { IFreerunMetrics } from "./freerun.types";

const gameStateSelector = createSelector(
  (state: IReduxState) => state.freerun,
  (freerunState) => freerunState.state
);

const checkpointTriggerSettingsSelector = createSelector(
  (state: IReduxState) => state.freerun,
  (freerunState) => freerunState.checkpointTriggerSettings
);

const userLocationListSelector = createSelector(
  (state: IReduxState) => state.freerun,
  (freerunState) => freerunState.userLocationList
);

// Calculates and returns how far the user has walked
// based on the locations registered (in meters)
const distanceTravelledSelector = createSelector(
  userLocationListSelector,
  (locations) => {
    let totalDistance = 0;
    locations.forEach((location, i) => {
      if (locations[i - 1]) {
        totalDistance += Utils.calculateDistance(
          location.latitude,
          location.longitude,
          locations[i - 1].latitude,
          locations[i - 1].longitude
        );
      }
    });
    return Math.round(totalDistance);
  }
);

const gameMetricsSelector = createSelector(
  [(state: IReduxState) => state.freerun, distanceTravelledSelector],
  (freerunState, distance): IFreerunMetrics => ({
    startTime: freerunState.startTime,
    distance: distance >= 1000 ? `${distance / 1000}km` : `${distance}m`,
    score: "0",
  })
);

export default {
  gameStateSelector,
  checkpointTriggerSettingsSelector,
  userLocationListSelector,
  gameMetricsSelector,
};
