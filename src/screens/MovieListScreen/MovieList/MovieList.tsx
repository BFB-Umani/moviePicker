import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Icon from "moviepicker/components/Icon/Icon";
import Separator from "moviepicker/components/Separator/Separator";
import { IMovieResults } from "moviepicker/reduxStore/store.types";
import React from "react";
import { RefreshControl, FlatList, TouchableOpacity, } from "react-native";
import SearchImage from "moviepicker/components/SearchImage/SearchImage";

interface Props {
  results: IMovieResults[];
  onSelectMovie: (results: IMovieResults) => void;
  isRefreshing: boolean;
}

const CompetitionList: React.FC<Props> = (props) => {

  const renderCompetitionListItem = (results: IMovieResults) => (
    <TouchableOpacity onPress={() => props.onSelectMovie(results)}>
      <Box
        justifyContent="space-around"
        alignItems="center"
        flexDirection="row"
        padding="sm"
      >
          <Box flex={1} alignItems="center">
            <SearchImage imageUrl={results.poster_path} onPress={() => props.onSelectMovie(results)}/>
            <ContentText type="h1" color="text">{results.title}</ContentText>
            <Box margintop="xxs" flexDirection="row" alignItems="center">
              <Icon icon="star" marginright="xxs" color="gold" size="xxs" />
              <ContentText type="description" color="disabled">
                  {results.vote_average}
              </ContentText>
            </Box>
          </Box>
      </Box>
      <Separator color="panel" />
    </TouchableOpacity>
  );

  const resultList = props.results;

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
            <ContentText type="description" color="disabled" textalign="center">
              Could not find any movies
            </ContentText>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompetitionList;
