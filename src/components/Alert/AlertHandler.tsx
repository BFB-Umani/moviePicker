import Alert from "b3runtime/components/Alert/Alert";
import alertMethods from "b3runtime/reduxStore/alert/alert.methods";
import alertSelectors from "b3runtime/reduxStore/alert/alert.selectors";
import { IAlert, IReduxState } from "b3runtime/reduxStore/store.types";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { connect } from "react-redux";
import { animated } from "react-spring";
import { Transition } from "react-spring/renderprops";
import styled from "styled-components/native";

const Wrapper = styled(SafeAreaView)`
  z-index: 99;
  width: 100%;
  bottom: 0;
  left: 0;
`;

const AlertContainer = styled(animated(View))`
  z-index: 100;
`;

interface Props extends IStateProps, IDispatchProps {}

const AlertHandler: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <Transition
        items={props.alerts}
        from={{ opacity: 0, y: 20 }}
        enter={{ opacity: 1, y: 1 }}
        leave={{ opacity: 0, y: 20 }}
      >
        {(alert, state, index) => (anim) => (
          <AlertContainer
            style={{
              opacity: anim.opacity,
              top: anim.y,
            }}
          >
            <Alert {...alert} onClose={() => props.closeAlertByIndex(index)} />
          </AlertContainer>
        )}
      </Transition>
    </Wrapper>
  );
};

interface IStateProps {
  alerts: IAlert[];
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  alerts: alertSelectors.alertListSelector(state),
});

interface IDispatchProps {
  closeAlert: (id: IAlert["id"]) => void;
  closeAlertByIndex: (index: number) => void;
}
const mapDispatchToProps: IDispatchProps = {
  closeAlert: alertMethods.closeAlert,
  closeAlertByIndex: alertMethods.closeAlertByIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertHandler);
