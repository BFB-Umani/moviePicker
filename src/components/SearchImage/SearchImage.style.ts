import { colors } from "moviepicker/styles/colors";
import { generateMarginProps } from "moviepicker/styles/spacing";
import { Image } from "react-native-expo-image-cache";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 154px;
  height: 233px;
  border-radius: 30px;
  background-color: ${colors.panel.background};
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => generateMarginProps(props)}
`;

export const SearchImage = styled(Image)`
  width: 100%;
  flex: 1;
  height: 100%;
  border-radius: 30px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
`;
