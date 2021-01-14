import { IButton } from "b3runtime/components/Button/Button.types";
import { IconType } from "b3runtime/components/Icon/Icon.types";
import { ColorType } from "b3runtime/styles/colors";
import * as Notifications from "expo-notifications";

import { IAlertReduxState } from "./alert/alert.types";
import { IAuthReduxState } from "./auth/auth.types";
import { IGlobalReduxState } from "./global/global.types";
import { IModalReduxState } from "./modal/modal.types";
import { IRequestStateRedux } from "./requestState";
import { IUserReduxState } from "./user/user.types";

export interface IReduxState {
  global: IGlobalReduxState;
  requestState: IRequestStateRedux;
  auth: IAuthReduxState;
  user: IUserReduxState;
  modal: IModalReduxState;
  alert: IAlertReduxState;
}

export interface IError {
  message?: string;
  stack?: any;
}
export type RequestState = "INITIAL" | "LOADING" | "COMPLETE" | "ERROR";
export interface IRequestProps {
  state: RequestState;
  error?: IError;
}

export interface IModal {
  id?: string;
  title?: string;
  content: React.ReactNode;
  button?: IButton;
  fullScreen?: boolean;
  scrimColor?: ModalScrimColor;
  onClose?: () => void;
  state?: "animating-out";
  disableScrimClick?: boolean;
}
export type ModalScrimColor = "bright" | "dark";

export interface IAlert {
  id?: string;
  text: string;
  closable?: boolean;
  color?: ColorType;
  icon?: IconType;
  closeAfter?: number;
  onClick?: () => void;
  state?: "animating-out";
}

export interface IAppSettings {
  map: IMapSettings;
  ui: IUISettings;
  general: IGeneralSettings;
}
export interface IGeneralSettings {
  soundOn: boolean;
}
export interface IUISettings {
  showScore: boolean;
  showTime: boolean;
  showDistanceTravelled: boolean;
  showPace: boolean;
}
export interface IMapSettings {
  type: "standard" | "satellite" | "hybrid" | "terrain";
  style: "default" | "dark" | "retro" | "night" | "silver";
  drawCheckpointLines: boolean;
  drawUserPath: boolean;
}

export interface IUserProfile {
  id: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  organization?: string;
  avatarUrl?: string;
}

export interface IEditUserProfile {
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  organization?: string;
}

export interface IUserLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp?: number;
  altitude?: number;
  altitudeAccuracy?: number;
}

export interface ICheckpoint {
  id: string;
  label?: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  geofenceRadius: number;
  order: number;
  type: "START" | "QUESTION" | "PENALTY" | "FINISH";
  question?: IQuestion;
}

export interface IQuestion {
  id: string;
  categoryId: string;
  text: string;
  imageUrl?: string;
  options: IQuestionOption[];
  correctOption: IQuestionOption["value"];
}

export interface IQuestionOption {
  value: string;
  text: string;
  imageUrl?: string | null;
}

export interface IQuestionAnswerData {
  checkpoint: ICheckpoint;
  selectedOption: IQuestionOption["value"];
  timeToAnswerMs: number;
  state: "CORRECT" | "INCORRECT";
}

export interface ITrack {
  id: string;
  name?: string;
  categoryId?: string;
  checkpoints?: ICheckpoint[];
}

export interface ICompetition {
  id: string;
  order: number;
  name: string;
  tracks: ITrack[];
}

export interface IResult {
  id: string;
  user: IUserProfile;
  competition: ICompetition;
  track: ITrack;
  startTime: string;
  finishTime?: string;
  visitedCheckpoints: ICheckpoint[];
  userLocations: IUserLocation[];
  questionAnswers: IQuestionAnswerData[];
  totalTime: string;
  totalDistance: string;
  averagePace: string;
  averageTimeToAnswer: string;
}

export interface ISaveResultProps {
  userId: IUserProfile["id"];
  competition: ICompetition;
  track: ITrack;
  startTime: string;
  finishTime: string;
  visitedCheckpoints: ICheckpoint[];
  userLocations: IUserLocation[];
  questionAnswers: IQuestionAnswerData[];
}

export interface IPushNotification {
  title: string;
  body: string;
  playSound?: boolean;
}

// Documentation: https://docs.expo.io/push-notifications/sending-notifications/
export interface IExpoPushNotification {
  /**
   * An Expo push token or an array of Expo push tokens specifying
   * the recipient(s) of this message.
   */
  to: Notifications.ExpoPushToken | Notifications.ExpoPushToken[];
  /**
   * A JSON object delivered to your app. It may be up to about 4KiB;
   * the total notification payload sent to Apple and Google must be
   * at most 4KiB or else you will get a "Message Too Big" error.
   */
  data?: object;
  /**
   * The title to display in the notification.
   * Often displayed above the notification body
   */
  title?: string;
  /**
   * The message to display in the notification.
   */
  body?: string;
  /**
   * Time to Live: the number of seconds for which the message may
   * be kept around for redelivery if it hasn't been delivered yet.
   * Defaults to undefined in order to use the respective defaults
   * of each provider (0 for iOS/APNs and 2419200 (4 weeks)
   * for Android/FCM).
   */
  ttl?: number;
  /**
   * Timestamp since the UNIX epoch specifying when the message expires.
   * Same effect as `ttl` (ttl takes precedence over expiration).
   */
  expiration?: number;
  /**
   * The delivery priority of the message.
   * Specify "default" or omit this field to use the default priority
   * on each platform ("normal" on Android and "high" on iOS).
   */
  priority?: "default" | "normal" | "high";
  /**
   * The subtitle to display in the notification below the title.
   * IOS ONLY
   */
  subtitle?: string;
  /**
   * Play a sound when the recipient receives this notification.
   * Specify "default" to play the device's default notification sound,
   * or omit this field to play no sound.
   * IOS ONLY
   */
  sound?: "default";
  /**
   * Number to display in the badge on the app icon.
   * Specify zero to clear the badge.
   * IOS ONLY
   */
  badge?: number;
  /**
   * ID of the Notification Channel through which to display this notification.
   * If an ID is specified but the corresponding channel does not exist on the
   * device (i.e. has not yet been created by your app), the notification will
   * not be displayed to the user.
   * ANDROID ONLY
   */
  channelId?: string;
}
