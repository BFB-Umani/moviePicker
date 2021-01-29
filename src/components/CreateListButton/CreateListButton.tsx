import { WithMarginProps } from "moviepicker/styles/spacing";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import Box from "moviepicker/components/Box/Box";

import Icon from "../Icon/Icon";
import * as Style from "./CreateListButton.style";
import { IButton } from "./CreateListButton.types";

const Button: React.FC<IButton & TouchableOpacityProps & WithMarginProps> = ({
  label,
  ...props
}) => (
  <Style.Container
    {...props}
    activeOpacity={0.2}
    style={{ elevated: props.elevated && 5 }}
  >
    {props.icon && (
      <Box>
        <Icon
          icon={props.icon}
          color={props.iconColor}
          colorVariant={!props.hollow ? "background" : "text"}
          size="sm"
        />
      </Box>
    )}
  </Style.Container>
);
export default Button;
