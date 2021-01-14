import { ICheckpoint } from "b3runtime/reduxStore/store.types";
import { colors, getColorWithOpacity } from "b3runtime/styles/colors";
import React, { useEffect, useRef } from "react";
import { Circle } from "react-native-maps";

export interface IMapGeofenceRadius {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  type?: ICheckpoint["type"];
  contrast?: "bright" | "dark";
}

const MapGeofenceRadius: React.FC<IMapGeofenceRadius> = ({
  contrast = "dark",
  ...props
}) => {
  const circleRef = useRef<Circle>(null);

  /**
   * Workaround for circles not getting their props correctly set on iOS
   * Source: https://github.com/react-native-maps/react-native-maps/issues/2698
   */
  useEffect(() => {
    setTimeout(() => {
      if (circleRef && circleRef.current) {
        // @ts-ignore
        circleRef.current.setNativeProps({
          strokeColor: getBorderColor(),
          fillColor: getBackgroundColor(),
          strokeWidth: 3,
        });
      }
    }, 1);
  }, []);

  const getBackgroundColor = () => {
    switch (props.type) {
      case "START":
        return getColorWithOpacity(colors.primary.background, 75);
      case "FINISH":
        return getColorWithOpacity(colors.success.background, 75);
      case "PENALTY":
        return getColorWithOpacity(colors.warning.background, 65);
      default:
        return contrast === "bright"
          ? getColorWithOpacity(colors.primary.background, 50)
          : getColorWithOpacity(colors.primary.background, 50);
    }
  };

  const getBorderColor = () => {
    switch (props.type) {
      case "START":
        return colors.primary.background;
      case "FINISH":
        return colors.success.background;
      case "PENALTY":
        return colors.warning.background;
      default:
        return contrast === "bright"
          ? colors.primary.background
          : colors.primary.background;
    }
  };

  return (
    <Circle
      ref={circleRef}
      center={{
        latitude: props.coordinates.latitude,
        longitude: props.coordinates.longitude,
      }}
      radius={props.radius || 50}
      fillColor={getBackgroundColor()}
      strokeColor={getBorderColor()}
      strokeWidth={3}
    />
  );
};
export default MapGeofenceRadius;
