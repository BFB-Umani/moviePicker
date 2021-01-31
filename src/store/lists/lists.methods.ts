import { createNewList, getListsByCreator, getMoviesByList, addMoviesToList, getListsByContributer, getAllUserLists} from "moviepicker/firebase/api.methods";
import { Dispatch } from "redux";

import { addRequestState } from "../requestState";
import { IMovieList, INewMovieList, IMovie, IUserProfile } from "../store.types";
import { movieListReduxSlice } from "./lists";
import { moviesReduxSlice } from "./movies";
import { contributersListReduxSlice } from "./contributersList";
import { allUserListsReduxSlice } from "./allUserLists";

/**
 * Create a new movie list linked to a given user ID stored as "creatorId" in param object
 * @param listData 
 */
const createList = (listData: INewMovieList) => async (
    dispatch: Dispatch
  ) => {
    try {
      if (!listData.name) {
        throw Error("No list name provided");
      }
  
      addRequestState({
        name: "createMovieList",
        state: "LOADING",
      })(dispatch);
  
      // Create the new list
      createNewList(listData);
      
      addRequestState({
        name: "createMovieList",
        state: "COMPLETE",
      })(dispatch);
    } catch (error) {
      addRequestState({
        name: "createMovieList",
        state: "ERROR",
        error,
      })(dispatch);
    }
  };

/**
 * Fetches all lists created by user, using the users ID
 * @param userId 
 */
const fetchListsById = (userId: IUserProfile["id"]) => async (dispatch: Dispatch) => {
  try {
    addRequestState({
      name: "fetchLists",
      state: "LOADING",
    })(dispatch);

    const competitionList = await getListsByCreator(userId);

    dispatch(
        movieListReduxSlice.actions.fetchListsSuccess(competitionList)
    );
    addRequestState({
      name: "fetchLists",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchLists",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * Fetches all lists where user is marked as contributer, by using user ID
 * @param userId 
 */
const fetchContributersLists = (userId: IUserProfile["id"]) => async (dispatch: Dispatch) => {
  try {
    addRequestState({
      name: "fetchLists",
      state: "LOADING",
    })(dispatch);

    const contributersList = await getListsByContributer(userId);

    dispatch(
      contributersListReduxSlice.actions.fetchContributersListsSuccess(contributersList)
    );
    addRequestState({
      name: "fetchLists",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchLists",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * Fetches all lists connected to user ID, both as creator and contributer
 * @param userId 
 */
const fetchAllUserLists = (userId: IUserProfile["id"]) => async (dispatch: Dispatch) => {
  try {
    addRequestState({
      name: "fetchLists",
      state: "LOADING",
    })(dispatch);

    const allUserLists = await getAllUserLists(userId);

    dispatch(
      allUserListsReduxSlice.actions.fetchAllUserListsSuccess(allUserLists)
    );
    addRequestState({
      name: "fetchLists",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchLists",
      state: "ERROR",
      error,
    })(dispatch);
  }
};

/**
 * Fetches movies that is connected to a movieList by movieList ID
 * @param movieListId 
 */
const fetchMovies = (movieListId: IMovieList["id"]) => async (
  dispatch: Dispatch,
) => {
  try {

    addRequestState({
      name: "fetchMovies",
      state: "LOADING",
    })(dispatch);
    const movies: IMovie[] = await getMoviesByList(movieListId);
    
    dispatch(
      moviesReduxSlice.actions.fetchMoviesSuccess(movies)
    );
    addRequestState({
      name: "fetchMovies",
      state: "COMPLETE",
    })(dispatch);
  } catch (error) {
    addRequestState({
      name: "fetchMovies",
      state: "ERROR",
      error,
    })(dispatch);
  }
};


/**
 * Adds a movie to chosen list connected to user
 * @param movie 
 * @param list 
 */
const addMovieToList = (movie: IMovie, list: IMovieList) => async (
  dispatch: Dispatch,
  ) => {

    try {
      addRequestState({
        name: "addMovie",
        state: "LOADING",
      })(dispatch);

      await addMoviesToList(movie, list);
      
      addRequestState({
        name: "addMovie",
        state: "COMPLETE",
      })(dispatch);
    } catch (error) {
      addRequestState({
        name: "addMovie",
        state: "ERROR",
        error,
      })(dispatch);
    }
}

export default {
  createList,
  fetchLists: fetchListsById,
  fetchContributersLists,
  fetchAllUserLists,
  fetchMovies,
  addMovieToList
};
