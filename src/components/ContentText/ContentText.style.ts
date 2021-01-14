import { colors, generateColorProps } from "moviepicker/styles/colors";
import { generateMarginProps } from "moviepicker/styles/spacing";
import { fontSize, typography } from "moviepicker/styles/typography";
import { Text } from "react-native";
import styled from "styled-components/native";

import { ContentTextType, IContentText } from "./ContentText.types";

const contextTextFontDefinitions: {
  [key in ContentTextType]: { size: string; fontFamily: string };
} = {
  body: {
    fontFamily: typography.body,
    size: fontSize.md,
  },
  description: {
    fontFamily: typography.body,
    size: fontSize.sm,
  },
  fineprint: {
    fontFamily: typography.body,
    size: fontSize.xs,
  },
  h1: {
    fontFamily: typography.bodyBold,
    size: fontSize.xxlg,
  },
  h2: {
    fontFamily: typography.bodyBold,
    size: fontSize.xlg,
  },
  h3: {
    fontFamily: typography.bodyBold,
    size: fontSize.lg,
  },
  h4: {
    fontFamily: typography.bodyBold,
    size: fontSize.md,
  },
  h5: {
    fontFamily: typography.bodyBold,
    size: fontSize.sm,
  },
  h6: {
    fontFamily: typography.bodyBold,
    size: fontSize.xs,
  },
};

export const StyledText = styled<IContentText>(Text)`
  flex-shrink: 1;
  font-size: ${(props) => contextTextFontDefinitions[props.type].size};
  font-family: ${(props) => contextTextFontDefinitions[props.type].fontFamily};
  ${(props) => (props.uppercase ? "text-transform: uppercase;" : "")}
  ${(props) => (props.textalign ? `text-align: ${props.textalign}` : "")};
  ${(props) => generateColorProps(props)}
  ${(props) => generateMarginProps(props)}
`;

export const StyledSkeleton = styled.View`
  width: 100%;
  height: 20px;
  background-color: ${colors.panel.background};
`;
