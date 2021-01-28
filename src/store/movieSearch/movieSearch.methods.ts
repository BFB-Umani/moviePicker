import * as APIMethods from "moviepicker/firebase/api.methods";
import { Dispatch } from "redux";
import { addRequestState } from "../requestState";
import {
  ISearchMovie,
} from "../store.types";
import { movieSearchReduxSlice } from "./movieSearch";


/**
 * Search for movie title
 */
const searchMovie = (searchData: ISearchMovie) => async (
  dispatch: Dispatch,
) => {
  try {
    addRequestState({
      name: "searchMovie",
      state: "LOADING",
    })(dispatch);

    const searchResult = await APIMethods.getSearchResults(searchData);

    dispatch(
      movieSearchReduxSlice.actions.fetchMovieSuccess(searchResult)
    );
    addRequestState({
      name: "searchMovie",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "searchMovie",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

export default {
  searchMovie,
};
