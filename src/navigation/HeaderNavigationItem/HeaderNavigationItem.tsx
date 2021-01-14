import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import { IconType } from "b3runtime/components/Icon/Icon.types";
import { ColorType } from "b3runtime/styles/colors";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

interface Props {
  label?: string;
  iconLeft?: IconType;
  iconRight?: IconType;
  color?: ColorType;
  colorVariant?: "background" | "text";
  disabled?: boolean;
}

const Container = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(props) => (props.disabled ? "opacity: 0.5;" : "")}
`;

const HeaderNavigationItem: React.FC<Props & TouchableOpacityProps> = (
  props
) => (
  <Container
    accessibilityRole="button"
    accessibilityLabel={props.label}
    {...props}
  >
    {props.iconLeft && (
      <Icon
        icon={props.iconLeft}
        size="sm"
        marginleft="xs"
        marginright="xs"
        color={props.color}
        colorVariant={props.colorVariant || "background"}
        {...props}
      />
    )}

    {props.label && (
      <ContentText
        type="body"
        color={props.color}
        colorVariant={props.colorVariant || "background"}
        {...props}
      >
        {props.label}
      </ContentText>
    )}

    {props.iconRight && (
      <Icon
        icon={props.iconRight}
        size="sm"
        marginright="xs"
        marginleft="xs"
        color={props.color}
        {...props}
      />
    )}
  </Container>
);
export default HeaderNavigationItem;
