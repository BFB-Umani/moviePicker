import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Icon from "moviepicker/components/Icon/Icon";
import Separator from "moviepicker/components/Separator/Separator";
import { IMovie, IMovieList } from "moviepicker/reduxStore/store.types";
import React from "react";
import { RefreshControl, FlatList, TouchableOpacity, } from "react-native";
import CreateListButton from "moviepicker/components/CreateListButton/CreateListButton";

interface Props {
  lists: IMovieList[];
  onSelectList: (results: IMovieList) => void;
  onCreateList: () => void;
  isRefreshing: boolean;
  messageForUser: string;
}

const MovieList: React.FC<Props> = (props) => {

  const renderCompetitionListItem = (results: IMovieList) => (
    <TouchableOpacity onPress={() => props.onSelectList(results)}>
      <Box
        justifyContent="space-around"
        alignItems="center"
        flexDirection="row"
        padding="sm"
      >
          <Box flex={1} alignItems="center">
            <Icon icon="list" size="xxs"/>
            <ContentText type="h3" color="text">{results.name}</ContentText>
          </Box>
          <Icon icon="chevron-right" size="xxs" />
      </Box>
      <Separator color="panel" />
    </TouchableOpacity>
  );

  const resultList = props.lists;

  return (
    <Box alignItems="center">
      <Box fullWidth={true}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={resultList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderCompetitionListItem(item)}
          refreshControl={
            <RefreshControl
              refreshing={props.isRefreshing}
            />
          }
        />
        {!props.isRefreshing && resultList.length === 0 && (
          <Box padding="sm" alignItems="center" justifyContent="center">
            <ContentText type="h1" color="disabled" textalign="center">
              Could not find any lists..
            </ContentText>
            <ContentText type="h1" color="disabled" textalign="center">
              {props.messageForUser}
            </ContentText>
          </Box>  
        )}
      </Box>
      <Box alignItems="center">
              <CreateListButton
                size="xxxlarge"
                type="primary"
                hollow={false}
                icon="plus"
                margintop="md"
                iconColor="general"
                onPress={props.onCreateList}
              />
            </Box>
    </Box>
  );
};

export default MovieList;
