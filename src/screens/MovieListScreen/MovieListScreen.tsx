import { StackScreenProps } from "@react-navigation/stack";
import Box from "moviepicker/components/Box/Box";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
} from "moviepicker/navigation/Navigation.types";
import movieSearchSelectors from "moviepicker/reduxStore/movieSearch/movieSearch.selectors";
import { IReduxState, IMovieResults } from "moviepicker/reduxStore/store.types";
import React, { useRef } from "react";
import { connect } from "react-redux";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import SearchImage from "moviepicker/components/SearchImage/SearchImage";

import SearchResultList from "./MovieList/MovieList";

const searchResultScreen: React.FC<
IStateProps &
  StackScreenProps<AuthorizedBottomTabStack, "Dashboard"> &
    StackScreenProps<IDashboardStack, "Dashboard">
> = (props) => {

  const modalizeRef = useRef<Modalize>(null);

  let searchImageSrc = "https://image.tmdb.org/t/p/w500/uh8bwvgGXeUKzdL4oSul9zxyTcd.jpg";
  let imageSrcSet = false;

  const onSelectMovie = async (result: IMovieResults) => {
    if (result && result.id) {
      await setSearchImageSrc(result);
      if(imageSrcSet) {
        modalizeRef.current?.open();
      }
    }
  };
  const setSearchImageSrc = (result: IMovieResults) => {
    searchImageSrc = result.poster_path;
    imageSrcSet = true;
  }

  return (
    <Screen
      header={{
        color: "general",
        title: "Your Lists",
      }}
      showLoadingIndicator={
        props.results.length === 0 && props.isFetchingResults
      }
      loadingText="Fetching results"
      noScroll={true}
      ignorepadding={true}
    >
      <Separator color="primary"/>
      <Box>
        <SearchResultList
          results={props.results}
          isRefreshing={props.isFetchingResults}
          onSelectMovie={onSelectMovie}
        />
      </Box>
      <Portal>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          withHandle={false}
          adjustToContentHeight={true}
        >
          <Box padding="sm" color="general" paddingbottom="xlg">
            <Box alignItems="center" marginbottom="sm">
              <SearchImage imageUrl={searchImageSrc}/>
            </Box>
            <ContentText
              type="h3"
              marginbottom="md"
              color="text"
              textalign="center"
            >
              Add to List?
            </ContentText>
            <Button
              size="small"
              label="add to list"
              type="text"
              hollow={true}
              iconLeft="camera"
            />
            <Button
              size="small"
              label="create and add to new list"
              type="text"
              hollow={true}
              iconLeft="images"
              margintop="md"
              
            />
          </Box>
        </Modalize>
      </Portal>
    </Screen>
  );
};

interface IStateProps {
  results: IMovieResults[];
  isFetchingResults: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  results: movieSearchSelectors.movieSearchListSelector(state),
  isFetchingResults: movieSearchSelectors.movieSearchStateSelector.isLoading(
    state
  ),
});

export default connect(
  mapStateToProps,
)(searchResultScreen);
