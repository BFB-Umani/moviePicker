import { IMapSettings } from "b3runtime/reduxStore/store.types";

import DarkMapstyle from "./Dark.mapstyle";
import NightMapstyle from "./Night.mapstyle";
import RetroMapstyle from "./Retro.mapstyle";
import SilverMapstyle from "./Silver.mapstyle";

export interface ICustomMapStyle {
  elementType?: string;
  featureType?: string;
  stylers: { color?: string; visibility?: string }[];
}

export const MapCustomStyles: {
  [key in IMapSettings["style"]]: ICustomMapStyle[];
} = {
  default: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
  retro: RetroMapstyle,
  dark: DarkMapstyle,
  night: NightMapstyle,
  silver: SilverMapstyle,
};
