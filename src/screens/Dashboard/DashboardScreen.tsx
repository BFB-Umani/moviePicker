import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import ForestImg from "moviepicker/assets/images/forest.jpg";
import B3RuntimeLogo from "moviepicker/components/B3RuntimeLogo/B3RuntimeLogo";
import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Screen from "moviepicker/components/Screen/Screen";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
} from "moviepicker/navigation/Navigation.types";
import Utils from "moviepicker/utils/index";
import { useSpring } from "react-spring";
import { config } from "react-spring/renderprops";

import * as Style from "./DashboardScreen.style";

const DashboardScreen: React.FC<
  StackScreenProps<AuthorizedBottomTabStack, "Dashboard"> &
    StackScreenProps<IDashboardStack, "Dashboard">
> = () => {
  const logoAnim = useSpring({
    opacity: 1,
    y: 0,
    from: {
      opacity: 0,
      y: 20,
    },
    to: {
      opacity: 1,
      y: 0,
    },
    delay: 100,
    config: config.slow,
  });

  return (
    <Style.Wrapper>
      <Style.BackgroundImage source={ForestImg} />
      <Style.BgFeature
        color="primary"
        opacity={0.75}
        style={{
          height: "15%",
          transform: [
            {
              rotate: "-5deg",
            },
          ],
        }}
      />
      <Style.BgFeature
        color="secondary"
        opacity={1}
        style={{
          height: "13%",
          transform: [
            {
              rotate: "5deg",
            },
          ],
        }}
      />
      <Screen
        transparentBackground={true}
        header={{ hide: true, color: "primary" }}
      >
        <Style.Container>
          <Style.Logo
            style={{
              opacity: logoAnim.opacity,
              transform: [{ translateY: logoAnim.y }],
            }}
          >
            <B3RuntimeLogo />
          </Style.Logo>
          <Box margintop="xxs">
            <ContentText type="fineprint" textalign="center" color="secondary">
              v{Utils.getAppVersion()}
            </ContentText>
          </Box>
        </Style.Container>
      </Screen>
    </Style.Wrapper>
  );
};

export default DashboardScreen;
