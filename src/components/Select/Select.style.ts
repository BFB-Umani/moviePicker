import { colors } from "b3runtime/styles/colors";
import { spacing } from "b3runtime/styles/spacing";
import { fontSize, typography } from "b3runtime/styles/typography";
import { Text, TouchableOpacity, View } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import styled from "styled-components/native";

export const Container = styled<{ disabled?: boolean }>(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  ${(props) => (props.disabled ? "opacity: 0.35;" : "")};
`;
export const Label = styled(Text)`
  font-size: ${fontSize.md};
  font-family: ${typography.body};
  color: ${colors.primary.background};
`;
export const SelectIcon = styled(FontAwesomeIcon)`
  color: ${colors.primary.background};
  margin-left: ${spacing.sm};
  padding-top: ${spacing.xxxs};
`;

export const SelectListContainer = styled(View)`
  background-color: ${colors.general.background};
  width: 100%;
`;

export const SelectListItem = styled<{ selected?: boolean }>(TouchableOpacity)`
  width: 100%;
  padding: ${spacing.sm} 0;
  margin-bottom: ${spacing.xs};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props.selected ? colors.primary.background : colors.panel.background};
`;

export const SelectListItemLabel = styled<{ selected?: boolean }>(Text)`
  font-size: ${fontSize.md};
  font-family: ${(props) =>
    props.selected ? typography.bodyBold : typography.bodySemiBold};
  color: ${(props) =>
    props.selected ? colors.primary.background : colors.disabled.background};
`;

export const SelectListItemCheck = styled(FontAwesomeIcon)`
  color: ${colors.primary.background};
  margin-left: ${spacing.sm};
  padding-top: ${spacing.xxxs};
`;
