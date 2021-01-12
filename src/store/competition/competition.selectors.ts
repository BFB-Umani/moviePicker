import { IReduxState } from "b3runtime/reduxStore/store.types";
import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";

const competitionListSelector = createSelector(
  (state: IReduxState) => state.competition,
  (competitionState) =>
    competitionState.list
      ? competitionState.list
          .slice()
          .sort((a, b) => (a.order > b.order ? 1 : -1))
      : []
);

const fetchCompetitionsStateSelector = generateRequestStateSelectors(
  "fetchCompetitions"
);
const fetchCompetitionTrackListStateSelector = generateRequestStateSelectors(
  "fetchCompetitionTrackList"
);

export default {
  competitionListSelector,
  fetchCompetitionsStateSelector,
  fetchCompetitionTrackListStateSelector,
};
