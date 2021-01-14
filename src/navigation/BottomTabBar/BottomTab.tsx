import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import { IconType } from "b3runtime/components/Icon/Icon.types";
import { spacing } from "b3runtime/styles/spacing";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

interface Props {
  label: string;
  icon?: IconType;
  isActive?: boolean;
}

const Container = styled(TouchableOpacity)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xxs};
`;

const BottomTab: React.FC<Props & TouchableOpacityProps> = (props) => (
  <Container
    accessibilityRole="button"
    accessibilityState={props.isActive ? { selected: true } : {}}
    accessibilityLabel={props.label}
    {...props}
  >
    {props.icon && (
      <Icon
        icon={props.icon}
        size="xxs"
        marginbottom="xxxs"
        color={props.isActive ? "primary" : "disabled"}
      />
    )}

    <ContentText
      type="fineprint"
      color={props.isActive ? "primary" : "disabled"}
    >
      {props.label}
    </ContentText>
  </Container>
);
export default BottomTab;
