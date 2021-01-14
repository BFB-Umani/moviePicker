export type SpacingSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xlg"
  | "xxlg"
  | "xxxlg";
export const spacing: { [key in SpacingSize]: string } = {
  /** `4px` */
  xxxs: "4px",
  /** `8px` */
  xxs: "8px",
  /** `12px` */
  xs: "12px",
  /** `16px` */
  sm: "16px",
  /** `24px` */
  md: "24px",
  /** `32px` */
  lg: "32px",
  /** `40px` */
  xlg: "40px",
  /** `48px` */
  xxlg: "48px",
  /** `56px` */
  xxxlg: "56px",
};

export const borderRadius = {
  /** `4px` */
  xs: "4px",
  /** `8px` */
  sm: "8px",
  /** `12px` */
  md: "12px",
  /** `16px` */
  lg: "16px",
  /** `20px` */
  xlg: "20px",
};

export interface WithMarginProps {
  margin?: SpacingSize;
  margintop?: SpacingSize;
  marginbottom?: SpacingSize;
  marginleft?: SpacingSize;
  marginright?: SpacingSize;
}
export const generateMarginProps = (props: WithMarginProps) => `
  ${props.margin ? `margin: ${spacing[props.margin]};` : ""};
  ${props.margintop ? `margin-top: ${spacing[props.margintop]};` : ""}
  ${props.marginbottom ? `margin-bottom: ${spacing[props.marginbottom]};` : ""}
  ${props.marginleft ? `margin-left: ${spacing[props.marginleft]};` : ""}
  ${props.marginright ? `margin-right: ${spacing[props.marginright]};` : ""}
`;

export interface WithPaddingProps {
  padding?: SpacingSize;
  paddingtop?: SpacingSize;
  paddingbottom?: SpacingSize;
  paddingleft?: SpacingSize;
  paddingright?: SpacingSize;
}
export const generatePaddingProps = (props: WithPaddingProps) => `
  ${props.padding ? `padding: ${spacing[props.padding]};` : ""};
  ${props.paddingtop ? `padding-top: ${spacing[props.paddingtop]};` : ""}
  ${
    props.paddingbottom
      ? `padding-bottom: ${spacing[props.paddingbottom]};`
      : ""
  }
  ${props.paddingleft ? `padding-left: ${spacing[props.paddingleft]};` : ""}
  ${props.paddingright ? `padding-right: ${spacing[props.paddingright]};` : ""}
`;
