import {
  IMovie,
  IMovieList,
  INewMovieList
} from "moviepicker/reduxStore/store.types";
import { MoviePickerAPI } from "../api.types";

import firebase, { firebaseCollections, firestore } from "../index";
import { logAPIError } from "../utils";

export const getSearchResults = async (searchData) => {
  const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=c5bbf3c69097e603e809cb5595f462a2&language=en-US&query=' + searchData.searchValue + '&include_adult=false');
  let resultObject = await response.json();

  const searchResults: IMovie[] = [];

  for (let doc of resultObject.results) {
    searchResults.push({
      id: doc.id.toString(),
      poster_path: "https://image.tmdb.org/t/p/w500" + doc.poster_path,
      title: doc.title,
      release_date: doc.release_date,
      vote_average: doc.vote_average,
    });
  }
  return searchResults;
};

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
          console.log(data);
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