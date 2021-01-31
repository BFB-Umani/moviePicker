import { StackScreenProps } from "@react-navigation/stack";
import Box from "moviepicker/components/Box/Box";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
} from "moviepicker/navigation/Navigation.types";
import { IReduxState, IMovie } from "moviepicker/reduxStore/store.types";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Icon from "moviepicker/components/Icon/Icon";
import SearchImage from "moviepicker/components/SearchImage/SearchImage";

import MovieList from "./MovieList/MovieList";
import listsSelectors from "moviepicker/reduxStore/lists/lists.selectors";

const searchResultScreen: React.FC<
IStateProps &
  StackScreenProps<AuthorizedBottomTabStack, "Dashboard"> &
    StackScreenProps<IDashboardStack, "Dashboard">
> = (props) => {

  const modalizeRef = useRef<Modalize>(null);
  const [searchImageSrc, setsearchImageSrc] = useState(".jpg");
  const [movieName, setMovieName] = useState("placeholder");
  const [realeaseDate, setRealeaseDate] = useState("placeholder");
  const [voteAverage, setVoteAverage] = useState("placeholder");

  const onGiveRandomMovie = () => {
    const rn = Math.floor(Math.random() * props.movies.length);
    const result = props.movies[rn];
    setMovieName(result.title);
    setRealeaseDate(result.release_date);
    setVoteAverage(result.vote_average);
    setsearchImageSrc(result.poster_path);
    modalizeRef.current?.open();
  };

  return (
    <Screen
      header={{
        color: "general",
        title: "movies",
      }}
      showLoadingIndicator={
        props.movies.length === 0 && props.isFetchingResults
      }
      loadingText="Fetching results"
      noScroll={true}
      ignorepadding={true}
    >
      <Portal>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          withHandle={false}
          adjustToContentHeight={true}
        >
          <Box padding="sm" color="general" paddingbottom="xlg">
            <ContentText
              type="h3"
              color="text"
              textalign="center"
              marginbottom="md"
            >
              Tonight you'll watch:
            </ContentText>
            <Box alignItems="center" marginbottom="sm">
              <SearchImage imageUrl={searchImageSrc}/>
            </Box>
            <ContentText type="h3" color="text" textalign="center">
              {movieName}!
            </ContentText>
            <ContentText type="h4" color="text" textalign="center">
              ({realeaseDate})
            </ContentText>
            <Box margintop="xxs" flexDirection="row" alignItems="center" justifyContent="center">
              <Icon icon="star" marginright="xxs" color="gold" size="xxs" />
              <ContentText type="description" color="disabled">
                  {voteAverage}
              </ContentText>
            </Box>
          </Box>
        </Modalize>
      </Portal>
      <Separator color="primary"/>
      {props.movies.length > 0 && (
        <Box padding="sm" color="general" >
          <Button
            size="small"
            label="get random movie!"
            type="secondary"
            hollow={false}
            onPress={onGiveRandomMovie}
          />
        </Box>)}
      <Box paddingbottom="xxxlg">
        <MovieList
          movies={props.movies}
          isRefreshing={props.isFetchingResults}
        />
      </Box>
          
    </Screen>
  );
};

interface IStateProps {
  movies: IMovie[];
  isFetchingResults: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  movies: listsSelectors.moviesSelector(state),
  isFetchingResults: listsSelectors.fetchMovieListStateSelector.isLoading(
    state
  ),
});

export default connect(
  mapStateToProps,
)(searchResultScreen);
