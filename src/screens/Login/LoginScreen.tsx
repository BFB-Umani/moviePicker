import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Alert from "b3runtime/components/Alert/Alert";
import Box from "b3runtime/components/Box/Box";
import Button from "b3runtime/components/Button/Button";
import InputField from "b3runtime/components/InputField/InputField";
import Screen from "b3runtime/components/Screen/Screen";
import { UnauthorizedNavigationStack } from "b3runtime/navigation/Navigation.types";
import authMethods from "b3runtime/reduxStore/auth/auth.methods";
import authSelectors from "b3runtime/reduxStore/auth/auth.selectors";
import { ILoginCredentials } from "b3runtime/reduxStore/auth/auth.types";
import { IError, IReduxState } from "b3runtime/reduxStore/store.types";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import * as yup from "yup";

interface Props extends IStateProps, IDispatchProps {
  route: RouteProp<UnauthorizedNavigationStack, "Login">;
  navigation: StackNavigationProp<UnauthorizedNavigationStack, "Login">;
}

const LoginScreen: React.FC<Props> = (props) => {
  const [showLoading, setShowLoading] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup.string().required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    errors,
    formState,
  } = useForm<ILoginCredentials>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    props.login(data);
  };

  const resetPassword = () => props.navigation.navigate("ResetPassword");

  useEffect(() => {
    if (props.isLoginLoading) {
      setShowLoading(true);
    }
    if (props.loginError) {
      setShowLoading(false);
    }
  }, [props.isLoginLoading, props.loginError]);

  return (
    <Screen
      header={{ color: "general", hide: showLoading }}
      showLoadingIndicator={showLoading}
      loadingText="Logging in..."
      loadingUnmountsContent={true}
    >
      <Box flex={1} justifyContent="center" alignItems="center" padding="sm">
        <Box marginbottom="xlg" flexDirection="column" fullWidth={true}>
          <Box marginbottom="sm" fullWidth={true}>
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
              rules={{ required: true }}
              defaultValue=""
            />
          </Box>
          <Box fullWidth={true}>
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
              rules={{ required: true }}
              defaultValue=""
            />
          </Box>
        </Box>
        {formState.isSubmitted && props.loginError && (
          <Box marginbottom="lg" fullWidth={true}>
            <Alert
              text={
                props.loginError?.message || "There was an issue logging in"
              }
              icon="exclamation-triangle"
              color="danger"
            />
          </Box>
        )}
        <Button
          label="Login"
          type="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={props.isLoginLoading || !formState.isValid}
          marginbottom="xlg"
        />
        <Button
          label="Forgot password"
          hollow={true}
          type="primary"
          noBorder={true}
          onPress={resetPassword}
        />
      </Box>
    </Screen>
  );
};

interface IStateProps {
  isLoginLoading?: boolean;
  loginError?: IError;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  isLoginLoading: authSelectors.isLoginInProgressSelector(state),
  loginError: authSelectors.loginCredentialsStateSelector.error(state),
});

interface IDispatchProps {
  login: (credentials: ILoginCredentials) => void;
}
const mapDispatchToProps: IDispatchProps = {
  login: authMethods.loginCredentials,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
