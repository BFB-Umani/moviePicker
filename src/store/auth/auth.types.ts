import { IUserProfile } from "../store.types";

export type AuthenticationState = "INITIAL" | "LOGGED_IN" | "LOGGED_OUT";
export interface IAuthReduxState {
  authenticationState: AuthenticationState;
  userId?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ISignupFields extends Omit<IUserProfile, "id" | "email"> {
  email: string;
  password: string;
}
