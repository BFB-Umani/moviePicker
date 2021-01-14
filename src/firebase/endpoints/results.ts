import {
  ITrack,
  IUserProfile,
  IResult,
  ISaveResultProps,
} from "moviepicker/reduxStore/store.types";
import * as dateFns from "date-fns";

import { B3RuntimeAPI } from "../api.types";
import { firebaseCollections, firestore } from "../index";
import { logAPIError } from "../utils";

export const getResult = async (resultId: IResult["id"]) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.results)
      .where("attendee.id", "==", resultId)
      .get();

    if (response.docs.length === 0 || !response.docs[0]) {
      throw Error("Result does not exist");
    }

    return response.docs[0].data() as B3RuntimeAPI.Result;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "getResult",
      error,
    });
  }
};

export const getResultsByUser = async (userId: IUserProfile["id"]) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.results)
      .where("attendee.userAccountKey", "==", userId)
      .get();

    const results: B3RuntimeAPI.Result[] = [];
    for (const doc of response.docs) {
      const entry = doc.data() as B3RuntimeAPI.Result;
      if (entry.totalTime) {
        results.push(entry);
      }
    }
    return results;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "getResultsByUser",
      error,
    });
  }
};

export const getResultsByTrack = async (trackId: ITrack["id"]) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.results)
      .where("attendee.trackKey", "==", trackId)
      .where("totalTime", ">", 0)
      .orderBy("totalTime")
      .get();

    const results: B3RuntimeAPI.Result[] = [];
    for (const doc of response.docs) {
      const entry = doc.data() as B3RuntimeAPI.Result;
      if (entry.totalTime) {
        results.push(entry);
      }
    }
    return results;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "getResultsByUser",
      error,
    });
  }
};

export const createResult = async (data: ISaveResultProps) => {
  try {
    // TODO: This information should be stored in the result-entry, and not as a separate collection
    // Create an attendee-object
    const attendee = await createAttendee({
      competitionKey: data.competition.id,
      competitionName: data.competition.name,
      trackKey: data.track.id,
      trackName: data.track.name,
      userAccountKey: data.userId,
    });

    if (!attendee) {
      throw Error("Something went wong when adding attendee data");
    }

    // TODO: The database structure needs to be refactored...
    const resultData: Omit<
      B3RuntimeAPI.ResultData,
      "id"
    >[] = data.visitedCheckpoints.map((checkpoint) => {
      const relatedAnswer = data.questionAnswers.find(
        (qa) => qa.checkpoint.id === checkpoint.id
      );
      return {
        ...checkpoint.coordinates,
        questionKey: checkpoint.question ? checkpoint.question.id : "",
        label: checkpoint.question ? checkpoint.question.text : "",
        completed: true,
        penalty: checkpoint.type === "PENALTY",
        order: checkpoint.order,
        answeredCorrect: relatedAnswer
          ? relatedAnswer.state === "CORRECT"
          : false,
        completedTime: relatedAnswer ? relatedAnswer.timeToAnswerMs : 0,
        skipped: false,
      };
    });

    const newResult: B3RuntimeAPI.NewResult = {
      attendee,
      results: resultData,
      // TODO: Consider storing time in date/time stirngs instead of miliseconds
      startedTime: dateFns.getTime(dateFns.parseISO(data.startTime)),
      // TODO: This should be saved as the actual date/time for finish (the value of data.finishTime in other words)
      totalTime:
        dateFns.getTime(dateFns.parseISO(data.finishTime)) -
        dateFns.getTime(dateFns.parseISO(data.startTime)),
    };

    const response = await firestore
      .collection(firebaseCollections.results)
      .add(newResult);

    return {
      id: response.id,
      ...newResult,
    } as B3RuntimeAPI.Result;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createResult",
      error,
    });
  }
};

export const createAttendee = async (
  attendeeData: B3RuntimeAPI.NewAttendee
) => {
  try {
    const newAttendee = await firestore
      .collection(firebaseCollections.attendees)
      .add(attendeeData);
    return {
      id: newAttendee.id,
      ...attendeeData,
    } as B3RuntimeAPI.NewAttendee;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createAttendee",
      error,
    });
  }
};
