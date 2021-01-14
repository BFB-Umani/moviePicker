import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "moviepicker/styles/colors";
import { generateMarginProps } from "moviepicker/styles/spacing";
import { View, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { IIcon } from "./Icon.types";

export const Container = styled<IIcon>(View)`
  ${(props) => generateMarginProps(props)}
`;

export const ClickableContainer = styled<IIcon>(TouchableOpacity)`
  ${(props) => generateMarginProps(props)}
`;

export const StyledIcon = styled<IIcon>(FontAwesome5)`
  color: ${(props) => {
    if (props.color) {
      if (props.colorShade) {
        return props.colorVariant
          ? colors[props.color][props.colorShade][props.colorVariant]
          : colors[props.color][props.colorShade].background;
      }
      return props.colorVariant
        ? colors[props.color][props.colorVariant]
        : colors[props.color].background;
    }
    return colors.general.text;
  }};
`;
