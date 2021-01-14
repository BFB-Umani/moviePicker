import { WithMarginProps } from "moviepicker/styles/spacing";
import React from "react";
import { TouchableOpacityProps } from "react-native";

import Icon from "../Icon/Icon";
import * as Style from "./Avatar.style";

interface Props {
  imageUrl?: string;
}

const Avatar: React.FC<Props & WithMarginProps & TouchableOpacityProps> = ({
  imageUrl,
  ...props
}) => (
  <Style.Container {...props} activeOpacity={1} style={{ elevation: 5 }}>
    {imageUrl && <Style.ProfilePicture uri={imageUrl} />}
    {!imageUrl && <Icon icon="user-astronaut" size="xxlg" color="primary" />}
  </Style.Container>
);
export default Avatar;
