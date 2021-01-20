import React, { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { StackScreenProps } from "@react-navigation/stack";
import Alert from "moviepicker/components/Alert/Alert";
import Box from "moviepicker/components/Box/Box";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import InputField from "moviepicker/components/InputField/InputField";
import Screen from "moviepicker/components/Screen/Screen";
import { UnauthorizedNavigationStack } from "moviepicker/navigation/Navigation.types";
import authMethods from "moviepicker/reduxStore/auth/auth.methods";
import authSelectors from "moviepicker/reduxStore/auth/auth.selectors";
import { ISignupFields } from "moviepicker/reduxStore/auth/auth.types";
import { IError, IReduxState } from "moviepicker/reduxStore/store.types";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import * as yup from "yup";

const SignupScreen: React.FC<
  IStateProps &
    IDispatchProps &
    StackScreenProps<UnauthorizedNavigationStack, "Landing">
> = (props) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email("Invalid email address"),
        username: yup
          .string()
          .test(
            "username",
            "Your username contain at least 3 characters",
            (value) => (value ? yup.string().min(3).isValidSync(value) : true)
          ),
        password: yup
          .string()
          .test(
            "password",
            "Your password needs to contain at least 6 characters",
            (value) => (value ? yup.string().min(6).isValidSync(value) : true)
          ),
      }),
    []
  );

  const { control, handleSubmit, errors, formState } = useForm<
    ISignupFields & { acceptTerms: boolean }
  >({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
  });

  const onSubmit = async (data: ISignupFields) => {
    await props.signup(data);
  };

  return (
    <Screen
      header={{ color: "general" }}
      showLoadingIndicator={props.signupInProgress}
      loadingText="Creating account..."
      loadingUnmountsContent={true}
    >
      <Box flex={1} padding="sm" justifyContent="center" alignItems="center">
        <ContentText type="h2" marginbottom="lg" margintop="sm" color="primary">
          Create An Account
        </ContentText>
        <Box marginbottom="xlg" fullWidth={true}>
          <Box marginbottom="lg">
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputField
                  placeholder="Display Name"
                  label="Display Name"
                  iconLeft="user-astronaut"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  fullWidth={true}
                  error={!!errors.username}
                  errorMessage={errors.username?.message}
                  description="Visible to others"
                />
              )}
              name="username"
              defaultValue=""
            />
          </Box>
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
          <Box marginbottom="lg">
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <InputField
                  placeholder="Password"
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  fullWidth={true}
                  type="password"
                  iconLeft="lock"
                  error={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              )}
              name="password"
              defaultValue=""
            />
          </Box>
        </Box>
        {formState.isSubmitted && props.signupError && (
          <Box marginbottom="lg" fullWidth={true}>
            <Alert
              text={
                props.signupError?.message ||
                "There was an issue while signing up"
              }
              icon="exclamation-triangle"
              color="danger"
            />
          </Box>
        )}
        <Button
          label="Sign up"
          type="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={props.signupInProgress || !formState.isValid}
          marginbottom="xlg"
        />
      </Box>
    </Screen>
  );
};

interface IStateProps {
  signupInProgress?: boolean;
  signupError?: IError;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  signupInProgress: authSelectors.signupStateSelector.isLoading(state),
  signupError: authSelectors.signupStateSelector.error(state),
});

interface IDispatchProps {
  signup: (fields: ISignupFields) => void;
}
const mapDispatchToProps: IDispatchProps = {
  signup: authMethods.signup,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
