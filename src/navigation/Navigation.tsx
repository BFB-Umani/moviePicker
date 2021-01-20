import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "moviepicker/screens/Dashboard/DashboardScreen";
import EditProfileScreen from "moviepicker/screens/EditProfile/EditProfileScreen";
import LandingScreen from "moviepicker/screens/LandingScreen/LandingScreen";
import LoginScreen from "moviepicker/screens/Login/LoginScreen";
import ProfileScreen from "moviepicker/screens/Profile/ProfileScreen";
import ResetPasswordScreen from "moviepicker/screens/ResetPassword/ResetPasswordScreen";
import SignupScreen from "moviepicker/screens/Signup/SignupScreen";
import UserSettingsScreen from "moviepicker/screens/UserSettings/UserSettingsScreen";
import { Host } from "react-native-portalize";

import BottomTabBar from "./BottomTabBar/BottomTabBar";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
  IProfileStack,
  UnauthorizedNavigationStack,
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
  </AuthorizedStack.Navigator>
);

const BottomTabStack = createBottomTabNavigator<AuthorizedBottomTabStack>();
const renderBottomTabBar = (props) => <BottomTabBar {...props} />;
const BottomTabs = () => (
  <BottomTabStack.Navigator tabBar={renderBottomTabBar}>
    <BottomTabStack.Screen name="Dashboard" component={DashboardScreens} />
    <BottomTabStack.Screen name="Profile" component={ProfileScreens} />
  </BottomTabStack.Navigator>
);

const DashboardStack = createStackNavigator<IDashboardStack>();
const DashboardScreens = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStack.Navigator>
);

const ProfileStack = createStackNavigator<IProfileStack>();
const ProfileScreens = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="UserSettings" component={UserSettingsScreen} />
  </ProfileStack.Navigator>
);

export default Navigation;
