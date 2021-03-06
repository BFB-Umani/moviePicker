import { WithMarginProps } from "moviepicker/styles/spacing";
import React from "react";
import { TouchableOpacityProps } from "react-native";

import Icon from "../Icon/Icon";
import * as Style from "./SearchImage.style";

interface Props {
  imageUrl?: string;
}

const Avatar: React.FC<Props & WithMarginProps & TouchableOpacityProps> = ({
  imageUrl,
  ...props
}) => (
  <Style.Container {...props} style={{ elevation: 5 }}>
    {imageUrl && <Style.SearchImage uri={imageUrl} />}
    {!imageUrl && <Icon icon="user-astronaut" size="xxlg" color="primary" />}
  </Style.Container>
);
export default Avatar;
