import { IResult } from "../store.types";

export interface IResultReduxState {
  user: IResult[];
  postGameResult?: IResult;
}
