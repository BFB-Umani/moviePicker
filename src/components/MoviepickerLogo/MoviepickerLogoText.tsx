import { colors } from "moviepicker/styles/colors";
import { typography } from "moviepicker/styles/typography";
import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

import Box from "../Box/Box";
import MoviepickerLogo from "./MoviepickerLogo";

const LogoText = styled(Text)`
  font-family: ${typography.headingBold};
  font-size: 28px;
  color: ${colors.text.background};
  text-align: center;
`;

const MoviepickerLogoText: React.FC<object> = (props) => (
  <Box justifyContent="center" alignItems="center">
    <MoviepickerLogo />
    <LogoText>MOVIEPICKER</LogoText>
  </Box>
);
export default MoviepickerLogoText;
