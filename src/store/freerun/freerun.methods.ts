import * as dateFns from "date-fns";
import { Dispatch } from "redux";

import { IUserLocation } from "../store.types";
import { freerunReduxSlice } from "./freerun";
import { IFreerunCheckpointTriggerSettings } from "./freerun.types";

const prepareNewGame = ({
  settings,
  categoryIdList,
}: {
  settings: IFreerunCheckpointTriggerSettings;
  categoryIdList: string[];
}) => async (dispatch: Dispatch) => {
  await dispatch(freerunReduxSlice.actions.resetState());
  dispatch(freerunReduxSlice.actions.setCheckpointTriggerSettings(settings));
};

const startGame = () => (dispatch: Dispatch) => {
  dispatch(
    freerunReduxSlice.actions.setStartTime(dateFns.formatISO(new Date()))
  );
  dispatch(freerunReduxSlice.actions.setGameState("ONGOING"));
};

const pauseGame = () => (dispatch: Dispatch) =>
  dispatch(freerunReduxSlice.actions.setGameState("PAUSED"));
const finishGame = () => (dispatch: Dispatch) => {
  dispatch(freerunReduxSlice.actions.setGameState("FINISHED"));
};

/**
 * Adds the user's current location to the list of locations
 */
const addUserLocationToList = (location: IUserLocation) => (
  dispatch: Dispatch
) => {
  dispatch(freerunReduxSlice.actions.addUserLocation(location));
};

export default {
  prepareNewGame,
  startGame,
  pauseGame,
  finishGame,
  addUserLocationToList,
};
