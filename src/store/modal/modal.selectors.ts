import { IModal, IReduxState } from "moviepicker/reduxStore/store.types";
import { createSelector } from "reselect";

const currentModal = createSelector(
  (state: IReduxState) => state.modal,
  (modal): IModal | undefined => modal && modal.list && modal.list[0]
);
const isCurrentModalAnimatingOut = createSelector(
  (state: IReduxState) => state.modal,
  (modal): boolean =>
    modal && modal.list && modal.list[0]
      ? modal.list[0].state === "animating-out"
      : false
);

export default {
  currentModal,
  isCurrentModalAnimatingOut,
};
