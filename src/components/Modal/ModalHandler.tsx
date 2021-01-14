import Modal from "b3runtime/components/Modal/Modal";
import modalMethods from "b3runtime/reduxStore/modal/modal.metods";
import modalSelectors from "b3runtime/reduxStore/modal/modal.selectors";
import { IModal, IReduxState } from "b3runtime/reduxStore/store.types";
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
