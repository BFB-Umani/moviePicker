import { colors } from "b3runtime/styles/colors";
import { borderRadius, spacing } from "b3runtime/styles/spacing";
import { fontSize, typography } from "b3runtime/styles/typography";
import styled from "styled-components/native";

const InputFieldHeight = 50;

export const InputFieldContainer = styled.View`
  width: ${(p) => (p.fullWidth ? "100%" : "288px")};
  overflow: hidden;
`;

const getInputColor = (hasFocus?: boolean, hasError?: boolean) => {
  if (hasFocus) {
    return colors.primary.background;
  }
  if (hasError) {
    return colors.danger.background;
  }
  return colors.disabled.background;
};

export const InnerContainer = styled.View`
  align-items: center;
  align-self: stretch;
  height: ${InputFieldHeight}px;
  flex-direction: row;
  overflow: hidden;
  border: 2px solid ${(props) => getInputColor(props.hasFocus, props.error)};
  border-radius: ${borderRadius.sm};
  background-color: ${(props) =>
    props.hasFocus
      ? colors.general.background
      : colors.panel.brighter.background};
`;

export const StyledTextField = styled.TextInput`
  height: 100%;
  font-family: ${typography.body};
  font-size: ${fontSize.md};
  flex-grow: 1;
  background-color: transparent;
  color: ${(p) =>
    p.disabled ? colors.disabled.background : colors.general.text};
`;

export const IconContainer = styled.View`
  position: absolute;
  top: ${spacing.xs};
  ${(props) =>
    props.position === "right"
      ? `right: ${spacing.sm};`
      : `left: ${spacing.sm};`}
`;

export const Label = styled.Text`
  font-family: ${typography.bodySemiBold};
  font-size: ${fontSize.xs};
  color: ${(props) => getInputColor(props.hasFocus, props.error)};
`;
