import { WithColorProps } from "moviepicker/styles/colors";
import { WithMarginProps } from "moviepicker/styles/spacing";
import React from "react";

import * as Style from "./ContentText.style";
import { IContentText } from "./ContentText.types";

const ContentText: React.FC<IContentText & WithMarginProps & WithColorProps> = (
  props
) => <Style.StyledText {...props}>{props.children}</Style.StyledText>;
export default ContentText;
