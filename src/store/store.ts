import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import thunk from "redux-thunk";

import alertReducer from "./alert/alert";
import authReducer from "./auth/auth";
import globalReducer from "./global/global";
import modalReducer from "./modal/modal";
import requestStateReducer from "./requestState";
import { IReduxState } from "./store.types";
import userReducer from "./user/user";

const rootReducer: Reducer<IReduxState> = combineReducers<IReduxState>({
  global: globalReducer,
  requestState: requestStateReducer,
  auth: authReducer,
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
});

const store = createStore(
  rootReducer,
);

export default { store };
