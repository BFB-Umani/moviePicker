import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ForestImg from "moviepicker/assets/images/forest.jpg";
import AlertHandler from "moviepicker/components/Alert/AlertHandler";
import B3RuntimeLogo from "moviepicker/components/B3RuntimeLogo/B3RuntimeLogo";
import Box from "moviepicker/components/Box/Box";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Screen from "moviepicker/components/Screen/Screen";
import { UnauthorizedNavigationStack } from "moviepicker/navigation/Navigation.types";
import authMethods from "moviepicker/reduxStore/auth/auth.methods";
import authSelectors from "moviepicker/reduxStore/auth/auth.selectors";
import { IError, IReduxState } from "moviepicker/reduxStore/store.types";
import React from "react";
import { SafeAreaView } from "react-native";
import { connect } from "react-redux";

import * as Style from "./LandingScreen.style";

interface Props extends IStateProps, IDispatchProps {
  route: RouteProp<UnauthorizedNavigationStack, "Landing">;
  navigation: StackNavigationProp<UnauthorizedNavigationStack, "Landing">;
}

const LandingScreen: React.FC<Props> = (props) => {
  const navigateToLogin = () => {
    props.navigation.navigate("Login");
  };
  const navigateToSignup = () => {
    props.navigation.navigate("Signup");
  };

  return (
    <Style.Wrapper>
      <Style.BackgroundImage source={ForestImg} />
      <Screen
        header={{ hide: true, color: "primary" }}
        transparentBackground={true}
        showLoadingIndicator={props.isLoginGoogleLoading}
        loadingText="Logging in..."
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <B3RuntimeLogo />
        </Box>
        <SafeAreaView>
          <Box paddingleft="sm" paddingright="sm" alignItems="center">
            <ContentText
              type="h4"
              marginbottom="sm"
              textalign="center"
              color="primary"
              colorVariant="text"
            >
              Login
            </ContentText>
            <Button
              label="Email"
              iconLeft="envelope"
              iconRight="chevron-right"
              type="general"
              marginbottom="sm"
              onPress={navigateToLogin}
            />
            <Button
              label="Google"
              iconLeft="google"
              iconRight="chevron-right"
              type="text"
              marginbottom="md"
              disabled={props.isLoginGoogleLoading}
              onPress={props.loginGoogle}
            />
            <Button
              label="Create an account"
              hollow={true}
              type="general"
              margintop="md"
              onPress={navigateToSignup}
            />
          </Box>
          <Box margintop="lg">
            <ContentText
              type="fineprint"
              textalign="center"
              color="primary"
              colorVariant="text"
            >
              v{Utils.getAppVersion()}
            </ContentText>
          </Box>
        </SafeAreaView>
      </Screen>
      <AlertHandler />
    </Style.Wrapper>
  );
};

interface IStateProps {
  gameIsOngoing: boolean;
  currentTrackId?: string;
  isLoginGoogleLoading?: boolean;
  loginGoogleError?: IError;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  gameIsOngoing: ingameSelectors.gameIsOngoingSelector(state),
  currentTrackId: ingameSelectors.currentTrackIdSelector(state),
  isLoginGoogleLoading: authSelectors.loginGoogleStateSelector.isLoading(state),
  loginGoogleError: authSelectors.loginGoogleStateSelector.error(state),
});

interface IDispatchProps {
  loginGoogle: () => void;
}
const mapDispatchToProps: IDispatchProps = {
  loginGoogle: authMethods.loginGoogle,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);
