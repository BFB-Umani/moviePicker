import { IModal } from "b3runtime/reduxStore/store.types";
import { colors } from "b3runtime/styles/colors";
import { borderRadius, spacing } from "b3runtime/styles/spacing";
import { fontSize, typography } from "b3runtime/styles/typography";
import { Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import styled from "styled-components/native";

export const Modal = styled<IModal & ReactNativeModal>(ReactNativeModal)``;

export const Container = styled<{ fullscreen?: boolean }>(View)`
  position: relative;
  z-index: 5;
  ${(props) =>
    props.fullscreen
      ? `
    height: 100%;
  `
      : `
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
  `};
`;

export const TopBar = styled<{ fullscreen?: boolean }>(View)`
  display: flex;
  ${(props) =>
    !props.fullscreen
      ? `
  border-top-right-radius: ${borderRadius.md};
  border-top-left-radius: ${borderRadius.md};
  `
      : ""}
  justify-content: center;
  background-color: ${colors.primary.background};
  min-height: 52px;
`;

export const Title = styled(Text)`
  font-family: ${typography.headingBold};
  font-size: ${fontSize.lg};
  color: ${colors.primary.text};
  text-transform: uppercase;
  text-align: center;
`;

export const Content = styled<{
  roundedTop?: boolean;
  roundedBottom?: boolean;
  fullscreen?: boolean;
}>(View)`
  justify-content: center;
  align-items: center;
  padding: ${spacing.sm};
  background-color: ${colors.general.background};
  ${(props) =>
    props.roundedTop
      ? `border-top-right-radius: ${borderRadius.md};
  border-top-left-radius: ${borderRadius.md};`
      : ""}
  ${(props) =>
    props.roundedBottom
      ? `border-bottom-right-radius: ${borderRadius.md};
  border-bottom-left-radius: ${borderRadius.md};`
      : ""}
  ${(props) => (props.fullscreen ? "flex: 1;" : "")}
`;

export const BottomBar = styled<{
  transparent?: boolean;
  fullscreen?: boolean;
}>(View)`
  padding: 0 ${spacing.md} ${spacing.md} ${spacing.md};
  ${(props) =>
    !props.transparent && !props.fullscreen
      ? `
    border-bottom-right-radius: ${borderRadius.md};
    border-bottom-left-radius: ${borderRadius.md};
    background-color: ${colors.general.background};
  `
      : ""}
`;
