import { StackScreenProps } from "@react-navigation/stack";
import Box from "moviepicker/components/Box/Box";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
} from "moviepicker/navigation/Navigation.types";
import movieSearchSelectors from "moviepicker/reduxStore/movieSearch/movieSearch.selectors";
import { IReduxState, IMovie, IUserProfile, IMovieList } from "moviepicker/reduxStore/store.types";
import React, { useRef, useState } from "react";
import { RefreshControl, FlatList, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Modalize } from "react-native-modalize";
import Modal from 'react-native-modal';
import { Portal } from "react-native-portalize";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import SearchImage from "moviepicker/components/SearchImage/SearchImage";
import listsMethods from "moviepicker/reduxStore/lists/lists.methods";
import listSelectors from "moviepicker/reduxStore/lists/lists.selectors";
import userSelectors from "moviepicker/reduxStore/user/user.selectors";

import SearchResultList from "./SearchResultList/SearchResultList";

const searchResultScreen: React.FC<
IStateProps &
IDispatchProps &
  StackScreenProps<AuthorizedBottomTabStack, "Dashboard"> &
    StackScreenProps<IDashboardStack, "Dashboard">
> = (props) => {

  const modalizeRef = useRef<Modalize>(null);
  const [searchImageSrc, setsearchImageSrc] = useState(".jpg");
  const [selectedMovie, setSelectedMovie] = useState<IMovie>();
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectMovie = (result: IMovie) => {
    if (result && result.id) {
      selectMovie(result)
        setsearchImageSrc(result.poster_path);
        modalizeRef.current?.open();
    }
  };

  const selectMovie = async (result: IMovie) => {
    setSelectedMovie(result);
  }

  const onSelectList = (list: IMovieList) => {
    if(selectedMovie) {
      props.addMovieToList(selectedMovie, list)
      setModalVisible(false);
      modalizeRef.current?.close();
    }
  }

  const openModal = () => {
    console.log(props.lists);
    setModalVisible(true);
  }

  const renderMovieListItem = (list: IMovieList) => (
    <TouchableOpacity onPress={() => onSelectList(list)}>
      <Box
        justifyContent="space-around"
        alignItems="center"
        flexDirection="row"
        padding="sm"
      >
          <Box flex={1} alignItems="center">
            <ContentText type="h4" color="text">{list.name}</ContentText>
            <Box margintop="xxs" flexDirection="row" alignItems="center">
            </Box>
          </Box>
      </Box>
      <Separator color="panel" />
    </TouchableOpacity>
  );

  return (
    <Screen
      header={{
        color: "general",
        title: "Search results",
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
              label="add"
              type="primary"
              hollow={true}
              onPress={openModal}
            />
          </Box>
        </Modalize>
      </Portal>
      <Modal isVisible={modalVisible}>
      <TouchableOpacity  
            activeOpacity={1} 
            onPressOut={() => {setModalVisible(false)}}
            style={{width: '100%', height: '100%'}}
          >
                <Box color="general" style={{borderRadius: 30, marginTop:200}} margintop="xxxlg">
                  <ContentText type="h1" margin="md" color="text">
                    pick a list
                  </ContentText>
                  <Separator color="primary"/>
                  <FlatList
                    contentContainerStyle={{ paddingBottom: 20 }}
                    data={props.lists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderMovieListItem(item)}
                    refreshControl={
                      <RefreshControl
                        refreshing={props.isFetchingLists}
                      />
                    }
                  />
                </Box>
          </TouchableOpacity>   
      </Modal>
    </Screen>
  );
};

interface IStateProps {
  userProfile?: IUserProfile;
  results: IMovie[];
  lists: IMovieList[];
  isFetchingResults: boolean;
  isFetchingLists: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  userProfile: userSelectors.userProfileSelector(state),
  results: movieSearchSelectors.movieSearchListSelector(state),
  lists: listSelectors.movieListSelector(state),
  isFetchingResults: movieSearchSelectors.movieSearchStateSelector.isLoading(
    state
  ),
  isFetchingLists: listSelectors.fetchListStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  addMovieToList: (movie: IMovie, list: IMovieList) => void;
  fetchLists: (userId: IUserProfile["id"]) => void;
}
const mapDispatchToProps: IDispatchProps = {
  addMovieToList: listsMethods.addMovieToList,
  fetchLists: listsMethods.fetchLists,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(searchResultScreen);
