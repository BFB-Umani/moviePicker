import {
  ICheckpoint,
  ICompetition,
  IQuestionAnswerData,
  ITrack,
  IUserLocation,
} from "../store.types";

interface IIngameStats {
  startTime?: string;
  finishTime?: string;
  questionAnswers: IQuestionAnswerData[];
  userLocations: IUserLocation[];
  visitedCheckpoints: ICheckpoint[];
}

export interface IIngameMetrics {
  pace: string;
  distance: string;
  score: string;
}

export interface IIngameReduxState {
  selectedCompetition?: ICompetition;
  selectedTrack?: ITrack;
  initialized: boolean;
  currentCheckpointId?: ICheckpoint["id"];
  currentCheckpointGeofencesEntered: ICheckpoint["id"][];
  stats: IIngameStats;
}
