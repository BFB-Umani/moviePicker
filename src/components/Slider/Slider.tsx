import ReactSlider from "@react-native-community/slider";
import { colors, ColorType } from "b3runtime/styles/colors";
import React from "react";

interface Props {
  min: number;
  max: number;
  step?: number;
  onChange?: (newValue: number) => void;
  disabled?: boolean;
  color?: ColorType;
}

const Slider: React.FC<Props> = (props) => (
  <ReactSlider
    style={{ width: "100%", height: 40 }}
    minimumValue={props.min}
    maximumValue={props.max}
    step={props.step}
    minimumTrackTintColor={colors[props.color || "primary"].background}
    maximumTrackTintColor={colors.panel.background}
    onValueChange={props.onChange}
  />
);
export default Slider;
