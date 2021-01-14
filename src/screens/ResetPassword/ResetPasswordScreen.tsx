import { yupResolver } from "@hookform/resolvers/yup";
import { StackScreenProps } from "@react-navigation/stack";
import Box from "b3runtime/components/Box/Box";
import Button from "b3runtime/components/Button/Button";
import ContentText from "b3runtime/components/ContentText/ContentText";
import Icon from "b3runtime/components/Icon/Icon";
import InputField from "b3runtime/components/InputField/InputField";
import Screen from "b3runtime/components/Screen/Screen";
import { UnauthorizedNavigationStack } from "b3runtime/navigation/Navigation.types";
import authMethods from "b3runtime/reduxStore/auth/auth.methods";
import authSelectors from "b3runtime/reduxStore/auth/auth.selectors";
import { IReduxState } from "b3runtime/reduxStore/store.types";
import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import * as yup from "yup";

const ResetPasswordScreen: React.FC<
  IStateProps &
    IDispatchProps &
    StackScreenProps<UnauthorizedNavigationStack, "Landing">
> = (props) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .required("Email is required")
          .email("Invalid email address"),
      }),
    []
  );

  const { control, handleSubmit, errors, formState } = useForm<{
    email: string;
  }>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    props.requestResetPassword(data.email);
  };

  return (
    <Screen
      header={{ color: "general" }}
      showLoadingIndicator={props.isRequestingResetPassword}
      loadingText="Sending..."
    >
      {!formState.isSubmitted && (
        <Box flex={1} justifyContent="center" alignItems="center" padding="sm">
          <ContentText type="h1" color="primary" marginbottom="md">
            Reset Password
          </ContentText>
          <ContentText type="description" marginbottom="lg">
            You will be sent an email to reset and change your password
          </ContentText>
          <Box marginbottom="xlg" fullWidth={true}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputField
                  placeholder="Enter your email..."
                  label="Email address"
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
              rules={{ required: true }}
              defaultValue=""
            />
          </Box>
          <Button
            label="Reset password"
            type="success"
            onPress={handleSubmit(onSubmit)}
            disabled={props.isRequestingResetPassword || !formState.isValid}
            marginbottom="xlg"
          />
        </Box>
      )}

      {formState.isSubmitted && (
        <Box flex={1} justifyContent="center" alignItems="center" padding="sm">
          <Icon icon="check" size="xxlg" color="success" marginbottom="xs" />
          <ContentText type="h2" color="success" marginbottom="xlg">
            Success
          </ContentText>
          <ContentText type="description">
            Check your inbox for a mail containing directions on how to reset
            and change your password.
          </ContentText>
        </Box>
      )}
    </Screen>
  );
};

interface IStateProps {
  isRequestingResetPassword?: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  isRequestingResetPassword: authSelectors.requestResetPasswordStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  requestResetPassword: (email: string) => void;
}
const mapDispatchToProps: IDispatchProps = {
  requestResetPassword: authMethods.requestResetPassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordScreen);