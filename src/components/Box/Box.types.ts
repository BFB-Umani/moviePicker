import { CSSProperties } from "react";

export interface IBox {
  pointerEvents?: "box-none" | "none" | "auto";
  flexDirection?: "row" | "column";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}
