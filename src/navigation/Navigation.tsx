import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "b3runtime/screens/Dashboard/DashboardScreen";
import EditProfileScreen from "b3runtime/screens/EditProfile/EditProfileScreen";
import FindCompetitionScreen from "b3runtime/screens/FindCompetition/FindCompetitionScreen";
import FreerunScreen from "b3runtime/screens/Freerun/FreerunScreen";
import GameSettingsScreen from "b3runtime/screens/GameSettings/GameSettingsScreen";
import IngameScreen from "b3runtime/screens/Ingame/IngameScreen";
import LandingScreen from "b3runtime/screens/LandingScreen/LandingScreen";
import LoginScreen from "b3runtime/screens/Login/LoginScreen";
import MyResultsScreen from "b3runtime/screens/MyResults/MyResultsScreen";
import PostGameScreen from "b3runtime/screens/PostGame/PostGameScreen";
import ProfileScreen from "b3runtime/screens/Profile/ProfileScreen";
import ResetPasswordScreen from "b3runtime/screens/ResetPassword/ResetPasswordScreen";
import SignupScreen from "b3runtime/screens/Signup/SignupScreen";
import TrackSelectScreen from "b3runtime/screens/TrackSelect/TrackSelectScreen";
import UserSettingsScreen from "b3runtime/screens/UserSettings/UserSettingsScreen";
import React from "react";
import { Host } from "react-native-portalize";

import BottomTabBar from "./BottomTabBar/BottomTabBar";
import {
  AuthorizedBottomTabStack,
  IFindGameStack,
  IDashboardStack,
  IProfileStack,
  UnauthorizedNavigationStack,
  ICompetitionStack,
  IFreerunStack,
} from "./Navigation.types";
import Splash from "./Splash/Splash";

interface IAppNavigation {
  isAuthenticated: boolean;
  isAuthStateKnown: boolean;
  onNavigation?: (state?: NavigationState) => void;
}
export const navigationRef = React.createRef<NavigationContainerRef>();
const Navigation: React.FunctionComponent<IAppNavigation> = (props) =>
  props.isAuthStateKnown ? (
    <NavigationContainer ref={navigationRef} onStateChange={props.onNavigation}>
      <Host>{!props.isAuthenticated ? <Unauthorized /> : <Authorized />}</Host>
    </NavigationContainer>
  ) : (
    <Splash />
  );

const UnauthorizedStack = createStackNavigator<UnauthorizedNavigationStack>();
const Unauthorized = () => (
  <UnauthorizedStack.Navigator>
    <UnauthorizedStack.Screen name="Landing" component={LandingScreen} />
    <UnauthorizedStack.Screen name="Login" component={LoginScreen} />
    <UnauthorizedStack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
    />
    <UnauthorizedStack.Screen name="Signup" component={SignupScreen} />
  </UnauthorizedStack.Navigator>
);

const AuthorizedStack = createStackNavigator();
const Authorized = () => (
  <AuthorizedStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthorizedStack.Screen name="Home" component={BottomTabs} />
    <AuthorizedStack.Screen name="Competition" component={CompetitionScreens} />
    <AuthorizedStack.Screen name="Freerun" component={FreerunScreens} />
  </AuthorizedStack.Navigator>
);

const CompetitionStack = createStackNavigator<ICompetitionStack>();
const CompetitionScreens = () => (
  <CompetitionStack.Navigator>
    <CompetitionStack.Screen name="Ingame" component={IngameScreen} />
    <CompetitionStack.Screen
      name="GameSettings"
      component={GameSettingsScreen}
    />
    <CompetitionStack.Screen name="PostGame" component={PostGameScreen} />
  </CompetitionStack.Navigator>
);

const FreerunStack = createStackNavigator<IFreerunStack>();
const FreerunScreens = () => (
  <FreerunStack.Navigator>
    <FreerunStack.Screen name="Ingame" component={FreerunScreen} />
  </FreerunStack.Navigator>
);

const BottomTabStack = createBottomTabNavigator<AuthorizedBottomTabStack>();
const renderBottomTabBar = (props) => <BottomTabBar {...props} />;
const BottomTabs = () => (
  <BottomTabStack.Navigator tabBar={renderBottomTabBar}>
    <BottomTabStack.Screen name="Dashboard" component={DashboardScreens} />
    <BottomTabStack.Screen name="FindGame" component={FindGameScreens} />
    <BottomTabStack.Screen name="Profile" component={ProfileScreens} />
  </BottomTabStack.Navigator>
);

const DashboardStack = createStackNavigator<IDashboardStack>();
const DashboardScreens = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStack.Navigator>
);

const FindGameStack = createStackNavigator<IFindGameStack>();
const FindGameScreens = () => (
  <FindGameStack.Navigator>
    <FindGameStack.Screen
      name="FindCompetition"
      component={FindCompetitionScreen}
    />
    <FindGameStack.Screen name="TrackSelect" component={TrackSelectScreen} />
  </FindGameStack.Navigator>
);

const ProfileStack = createStackNavigator<IProfileStack>();
const ProfileScreens = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="MyResults" component={MyResultsScreen} />
    <ProfileStack.Screen name="UserSettings" component={UserSettingsScreen} />
  </ProfileStack.Navigator>
);

export default Navigation;
