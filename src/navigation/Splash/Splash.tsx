import React from "react";
import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import { colors } from "moviepicker/styles/colors";
import { spacing } from "moviepicker/styles/spacing";
import { ActivityIndicator, Animated } from "react-native";
import styled from "styled-components/native";

const Container = styled(Box)`
  background-color: ${colors.general.background};
`;
const LabelContainer = styled(Box)`
  background-color: ${colors.primary.background};
  padding: ${spacing.xs} ${spacing.md};
  margin-top: ${spacing.xlg};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: rotate(-3deg);
`;

const Splash: React.FC<object> = (props) => {
  const labelList = [
    "Popping popcorn...",
    "Preparing filmroll...",
    "Pouring drinks...",
    "Fetching snacks...",
    "Checking tickets...",
    "Getting blankets...",
    "Starting projector...",
    "Testing surround sound...",
    "Cleaning lounge...",
  ];

  const labelAnimation = new Animated.Value(0);
  Animated.loop(
    Animated.sequence([
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]),
    {}
  ).start();

  return (
    <Container
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="md"
    >
      <ActivityIndicator color={colors.primary.background} size="large" />
      <Animated.View
        style={{
          transform: [
            {
              translateY: labelAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-5, 0],
              }),
            },
          ],
        }}
      >
        <LabelContainer style={{ elevation: 10 }}>
          <ContentText
            type="h6"
            textalign="center"
            color="general"
            colorVariant="background"
          >
            {labelList[Math.floor(Math.random() * labelList.length)]}
          </ContentText>
        </LabelContainer>
      </Animated.View>
    </Container>
  );
};
export default Splash;
