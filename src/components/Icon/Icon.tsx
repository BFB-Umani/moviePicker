import { WithMarginProps } from "moviepicker/styles/spacing";
import { fontSize } from "moviepicker/styles/typography";
import React from "react";
import { TouchableOpacityProps } from "react-native";

import * as Style from "./Icon.style";
import { IIcon } from "./Icon.types";

const Icon: React.FC<IIcon & WithMarginProps & TouchableOpacityProps> = ({
  icon,
  size = "md",
  color,
  colorShade,
  colorVariant,
  ...props
}) => {
  const getIconSize = (): number => {
    return parseInt(fontSize[size], 10) + 8;
  };

  return props.onPress ? (
    <Style.ClickableContainer {...props}>
      <Style.StyledIcon
        name={icon}
        size={getIconSize()}
        color={color}
        colorShade={colorShade}
        colorVariant={colorVariant}
      />
    </Style.ClickableContainer>
  ) : (
    <Style.Container {...props}>
      <Style.StyledIcon
        name={icon}
        size={getIconSize()}
        color={color}
        colorShade={colorShade}
        colorVariant={colorVariant}
      />
    </Style.Container>
  );
};
export default Icon;
