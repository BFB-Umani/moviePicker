import tinycolor from "tinycolor2";

export interface IColorSet {
  background: string;
  text: string;
  brighter: { background: string; text: string };
  darker: { background: string; text: string };
}

export type ColorType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "general"
  | "panel"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "text"
  | "disabled";

type IColorTheme = { [key in ColorType]: IColorSet };

export interface WithColorProps {
  color?: ColorType;
  colorShade?: "brighter" | "darker";
  colorVariant?: "background" | "text";
}

const colorPalette: { [key in ColorType]: string } = {
  primary: "#fe2d7f",
  secondary: "#0bcccb",
  tertiary: "#3600CC",
  general: "#ffffff",
  panel: "#eeeeee",
  danger: "#CC0C0C",
  success: "#088484",
  warning: "#F3DA90",
  info: "#5081AB",
  text: "#111111",
  disabled: "#999999",
};

const generateColorSet = (color: string): IColorSet => ({
  background: color,
  text: getTextColorByBackground(color),
  brighter: brightenColor(color),
  darker: darkenColor(color),
});

const getTextColorByBackground = (background: string) =>
  tinycolor(background).isLight() ? colorPalette.text : colorPalette.general;

const brightenColor = (color: string): IColorSet["brighter"] => {
  const newColor = tinycolor(color).brighten(20).toHex();
  return {
    background: `#${newColor}`,
    text: getTextColorByBackground(newColor),
  };
};
const darkenColor = (color: string): IColorSet["darker"] => {
  const newColor = tinycolor(color).darken(20).toHex();
  return {
    background: `#${newColor}`,
    text: getTextColorByBackground(newColor),
  };
};

/**
 * Returns a given color hex with an opacity applied
 * @param colorHex
 * @param opacity
 */
export const getColorWithOpacity = (colorHex: string, opacity: number) => {
  let hex = colorHex.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity / 100})`;
};

export const colors: IColorTheme = {
  primary: generateColorSet(colorPalette.primary),
  secondary: generateColorSet(colorPalette.secondary),
  tertiary: generateColorSet(colorPalette.tertiary),
  general: generateColorSet(colorPalette.general),
  panel: generateColorSet(colorPalette.panel),
  danger: generateColorSet(colorPalette.danger),
  success: generateColorSet(colorPalette.success),
  warning: generateColorSet(colorPalette.warning),
  info: generateColorSet(colorPalette.info),
  text: generateColorSet(colorPalette.text),
  disabled: generateColorSet(colorPalette.disabled),
};

export const generateColorProps = (
  props: WithColorProps,
  asBackground?: boolean
) => {
  if (props.color) {
    if (props.colorShade) {
      if (props.colorVariant) {
        return `${asBackground ? "background" : "color"}: ${
          colors[props.color][props.colorShade][props.colorVariant]
        };`;
      }
      return `${asBackground ? "background" : "color"}: ${
        props.colorVariant
          ? colors[props.color][props.colorShade][props.colorVariant]
          : colors[props.color][props.colorShade].background
      };`;
    }
    return `${asBackground ? "background" : "color"}: ${
      props.colorVariant
        ? colors[props.color][props.colorVariant]
        : colors[props.color].background
    };`;
  }
};
