import { ColorType } from "b3runtime/styles/colors";

export interface ITabs {
  tabs: ITabItem[];
  initialTab?: ITabItem["id"];
  activeColor?: ColorType;
}

export interface ITabItem {
  id: string;
  title: string;
  content: React.ReactNode;
  onSelect?: (id: string) => void;
}
