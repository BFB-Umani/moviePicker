import { generateColorProps, WithColorProps } from "b3runtime/styles/colors";
import {
  generateMarginProps,
  generatePaddingProps,
  WithMarginProps,
  WithPaddingProps,
} from "b3runtime/styles/spacing";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

import { IBox } from "./Box.types";

export const StyledBox = styled<IBox>(
  ({
    padding,
    margin,
    justifyContent,
    alignItems,
    flexDirection,
    flex,
    flexGrow,
    flexShrink,
    flexWrap,
    fullWidth,
    ...props
  }) => <View {...props} />
)`
  ${(props) => generateMarginProps(props)}
  ${(props) => generatePaddingProps(props)}
  ${(props) => generateColorProps(props, true)}
  ${(props) => {
    if (props.fullWidth) {
      return `
        width: 100%;
      `;
    }
  }}
  ${(props) => {
    if (props.flexDirection) {
      return `
        display: flex;
        flex-direction: ${props.flexDirection};
      `;
    }
  }}
  ${(props) => {
    if (props.flexWrap) {
      return `
        flex-wrap: wrap;
      `;
    }
  }}
  ${(props) => {
    if (props.justifyContent) {
      return `justify-content: ${props.justifyContent};`;
    }
  }}
  ${(props) => {
    if (props.alignItems) {
      return `align-items: ${props.alignItems};`;
    }
  }}
  ${(props) => {
    if (props.flex) {
      return `flex: ${props.flex};`;
    }
  }}
  ${(props) => {
    if (props.flexGrow) {
      return `flex-grow: ${props.flexGrow};`;
    }
  }}
  ${(props) => {
    if (props.flexShrink) {
      return `flex-shrink: ${props.flexShrink};`;
    }
  }}
`;

const Box: React.FC<
  IBox & WithMarginProps & WithPaddingProps & WithColorProps
> = (props) => <StyledBox {...props}>{props.children}</StyledBox>;
export default Box;
