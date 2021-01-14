export interface ISelect {
  title?: string;
  selected: string;
  list: ISelectListItem[];
  onChange: (val: ISelectListItem["value"]) => void;
  disabled?: boolean;
}
export interface ISelectListItem {
  value: any;
  label: string;
}
