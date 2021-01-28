import { IReduxState } from "moviepicker/reduxStore/store.types";
import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";

const movieSearchListSelector = createSelector(
  (state: IReduxState) => state.searchResult,
  (searchListState) =>
    searchListState.searchResult 
      ? searchListState.searchResult
      : []
);

const movieSearchStateSelector = generateRequestStateSelectors(
  "searchMovies"
);

export default {
  movieSearchStateSelector,
  movieSearchListSelector,
};
