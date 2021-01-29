import { IMovieList, IMovie } from "moviepicker/reduxStore/store.types";

export interface IMovieListsReduxState {
  list?: IMovieList[];
}

export interface IContributersReduxState {
  list?: IMovieList[];
}

export interface IMoviesReduxState {
  list?: IMovie[];
}
