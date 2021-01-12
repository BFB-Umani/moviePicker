import React, { useState } from "react";

import { YellowBox } from "react-native";

import { AppLoading } from "expo";
import * as Sentry from 'sentry-expo';
import * as Font from "expo-font";
import { Text, View } from 'react-native';

Sentry.init({
  dsn: 'https://82c229e94a8b42249ba178e4fdcff077@o499968.ingest.sentry.io/5579092',
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

const fetchFonts = () =>
  Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "open-sans-semiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
    "work-sans": require("./assets/fonts/WorkSans-Regular.ttf"),
    "work-sans-bold": require("./assets/fonts/WorkSans-Bold.ttf"),
  });

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = { ...console };
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

  const App = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
  
    if (!fontLoaded) {
      return (
        <AppLoading
          startAsync={fetchFonts}
          onFinish={() => {
            setFontLoaded(true);
          }}
        />
      );
    }
    
  return (
      <View>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
  );
}

export default App;