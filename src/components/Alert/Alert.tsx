import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import { IAlert } from "b3runtime/reduxStore/store.types";
import React from "react";
import { TouchableOpacity } from "react-native";

import * as Style from "./Alert.style";

interface Props extends IAlert {
  animateOut?: boolean;
  onClose?: () => void;
}

const Alert: React.FC<Props> = (props) => {
  return (
    <Style.Container
      color={props.color}
      onPress={props.onClick}
      activeOpacity={1}
    >
      <Style.Content>
        {props.icon && (
          <Icon
            icon={props.icon}
            marginright="sm"
            size="md"
            color={props.color}
            colorVariant="text"
          />
        )}
        <ContentText type="description" color={props.color} colorVariant="text">
          {props.text}
        </ContentText>
      </Style.Content>
      {props.closable && props.onClose && (
        <TouchableOpacity onPress={props.onClose}>
          <Icon
            icon="times"
            marginleft="md"
            size="xxs"
            color={props.color}
            colorVariant="text"
          />
        </TouchableOpacity>
      )}
      {props.onClick && (
        <Icon
          icon="chevron-right"
          marginleft="md"
          size="xxs"
          color={props.color}
          colorVariant="text"
        />
      )}
    </Style.Container>
  );
};

export default Alert;
