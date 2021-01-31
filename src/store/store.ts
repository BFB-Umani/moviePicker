import { createStore, combineReducers, applyMiddleware, Reducer } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import alertReducer from "./alert/alert";
import authReducer from "./auth/auth";
import globalReducer from "./global/global";
import requestStateReducer from "./requestState";
import movieSearchReducer from "./movieSearch/movieSearch"
import { IReduxState } from "./store.types";
import userReducer from "./user/user";
import listReducer from "./lists/lists";
import moviesReducer from "./lists/movies";
import contributersListReducer from "./lists/contributersList";
import allUserListsReducer from "./lists/allUserLists";

const rootReducer: Reducer<IReduxState> = combineReducers<IReduxState>({
  global: globalReducer,
  requestState: requestStateReducer,
  auth: authReducer,
  user: userReducer,
  alert: alertReducer,
  searchResult: movieSearchReducer,
  lists: listReducer,
  movieList: moviesReducer,
  contributersLists: contributersListReducer,
  allUserLists: allUserListsReducer,
});

const middlewares = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default { store };
