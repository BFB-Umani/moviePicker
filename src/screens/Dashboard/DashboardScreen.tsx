import React, { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "moviepicker/components/Alert/Alert";
import Button from "moviepicker/components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import ForestImg from "moviepicker/assets/images/background.jpg";
import MoviepickerLogo from "moviepicker/components/MoviepickerLogo/MoviepickerLogoText";
import Box from "moviepicker/components/Box/Box";
import ContentText from "moviepicker/components/ContentText/ContentText";
import Screen from "moviepicker/components/Screen/Screen";
import InputField from "moviepicker/components/InputField/InputField";
import { useForm, Controller } from "react-hook-form";
import {
  AuthorizedBottomTabStack,
  IDashboardStack,
} from "moviepicker/navigation/Navigation.types";
import {
  IError,
  IReduxState,
  ISearchMovie,
} from "moviepicker/reduxStore/store.types";
import Utils from "moviepicker/utils/index";
import { useSpring } from "react-spring";
import { config } from "react-spring/renderprops";
import movieSearchMethods from "moviepicker/reduxStore/movieSearch/movieSearch.methods";
import movieSearchSelectors from "moviepicker/reduxStore/movieSearch/movieSearch.selectors";
import { connect } from "react-redux";
import * as yup from "yup";

import * as Style from "./DashboardScreen.style";

const DashboardScreen: React.FC<
IStateProps &
IDispatchProps &
  StackScreenProps<AuthorizedBottomTabStack, "Dashboard"> &
    StackScreenProps<IDashboardStack, "Dashboard">
> = (props) => {


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

  const validationSchema = useMemo(
    () =>
      yup.object({
        searchValue: yup
          .string()
          .min(1, "Your search must contain at least 1 character"),
      }),
    []
  );

  const { control, handleSubmit, errors, formState } = useForm<ISearchMovie>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
  });

  const onSubmit = async (data: ISearchMovie) => {
    await props.searchMovie(data);
    if(!props.searchMovieInProgress) {
      if (!props.searchMovieError) {
        props.navigation.navigate("searchResults");
      }
    }
  };

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
        <Box marginbottom="md" margintop="xxlg">
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputField
                placeholder="Search Movie"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                fullWidth={true}
                type="email"
                iconLeft="film"
                error={!!errors.search}
                errorMessage={errors.search?.message}
              />
            )}
            name="searchValue"
            defaultValue=""
          />
        </Box>

        {formState.isSubmitted && props.searchMovieError && (
        <Box marginbottom="lg">
          <Alert
            text={props.searchMovieError?.message || "Something went wrong"}
            icon="exclamation-triangle"
            color="danger"
          />
        </Box>
      )}
      <Button
        label="Search"
        type="primary"
        onPress={handleSubmit(onSubmit)}
        disabled={
          !formState.isDirty ||
          props.searchMovieInProgress ||
          !formState.isValid
        }
        marginbottom="xlg"
      />

        <Style.Container>
          <Style.Logo
            style={{
              opacity: logoAnim.opacity,
              transform: [{ translateY: logoAnim.y }],
            }}
          >
            <MoviepickerLogo />
          </Style.Logo>
          <Box margintop="xxs">
            <ContentText type="fineprint" textalign="center" color="text">
              v{Utils.getAppVersion()}
            </ContentText>
          </Box>
        </Style.Container>
      </Screen>
    </Style.Wrapper>
  );
};

interface IStateProps {
  searchMovieInProgress?: boolean;
  searchMovieError?: IError;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  searchMovieInProgress: movieSearchSelectors.movieSearchStateSelector.isLoading(
    state
  ),
  searchMovieError: movieSearchSelectors.movieSearchStateSelector.error(state),
});

interface IDispatchProps {
  searchMovie: (fields: ISearchMovie) => void;
}
const mapDispatchToProps: IDispatchProps = {
  searchMovie: movieSearchMethods.searchMovie,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
