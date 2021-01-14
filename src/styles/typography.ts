export const typography = {
  body: "open-sans",
  bodySemiBold: "open-sans-semiBold",
  bodyBold: "open-sans-bold",
  heading: "work-sans",
  headingBold: "work-sans-bold",
};

export type FontSize = "xxlg" | "xlg" | "lg" | "md" | "sm" | "xs" | "xxs";
export const fontSize: { [key in FontSize]: string } = {
  /** 20px */
  xxlg: "24px",
  /** 20px */
  xlg: "20px",
  /** 20px */
  lg: "18px",
  /** 18px */
  md: "16px",
  /** 16px */
  sm: "14px",
  /** 14px */
  xs: "12px",
  /** 12px */
  xxs: "10px",
};
export type TextAlign = "left" | "center" | "right";
