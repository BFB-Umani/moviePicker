import {
  IMovieResults,
} from "moviepicker/reduxStore/store.types";

import { MoviePickerAPI } from "../api.types";
import { firebaseCollections, firestore } from "../index";
import { logAPIError } from "../utils";

export const getSearchResults = async (searchData) => {
  const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=c5bbf3c69097e603e809cb5595f462a2&language=en-US&query=' + searchData.searchValue + '&include_adult=false');
  let resultObject = await response.json();

  const searchResults: IMovieResults[] = [];

  for (let doc of resultObject.results) {
    searchResults.push({
      id: doc.id.toString(),
      poster_path: "https://image.tmdb.org/t/p/w500" + doc.poster_path,
      title: doc.title,
      release_date: doc.release_date,
      vote_average: doc.vote_average,
    });
  }
  return searchResults;
};

export const createCreator = async (
  creatorData: MoviePickerAPI.NewCreator
) => {
  try {
    const newCreator = await firestore
      .collection(firebaseCollections.creators)
      .add(creatorData);
    return {
      id: newCreator.id,
      ...creatorData,
    } as MoviePickerAPI.NewCreator;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createCreator",
      error,
    });
  }
};

export const createContributer = async (
  contributerData: MoviePickerAPI.NewContributer
) => {
  try {
    const newContributer = await firestore
      .collection(firebaseCollections.contributers)
      .add(contributerData);
    return {
      id: newContributer.id,
      ...contributerData,
    } as MoviePickerAPI.NewContributer;
  } catch (error) {
    logAPIError({
      origin: "results",
      methodName: "createContributer",
      error,
    });
  }
};
