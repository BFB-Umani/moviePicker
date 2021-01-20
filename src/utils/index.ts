import React from "react";
import { scrollViewRef } from "moviepicker/components/Screen/Screen";
import { ICheckpoint } from "moviepicker/reduxStore/store.types";
import * as dateFns from "date-fns";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import { Dimensions, Linking, Platform } from "react-native";
import * as Sentry from "sentry-expo";

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

const playAudio = async (audio) => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(audio);
    soundObject.setOnPlaybackStatusUpdate(async (status: any) => {
      if (status.didJustFinish === true) {
        // audio has finished!
        await soundObject.unloadAsync();
      }
    });
    await soundObject.playAsync();
  } catch (error) {
    logError({ origin: "Utils", methodName: "playAudio", error });
  }
};

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371e3; // earth radius in meters
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance; // in meters
};

const calculateDistanceByCheckpoints = (checkpoints: ICheckpoint[]) => {
  let totalDistance = 0;
  checkpoints.forEach((checkpoint, i) => {
    if (checkpoints[i - 1]) {
      totalDistance += calculateDistance(
        checkpoint.coordinates.latitude,
        checkpoint.coordinates.longitude,
        checkpoints[i - 1].coordinates.latitude,
        checkpoints[i - 1].coordinates.longitude
      );
    }
  });
  return Math.round(totalDistance);
};

const getBuildNumber = (): string => {
  const { android, ios } = Constants.manifest;

  if (Platform.OS === "android" && android) {
    return android.versionCode;
  }
  if (Platform.OS === "ios" && ios) {
    return ios.buildNumber;
  }
  return "";
};

const getAppVersion = () => {
  return `${Constants.manifest.version} (${getBuildNumber()})`;
};

const openAppSettings = () => {
  if (platformIs("ios")) {
    Linking.openURL("app-settings:");
  } else {
    const pkg = Constants.manifest.releaseChannel
      ? Constants.manifest.android.package
      : "host.exp.exponent";

    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
      { data: "package:" + pkg }
    );
  }
};

export type PlatformOS = "ios" | "android" | "windows" | "macos" | "web";
const platformIs = (os: PlatformOS) => Platform.OS === os;
const isSmallScreen = () => Dimensions.get("window").width <= 320;
const isBigScreen = () => Dimensions.get("window").width >= 500;

/**
 * Attempts to scroll the current Screen component to the given y position
 */
const scrollTo = (y: number) => {
  if (scrollViewRef && scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true });
  }
};
/**
 * Attempts to scroll the current Screen component to the top
 */
const scrollToTop = () => scrollTo(0);
/**
 * Attempts to scroll the current Screen component to the bottom
 */
const scrollToBottom = () => scrollTo(Dimensions.get("screen").height);

// Return the pace based on distance travelled and start / finish time
const calculatePace = ({
  startTime,
  finishTime,
  totalTime,
  distance,
}: {
  startTime?: string;
  finishTime?: string;
  totalTime?: number;
  distance: number;
}) => {
  if (startTime || totalTime) {
    if (distance > 0) {
      let timeInSeconds = 0;
      if (startTime) {
        timeInSeconds =
          Math.round(
            (dateFns.differenceInSeconds(
              finishTime ? dateFns.parseISO(finishTime) : new Date(),
              dateFns.parseISO(startTime)
            ) /
              (distance / 1000) +
              Number.EPSILON) *
              100
          ) / 100;
      } else if (totalTime) {
        timeInSeconds =
          Math.round(
            (totalTime / 1000 / (distance / 1000) + Number.EPSILON) * 100
          ) / 100;
      }

      if (timeInSeconds > 0) {
        return `${convertMilisecondsToTime(timeInSeconds * 1000, true)} /km`;
      }
    }
  }
  return "--:-- /km";
};

const getTotalTime = (startTime?: string, finishTime?: string) => {
  if (startTime) {
    const timeInSeconds = dateFns.differenceInSeconds(
      finishTime ? dateFns.parseISO(finishTime) : new Date(),
      dateFns.parseISO(startTime)
    );

    if (timeInSeconds > 0) {
      return convertMilisecondsToTime(timeInSeconds * 1000);
    }
  }
  return "--:--";
};

const convertMilisecondsToTime = (ms?: number | null, compact?: boolean) => {
  if (!ms) {
    return "--:--";
  }
  let time = new Date((ms / 1000) * 1000).toISOString().substr(11, 8);
  if (compact && time.substr(0, 3) === "00:") {
    time = time.substr(3);
  }
  if (compact && time.substr(0, 1) === "0") {
    time = time.substr(1);
  }
  return time;
};

export default {
  logError,
  playAudio,
  calculateDistance,
  calculateDistanceByCheckpoints,
  getAppVersion,
  openAppSettings,
  platformIs,
  isSmallScreen,
  isBigScreen,
  scrollToTop,
  scrollTo,
  scrollToBottom,
  calculatePace,
  getTotalTime,
  convertMilisecondsToTime,
};
