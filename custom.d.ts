type SvgrComponent = React.FC<React.SVGAttributes<SVGElement>>;
declare module "*.svg" {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.jpg";
declare module "*.png";
declare module "*.mp3";
declare module "*.wav";
