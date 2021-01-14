import { WithColorProps } from "b3runtime/styles/colors";
import { WithMarginProps } from "b3runtime/styles/spacing";
import React from "react";

import * as Style from "./ContentText.style";
import { IContentText } from "./ContentText.types";

const ContentText: React.FC<IContentText & WithMarginProps & WithColorProps> = (
  props
) => <Style.StyledText {...props}>{props.children}</Style.StyledText>;
export default ContentText;
