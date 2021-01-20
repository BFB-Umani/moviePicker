import React from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ForestImg from "moviepicker/assets/images/forest.jpg";
import Avatar from "moviepicker/components/Avatar/Avatar";
import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Icon from "moviepicker/components/Icon/Icon";
import List from "moviepicker/components/List/List";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import { IProfileStack } from "moviepicker/navigation/Navigation.types";
import authMethods from "moviepicker/reduxStore/auth/auth.methods";
import { IReduxState, IUserProfile } from "moviepicker/reduxStore/store.types";
import userSelectors from "moviepicker/reduxStore/user/user.selectors";
import { connect } from "react-redux";

import * as Style from "./ProfileScreen.style";

interface Props extends IStateProps, IDispatchProps {
  route: RouteProp<IProfileStack, "Profile">;
  navigation: StackNavigationProp<IProfileStack, "Profile">;
}

const ProfileScreen: React.FC<Props> = (props) => {
  const navigateToResults = () => {
    props.navigation.navigate("MyResults");
  };
  const navigateToSettings = () => {
    props.navigation.navigate("UserSettings");
  };

  return (
    <Screen
      header={{
        hide: true,
        color: "text",
      }}
      showLoadingIndicator={props.isLoadingUserProfile}
      ignorepadding={true}
      fullwidth={true}
    >
      <Box color="secondary" flex={1}>
        <Style.ProfileBackground source={ForestImg} blurRadius={3} />
        {props.userProfile && (
          <Box flex={1} color="general">
            <Style.AvatarContainer>
              <Avatar imageUrl={props.userProfile.avatarUrl} />
            </Style.AvatarContainer>

            <Box margintop="xxxlg" marginbottom="lg">
              {props.userProfile.username && (
                <ContentText
                  type="h3"
                  color="primary"
                  textalign="center"
                  margintop="xxxs"
                >
                  {props.userProfile.username}
                </ContentText>
              )}
              {props.fullname && (
                <ContentText
                  type="description"
                  textalign="center"
                  margintop="xxxs"
                >
                  {props.fullname}
                </ContentText>
              )}
            </Box>
            <Separator color="panel" size="lg" />
            <Box justifyContent="center" alignItems="center" padding="xxlg">
              <Icon icon="chart-bar" color="disabled" marginbottom="xxs" />
              <ContentText type="fineprint" color="disabled">
                Here you will see your overall stats...
              </ContentText>
            </Box>
            <Separator color="panel" size="lg" />
            <List
              items={[
                {
                  label: "Settings",
                  iconLeft: "cog",
                  iconRight: "chevron-right",
                  onPress: navigateToSettings,
                },
              ]}
            />
          </Box>
        )}
        {!props.userProfile && (
          <Box flex={1} color="general">
            <Box flex={1} color="general">
              <Style.AvatarContainer>
                <Avatar />
              </Style.AvatarContainer>

              <Box
                margintop="xxxlg"
                marginbottom="lg"
                flex={1}
                justifyContent="center"
                alignItems="center"
              >
                <Icon
                  icon="user-alt-slash"
                  color="disabled"
                  marginbottom="sm"
                  size="xxlg"
                />
                <ContentText type="description" color="disabled">
                  Could not load profile
                </ContentText>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Screen>
  );
};

interface IStateProps {
  userProfile?: IUserProfile;
  fullname?: string;
  isLoadingUserProfile: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  userProfile: userSelectors.userProfileSelector(state),
  fullname: userSelectors.userFullnameSelector(state),
  isLoadingUserProfile: userSelectors.fetchProfileStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  logout: () => void;
}
const mapDispatchToProps: IDispatchProps = {
  logout: authMethods.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
