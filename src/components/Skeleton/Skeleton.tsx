import { colors, WithColorProps } from "b3runtime/styles/colors";
import {
  generateMarginProps,
  generatePaddingProps,
  WithMarginProps,
  WithPaddingProps,
} from "b3runtime/styles/spacing";
import { fontSize, FontSize } from "b3runtime/styles/typography";
import React from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

interface ISkeleton {
  size?: FontSize;
  sizeMultiplier?: number;
}

export const StyledSkeleton = styled<ISkeleton>(
  ({ padding, margin, fontSize, ...props }) => <Animated.View {...props} />
)`
  width: 100%;
  height: ${(props) =>
    parseInt(fontSize[props.size || "xxlg"], 10) *
    (props.sizeMultiplier || 1)}px;
  background-color: ${colors.panel.background};
  ${(props) => generateMarginProps(props)}
  ${(props) => generatePaddingProps(props)}
`;

const Skeleton: React.FC<
  ISkeleton & WithMarginProps & WithPaddingProps & WithColorProps
> = (props) => {
  const skeletonAnim = new Animated.Value(0);
  Animated.loop(
    Animated.sequence([
      Animated.timing(skeletonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(skeletonAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]),
    {}
  ).start();

  return (
    <StyledSkeleton
      {...props}
      style={{
        opacity: skeletonAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.25, 1],
        }),
      }}
    />
  );
};
export default Skeleton;
