import * as Sentry from "sentry-expo";

export const formatFirebaseErrors = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/invalid-password":
    case "auth/wrong-password":
      return "The email or password is invalid";
    case "auth/invalid-email-verified":
      return "The email has not yet been verified";
    case "auth/email-already-exists":
      return "The email already exists";
    case "auth/email-already-in-use":
      return "The email is already in use";
    case "auth/weak-password":
      return "The password is not strong enough";
    default:
      console.log(errorCode);
      return "Unknown error";
  }
};

export const logAPIError = ({
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
