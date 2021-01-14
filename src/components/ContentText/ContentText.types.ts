import { TextAlign } from "moviepicker/styles/typography";

export type ContentTextType =
  | "body"
  | "description"
  | "fineprint"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export interface IContentText {
  type: ContentTextType;
  textalign?: TextAlign;
  uppercase?: boolean;
}
