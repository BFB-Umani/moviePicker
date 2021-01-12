import * as APIMethods from "b3runtime/firebase/api.methods";
import {
  ICheckpoint,
  IUserLocation,
  IReduxState,
  IQuestionAnswerData,
} from "b3runtime/reduxStore/store.types";
import Utils from "b3runtime/utils/index";
import * as dateFns from "date-fns";
import { CacheManager } from "react-native-expo-image-cache";
import { Dispatch } from "redux";

import authSelectors from "../auth/auth.selectors";
import { addRequestState } from "../requestState";
import resultMethods from "../result/result.methods";
import userMethods from "../user/user.methods";
import userSelectors from "../user/user.selectors";
import { ingameReduxSlice } from "./ingame";
import ingameSelectors from "./ingame.selectors";

/**
 * Initializes a track and fetches the necessary data
 */
const initializeTrack = ({
  competitionId,
  trackId,
  currentCheckpointId,
}: {
  competitionId: string;
  trackId: string;
  currentCheckpointId?: ICheckpoint["id"];
}) => async (dispatch: Dispatch, getState: () => IReduxState) => {
  try {
    if (!trackId) {
      throw Error("No trackId was provided");
    }

    // Request user location
    await userMethods.requestUserLocation()(dispatch, getState);

    // Check if there is a track loaded which is still in progress
    // (and has not been in progress for more than 1 day) to prevent a refetch
    const gameIsOnGoing = ingameSelectors.gameIsOngoingSelector(getState());
    const previouslyLoadedTrackId = ingameSelectors.currentTrackIdSelector(
      getState()
    );
    if (previouslyLoadedTrackId !== trackId || !gameIsOnGoing) {
      // Reset previously loaded tracks
      await dispatch(ingameReduxSlice.actions.resetState());

      const competition = await APIMethods.getCompetition(competitionId);
      const track = await APIMethods.getTrack(trackId);
      dispatch(
        ingameReduxSlice.actions.setSelectedTrackAndCompetition({
          competition,
          track,
        })
      );

      if (
        !track.checkpoints ||
        (track.checkpoints && track.checkpoints.length === 0)
      ) {
        throw Error("Track is missing checkpoints");
      }

      // Pre-fetch question images
      for (const checkpoint of track.checkpoints) {
        if (checkpoint.question && checkpoint.question.imageUrl) {
          await CacheManager.get(checkpoint.question.imageUrl, {}).getPath();
        }
      }

      // Set the current checkpoint ID
      let currentCheckpoint = track.checkpoints[0];
      // If we have received another checkpoint than the first one to be used
      if (currentCheckpointId) {
        // Make sure the provided current checkpoint actually exists before assigning it
        const providedCurrentCheckpoint = track.checkpoints.find(
          (c) => c.id === currentCheckpointId
        );
        if (providedCurrentCheckpoint) {
          currentCheckpoint = providedCurrentCheckpoint;
        }
      }

      dispatch(
        ingameReduxSlice.actions.setCurrentCheckpoint(currentCheckpoint.id)
      );
      dispatch(ingameReduxSlice.actions.setInitializingState(true));
    } else {
      // We have a game in progress already and are ready to go
      dispatch(ingameReduxSlice.actions.setInitializingState(true));
    }
  } catch (error) {
    addRequestState({
      name: "initializeTrack",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

const deinitializeCurrentTrack = () => (dispatch: Dispatch) => {
  dispatch(ingameReduxSlice.actions.setInitializingState(false));
};

/**
 * Start the current game
 */
const toggleStart = () => (dispatch: Dispatch) => {
  dispatch(
    ingameReduxSlice.actions.setStartTime(dateFns.formatISO(new Date()))
  );
};

/**
 * Stops the current game
 */
const toggleFinish = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  // Add the final checkpoint to the list of checkpoints visited
  const finalCheckpoint = ingameSelectors.currentCheckpointSelector(getState());
  if (finalCheckpoint) {
    dispatch(ingameReduxSlice.actions.addCheckpointVisited(finalCheckpoint));
  }

  const finishTime = dateFns.formatISO(new Date());
  // Save a summary
  const competition = ingameSelectors.selectedCompetitionSelector(getState());
  const track = ingameSelectors.selectedTrackSelector(getState());
  const startTime = ingameSelectors.startTimeSelector(getState());
  const questionAnswers = ingameSelectors.questionsAnsweredListSelector(
    getState()
  );
  const visitedCheckpoints = ingameSelectors.visitedCheckpointsListSelector(
    getState()
  );
  const userLocations = ingameSelectors.userLocationListSelector(getState());

  const currentUserId = await authSelectors.userIdSelector(getState());
  // Make sure we are logged in before saving the result
  if (startTime && currentUserId && track && competition) {
    await resultMethods.saveGameResult({
      userId: currentUserId,
      competition,
      track,
      startTime,
      finishTime,
      visitedCheckpoints,
      userLocations,
      questionAnswers,
    })(dispatch);
  }
  dispatch(ingameReduxSlice.actions.setFinishTime(finishTime));
};

/**
 * Activates the next checkpoint in the list
 */
const activateNextCheckpoint = (inputType?: ICheckpoint["type"]) => (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  const allCheckpoints = ingameSelectors.allCheckpointsSelector(getState());
  const currentCheckpoint = ingameSelectors.currentCheckpointSelector(
    getState()
  );

  if (allCheckpoints && allCheckpoints.length > 0 && currentCheckpoint) {
    // Find all checkpoints either by the given type or those that aren't a penalty-checkpoint,
    // and then sort the list by order to retrive which one should be up next
    const orderedCheckpoints = allCheckpoints
      .filter(
        (c) =>
          ((inputType && c.type === inputType) ||
            (!inputType && c.type !== "PENALTY")) &&
          c.order > currentCheckpoint.order
      )
      .sort((a, b) => (a.order > b.order ? 1 : -1));

    // We found a checkpoint
    if (orderedCheckpoints && orderedCheckpoints[0]) {
      // Add the current checkpoint to the list of checkpoints visited
      dispatch(
        ingameReduxSlice.actions.addCheckpointVisited(currentCheckpoint)
      );
      // Set the new checkpoint to the current one
      dispatch(
        ingameReduxSlice.actions.setCurrentCheckpoint(orderedCheckpoints[0].id)
      );
      // If the user is currently within an active checkpoint geofence, we leave it
      if (currentCheckpoint) {
        dispatch(
          ingameReduxSlice.actions.exitCheckpointGeofence(currentCheckpoint.id)
        );
      }
    }
  }
};

/**
 * Activate a checkpoint by a given ID
 */
const activateCheckpointById = (checkpointId: ICheckpoint["id"]) => (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  const allCheckpoints = ingameSelectors.allCheckpointsSelector(getState());
  const currentCheckpoint = ingameSelectors.currentCheckpointSelector(
    getState()
  );

  const checkpointToActivate = allCheckpoints.find(
    (c) => c.id === checkpointId
  );

  if (checkpointToActivate) {
    // If the user is currently within an active checkpoint geofence, we leave it
    if (currentCheckpoint) {
      dispatch(
        ingameReduxSlice.actions.exitCheckpointGeofence(currentCheckpoint.id)
      );
    }
    dispatch(
      ingameReduxSlice.actions.setCurrentCheckpoint(checkpointToActivate.id)
    );
  }
};

/**
 * Checkpoint Geofence entered
 */
const enterCheckpointGeofence = (checkpointId: ICheckpoint["id"]) => (
  dispatch: Dispatch
) => dispatch(ingameReduxSlice.actions.enterCheckpointGeofence(checkpointId));

/**
 * Checkpoint Geofence exited
 */
const exitCheckpointGeofence = (checkpointId: ICheckpoint["id"]) => (
  dispatch: Dispatch
) => dispatch(ingameReduxSlice.actions.exitCheckpointGeofence(checkpointId));

/**
 * Adds the user's current location to the list of locations
 */
const addUserLocationToList = (location: IUserLocation) => (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  const hasGameStarted = ingameSelectors.gameIsOngoingSelector(getState());
  if (hasGameStarted) {
    // Log user's movement
    dispatch(ingameReduxSlice.actions.addUserLocation(location));
  }
  // Check the location
  checkUserLocation()(dispatch, getState);
};

/**
 * Check the user's current location and if it is within the current geofence
 */
const checkUserLocation = () => (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  const userLocation = userSelectors.userLocationSelector(getState());
  // Check if there is a current checkpoint to target
  const currentCheckpoint = ingameSelectors.currentCheckpointSelector(
    getState()
  );
  if (userLocation && currentCheckpoint) {
    // If the user has not yet been tagged as being within the checkpoint's geofence,
    // we trigger the action here
    const checkpointsWithinUserRange = ingameSelectors.checkpointsWithinUserRange(
      getState()
    );
    if (!checkpointsWithinUserRange.find((id) => id === currentCheckpoint.id)) {
      // Calculate the distance between the player and the checkpoint
      const distance = Utils.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        currentCheckpoint.coordinates.latitude,
        currentCheckpoint.coordinates.longitude
      );

      // We are close enough!
      if (distance < currentCheckpoint.geofenceRadius) {
        dispatch(
          ingameReduxSlice.actions.enterCheckpointGeofence(currentCheckpoint.id)
        );
      }
    }
  }
};

/**
 * Log an answer to a specific question
 */
const logQuestionAnswer = (data: IQuestionAnswerData) => (dispatch: Dispatch) =>
  dispatch(ingameReduxSlice.actions.addQuestionAnswer(data));

/**
 * Resets the previously initiated game
 */
const resetGame = () => (dispatch: Dispatch) => {
  dispatch(ingameReduxSlice.actions.resetState());
};

export default {
  initializeTrack,
  deinitializeCurrentTrack,
  toggleStart,
  toggleFinish,
  activateNextCheckpoint,
  activateCheckpointById,
  addUserLocationToList,
  checkUserLocation,
  enterCheckpointGeofence,
  exitCheckpointGeofence,
  logQuestionAnswer,
  resetGame,
};
