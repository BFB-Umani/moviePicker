import { StackScreenProps } from "@react-navigation/stack";
import Box from "moviepicker/components/Box/Box";
import Screen from "moviepicker/components/Screen/Screen";
import Separator from "moviepicker/components/Separator/Separator";
import {
  AuthorizedBottomTabStack,
  IMovieListStack,
} from "moviepicker/navigation/Navigation.types";
import listSelectors from "moviepicker/reduxStore/lists/lists.selectors";
import { IReduxState, IMovie, IUserProfile, IMovieList, INewMovieList } from "moviepicker/reduxStore/store.types";
import React, { useRef, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import Button from "moviepicker/components/Button/Button";
import ContentText from "moviepicker/components/ContentText/ContentText";
import InputField from "moviepicker/components/InputField/InputField";
import Tabs from "moviepicker/components/Tabs/Tabs";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import userSelectors from "moviepicker/reduxStore/user/user.selectors";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchUserProfileByEmail } from "moviepicker/reduxStore/user/user.methods"
import * as yup from "yup";

import List from "./List/List";
import listsMethods from "moviepicker/reduxStore/lists/lists.methods";

const searchResultScreen: React.FC<
IStateProps &
IDispatchProps &
  StackScreenProps<AuthorizedBottomTabStack, "List"> &
    StackScreenProps<IMovieListStack, "List">
> = (props) => {

  useEffect(() => {
    if (props.list.length === 0 && props.userProfile) {
      props.fetchLists(props.userProfile.id);
      props.fetchContributerLists(props.userProfile.id);
      props.fetchAllLists(props.userProfile.id);
    }
  }, []);

  const modalizeRef = useRef<Modalize>(null);

  const validationSchema = useMemo(
    () =>
      yup.object({
        listName: yup
          .string()
          .min(1, "Your search must contain at least 1 character"),
      }),
    []
  );
  const { control, handleSubmit, errors, formState } = useForm<IMovieList>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
  });

  /**
   * opens modal with input fields for user to fill
   */
  const createList = () => {
    modalizeRef.current?.open();
  } 

  /**
   * takes user to new screen with all the movies that is in the selected list
   * @param result 
   */
  const onSelectList = async (result: IMovieList) => {
    props.fetchMovies(result.id)
    props.navigation.navigate("MovieList")
  };

  /**
   * takes data from user and sends it to dispatch methods for creating a new list
   * @param data 
   */
  const onSubmit = async (data: INewMovieList) => {
    if(props.userProfile) {
      data.creatorId = props.userProfile?.id;
    }
    const contributerIds = await fetchUserByEmail(data.contributerId);
    data.contributerId = contributerIds.idArray;
    await props.createList(data);
    if(props.userProfile) {
      await props.fetchLists(props.userProfile.id)
    }
    modalizeRef.current?.close();
  };

  /*
  * takes contriubter emails and returns the userID values connected
  * */
  const fetchUserByEmail = async (ids) => {
    let idArray: string[] = [];
    const contributersId = ids.split(", ")
    for(let contEmails of contributersId) {
      const contId = await fetchUserProfileByEmail(contEmails)
      if(contId) {
        idArray.push(contId) 
      }
    }
    return {
      idArray
    }
  }

  return (
    <Screen
      header={{
        color: "general",
        title: "Your Lists",
      }}
      showLoadingIndicator={
        props.list.length === 0 && props.isFetchingLists
      }
      loadingText="Fetching results"
      noScroll={true}
      ignorepadding={true}
    >
      <Separator color="primary"/>
      <Tabs
        activeColor="primary"
        initialTab="creator"
        tabs={[
          {
            id: "creator",
            title: "your lists",
            content: (
              <Box>
                <List
                  lists={props.list}
                  isRefreshing={props.isFetchingLists}
                  onSelectList={onSelectList}
                  onCreateList={createList}
                  messageForUser={"Click the + to create a new list!"}
                />
              </Box>
            ),
          },
          {
            id: "contributer",
            title: "shared lists",
            content: (
              <Box>
                <List
                  lists={props.contributersList}
                  isRefreshing={props.isFetchingLists}
                  onSelectList={onSelectList}
                  onCreateList={createList}
                  messageForUser={"Ask your friends to add you as contributer!"}
                />
              </Box>
            ),
          },
        ]}
      />
      <Portal>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          withHandle={false}
          adjustToContentHeight={true}
        >
          <Box color="general">
            <ContentText type="h1" color="text" margintop="md">
              Name your list and add contributers!
            </ContentText>
          <Box marginbottom="md" margintop="sm" padding="lg">
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputField
                label="list name"
                placeholder="name"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                fullWidth={true}
                type="email"
                error={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
            name="name"
            defaultValue=""
          /><Box margintop="md">
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <InputField
                label="contributers"
                placeholder="email, email..."
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                fullWidth={true}
                type="email"
                error={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
            name="contributerId"
            defaultValue=""
          />
          </Box>
          <Box margintop="xxlg">
            <Button
              label="create list"
              size="small"
              type="primary"
              onPress={handleSubmit(onSubmit)}
              disabled={
                !formState.isDirty ||
                props.isFetchingLists ||
                !formState.isValid
              }
              marginbottom="xlg"
            />
          </Box>
        </Box>
      </Box>
        </Modalize>
      </Portal>
    </Screen>
  );
};

interface IStateProps {
  userProfile?: IUserProfile;
  list: IMovieList[];
  contributersList: IMovieList[];
  movieList: IMovie[];
  isFetchingLists: boolean;
}
const mapStateToProps = (state: IReduxState): IStateProps => ({
  userProfile: userSelectors.userProfileSelector(state),
  list: listSelectors.movieListSelector(state),
  contributersList: listSelectors.contributersListSelector(state),
  movieList: listSelectors.moviesSelector(state),
  isFetchingLists: listSelectors.fetchListStateSelector.isLoading(
    state
  ),
});

interface IDispatchProps {
  fetchMovies: (movieListId: IMovieList["id"]) => void;
  fetchLists: (userId: IUserProfile["id"]) => void;
  fetchAllLists: (userId: IUserProfile["id"]) => void;
  fetchContributerLists: (userId: IUserProfile["id"]) => void;
  createList:  (fields: INewMovieList) => void;
}
const mapDispatchToProps: IDispatchProps = {
  fetchMovies: listsMethods.fetchMovies,
  fetchLists: listsMethods.fetchLists,
  fetchAllLists: listsMethods.fetchAllUserLists,
  fetchContributerLists: listsMethods.fetchContributersLists,
  createList: listsMethods.createList,
};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(searchResultScreen);
