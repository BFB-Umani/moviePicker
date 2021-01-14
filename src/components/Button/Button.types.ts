import { ColorType } from "b3runtime/styles/colors";

import { IconType } from "../Icon/Icon.types";

export interface IButton {
  label: string;
  type?: ColorType;
  hollow?: boolean;
  elevated?: boolean;
  disabled?: boolean;
  noBorder?: boolean;
  onPress?: () => void;
  iconLeft?: IconType;
  iconRight?: IconType;
  size?: "small" | "medium" | "large";
}
