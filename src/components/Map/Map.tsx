import {
  ICheckpoint,
  IMapSettings,
  IUserLocation,
} from "b3runtime/reduxStore/store.types";
import { colors, getColorWithOpacity } from "b3runtime/styles/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import MapView, {
  EventUserLocation,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import styled from "styled-components/native";

import { ICustomMapStyle, MapCustomStyles } from "./MapCustomStyles";
import MapGeofenceRadius from "./MapGeofenceRadius/MapGeofenceRadius";
import MapMarker from "./MapMarker/MapMarker";

const StyledMapView = styled<{ height?: string; width?: string }>(MapView)`
  width: ${(props) => props.width || `${Dimensions.get("window").width}px`};
  height: ${(props) => props.height || "100%"};
`;

export interface IMap {
  width?: string;
  height?: string;
  showUserPosition?: boolean;
  userLocation?: IUserLocation;
  centerType?:
    | "Checkpoint"
    | "Player"
    | "PlayerAndCheckpoint"
    | "FollowPlayer"
    | "Track";
  centerTypeActive?: boolean;
  asSummary?: boolean;
  checkpointList?: ICheckpoint[];
  currentCheckpoint?: ICheckpoint;
  disableTouch?: boolean;
  drawMapContents?: boolean;
  mapContentShade?: "bright" | "dark";
  mapSettings?: IMapSettings;
  userLocationList?: IUserLocation[];
  onMapPan?: () => void;
  onUserLocationChange?: (location: IUserLocation) => void;
}

const Map: React.FC<IMap> = ({ mapContentShade = "dark", ...props }) => {
  const mapRef = useRef<MapView>();

  const [mapLoaded, setMapLoaded] = useState(false);
  const onMapLoaded = () => {
    setMapLoaded(true);
  };

  /**
   * Track user's location
   */
  const onUserLocationChange = useCallback((e: EventUserLocation) => {
    if (props.onUserLocationChange && e && e.nativeEvent) {
      const newCoordinates = e.nativeEvent.coordinate;
      props.onUserLocationChange(newCoordinates);
    }
  }, []);

  /**
   * Map Centering Animations
   */
  const [followType, setFollowType] = useState<"Player" | "PlayerCheckpoint">();
  useEffect(() => {
    if (props.centerTypeActive && mapLoaded) {
      switch (props.centerType) {
        case "Player":
          if (mapRef.current && props.userLocation) {
            if (followType) {
              setFollowType(undefined);
            }
            mapRef.current.animateCamera(
              {
                center: {
                  latitude: props.userLocation.latitude,
                  longitude: props.userLocation.longitude,
                },
                zoom: 17,
                heading: 0,
                pitch: 0,
              },
              {
                duration: 500,
              }
            );
          }
          break;
        case "FollowPlayer":
          if (followType !== "Player" && props.userLocation) {
            setFollowType("Player");
          }
          break;
        case "Checkpoint":
          if (props.currentCheckpoint && mapRef.current) {
            if (followType) {
              setFollowType(undefined);
            }
            mapRef.current.animateCamera(
              {
                center: {
                  latitude: props.currentCheckpoint.coordinates.latitude,
                  longitude: props.currentCheckpoint.coordinates.longitude,
                },
                zoom: 17,
                heading: 0,
                pitch: 0,
              },
              {
                duration: 500,
              }
            );
          }
          break;
        case "PlayerAndCheckpoint":
          if (followType !== "PlayerCheckpoint" && props.userLocation) {
            setFollowType("PlayerCheckpoint");
          }
          break;
        case "Track":
          if (props.checkpointList && mapRef.current) {
            if (followType) {
              setFollowType(undefined);
            }
            mapRef.current.fitToCoordinates(
              props.checkpointList.map((checkpoint) => ({
                latitude: checkpoint.coordinates.latitude,
                longitude: checkpoint.coordinates.longitude,
              })),
              {
                edgePadding: {
                  top: 10,
                  bottom: 10,
                  left: 50,
                  right: 50,
                },
                animated: true,
              }
            );
          }
          break;
        default:
          if (followType) {
            setFollowType(undefined);
          }
          break;
      }
    }
  }, [
    props.centerType,
    props.centerTypeActive,
    props.currentCheckpoint,
    mapLoaded,
  ]);

  // Follow animation updates
  useEffect(() => {
    if (mapRef.current && mapLoaded && props.centerTypeActive) {
      if (followType === "Player" && props.userLocation) {
        mapRef.current.animateCamera(
          {
            center: {
              latitude: props.userLocation.latitude,
              longitude: props.userLocation.longitude,
            },
            heading: props.userLocation.heading || 0,
            pitch: 0,
            zoom: 17,
          },
          {
            duration: 0,
          }
        );
      } else if (
        followType === "PlayerCheckpoint" &&
        props.userLocation &&
        props.currentCheckpoint
      ) {
        mapRef.current.fitToCoordinates(
          [
            {
              latitude: props.userLocation.latitude,
              longitude: props.userLocation.longitude,
            },
            {
              latitude: props.currentCheckpoint.coordinates.latitude,
              longitude: props.currentCheckpoint.coordinates.longitude,
            },
          ],
          {
            edgePadding: {
              top: 300,
              bottom: 200,
              left: 50,
              right: 50,
            },
            animated: true,
          }
        );
      }
    }
  }, [
    followType,
    props.userLocation,
    props.currentCheckpoint,
    mapLoaded,
    props.centerTypeActive,
  ]);

  /**
   * Map Custom Styles
   */
  const [currentMapStyle, setCurrentMapStyle] = useState<ICustomMapStyle[]>();
  useEffect(() => {
    if (props.mapSettings?.style) {
      setCurrentMapStyle(MapCustomStyles[props.mapSettings.style]);
    }
  }, [props.mapSettings?.style]);

  const shouldShowCheckpointMarker = (checkpoint: ICheckpoint) =>
    props.asSummary ||
    checkpoint.type !== "PENALTY" ||
    (props.currentCheckpoint &&
      checkpoint.type === "PENALTY" &&
      checkpoint.id === props.currentCheckpoint.id);

  return (
    <StyledMapView
      width={props.width}
      height={props.height}
      ref={mapRef}
      onUserLocationChange={props.onUserLocationChange && onUserLocationChange}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: props.userLocation?.latitude || 59.334591,
        longitude: props.userLocation?.longitude || 18.06324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      mapPadding={{
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }}
      showsUserLocation={props.showUserPosition}
      showsBuildings={false}
      userLocationPriority="high"
      followsUserLocation={false}
      showsCompass={false}
      showsMyLocationButton={false}
      showsScale={true}
      mapType={props.mapSettings?.type || "standard"}
      customMapStyle={currentMapStyle}
      onPanDrag={props.onMapPan}
      onMapReady={onMapLoaded}
      scrollEnabled={!props.disableTouch}
      rotateEnabled={!props.disableTouch}
      zoomEnabled={!props.disableTouch}
      pitchEnabled={!props.disableTouch}
      moveOnMarkerPress={!props.disableTouch}
    >
      {props.drawMapContents &&
        props.checkpointList &&
        props.checkpointList
          .filter((checkpoint) => shouldShowCheckpointMarker(checkpoint))
          .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((checkpoint, i) => (
            <View key={`marker-${checkpoint.id || i}`}>
              {props.asSummary && (
                <MapGeofenceRadius
                  coordinates={{
                    latitude: checkpoint.coordinates.latitude,
                    longitude: checkpoint.coordinates.longitude,
                  }}
                  type={checkpoint.type}
                  radius={checkpoint.geofenceRadius}
                  contrast={mapContentShade === "dark" ? "dark" : "bright"}
                />
              )}
              <MapMarker
                coordinates={{
                  latitude: checkpoint.coordinates.latitude,
                  longitude: checkpoint.coordinates.longitude,
                }}
                title={checkpoint.label}
                isCurrent={
                  props.currentCheckpoint &&
                  checkpoint.id === props.currentCheckpoint?.id
                }
                type={checkpoint.type}
                colorShade={mapContentShade === "dark" ? "dark" : "bright"}
                label={
                  checkpoint.type === "QUESTION" ? i.toString() : undefined
                }
              />
            </View>
          ))}
      {props.drawMapContents && mapLoaded && props.currentCheckpoint && (
        <MapGeofenceRadius
          coordinates={{
            latitude: props.currentCheckpoint.coordinates.latitude,
            longitude: props.currentCheckpoint.coordinates.longitude,
          }}
          type={props.currentCheckpoint.type}
          radius={props.currentCheckpoint.geofenceRadius}
          contrast={mapContentShade === "dark" ? "dark" : "bright"}
        />
      )}

      {props.drawMapContents &&
        props.mapSettings?.drawCheckpointLines &&
        props.checkpointList &&
        props.checkpointList.length > 1 && (
          <Polyline
            coordinates={props.checkpointList
              .filter((checkpoint) => shouldShowCheckpointMarker(checkpoint))
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map((checkpoint) => ({
                latitude: checkpoint.coordinates.latitude,
                longitude: checkpoint.coordinates.longitude,
              }))}
            strokeWidth={3}
            strokeColor={
              mapContentShade === "dark"
                ? getColorWithOpacity(colors.general.background, 50)
                : getColorWithOpacity(colors.general.text, 35)
            }
            lineJoin="bevel"
            lineDashPattern={[15, 10]}
            style={{ zIndex: 1 }}
          />
        )}

      {props.userLocationList &&
        props.drawMapContents &&
        mapLoaded &&
        props.mapSettings?.drawUserPath && (
          <Polyline
            coordinates={props.userLocationList.map((location) => ({
              latitude: location.latitude,
              longitude: location.longitude,
            }))}
            strokeWidth={3}
            strokeColor={
              mapContentShade === "dark"
                ? getColorWithOpacity(colors.info.brighter.background, 75)
                : getColorWithOpacity(colors.info.background, 75)
            }
            lineJoin="bevel"
            style={{ zIndex: 100 }}
          />
        )}
    </StyledMapView>
  );
};

export default Map;
