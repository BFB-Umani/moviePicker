import { ColorType } from "moviepicker/styles/colors";

import { IconType } from "../Icon/Icon.types";

export interface IButton {
  label?: string;
  type?: ColorType;
  hollow?: boolean;
  elevated?: boolean;
  disabled?: boolean;
  noBorder?: boolean;
  onPress?: () => void;
  icon?: IconType;
  iconRight?: IconType;
  iconColor?: ColorType
  size?: "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge";
}
