import React, {useEffect, useState } from "react";

import { LogBox } from "react-native";

import ReduxStore from "moviepicker/reduxStore/store";
import MoviePicker from "./src/index";

import * as SplashScreen from "expo-splash-screen";
import * as Sentry from 'sentry-expo';
import * as Font from "expo-font";
import { Provider } from "react-redux";


Sentry.init({
  dsn: 'https://82c229e94a8b42249ba178e4fdcff077@o499968.ingest.sentry.io/5579092',
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

// Workaround for expo/firebase bug that shows a error message from inside firebase.
// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes/48778011
LogBox.ignoreLogs(["Setting a timer"]);
const _console = { ...console };
console.warn = (message) => {
  if (message && message.indexOf && message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    initializeResources();
  }, []);

  /**
   * initialize Fonts from assets and use method for preventing native splash screen from autohiding
   */
  const initializeResources = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({
        "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
        "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
        "open-sans-semiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
        "work-sans": require("./assets/fonts/WorkSans-Regular.ttf"),
        "work-sans-bold": require("./assets/fonts/WorkSans-Bold.ttf"),
      });
    } catch (e) {
      console.warn(e);
    } finally {
      await SplashScreen.hideAsync();
      setAppReady(true);
    }
  };

  if (!appReady) {
    return null;
  }

  return (
    <Provider store={ReduxStore.store}>
        <MoviePicker />
    </Provider>
  );
};

export default App;