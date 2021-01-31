import { IconType } from "moviepicker/components/Icon/Icon.types";
import { ColorType } from "moviepicker/styles/colors";

import { IAlertReduxState } from "./alert/alert.types";
import { IAuthReduxState } from "./auth/auth.types";
import { IGlobalReduxState } from "./global/global.types";
import { IRequestStateRedux } from "./requestState";
import { IUserReduxState } from "./user/user.types";
import { IMovieSearchReduxState } from "./movieSearch/movieSearch.types";
import { IMovieListsReduxState } from "./lists/lists.types";
import { IMoviesReduxState } from "./lists/lists.types";
import { IContributersReduxState } from "./lists/lists.types";
import { IAllUserListsReduxState } from "./lists/lists.types";

export interface IReduxState {
  global: IGlobalReduxState;
  requestState: IRequestStateRedux;
  auth: IAuthReduxState;
  user: IUserReduxState;
  alert: IAlertReduxState;
  searchResult: IMovieSearchReduxState;
  lists: IMovieListsReduxState;
  movieList: IMoviesReduxState;
  contributersLists: IContributersReduxState;
  allUserLists: IAllUserListsReduxState;
}

export interface IError {
  message?: string;
  stack?: any;
}

export interface IAlert {
  id?: string;
  text: string;
  closable?: boolean;
  color?: ColorType;
  icon?: IconType;
  closeAfter?: number;
  onClick?: () => void;
  state?: "animating-out";
}

export type RequestState = "INITIAL" | "LOADING" | "COMPLETE" | "ERROR";
export interface IRequestProps {
  state: RequestState;
  error?: IError;
}

export interface ISearchMovie {
  search: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: string;
}

export interface IUserProfile {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  organization?: string;
  avatarUrl?: string;
}

export interface IEditUserProfile {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  organization?: string;
}

export interface IMovieList {
  id: string;
  name: string;
  movies?: IMovie[];
  creatorId: string;
  contributerId?: string[];
}

export interface INewMovieList {
  name: string;
  movies?: IMovie[];
  creatorId: string;
  contributerId?: string[];
}