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
  FindGame: NavigatorScreenParams<IFindGameStack>;
  Profile: NavigatorScreenParams<IProfileStack>;
  Competition: NavigatorScreenParams<ICompetitionStack>;
  Freerun: NavigatorScreenParams<IFreerunStack>;
};

export type IDashboardStack = {
  Dashboard: undefined;
};

export type IFindGameStack = {
  FindCompetition: undefined;
  TrackSelect: {
    competitionId: string;
  };
};

export type IProfileStack = {
  Profile: undefined;
  EditProfile: undefined;
  MyResults: undefined;
  UserSettings: undefined;
};

export type ICompetitionStack = {
  Ingame: {
    competitionId: string;
    trackId: string;
  };
  GameSettings: undefined;
  PostGame: undefined;
};

export type IFreerunStack = {
  Ingame: undefined;
};
