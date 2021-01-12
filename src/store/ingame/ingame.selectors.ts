import { IReduxState } from "b3runtime/reduxStore/store.types";
import Utils from "b3runtime/utils/index";
import * as dateFns from "date-fns";
import { createSelector } from "reselect";

import userSelectors from "../user/user.selectors";
import { IIngameMetrics } from "./ingame.types";

const selectedCompetitionSelector = createSelector(
  (state: IReduxState) => state.ingame,
  (ingameState) => ingameState.selectedCompetition
);
const selectedTrackSelector = createSelector(
  (state: IReduxState) => state.ingame,
  (ingameState) => ingameState.selectedTrack
);

const gameStatsSelector = createSelector(
  (state: IReduxState) => state.ingame,
  (ingameState) => ingameState.stats
);

const currentTrackIdSelector = createSelector(
  selectedTrackSelector,
  (selectedTrack) => selectedTrack?.id
);

// Returns a list of all checkpoints for the current track
const allCheckpointsSelector = createSelector(
  selectedTrackSelector,
  (selectedTrack) => selectedTrack?.checkpoints || []
);

// Returns the currently active checkpoint
const currentCheckpointSelector = createSelector(
  [
    allCheckpointsSelector,
    (state: IReduxState) => state.ingame.currentCheckpointId,
  ],
  (allCheckpoints, currentCheckpointId) =>
    allCheckpoints.find((c) => c.id === currentCheckpointId)
);

// Returns all remaining checkpoints for the the current track
const remainingCheckpointsSelector = createSelector(
  [allCheckpointsSelector, currentCheckpointSelector],
  (allCheckpoints, currentCheckpoint) =>
    allCheckpoints.filter(
      (checkpoint) =>
        currentCheckpoint &&
        ((checkpoint.type !== "PENALTY" &&
          checkpoint.order >= currentCheckpoint.order) ||
          (checkpoint.type === "PENALTY" &&
            checkpoint.order === currentCheckpoint.order))
    )
);

// Returns a list of checkpoint IDs of which the user is within range of
const checkpointsWithinUserRange = createSelector(
  (state: IReduxState) => state.ingame,
  (ingameState) => ingameState.currentCheckpointGeofencesEntered
);

// Get times for the race
const startTimeSelector = createSelector(
  gameStatsSelector,
  (stats) => stats.startTime
);
const finishTimeSelector = createSelector(
  gameStatsSelector,
  (stats) => stats.finishTime
);

// Returns all user locations registered
const userLocationListSelector = createSelector(
  gameStatsSelector,
  (stats) => stats.userLocations
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

// Lists all answers to questions
const questionsAnsweredListSelector = createSelector(
  gameStatsSelector,
  (stats) => stats.questionAnswers
);

// Lists all answers to questions
const visitedCheckpointsListSelector = createSelector(
  gameStatsSelector,
  (stats) => stats.visitedCheckpoints
);

const gameIsReadyToStartSelector = createSelector(
  [
    currentCheckpointSelector,
    userSelectors.userLocationSelector,
    allCheckpointsSelector,
  ],
  (currentCheckpoint, userLocation, allCheckpoints) =>
    !!(allCheckpoints && currentCheckpoint && userLocation)
);

const gameIsOngoingSelector = createSelector(
  [startTimeSelector, finishTimeSelector],
  (startTime, finishTime) =>
    !!startTime &&
    dateFns.differenceInSeconds(new Date(), dateFns.parseISO(startTime)) <
      86400 &&
    !finishTime
);

const ingameMetricsSelector = createSelector(
  [gameStatsSelector, distanceTravelledSelector, allCheckpointsSelector],
  (stats, distance, checkpoints): IIngameMetrics => ({
    distance: distance >= 1000 ? `${distance / 1000}km` : `${distance}m`,
    pace: Utils.calculatePace({
      distance,
      startTime: stats.startTime,
      finishTime: stats.finishTime,
    }),
    score:
      checkpoints.length > 0
        ? `${stats.questionAnswers.length} / ${
            checkpoints.filter((c) => c.type === "QUESTION").length
          }`
        : "-/-",
  })
);

export default {
  selectedCompetitionSelector,
  selectedTrackSelector,
  currentTrackIdSelector,
  allCheckpointsSelector,
  currentCheckpointSelector,
  remainingCheckpointsSelector,
  checkpointsWithinUserRange,
  distanceTravelledSelector,
  startTimeSelector,
  finishTimeSelector,
  userLocationListSelector,
  questionsAnsweredListSelector,
  visitedCheckpointsListSelector,
  gameIsReadyToStartSelector,
  gameIsOngoingSelector,
  ingameMetricsSelector,
};
