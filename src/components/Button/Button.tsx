import { WithMarginProps } from "b3runtime/styles/spacing";
import React from "react";
import { TouchableOpacityProps } from "react-native";

import Box from "../Box/Box";
import Icon from "../Icon/Icon";
import * as Style from "./Button.style";
import { IButton } from "./Button.types";

const Button: React.FC<IButton & TouchableOpacityProps & WithMarginProps> = ({
  label,
  ...props
}) => (
  <Style.Container
    {...props}
    activeOpacity={1}
    style={{ elevated: props.elevated && 5 }}
  >
    {props.iconLeft && (
      <Icon
        icon={props.iconLeft}
        color={props.type}
        colorVariant={!props.hollow ? "text" : "background"}
        size="xxs"
        marginright="sm"
      />
    )}

    <Box flex={1}>
      <Style.Label
        {...props}
        pointerEvents="none"
        textAlign={
          (props.iconLeft && props.iconRight) ||
          (!props.iconLeft && !props.iconRight)
            ? "center"
            : "left"
        }
      >
        {label}
      </Style.Label>
    </Box>

    {props.iconRight && (
      <Icon
        icon={props.iconRight}
        color={props.type}
        colorVariant={!props.hollow ? "text" : "background"}
        size="xxs"
        marginleft="sm"
      />
    )}
  </Style.Container>
);
export default Button;
