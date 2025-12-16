
export interface IconProps {
  color: string;
  width: number;
  height: number;
}

export type CustomIconType = React.ComponentType<IconProps>;

export interface TabConfig {
  name: string;
  label: string;
  component: CustomIconType;
}
