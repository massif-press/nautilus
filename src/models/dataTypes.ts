type iconData = {
  icon: string;
  color: string;
  size?: string | number;
  show?: number;
};

type locationData = {
  map: string;
  coords: number[];
  heading?: number;
  line?: number[][];
};

export { iconData, locationData };
