import { IButton } from "moviepicker/components/Button/Button.types";
import { IconType } from "moviepicker/components/Icon/Icon.types";
import { ColorType } from "moviepicker/styles/colors";
import * as Notifications from "expo-notifications";

import { IAlertReduxState } from "./alert/alert.types";
import { IAuthReduxState } from "./auth/auth.types";
import { IGlobalReduxState } from "./global/global.types";
import { IModalReduxState } from "./modal/modal.types";
import { IRequestStateRedux } from "./requestState";
import { IUserReduxState } from "./user/user.types";
import { ISettingsReduxState } from "./settings/settings.types";
import { IMovieSearchReduxState } from "./movieSearch/movieSearch.types";
import { IMovieListsReduxState } from "./lists/lists.types";
import { IMoviesReduxState } from "./lists/lists.types";
import { IContributersReduxState } from "./lists/lists.types";
import { IAllUserListsReduxState } from "./lists/lists.types";

export interface IReduxState {
  global: IGlobalReduxState;
  requestState: IRequestStateRedux;
  auth: IAuthReduxState;
  user: IUserReduxState;
  modal: IModalReduxState;
  alert: IAlertReduxState;
  settings: ISettingsReduxState;
  searchResult: IMovieSearchReduxState;
  lists: IMovieListsReduxState;
  movieList: IMoviesReduxState;
  contributersLists: IContributersReduxState;
  allUserLists: IAllUserListsReduxState;
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

export interface ISearchMovie {
  search: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: string;
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

export interface IMovieList {
  id: string;
  name: string;
  movies?: IMovie[];
  creatorId: string;
  contributerId?: string[];
}

export interface INewMovieList {
  name: string;
  movies?: IMovie[];
  creatorId: string;
  contributerId?: string[];
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
