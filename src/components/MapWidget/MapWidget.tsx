import { ColorType } from "b3runtime/styles/colors";
import {
  borderRadius,
  spacing,
  WithMarginProps,
} from "b3runtime/styles/spacing";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

import Box from "../Box/Box";
import ContentText from "../ContentText/ContentText";
import Icon from "../Icon/Icon";
import { IconType } from "../Icon/Icon.types";

interface IMapWidget {
  inactive?: boolean;
  text?: string;
  iconLeft?: IconType;
  iconRight?: IconType;
  color: ColorType;
}

const MapWidget: React.FC<IMapWidget & WithMarginProps> = (props) => {
  return (
    <WidgetContainer
      inactive={props.inactive}
      color={props.color}
      margin={props.margin}
      margintop={props.margintop}
      marginbottom={props.marginbottom}
      marginleft={props.marginleft}
      marginright={props.marginright}
    >
      <Widget>
        {props.iconLeft && (
          <Icon
            icon={props.iconLeft}
            size="xxs"
            marginright="xxs"
            color={props.color}
            colorVariant="text"
          />
        )}
        {props.text && (
          <ContentText
            type="description"
            color={props.color}
            colorVariant="text"
          >
            {props.text}
          </ContentText>
        )}
        {props.iconRight && (
          <Icon
            icon={props.iconRight}
            size="xxs"
            marginleft="xxs"
            color={props.color}
            colorVariant="text"
          />
        )}
      </Widget>
    </WidgetContainer>
  );
};

const WidgetContainer = styled<
  {
    inactive?: boolean;
  } & WithMarginProps
>(Box)`
  ${(props) => (props.inactive ? "opacity: 0.35;" : "")}
  position: relative;
  z-index: 5;
  border-radius: ${borderRadius.md};
  padding: ${spacing.xxs} ${spacing.xs};
`;

const Widget = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default MapWidget;
