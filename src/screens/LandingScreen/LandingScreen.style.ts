import { colors } from "b3runtime/styles/colors";
import styled from "styled-components/native";

export const Wrapper = styled.View`
  background-color: ${colors.secondary.background};
  flex: 1;
`;

export const BackgroundImage = styled.Image`
  position: absolute;
  height: 120%;
  left: 0;
  top: 0;
  opacity: 0.1;
`;
