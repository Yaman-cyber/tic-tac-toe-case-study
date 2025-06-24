import { icons } from "../../../assets/data/icons";

export type IconMap = typeof icons;
export type IconName = keyof IconMap;

export interface AppIconProps {
  name?: IconName;
  fill?: string;
  color?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}
