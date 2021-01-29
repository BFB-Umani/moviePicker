import { IReduxState } from "moviepicker/reduxStore/store.types";
import { createSelector } from "reselect";

import { generateRequestStateSelectors } from "../requestState";

const movieListSelector = createSelector(
  (state: IReduxState) => state.lists,
  (movieListState) =>
    movieListState.list
      ? movieListState.list
      : []
);

const contributersListSelector = createSelector(
  (state: IReduxState) => state.contributersLists,
  (movieListState) =>
    movieListState.list
      ? movieListState.list
      : []
);

const allUserListsSelector = createSelector(
  (state: IReduxState) => state.allUserLists,
  (movieListState) =>
    movieListState.list
      ? movieListState.list
      : []
);

const moviesSelector = createSelector(
  (state: IReduxState) => state.movieList,
  (movieListState) =>
    movieListState.list
      ? movieListState.list
      : []
);

const fetchListStateSelector = generateRequestStateSelectors(
  "fetchLists"
);
const fetchMovieListStateSelector = generateRequestStateSelectors(
  "fetchMovies"
);

const addMovieToList = generateRequestStateSelectors(
  "addMovie"
)

export default {
  movieListSelector,
  contributersListSelector,
  allUserListsSelector,
  moviesSelector,
  fetchListStateSelector,
  fetchMovieListStateSelector,
  addMovieToList,
};
