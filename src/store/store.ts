import AsyncStorage from "@react-native-community/async-storage";
import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import alertReducer from "./alert/alert";
import authReducer from "./auth/auth";
import globalReducer from "./global/global";
import modalReducer from "./modal/modal";
import requestStateReducer from "./requestState";
import { IReduxState } from "./store.types";
import userReducer from "./user/user";
import settingsReducer from "./settings/settings";

const rootReducer: Reducer<IReduxState> = combineReducers<IReduxState>({
  global: globalReducer,
  requestState: requestStateReducer,
  auth: authReducer,
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    debug: false,
    /* version: 0,
    migrate: createMigrate({
      0: (state: IReduxState) => ({
        ...state,
        ingame: ingameInitialState,
      }),
    }), */
  },
  rootReducer
);

const middlewares = [thunk];

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

export default { store, persistor };
