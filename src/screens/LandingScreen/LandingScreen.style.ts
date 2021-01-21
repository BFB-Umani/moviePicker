import { colors } from "moviepicker/styles/colors";
import styled from "styled-components/native";

export const Wrapper = styled.View`
  background-color: ${colors.text.background};
  flex: 1;
`;

export const BackgroundImage = styled.Image`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0px;
  top: 0px;
  opacity: 0.6;
`;
