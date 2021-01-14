import { colors, ColorType } from "b3runtime/styles/colors";
import { generateMarginProps, WithMarginProps } from "b3runtime/styles/spacing";
import React from "react";
import styled from "styled-components/native";

interface ISeparator {
  color: ColorType;
  size?: "xs" | "sm" | "md" | "lg";
}

const heightFromSize = (size?: ISeparator["size"]) => {
  switch (size) {
    case "xs":
    default:
      return "1px";
    case "sm":
      return "2px";
    case "md":
      return "4px";
    case "lg":
      return "8px";
  }
};

const HorizontalRuler = styled.View<ISeparator>`
  ${(props) => generateMarginProps(props)}
  width: 100%;
  height: ${(props) => heightFromSize(props.size)};
  background-color: ${(props) => colors[props.color].background};
`;

const Separator: React.FC<ISeparator & WithMarginProps> = (props) => (
  <HorizontalRuler {...props} />
);
export default Separator;
