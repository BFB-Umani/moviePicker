import { IModal } from "b3runtime/reduxStore/store.types";
import { Dispatch } from "redux";

import { modalReduxSlice } from "./modal";

const createModal = (modal: IModal) => (dispatch: Dispatch) => {
  dispatch(modalReduxSlice.actions.create(modal));
};

const closeModal = (id: IModal["id"]) => (dispatch: Dispatch) => {
  dispatch(modalReduxSlice.actions.animateOut(id));
  setTimeout(() => {
    dispatch(modalReduxSlice.actions.close(id));
  }, 500);
};

export default {
  createModal,
  closeModal,
};
