import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import alertReducer from "./alert/alert";
import authReducer from "./auth/auth";
import globalReducer from "./global/global";
import modalReducer from "./modal/modal";
import requestStateReducer from "./requestState";
import movieSearchReducer from "./movieSearch/movieSearch"
import { IReduxState } from "./store.types";
import userReducer from "./user/user";
import settingsReducer from "./settings/settings";
import listReducer from "./lists/lists";
import moviesReducer from "./lists/movies";
import contributersListReducer from "./lists/contributersList";

const rootReducer: Reducer<IReduxState> = combineReducers<IReduxState>({
  global: globalReducer,
  requestState: requestStateReducer,
  auth: authReducer,
  user: userReducer,
  modal: modalReducer,
  alert: alertReducer,
  settings: settingsReducer,
  searchResult: movieSearchReducer,
  lists: listReducer,
  movieList: moviesReducer,
  contributersLists: contributersListReducer,
});

const middlewares = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default { store };
