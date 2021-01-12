import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import IngameScreen from '../screens/Ingame/IngameScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CompetitionScreen from '../screens/Competition/CompetitionScreen';
import TrackScreen from '../screens/Track/TrackScreen';
import ProfileScreen from '../screens/UserProfile/ProfileScreen';
import DebugScreen from '../screens/Debug/DebugScreen';
import ResultScreen from '../screens/Result/ResultScreen';
import TopListScreen from '../screens/TopList/TopListScreen';
import AuthStartScreen, {
    screenOptions as authStartScreenOptions,
} from '../screens/Auth/AuthStartScreen';
import EmailAuthScreen, {
    screenOptions as emailAuthScreenOptions,
} from '../screens/Auth/EmailAuthScreen';
import PasswordInputScreen, {
    screenOptions as passwordInputScreenOptions,
} from '../screens/Auth/PasswordInputScreen';
import ResetPasswordScreen, {
    screenOptions as ResetPasswordScreenOptions,
} from '../screens/Auth/ResetPasswordScreen';
import ManageAccountScreen from '../screens/Auth/ManageAccountScreen';
import StartUpScreen from '../screens/StartUpScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import Colors from '../constants/Colors';
import UploadProfilePic from '../screens/Auth/UploadProfilePic';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.b3BlueOp75,
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: 'white',
};

const HomeStackNavigator = createStackNavigator();

const HomeNavigator = (
    <HomeStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <HomeStackNavigator.Screen
            name="Home"
            component={HomeScreen}
        />
        <HomeStackNavigator.Screen
            name="Map"
            component={IngameScreen}
        />
        <HomeStackNavigator.Screen
            name="Competition"
            component={CompetitionScreen}
        />
        <HomeStackNavigator.Screen
            name="Track"
            component={TrackScreen}
            options={{ title: 'Category' }}
        />
        <HomeStackNavigator.Screen
            name="Debug"
            component={DebugScreen}
        />
        <HomeStackNavigator.Screen
            name="UploadProfilePic"
            component={UploadProfilePic}
        />
        <HomeStackNavigator.Screen
            name="Profile"
            component={ProfileScreen}
        />
        <HomeStackNavigator.Screen
            name="Results"
            component={ResultScreen}
        />

        <HomeStackNavigator.Screen
            name="TopList"
            component={TopListScreen}
        />
        <HomeStackNavigator.Screen
            name="Settings"
            component={SettingsScreen}
        />
        <HomeStackNavigator.Screen
            name="ManageAccount"
            component={ManageAccountScreen}
            options={({ route }) => {
                if (route.params.isFirstTime) {
                    return {
                        title: route.params.headerTitle || 'Manage Account',
                        headerLeft: () => { },
                    };
                }
                return {
                    title: route.params.headerTitle || 'Manage Account',
                };
            }}
        />
    </HomeStackNavigator.Navigator>
);

const AuthStackNavigator = createStackNavigator();

const AuthNavigator = (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
        <AuthStackNavigator.Screen
            name="Auth"
            component={AuthStartScreen}
            options={authStartScreenOptions}
        />
        <AuthStackNavigator.Screen
            name="EmailAuth"
            component={EmailAuthScreen}
            options={emailAuthScreenOptions}
        />
        <AuthStackNavigator.Screen
            name="PasswordInput"
            component={PasswordInputScreen}
            options={passwordInputScreenOptions}
        />
        <AuthStackNavigator.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={ResetPasswordScreenOptions}
        />
        <AuthStackNavigator.Screen
            name="ManageAccount"
            component={ManageAccountScreen}
            options={({ route }) => ({
                title: route.params.headerTitle || 'Manage Account',
            })}
        />
        <AuthStackNavigator.Screen
            name="UploadProfilePic"
            component={UploadProfilePic}
        />
    </AuthStackNavigator.Navigator>
);

const AppNavigator = () => {
    const isAuth = useSelector((state) => !!state.auth.token);
    const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

    return (
        <NavigationContainer>
            {isAuth && HomeNavigator}
            {!isAuth && didTryAutoLogin && AuthNavigator}
            {!isAuth && !didTryAutoLogin && <StartUpScreen />}
        </NavigationContainer>
    );
};

export default AppNavigator;
