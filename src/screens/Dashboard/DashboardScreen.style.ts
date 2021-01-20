import { colors, ColorType } from "moviepicker/styles/colors";
import { Image, SafeAreaView, View } from "react-native";
import { animated } from "react-spring";
import styled from "styled-components/native";

export const Wrapper = styled(SafeAreaView)`
  background-color: ${colors.text.background};
  flex: 1;
`;

export const Container = styled(View)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const BackgroundImage = styled(Image)`
  position: absolute;
  height: 120%;
  left: 0;
  top: 0;
  opacity: 0.15;
`;

export const Logo = styled(animated(View))`
  display: flex;
  justify-content: center;
`;

export const BgFeature = styled<{ color: ColorType; opacity: number }>(View)`
  background-color: ${(props) => colors[props.color].background};
  width: 200%;
  position: absolute;
  bottom: -10%;
  left: -50%;
  z-index: 0;
`;
