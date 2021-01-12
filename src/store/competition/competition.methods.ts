import * as APIMethods from "b3runtime/firebase/api.methods";
import { Dispatch } from "redux";

import { addRequestState, requestStateSlice } from "../requestState";
import { ICompetition, IReduxState } from "../store.types";
import { competitionReduxSlice } from "./competition";
import competitionSelectors from "./competition.selectors";

// Fetches all available competitions
const fetchCompetitions = () => async (dispatch: Dispatch) => {
  try {
    addRequestState({
      name: "fetchCompetitions",
      state: "LOADING",
    })(dispatch);

    const competitionList = await APIMethods.getAllCompetitions();

    dispatch(
      competitionReduxSlice.actions.fetchCompetitionsSuccess(competitionList)
    );
    addRequestState({
      name: "fetchCompetitions",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchCompetitions",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

const fetchCompetitionTrackList = (competitionId: ICompetition["id"]) => async (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  try {
    // Find the targeted competition in the state
    const allCompetitions = competitionSelectors.competitionListSelector(
      getState()
    );
    let competition = allCompetitions.find((c) => c.id === competitionId);

    // If we aren't refreshing the data, and already have loaded all the tracks previously, we simply return the competition
    if (competition && !competition.tracks.find((c) => !c.name)) {
      return competition;
    }

    addRequestState({
      name: "fetchCompetitionTrackList",
      state: "LOADING",
    })(dispatch);

    if (!competition) {
      competition = await APIMethods.getCompetition(competitionId);
    }
    const tracks = await APIMethods.getTracksByCompetition(competitionId);

    // Add the track data to the competition list to prevent unecessary refetch of data
    dispatch(
      competitionReduxSlice.actions.fetchCompetitionTrackListSuccess({
        competitionId,
        tracks,
      })
    );
    addRequestState({
      name: "fetchCompetitionTrackList",
      state: "COMPLETE",
    })(dispatch);

    return competition;
  } catch (error) {
    addRequestState({
      name: "fetchCompetitionTrackList",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

const fetchTrackById = (trackId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(
      requestStateSlice.actions.setState({
        name: "fetchTrackById",
        state: "LOADING",
      })
    );

    const track = await APIMethods.getTrack(trackId);

    dispatch(
      requestStateSlice.actions.setState({
        name: "fetchTrackById",
        state: "COMPLETE",
      })
    );
    return track;
  } catch (error) {
    dispatch(
      requestStateSlice.actions.setState({
        name: "fetchTrackById",
        state: "ERROR",
        error,
      })
    );
  }
};

export default {
  fetchCompetitions,
  fetchCompetitionTrackList,
  fetchTrackById,
};
