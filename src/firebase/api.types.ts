import {
  IMovie,
  IMovieList,
  INewMovieList
} from "moviepicker/reduxStore/store.types";

export type FirebaseCollections =
  | "categories"
  | "movie_lists"
  | "user_accounts"
  | "creators"
  | "contributers";

export namespace MoviePickerAPI {
  export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    organization: string;
    username: string;
    email: string;
  }

  export interface MovieList {
    id: string;
    name: string;
    movies?: IMovie[];
    creatorId: string;
    contributerId?: string[];
  }

  export interface Creator {
    id: string;
    name: string;
    email: string;
    userAccountKey: string;
  }

  export interface NewCreator {
    userAccountKey: string;
  }
  
  export interface Contributer {
    id: string;
    name: string;
    email: string;
    userAccountKey: string;
  }

  export interface NewContributer {
    userAccountKey: string;
  }
}
