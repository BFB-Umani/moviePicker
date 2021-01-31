export const typography = {
  body: "open-sans",
  bodySemiBold: "open-sans-semiBold",
  bodyBold: "open-sans-bold",
  heading: "work-sans",
  headingBold: "work-sans-bold",
};

export type FontSize = "xxlg" | "xlg" | "lg" | "md" | "sm" | "xs" | "xxs";
export const fontSize: { [key in FontSize]: string } = {
  /** 24px */
  xxlg: "24px",
  /** 20px */
  xlg: "20px",
  /** 18px */
  lg: "18px",
  /** 16px */
  md: "16px",
  /** 14px */
  sm: "14px",
  /** 12px */
  xs: "12px",
  /** 10px */
  xxs: "10px",
};
export type TextAlign = "left" | "center" | "right";
