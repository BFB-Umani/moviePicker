import {
  createResult,
  extractCheckpointType,
  getResultsByUser,
} from "b3runtime/firebase/api.methods";
import { B3RuntimeAPI } from "b3runtime/firebase/api.types";
import Utils from "b3runtime/utils";
import * as dateFns from "date-fns";
import { Dispatch } from "redux";

import authSelectors from "../auth/auth.selectors";
import { addRequestState } from "../requestState";
import {
  ICheckpoint,
  IQuestionAnswerData,
  IReduxState,
  IResult,
  ISaveResultProps,
} from "../store.types";
import { resultReduxSlice } from "./result";

const saveGameResult = (data: ISaveResultProps) => async (
  dispatch: Dispatch
) => {
  try {
    const result = await createResult(data);
    if (result) {
      const parsedResult = parseResult(result);
      dispatch(resultReduxSlice.actions.saveGameResultSuccess(parsedResult));
    }
  } catch (error) {
    addRequestState({
      name: "saveGameResult",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

const fetchUserResults = () => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    // Start by fetching the currently logged in user's ID from the state
    const userID = authSelectors.userIdSelector(getState());
    // If we don't find an user ID, the user is not logged in
    if (!userID) {
      throw Error("User currently not logged in");
    }

    addRequestState({
      name: "fetchUserResults",
      state: "LOADING",
    })(dispatch);

    const results = await getResultsByUser(userID);
    const parsedResults = results?.map((r) => parseResult(r));
    dispatch(
      resultReduxSlice.actions.fetchUserResultsSuccess(parsedResults || [])
    );

    addRequestState({
      name: "fetchUserResults",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchUserResults",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

// Helper method to parse results to a usable format
const parseResult = (data: B3RuntimeAPI.Result): IResult => {
  // Start Time
  const startTime = dateFns.formatISO(data.startedTime);

  // Total Time
  const totalTime = Utils.convertMilisecondsToTime(data.totalTime);

  // Calculate Distance
  let distance = 0;
  data.results.forEach((result, i) => {
    if (data.results[i - 1]) {
      distance += Utils.calculateDistance(
        result.latitude,
        result.longitude,
        data.results[i - 1].latitude,
        data.results[i - 1].longitude
      );
    }
  });
  distance = Math.round(distance);
  const totalDistance =
    distance >= 1000 ? `${distance / 1000}km` : `${distance}m`;

  // Calculate pace
  const averagePace = Utils.calculatePace({
    totalTime: data.totalTime || 0,
    distance,
  });

  // Visited Checkpoints
  const visitedCheckpoints: ICheckpoint[] = data.results
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    .map((res, i, list) => ({
      id: res.id,
      label: res.label,
      type: extractCheckpointType(i + 1, list.length, res.penalty),
      order: res.order,
      // Hard-coded for now, but could possibly be a prop in the database collection
      geofenceRadius: 50,
      coordinates: {
        latitude: res.latitude,
        longitude: res.longitude,
      },
    }));

  // Answers
  const questionAnswers: IQuestionAnswerData[] = data.results
    .filter((r) => !!r.questionKey)
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    .map((res, i, list) => ({
      checkpoint: {
        id: res.id,
        type: extractCheckpointType(i + 1, list.length, res.penalty),
        order: res.order,
        // Hard-coded for now, but could possibly be a prop in the database collection
        geofenceRadius: 50,
        coordinates: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
        question: {
          id: res.questionKey || "",
          text: res.label || "",
          // TODO: These needs to be stored/fetched
          categoryId: "",
          correctOption: "",
          options: [],
        },
      },
      selectedOption: "",
      timeToAnswerMs: res.completedTime,
      state: res.answeredCorrect ? "CORRECT" : "INCORRECT",
    }));

  // Calculate Average Answer Time
  const averageTimeToAnswer = Utils.convertMilisecondsToTime(
    data.results.reduce((acc, current) => acc + current.completedTime, 0) /
      data.results.length,
    true
  );

  return {
    id: data.attendee.id,
    user: {
      id: data.attendee.userAccountKey,
      email: data.attendee.email,
      username: data.attendee.name,
    },
    competition: {
      id: data.attendee.competitionKey,
      name: data.attendee.competitionName,
      order: 0,
      tracks: [],
    },
    track: {
      id: data.attendee.trackKey,
      name: data.attendee.trackName,
    },
    startTime,
    totalTime,
    totalDistance,
    averagePace,
    visitedCheckpoints,
    questionAnswers,
    averageTimeToAnswer,
    // TODO: This should be stored and fetched from the database
    userLocations: [],
  };
};

export default {
  saveGameResult,
  fetchUserResults,
};
