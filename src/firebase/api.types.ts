export type FirebaseCollections =
  | "categories"
  | "movies"
  | "user_lists"
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

  export interface Movie {
    id: string;
    poster_path: string;
    title: string;
    release_date: string;
    vote_average: number;
  }

  export interface Movie_List {
    id: string;
    list: Omit<Movie, "id">[];
    creator: Creator;
    contributer: Contributer;
  }

  export interface NewList {
    startedTime: number;
    creator: NewCreator;
    contributer?: NewContributer;
    list: Omit<Movie, "id">[];
  }

  export interface Creator {
    id: string;
    name: string;
    listKey: string;
    listName?: string;
    userAccountKey: string;
  }

  export interface NewCreator {
    listKey: string;
    listName?: string;
    userAccountKey: string;
  }
  
  export interface Contributer {
    id: string;
    name: string;
    listKey: string;
    listName?: string;
    userAccountKey: string;
  }

  export interface NewContributer {
    listKey: string;
    listName?: string;
    userAccountKey: string;
  }
}
