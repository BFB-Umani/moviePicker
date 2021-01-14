import Icon from "b3runtime/components/Icon/Icon";
import { spacing } from "b3runtime/styles/spacing";
import { fontSize } from "b3runtime/styles/typography";
import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  TextInputProps,
  View,
} from "react-native";

import Box from "../Box/Box";
import ContentText from "../ContentText/ContentText";
import * as Style from "./InputField.style";
import { IInputField } from "./InputField.types";

const InputField: React.FC<IInputField & TextInputProps> = (props) => {
  const textInputRef = useRef<TextInput>(null);
  const [hasFocus, setHasFocus] = useState(false);

  const onFocus = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setHasFocus(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setHasFocus(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const getKeyboardType = () => {
    switch (props.type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  };

  return (
    <Style.InputFieldContainer fullWidth={props.fullWidth}>
      <View>
        {props.label && (
          <Box marginbottom="xxs">
            <Style.Label
              error={props.error}
              disabled={props.disabled}
              hasFocus={hasFocus}
            >
              {props.label}
            </Style.Label>
          </Box>
        )}
        <Style.InnerContainer
          error={props.error}
          disabled={props.disabled}
          hasFocus={hasFocus}
        >
          <Style.StyledTextField
            ref={textInputRef}
            style={{
              top: props.multiline ? parseInt(spacing.xs, 10) : 0,
              paddingLeft: props.iconLeft
                ? 22 + parseInt(spacing.sm, 10) * 2
                : parseInt(spacing.sm, 10),
              paddingRight: props.iconRight
                ? 22 + parseInt(spacing.sm, 10) * 2
                : parseInt(spacing.sm, 10),
            }}
            fontSize={fontSize.md}
            textAlignVertical={props.multiline ? "top" : "center"}
            accessibilityLabel={props.accessibilityLabel}
            error={props.error}
            editable={!props.disabled}
            scrollEnabled={true}
            disabled={props.disabled}
            inputActive={hasFocus}
            multiline={props.multiline}
            numberOfLines={1}
            secureTextEntry={props.type === "password"}
            placeholder={hasFocus ? props.placeholder : " "}
            autoCapitalize={
              props.type === "email" || props.type === "password"
                ? "none"
                : undefined
            }
            keyboardType={getKeyboardType()}
            {...props}
            onBlur={onBlur}
            onFocus={onFocus}
          />
          {props.iconLeft && (
            <Style.IconContainer>
              <Icon
                icon={props.iconLeft}
                size="xs"
                color={hasFocus ? "primary" : "panel"}
                colorShade="darker"
              />
            </Style.IconContainer>
          )}
          {props.iconRight && (
            <Style.IconContainer position="right">
              <Icon
                icon={props.iconRight}
                size="xs"
                color={hasFocus ? "primary" : "panel"}
                colorShade="darker"
              />
            </Style.IconContainer>
          )}
        </Style.InnerContainer>
        {props.description && (
          <Box flexDirection="row" alignItems="center">
            {props.descriptionIcon && (
              <Icon
                icon={props.descriptionIcon}
                color="disabled"
                size="xxs"
                marginright="xs"
              />
            )}

            <Box>
              <ContentText type="fineprint" margintop="xs" color="disabled">
                {props.description}
              </ContentText>
            </Box>
          </Box>
        )}
        {props.error && props.errorMessage && (
          <ContentText type="fineprint" color="danger" margintop="xxs">
            {props.errorMessage}
          </ContentText>
        )}
      </View>
    </Style.InputFieldContainer>
  );
};
export default InputField;
