import {
  IMovie,
  IMovieList,
  INewMovieList,
  ISearchMovie,
} from "moviepicker/reduxStore/store.types";
import { MoviePickerAPI } from "../api.types";

import firebase, { firebaseCollections, firestore } from "../index";
import { logAPIError } from "../utils";

/**
 * connects to TMDB database, creates a query using searchData from user and returns a list of the movies found
 * @param searchData 
 */
export const getSearchResults = async (searchData: ISearchMovie) => {
  //TODO: change API-key to environment variable
  const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=c5bbf3c69097e603e809cb5595f462a2&language=en-US&query=' + searchData.search + '&include_adult=false');
  let resultObject = await response.json();

  const searchResults: IMovie[] = [];

  for (let doc of resultObject.results) {
    if(doc.release_date) {
      searchResults.push({
        id: doc.id.toString(),
        poster_path: "https://image.tmdb.org/t/p/w500" + doc.poster_path,
        title: doc.title,
        release_date: doc.release_date.substring(0,4),
        vote_average: doc.vote_average,
      });
    } 
  }
  return searchResults;
};

/**
 * adds a new movie list on firebase database, connected to the currently logged in user account
 * @param listData 
 */
export const createNewList = async (listData: INewMovieList) => {
  try {
    await firestore
    .collection(firebaseCollections.movie_lists)
    .add({
        name: listData.name || null,
        movies: [],
        creatorId: listData.creatorId || null,
        contributerId: listData.contributerId || null,
    });
  }catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createNewList",
      error,
    });
  }
};

/**
 * Fetches all avaliable lists on the firebase database
 * @param id 
 */
export const getAllLists = async (id: string) => {
  const response = await firestore
    .collection(firebaseCollections.movie_lists)
    .get();

  const movieLists: IMovieList[] = [];

  for (const doc of response.docs) {
    const movieList = doc.data() as MoviePickerAPI.MovieList;

    
    let movies: IMovie[] = [];

    if(movieList.movies){
      movies = movieList.movies
    }

    movieLists.push({
      id: doc.id,
      name: movieList.name,
      creatorId: movieList.creatorId,
      contributerId: movieList.contributerId,
      movies,
    });
  }
  return movieLists;
};

/**
 * fetches lists from firebase database where the users ID matches a creator ID on the list
 * @param id 
 */
export const getListsByCreator = async (id: string) => {
  const response = await firestore
    .collection(firebaseCollections.movie_lists)
    .where("creatorId", "==", id)
    .get();

  const movieLists: IMovieList[] = [];

  for (const doc of response.docs) {
    const movieList = doc.data() as MoviePickerAPI.MovieList;

    let movies: IMovie[] = [];

    if(movieList.movies){
      movies = movieList.movies
    }

    movieLists.push({
      id: doc.id,
      name: movieList.name,
      creatorId: movieList.creatorId,
      contributerId: movieList.contributerId,
      movies,
    });
  }
  return movieLists;
};

/**
 * fetches lists from firebase database where the users ID matches a contributer ID on the list
 * @param id 
 */
export const getListsByContributer = async (id: string) => {
  const response = await firestore
    .collection(firebaseCollections.movie_lists)
    .get();

  const movieLists: IMovieList[] = [];

  for (const doc of response.docs) {
    const movieList = doc.data() as MoviePickerAPI.MovieList;

    if(movieList.contributerId) {
      for(const data of movieList.contributerId) {
        if(data === id) {
          let movies: IMovie[] = [];
          if(movieList.movies){
            movies = movieList.movies
          }
      
          movieLists.push({
            id: doc.id,
            name: movieList.name,
            creatorId: movieList.creatorId,
            contributerId: movieList.contributerId,
            movies,
          });
        }
      }
    }
  }
  return movieLists;
};

/**
 * fetches lists from firebase database where the users ID matches either a creator ID or a contributer ID on the list
 * @param id 
 */
export const getAllUserLists = async (id: string) => {
  const response = await firestore
    .collection(firebaseCollections.movie_lists)
    .get();

  const movieLists: IMovieList[] = [];

  for (const doc of response.docs) {
    const movieList = doc.data() as MoviePickerAPI.MovieList;
    let movies: IMovie[] = [];

    if(movieList.creatorId === id) {
      if(movieList.movies){
        movies = movieList.movies
      }
  
      movieLists.push({
        id: doc.id,
        name: movieList.name,
        creatorId: movieList.creatorId,
        contributerId: movieList.contributerId,
        movies,
      });
    } else if(movieList.contributerId) {
      for(const data of movieList.contributerId) {
        if(data === id) {
          if(movieList.movies){
            movies = movieList.movies
          }
      
          movieLists.push({
            id: doc.id,
            name: movieList.name,
            creatorId: movieList.creatorId,
            contributerId: movieList.contributerId,
            movies,
          });
        }
      }
    }
  }
  return movieLists;
};

/**
 * Fetches a specifik list from firebase database using a list ID
 * @param movieListId 
 */
export const getMovieList = async (movieListId: IMovieList["id"]) => {
  // Fetch Track Details
  const response = await firestore
    .collection(firebaseCollections.movie_lists)
    .where(firebase.firestore.FieldPath.documentId(), "==", movieListId)
    .get();

  const entry = response.docs[0].data() as MoviePickerAPI.MovieList;

  let movies: IMovie[] = [];

    if(entry.movies){
      movies = entry.movies
    }

  const movieList: IMovieList = {
    id: movieListId,
    name: entry.name,
    creatorId: entry.creatorId,
    contributerId: entry.contributerId,
    movies,
  };

  return movieList;
};

/**
 * fetches movies from a list on the firebase database
 * @param movieListId 
 */
export const getMoviesByList = async (
  movieListId: IMovieList["id"]
) => {
  const list = await getMovieList(movieListId);

  let movies: IMovie[] = [];

  if(list.movies) {
    movies = list.movies;
  }

  return movies;
};

/**
 * adds a movie to a list on the firebase database using a lists ID and a movie object with data
 * @param movie 
 * @param list 
 */
export const addMoviesToList = async (
  movie: IMovie, list: IMovieList
) => {
  const movies = await getMoviesByList(list.id);
  movies.push(movie);
  const updatedList: IMovieList = {
    id: list.id,
    creatorId: list.creatorId,
    contributerId: list.contributerId,
    name: list.name,
    movies: movies,
  }

  await firestore.collection(firebaseCollections.movie_lists).doc(list.id).set(updatedList)

};