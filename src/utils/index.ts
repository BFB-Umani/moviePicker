
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Sentry from "sentry-expo";

/**
 * sends accurate data to sentry for error logging
 */
const logError = ({
  origin,
  methodName,
  error,
}: {
  origin: string;
  methodName: string;
  error: any;
}) => {
  if (error && error.message) {
    Sentry.Native.captureMessage(
      `${origin}:${methodName}: ${error.message}, error`
    );
    return;
  }

  Sentry.Native.captureException(error);
};


/**
 * gets buildNumber or versionCode depending on platform Operative System
 */
export const getBuildNumber = (): string => {
  const { android, ios } = Constants.manifest;

  if (Platform.OS === "android" && android) {
    return "android 1." + android.versionCode;
  }
  if (Platform.OS === "ios" && ios) {
    return "ios 1." + ios.buildNumber;
  }
  return "";
};

/**
 * gets the current app version that is installed on your phone
 */
export const getAppVersion = () => {
  return `${Constants.manifest.version} (${getBuildNumber()})`;
};

export default {
  logError,
  getAppVersion,
};
