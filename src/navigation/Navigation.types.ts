import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  authorized: NavigatorScreenParams<AuthorizedBottomTabStack>;
  unathorized: NavigatorScreenParams<UnauthorizedNavigationStack>;
};

export type UnauthorizedNavigationStack = {
  Landing: undefined;
  Login: undefined;
  ResetPassword: undefined;
  Signup: undefined;
};

export type AuthorizedBottomTabStack = {
  Dashboard: NavigatorScreenParams<IDashboardStack>;
  List: NavigatorScreenParams<IMovieListStack>;
  Profile: NavigatorScreenParams<IProfileStack>;
};

export type IDashboardStack = {
  Dashboard: undefined;
  searchResults: undefined;
};

export type IProfileStack = {
  Profile: undefined;
  EditProfile: undefined;
  MyResults: undefined;
  UserSettings: undefined;
};

export type IMovieListStack = {
  List: undefined;
  MovieList: undefined;
};

