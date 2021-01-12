import { IAlert, IReduxState } from "b3runtime/reduxStore/store.types";
import { Dispatch } from "redux";

import { alertReduxSlice } from "./alert";
import alertSelectors from "./alert.selectors";

const createAlert = (alert: IAlert) => (
  dispatch: Dispatch,
  getState: () => IReduxState
) => {
  dispatch(alertReduxSlice.actions.create(alert));
  const alertList = alertSelectors.alertListSelector(getState());
  if (alert.closeAfter && alert.closeAfter > 0) {
    setTimeout(() => {
      if (alert.id) {
        closeAlert(alert.id)(dispatch);
      } else {
        closeAlertByIndex(alertList.length - 1)(dispatch);
      }
    }, alert.closeAfter);
  }
};

const closeAlert = (id: IAlert["id"]) => (dispatch: Dispatch) => {
  dispatch(alertReduxSlice.actions.close(id));
};

const closeAlertByIndex = (index: number) => (dispatch: Dispatch) => {
  dispatch(alertReduxSlice.actions.closeByIndex(index));
};

export default {
  createAlert,
  closeAlert,
  closeAlertByIndex,
};
