import { colors } from "b3runtime/styles/colors";
import { generateMarginProps } from "b3runtime/styles/spacing";
import { Image } from "react-native-expo-image-cache";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: ${colors.panel.background};
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => generateMarginProps(props)}
`;

export const ProfilePicture = styled(Image)`
  width: 100%;
  flex: 1;
  height: 100%;
  border-radius: 100px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
`;
