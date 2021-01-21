import { StackScreenProps } from "@react-navigation/stack";
import ContentText from "moviepicker/components/ContentText/ContentText";
import List from "moviepicker/components/List/List";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IProfileStack,
} from "moviepicker/navigation/Navigation.types";
import authMethods from "moviepicker/reduxStore/auth/auth.methods";
import settingsMethods from "moviepicker/reduxStore/settings/settings.methods";
import settingsSelectors from "moviepicker/reduxStore/settings/settings.selectors";
import { IAppSettings, IReduxState } from "moviepicker/reduxStore/store.types";
import Utils from "moviepicker/utils/index";
import React from "react";
import { connect } from "react-redux";

interface Props extends IStateProps, IDispatchProps {}

const UserSettingsScreen: React.FC<
  Props &
    StackScreenProps<AuthorizedBottomTabStack, "Profile"> &
    StackScreenProps<IProfileStack, "UserSettings">
> = (props) => {
  const navigateToEditProfile = () => {
    props.navigation.navigate("EditProfile");
  };

  return (
    <Screen
      header={{
        color: "general",
        title: "Settings",
      }}
      ignorepadding={true}
      fullwidth={true}
    >
      <List
        items={[
          {
            label: "Edit Profile",
            onPress: navigateToEditProfile,
            iconRight: "chevron-right",
            color: "text",
          },
        ]}
      />
      <Separator size="lg" color="panel" />
      <List
        items={[
          {
            label: "Log Out",
            color: "danger",
            iconRight: "sign-out-alt",
            onPress: props.logout,
          },
        ]}
      />
      <Separator size="lg" color="panel" />
      <ContentText
        type="fineprint"
        textalign="center"
        margintop="lg"
        color="disabled"
      >
        MOVIEPICKER
      </ContentText>
      <ContentText
        type="description"
        textalign="center"
        marginbottom="lg"
        color="disabled"
      >
        v{Utils.getAppVersion()}
      </ContentText>
    </Screen>
  );
};

interface IStateProps {
  allSettings: IAppSettings;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  allSettings: settingsSelectors.allSettings(state),
});

interface IDispatchProps {
  editSetting: <
    T extends keyof IAppSettings,
    K extends keyof IAppSettings[T],
    V extends IAppSettings[T][K]
  >(
    settingType: T,
    setting: K,
    value: V
  ) => void;
  logout: () => void;
}
const mapDispatchToProps: IDispatchProps = {
  editSetting: settingsMethods.editSetting,
  logout: authMethods.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsScreen);
