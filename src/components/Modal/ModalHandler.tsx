import Modal from "moviepicker/components/Modal/Modal";
import modalMethods from "moviepicker/reduxStore/modal/modal.metods";
import modalSelectors from "moviepicker/reduxStore/modal/modal.selectors";
import { IModal, IReduxState } from "moviepicker/reduxStore/store.types";
import React from "react";
import { connect } from "react-redux";

interface Props extends IStateProps, IDispatchProps {}

const ModalHandler: React.FC<Props> = (props) => {
  const onModalClose = () => {
    props.closeModal(props.currentModal?.id);
  };

  return props.currentModal ? (
    <Modal
      isOpen={true}
      onClose={onModalClose}
      animateOut={props.currentModal.state === "animating-out"}
      {...props.currentModal}
    />
  ) : null;
};

interface IStateProps {
  currentModal?: IModal;
  isCurrentModalAnimatingOut: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  currentModal: modalSelectors.currentModal(state),
  isCurrentModalAnimatingOut: modalSelectors.isCurrentModalAnimatingOut(state),
});

interface IDispatchProps {
  closeModal: (id: IModal["id"]) => void;
}
const mapDispatchToProps: IDispatchProps = {
  closeModal: modalMethods.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandler);
