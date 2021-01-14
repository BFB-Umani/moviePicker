import { IconType } from "moviepicker/components/Icon/Icon.types";

export interface IInputField {
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  accessibilityLabel?: string;
  type?: "text" | "password" | "email" | "number" | "phone";
  fullWidth?: boolean;
  iconLeft?: IconType;
  iconRight?: IconType;
  returnButtonType?: "done" | "go" | "next" | "search" | "send";
  description?: string;
  descriptionIcon?: IconType;
}
