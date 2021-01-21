import React, { useMemo, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { StackScreenProps } from "@react-navigation/stack";
import Alert from "moviepicker/components/Alert/Alert";
import Avatar from "moviepicker/components/Avatar/Avatar";
import Box from "moviepicker/components/Box/Box";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import InputField from "moviepicker/components/InputField/InputField";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IProfileStack,
} from "moviepicker/navigation/Navigation.types";
import modalMethods from "moviepicker/reduxStore/modal/modal.methods";
import {
  IError,
  IModal,
  IReduxState,
  IUserProfile,
} from "moviepicker/reduxStore/store.types";
import userMethods from "moviepicker/reduxStore/user/user.methods";
import userSelectors from "moviepicker/reduxStore/user/user.selectors";
import { useForm, Controller } from "react-hook-form";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { connect } from "react-redux";
import * as yup from "yup";

const EditProfileScreen: React.FC<
  IStateProps &
    IDispatchProps &
    StackScreenProps<AuthorizedBottomTabStack, "Profile"> &
    StackScreenProps<IProfileStack, "EditProfile">
> = (props) => {
  const modalizeRef = useRef<Modalize>(null);

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email("Invalid email address"),
        username: yup
          .string()
          .min(3, "Your username contain at least 3 characters"),
        firstname: yup
          .string()
          .notRequired()
          .test("firstname", "Please enter a valid firstname", (value) =>
            value ? yup.string().min(2).isValidSync(value) : true
          ),
        lastname: yup
          .string()
          .notRequired()
          .test("lastname", "Please enter a valid lastname", (value) =>
            value ? yup.string().min(2).isValidSync(value) : true
          ),
      }),
    []
  );

  const { control, handleSubmit, errors, formState } = useForm<IUserProfile>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: props.userProfile,
    shouldUnregister: true,
  });

  const onSubmit = async (data: IUserProfile) => {
    await props.updateProfile(data);
    if (!props.updateProfileError) {
      props.navigation.navigate("Profile");
    }
  };

  const onAvatarClick = () => {
    modalizeRef.current?.open();
  };

  const onOpenCamera = () => {
    modalizeRef.current?.close();
    props.toggleCameraToUpdateAvatar();
  };
  const onOpenCameraRoll = () => {
    modalizeRef.current?.close();
    props.openCameraRollToUpdateAvatar();
  };

  return (
    <Screen
      header={{
        color: "general",
        title: "Edit Profile",
      }}
      showLoadingIndicator={
        props.updateProfileInProgress || props.uploadAvatarInProgress
      }
      loadingText={props.uploadAvatarInProgress ? "Uploading..." : "Saving..."}
    >
      <Box
        justifyContent="center"
        alignItems="center"
        marginbottom="lg"
        margintop="md"
      >
        <Avatar
          imageUrl={props.userProfile?.avatarUrl}
          onPress={onAvatarClick}
        />
      </Box>

      <Portal>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          withHandle={false}
          adjustToContentHeight={true}
        >
          <Box padding="sm" marginbottom="md">
            <ContentText
              type="h3"
              marginbottom="md"
              color="primary"
              textalign="center"
            >
              Edit Profile Picture
            </ContentText>
            <Button
              size="small"
              label="Take picture"
              type="primary"
              hollow={true}
              iconLeft="camera"
              onPress={onOpenCamera}
            />
            <Button
              size="small"
              label="Select from gallery"
              type="primary"
              hollow={true}
              iconLeft="images"
              margintop="md"
              onPress={onOpenCameraRoll}
            />
          </Box>
        </Modalize>
      </Portal>

      <Box flex={1} marginbottom="lg">
        <Box marginbottom="md">
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputField
                placeholder="Display Name"
                label="Display Name"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                fullWidth={true}
                type="email"
                iconLeft="user-astronaut"
                error={!!errors.username}
                errorMessage={errors.username?.message}
              />
            )}
            name="username"
            defaultValue=""
          />
        </Box>

        <Separator color="panel" marginbottom="sm" size="md" />

        <Box marginbottom="sm">
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputField
                placeholder="Email"
                label="Email"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                fullWidth={true}
                type="email"
                iconLeft="envelope"
                error={!!errors.email}
                errorMessage={errors.email?.message}
              />
            )}
            name="email"
            defaultValue=""
          />
        </Box>

        <Box flexDirection="row" marginbottom="md">
          <Box flex={1} marginright="xxs">
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputField
                  placeholder="Firstname"
                  label="Firstname"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  fullWidth={true}
                  type="text"
                  error={!!errors.firstname}
                  errorMessage={errors.firstname?.message}
                />
              )}
              name="firstname"
              defaultValue=""
            />
          </Box>
          <Box flex={1} marginleft="xxs">
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputField
                  placeholder="Lastname"
                  label="Lastname"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  fullWidth={true}
                  type="text"
                  error={!!errors.lastname}
                  errorMessage={errors.lastname?.message}
                />
              )}
              name="lastname"
              defaultValue=""
            />
          </Box>
        </Box>

        <Separator color="panel" marginbottom="sm" size="md" />
      </Box>

      {formState.isSubmitted && props.updateProfileError && (
        <Box marginbottom="lg">
          <Alert
            text={props.updateProfileError?.message || "Something went wrong"}
            icon="exclamation-triangle"
            color="danger"
          />
        </Box>
      )}
      <Button
        label="Update"
        type="primary"
        onPress={handleSubmit(onSubmit)}
        disabled={
          !formState.isDirty ||
          props.updateProfileInProgress ||
          !formState.isValid
        }
        marginbottom="xlg"
      />
    </Screen>
  );
};

interface IStateProps {
  userProfile?: IUserProfile;
  updateProfileInProgress?: boolean;
  updateProfileError?: IError;
  uploadAvatarInProgress?: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  userProfile: userSelectors.userProfileSelector(state),
  updateProfileInProgress: userSelectors.updateProfileStateSelector.isLoading(
    state
  ),
  updateProfileError: userSelectors.updateProfileStateSelector.error(state),
  uploadAvatarInProgress: userSelectors.uploadAvatarStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  updateProfile: (fields: IUserProfile) => void;
  toggleCameraToUpdateAvatar: () => void;
  openCameraRollToUpdateAvatar: () => void;
  createModal: (modal: IModal) => void;
  closeModal: (id: IModal["id"]) => void;
}
const mapDispatchToProps: IDispatchProps = {
  updateProfile: userMethods.updateUserProfile,
  toggleCameraToUpdateAvatar: userMethods.toggleCameraToUpdateAvatar,
  openCameraRollToUpdateAvatar: userMethods.openCameraRollToUpdateAvatar,
  createModal: modalMethods.createModal,
  closeModal: modalMethods.closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
