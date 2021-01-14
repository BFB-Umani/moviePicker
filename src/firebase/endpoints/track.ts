import {
  ICheckpoint,
  ICompetition,
  IQuestionOption,
  ITrack,
} from "moviepicker/reduxStore/store.types";

import firebase, { firebaseCollections, firestore } from "..";
import { B3RuntimeAPI } from "../api.types";
import { logAPIError } from "../utils";

export const getAllCompetitions = async () => {
  const response = await firestore
    .collection(firebaseCollections.competitions)
    .where("active", "==", true)
    .get();

  const competitions: ICompetition[] = [];

  for (const doc of response.docs) {
    const competition = doc.data() as B3RuntimeAPI.Competition;

    const tracks: ITrack[] = competition.trackKeys.map((key) => ({
      id: key,
    }));

    competitions.push({
      id: doc.id,
      // TODO: We manually set the order to the place in the array that they arrived in
      // This could (and should probably) be set in the backend instead
      order: competitions.length,
      name: competition.name,
      tracks,
    });
  }
  return competitions;
};

export const getCompetition = async (competitionId: ICompetition["id"]) => {
  // Fetch Track Details
  const response = await firestore
    .collection(firebaseCollections.competitions)
    .where(firebase.firestore.FieldPath.documentId(), "==", competitionId)
    .get();

  const entry = response.docs[0].data() as B3RuntimeAPI.Competition;

  const tracks: ITrack[] = entry.trackKeys.map((key) => ({
    id: key,
  }));

  const competition: ICompetition = {
    id: competitionId,
    name: entry.name,
    // TODO: We manually set the order to the place in the array that they arrived in
    // This could (and should probably) be set in the backend instead
    order: -1,
    tracks,
  };

  return competition;
};

export const getTracksByCompetition = async (
  competitionId: ICompetition["id"]
) => {
  const competition = await getCompetition(competitionId);

  const response = await firestore
    .collection(firebaseCollections.tracks)
    .where(
      firebase.firestore.FieldPath.documentId(),
      "in",
      competition.tracks.map((track) => track.id)
    )
    .get();

  const tracks: ITrack[] = [];
  for (const doc of response.docs) {
    const trackEntry = doc.data() as B3RuntimeAPI.Track;
    if (trackEntry) {
      tracks.push({
        id: doc.id,
        name: trackEntry.name,
      });
    }
  }

  return tracks;
};

/**
 * Returns a track based on a given ID
 */
export const getTrack = async (trackId: string) => {
  // Fetch Track Details
  const trackFetchResponse = await firestore
    .collection(firebaseCollections.tracks)
    .where(firebase.firestore.FieldPath.documentId(), "==", trackId)
    .get();

  if (trackFetchResponse.docs.length === 0 || !trackFetchResponse.docs[0]) {
    throw Error("Track does not exist");
  }

  const trackEntry = trackFetchResponse.docs[0].data() as B3RuntimeAPI.Track;

  // Fetch related checkpoints
  const checkpointFetchResponse = await firestore
    .collection(firebaseCollections.tracks)
    .doc(trackId)
    .collection(firebaseCollections.checkpoints)
    .orderBy("order")
    .get();

  const checkpoints: ICheckpoint[] = [];

  for (const doc of checkpointFetchResponse.docs) {
    const checkpoint = doc.data() as B3RuntimeAPI.Checkpoint;

    // Fetch any related question
    let question;
    if (checkpoint.questionKey) {
      question = await getQuestion(checkpoint.questionKey);
    }

    checkpoints.push({
      id: doc.id,
      label: checkpoint.label,
      coordinates: {
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
      },
      geofenceRadius: 50, // Hard-coded for now, but could possibly be a prop in the database collection
      order: checkpoint.order,
      type: extractCheckpointType(
        checkpoint.order,
        checkpointFetchResponse.docs.length,
        checkpoint.penalty
      ),
      question,
    });
  }

  const track: ITrack = {
    id: trackId,
    name: trackEntry.name,
    categoryId: trackEntry.categoryKey,
    checkpoints,
  };

  return track;
};

// Fetches and returns a question by ID
export const getQuestion = async (id: string) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.questions)
      .doc(id)
      .get();

    // TODO: Create proper interfaces that matches the backend structure
    const questionEntry = response.data() as B3RuntimeAPI.Question;

    const options = parseQuestionOptions(questionEntry.options);

    return {
      id,
      categoryId: questionEntry.categoryKey,
      text: questionEntry.text,
      imageUrl: questionEntry.imgUrl,
      options,
      correctOption: questionEntry.correctAnswer,
    };
  } catch (error) {
    logAPIError({
      origin: "api.methods",
      methodName: "getQuestionById",
      error,
    });
  }
};

// Helper method that parses a given QuestionOption into the wanted type
export const parseQuestionOptions = (
  data: B3RuntimeAPI.QuestionOption[]
): IQuestionOption[] => {
  if (data && data.length > 0) {
    return data.map((entry) => ({
      value: entry.option,
      text: entry.text,
      imageUrl: entry.imgUrl,
    }));
  }
  return [];
};

// Helper method to extract the type of a checkpoint
export const extractCheckpointType = (
  checkpointOrder: number,
  amountOfCheckpoints: number,
  isPenalty?: boolean
): ICheckpoint["type"] => {
  if (checkpointOrder === 1) {
    return "START";
  }
  if (checkpointOrder >= amountOfCheckpoints) {
    return "FINISH";
  }
  if (isPenalty) {
    return "PENALTY";
  }
  return "QUESTION";
};
