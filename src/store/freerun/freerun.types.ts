import { IUserLocation } from "../store.types";

export type FreerunGameState = "INITIAL" | "ONGOING" | "PAUSED" | "FINISHED";

export interface IFreerunReduxState {
  state: FreerunGameState;
  startTime?: string;
  userLocationList: IUserLocation[];
  selectedCategoryIdList?: string[];
  checkpointTriggerSettings: IFreerunCheckpointTriggerSettings;
}

export interface IFreerunCheckpointTriggerSettings {
  type: "TIME" | "DISTANCE" | "STEPS";
  interval?: number;
}

export interface IFreerunMetrics {
  startTime?: IFreerunReduxState["startTime"];
  distance: string;
  score: string;
}
