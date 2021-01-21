import { colors } from "moviepicker/styles/colors";
import {
  borderRadius,
  generateMarginProps,
  spacing,
} from "moviepicker/styles/spacing";
import { fontSize, typography } from "moviepicker/styles/typography";
import { Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { IButton } from "./Button.types";

const getButtonBgColor = (type: IButton["type"], hollow?: boolean) => {
  if (type && colors[type]) {
    return !hollow ? colors[type].background : "transparent";
  }
  return colors.primary.background;
};

const getButtonTextColor = (type: IButton["type"], hollow?: boolean) => {
  if (type && colors[type]) {
    return !hollow ? colors.general.text : colors[type].background;
  }
  return colors.primary.text;
};

const getButtonSize = (size: IButton["size"]) => {
  switch (size) {
    case "small":
      return "48px";
    case "medium":
    default:
      return "56px";
    case "large":
      return "64px";
  }
};

const getButtonFontSize = (size: IButton["size"]) => {
  switch (size) {
    case "small":
      return fontSize.sm;
    case "medium":
    default:
      return fontSize.md;
    case "large":
      return fontSize.lg;
  }
};

export const Container = styled<IButton>(TouchableOpacity)`
  width: 100%;
  background-color: ${(props) => getButtonBgColor(props.type, props.hollow)};
  padding-left: ${(props) => (props.hollow ? spacing.xs : spacing.sm)};
  padding-right: ${(props) => (props.hollow ? spacing.xs : spacing.sm)};
  ${(props) =>
    props.hollow
      ? `
        border-width: 2px;
        border-color: ${
          !props.noBorder
            ? getButtonTextColor(props.type, props.hollow)
            : "transparent"
        };
  `
      : ""}

  border-radius: ${borderRadius.lg};
  ${(props) => (props.disabled ? "opacity: 0.25;" : "")}
  ${(props) =>
    props.elevated ? "box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);" : ""}
    ${(props) => generateMarginProps(props)}
    display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-shrink: 1;
  min-height: ${(props) => getButtonSize(props.size)};
`;
export const Label = styled<
  IButton & { textAlign?: "left" | "center" | "right" }
>(Text)`
  font-family: ${typography.bodyBold};
  font-size: ${(props) => getButtonFontSize(props.size)};
  color: ${(props) => getButtonTextColor(props.type, props.hollow)};
  text-transform: uppercase;
  flex-shrink: 1;
  text-align: ${(props) => props.textAlign || "center"};
`;
