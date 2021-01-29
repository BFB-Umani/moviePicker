import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import AlertHandler from "moviepicker/components/Alert/AlertHandler";
import { IconType } from "moviepicker/components/Icon/Icon.types";
import { AuthorizedBottomTabStack } from "moviepicker/navigation/Navigation.types";
import { colors } from "moviepicker/styles/colors";
import { SafeAreaView, View } from "react-native";
import styled from "styled-components/native";

import BottomTab from "./BottomTab";

const Wrapper = styled(SafeAreaView)`
  background-color: ${colors.general.background};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
`;

const Container = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BottomTabBar: React.FC<object & BottomTabBarProps> = (props) => {
  const tabs: {
    [key in keyof AuthorizedBottomTabStack]: {
      label?: string;
      icon?: IconType;
    };
  } = {
    Dashboard: {
      label: "Start",
      icon: "home",
    },
    List: {
      label: "Lists",
      icon: "list-alt",
    },
    Profile: {
      label: "Profile",
      icon: "user-alt",
    },
  };

  return (
    <Wrapper style={{ elevation: 10 }}>
      <AlertHandler />
      <Container>
        {props.state.routes.map((route, i) => {
          const isActive = props.state.index === i;

          const onTabPress = () => {
            const event = props.navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isActive && !event.defaultPrevented) {
              props.navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            props.navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            tabs[route.name].icon &&
            tabs[route.name].label && (
              <BottomTab
                key={route.key}
                icon={tabs[route.name].icon}
                label={tabs[route.name].label}
                onPress={onTabPress}
                onLongPress={onLongPress}
                isActive={isActive}
              />
            )
          );
        })}
      </Container>
    </Wrapper>
  );
};
export default BottomTabBar;
