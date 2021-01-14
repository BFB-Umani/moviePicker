import { colors } from "b3runtime/styles/colors";
import { typography } from "b3runtime/styles/typography";
import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

import Box from "../Box/Box";
import B3Logo from "./B3Logo";

const LogoText = styled(Text)`
  font-family: ${typography.headingBold};
  font-size: 28px;
  color: ${colors.general.background};
  text-align: center;
`;

const B3RuntimeLogo: React.FC<object> = (props) => (
  <Box justifyContent="center" alignItems="center">
    <B3Logo />
    <LogoText>RUNTIME</LogoText>
  </Box>
);
export default B3RuntimeLogo;
