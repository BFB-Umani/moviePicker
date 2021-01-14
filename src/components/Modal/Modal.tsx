import Button from "moviepicker/components/Button/Button";
import { IModal } from "moviepicker/reduxStore/store.types";
import { colors } from "moviepicker/styles/colors";
import React from "react";

import * as ModalStyle from "./Modal.style";

interface Props extends IModal {
  isOpen: boolean;
  animateOut?: boolean;
}

const Modal: React.FC<Props> = (props) => {
  return (
    <ModalStyle.Modal
      isVisible={props.isOpen && !props.animateOut}
      onBackdropPress={!props.disableScrimClick ? props.onClose : undefined}
      backdropColor={
        props.scrimColor === "bright" || props.fullScreen
          ? colors.general.background
          : colors.general.text
      }
      backdropOpacity={props.fullScreen ? 1 : 0.75}
      useNativeDriver={true}
      coverScreen={true}
      {...props}
    >
      <ModalStyle.Container fullscreen={props.fullScreen}>
        {props.title && (
          <ModalStyle.TopBar fullscreen={props.fullScreen}>
            <ModalStyle.Title>{props.title}</ModalStyle.Title>
          </ModalStyle.TopBar>
        )}

        <ModalStyle.Content
          fullscreen={props.fullScreen}
          roundedTop={!props.title}
          roundedBottom={!props.button}
        >
          {props.content}
        </ModalStyle.Content>
        {props.button && (
          <ModalStyle.BottomBar transparent={props.fullScreen}>
            <Button {...props.button} />
          </ModalStyle.BottomBar>
        )}
      </ModalStyle.Container>
    </ModalStyle.Modal>
  );
};

export default Modal;
