import { IError, IUserProfile } from "../store.types";

export interface IUserReduxState {
  profile?: IUserProfile;
  location: {
    granted?: boolean;
    error?: IError;
  };
}
