import AsyncStorage from "@react-native-community/async-storage";
import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import alertReducer from "./alert/alert";
import authReducer from "./auth/auth";
import competitionsReducer from "./competition/competition";
import freerunReducer from "./freerun/freerun";
import globalReducer from "./global/global";
import ingameReducer from "./ingame/ingame";
import modalReducer from "./modal/modal";
import pushNotificationsReducer from "./pushNotifications/pushNotifications";
import requestStateReducer from "./requestState";
import resultReducer from "./result/result";
import settingsReducer from "./settings/settings";
import { IReduxState } from "./store.types";
import userReducer from "./user/user";

const rootReducer: Reducer<IReduxState> = combineReducers<IReduxState>({
  global: globalReducer,
  requestState: requestStateReducer,
  auth: authReducer,
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
  pushNotifications: pushNotificationsReducer,
  competition: competitionsReducer,
  settings: settingsReducer,
  ingame: ingameReducer,
  freerun: freerunReducer,
  result: resultReducer,
});

const whitelist: (keyof IReduxState)[] = ["ingame", "settings"];
const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    whitelist,
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
