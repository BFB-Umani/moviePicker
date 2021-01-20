import {
  ITrack,
  IUserProfile,
  IResult,
  ISaveResultProps,
} from "moviepicker/reduxStore/store.types";

import { MoviePickerAPI } from "../api.types";
import { firebaseCollections, firestore } from "../index";
import { logAPIError } from "../utils";

export const getLists = async (resultId: IResult["id"]) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.user_lists)
      .where("attendee.id", "==", resultId)
      .get();

    if (response.docs.length === 0 || !response.docs[0]) {
      throw Error("Result does not exist");
    }

    return response.docs[0].data() as MoviePickerAPI.Movie_List;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "getLists",
      error,
    });
  }
};

export const getListByUser = async (userId: IUserProfile["id"]) => {
  try {
    const response = await firestore
      .collection(firebaseCollections.user_lists)
      .where("creator.userAccountKey", "==", userId)
      .get();

    const results: MoviePickerAPI.Movie_List[] = [];
    for (const doc of response.docs) {
      const entry = doc.data() as MoviePickerAPI.Movie_List;
      results.push(entry);
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

/*export const createResult = async (data: ISaveResultProps) => {
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
      MoviePickerAPI.ResultData,
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

    const newResult: MoviePickerAPI.NewResult = {
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
    } as MoviePickerAPI.Result;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createResult",
      error,
    });
  }
};
*/

export const createCreator = async (
  creatorData: MoviePickerAPI.NewCreator
) => {
  try {
    const newCreator = await firestore
      .collection(firebaseCollections.creators)
      .add(creatorData);
    return {
      id: newCreator.id,
      ...creatorData,
    } as MoviePickerAPI.NewCreator;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createCreator",
      error,
    });
  }
};

export const createContributer = async (
  contributerData: MoviePickerAPI.NewContributer
) => {
  try {
    const newContributer = await firestore
      .collection(firebaseCollections.contributers)
      .add(contributerData);
    return {
      id: newContributer.id,
      ...contributerData,
    } as MoviePickerAPI.NewContributer;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createContributer",
      error,
    });
  }
};
