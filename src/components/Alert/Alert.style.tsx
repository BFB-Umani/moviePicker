import { IAlert } from "b3runtime/reduxStore/store.types";
import { colors } from "b3runtime/styles/colors";
import { spacing } from "b3runtime/styles/spacing";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity<IAlert>`
  padding: ${spacing.sm};
  background-color: ${(props) =>
    props.color ? colors[props.color].background : colors.general.background};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Content = styled.View`
  display: flex;
  flex-direction: row;
  flex-shrink: 1;
  align-items: center;
`;
