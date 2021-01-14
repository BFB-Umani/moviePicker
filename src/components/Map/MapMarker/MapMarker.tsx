import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import { ICheckpoint } from "b3runtime/reduxStore/store.types";
import {
  colors,
  ColorType,
  getColorWithOpacity,
} from "b3runtime/styles/colors";
import React, { useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import styled from "styled-components/native";

const MarkerZenit = styled.View<{
  bgColor: string;
  borderColor: string;
  size?: string;
}>`
  width: ${(props) => props.size || "36px"};
  height: ${(props) => props.size || "36px"};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.size || "36px"};
  border: 2px solid ${(props) => props.borderColor};
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface IMapMarker {
  title?: string | null;
  label?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: ICheckpoint["type"];
  isCurrent?: boolean;
  onPress?: () => void;
  colorShade?: "bright" | "dark";
}

const MapMarker: React.FC<IMapMarker> = ({ colorShade = "dark", ...props }) => {
  /**
   * A work-around to get the marker to update property when needed
   * as having `tracksViewChanges` set to true causes major performance impact
   */
  const [shouldUpdate, setShouldUpdate] = useState(false);
  useEffect(() => {
    setShouldUpdate(true);
  }, [props.isCurrent, colorShade]);
  useEffect(() => {
    if (shouldUpdate) {
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  const getColorType = (): ColorType => {
    switch (props.type) {
      case "START":
        return "primary";
      case "FINISH":
        return "success";
      case "PENALTY":
        return "warning";
      default:
        if (props.isCurrent) {
          return "primary";
        }
        return "general";
    }
  };

  const getMarkerColor = () =>
    getColorWithOpacity(
      colors[getColorType()].background,
      props.isCurrent ? 95 : 75
    );

  const getBorderColor = () =>
    getColorWithOpacity(colors[getColorType()].text, props.isCurrent ? 95 : 25);

  const getMarkerContent = (): React.ReactNode => {
    switch (props.type) {
      case "START":
        return <Icon icon="running" color="general" size="xxs" />;
      case "FINISH":
        return <Icon icon="flag-checkered" color="general" size="xxs" />;
      case "PENALTY":
        return <Icon icon="stopwatch" color="text" size="xxs" />;
      default:
        if (props.label) {
          return (
            <ContentText type="h6" color={getColorType()} colorVariant="text">
              {props.label}
            </ContentText>
          );
        }
        return null;
    }
  };

  return (
    <Marker
      coordinate={props.coordinates}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={shouldUpdate}
      style={{ zIndex: props.isCurrent ? 3 : 2 }}
      title={props.title || undefined}
    >
      <MarkerZenit bgColor={getMarkerColor()} borderColor={getBorderColor()}>
        {getMarkerContent()}
      </MarkerZenit>
    </Marker>
  );
};
export default MapMarker;
