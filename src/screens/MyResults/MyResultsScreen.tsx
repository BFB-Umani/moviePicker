import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Box from "b3runtime/components/Box/Box";
import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import ResultFeed from "b3runtime/components/ResultFeed/ResultFeed";
import Screen from "b3runtime/components/Screen/Screen";
import { IProfileStack } from "b3runtime/navigation/Navigation.types";
import resultMethods from "b3runtime/reduxStore/result/result.methods";
import resultSelectors from "b3runtime/reduxStore/result/result.selectors";
import { IReduxState, IResult } from "b3runtime/reduxStore/store.types";
import React, { useEffect } from "react";
import { connect } from "react-redux";

interface Props extends IStateProps, IDispatchProps {
  route: RouteProp<IProfileStack, "MyResults">;
  navigation: StackNavigationProp<IProfileStack, "MyResults">;
}

const MyResultsScreen: React.FC<Props> = (props) => {
  useEffect(() => {
    if (props.userResultFeed.length === 0) {
      props.fetchUserResults();
    }
  }, []);

  return (
    <Screen
      header={{
        color: "primary",
        title: "Your Results",
      }}
      ignorepadding={true}
      showLoadingIndicator={props.isFetchingResults}
    >
      {props.userResultFeed.length > 0 && (
        <Box>
          <ResultFeed feed={props.userResultFeed} />
        </Box>
      )}

      {props.userResultFeed.length === 0 && (
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="xxlg"
        >
          <Icon icon="list-ol" color="disabled" marginbottom="sm" size="xxlg" />
          <ContentText type="description" color="disabled">
            No results yet...
          </ContentText>
        </Box>
      )}
    </Screen>
  );
};

interface IStateProps {
  userResultFeed: IResult[];
  isFetchingResults: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  userResultFeed: resultSelectors.currentUserResultFeedSelector(state),
  isFetchingResults: resultSelectors.fetchUserResultsStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  fetchUserResults: () => void;
}
const mapDispatchToProps: IDispatchProps = {
  fetchUserResults: resultMethods.fetchUserResults,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyResultsScreen);
