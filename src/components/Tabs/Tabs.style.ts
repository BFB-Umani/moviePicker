import { colors, ColorType } from "b3runtime/styles/colors";
import { generateMarginProps, spacing } from "b3runtime/styles/spacing";
import styled from "styled-components/native";

import { ITabs } from "./Tabs.types";

export const Container = styled.View<ITabs>`
  flex: 1;
  ${(props) => generateMarginProps(props)}
`;

export const TabHeadingContainer = styled.View`
  display: flex;
  flex-direction: row;
  background-color: ${colors.general.background};
`;

export const TabHeading = styled.TouchableOpacity<{
  selected?: boolean;
  activeColor?: ColorType;
}>`
  flex: 1;
  padding: ${spacing.sm};
  background-color: ${(props) =>
    props.selected ? colors.general.background : "transparent"};
  border-bottom-width: 4px;
  border-bottom-color: ${(props) =>
    props.selected
      ? colors[props.activeColor || "primary"].background
      : colors.panel.background};
`;

export const TabContentContainer = styled.View`
  flex: 1;
`;
