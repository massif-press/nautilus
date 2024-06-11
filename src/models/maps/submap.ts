import { iconData, locationData } from '../dataTypes';
import { MapItem } from './mapitem';
// import { Poi, PoiData } from '../poi';

type SubmapData = {
  name: string;
  img?: string;
  show?: number;
  size?: number;

  subitems?: SubitemData[];
};

type SubitemData = {
  id: string;
  name: string;
  poitype: string;
  offset: number[];
  icon?: string;
  color?: string;
  show?: number;
  description?: string;
  author?: string;
};

class Subitem {
  public readonly ItemType = 'subitem';
  public readonly Collection = 'subitem';
  public ID: string;
  public Name: string;
  public Owner: string;
  public PoiType: string;
  public Location: locationData;
  public Icon: iconData;
  public Offset: number[];
  public Show: number;
  public Description: string;
  public AuthorID: string;

  constructor(map: Submap, data: SubitemData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Owner = map.Parent.Owner;
    this.PoiType = data.poitype;
    this.Offset = data.offset;
    this.Icon = {
      icon: data.icon || 'mdi-rhombus-outline',
      color: data.color || 'yellow',
      show: map.Show,
    };
    this.Show = data.show || 0;
    this.Location = {
      map: map.Name,
      coords: [map.Center[0] + data.offset[0], map.Center[1] + data.offset[1]],
    };
    this.Description = data.description || '';
    this.AuthorID = data.author || '';
  }
}

class Submap {
  public readonly ItemType = 'submap';
  public readonly Collection = 'submap';
  public Name: string;
  public Img: string;
  public Show: number;
  public Center: number[];
  public Size: number;
  public Parent: MapItem;

  public Subitems: Subitem[];

  constructor(data: SubmapData, parent: MapItem | number[]) {
    this.Name = data.name || '';
    this.Img = data.img || '';
    this.Show = data.show || 0;
    this.Size = data.size || 1;
    if (parent instanceof Array) this.Center = parent;
    else {
      this.Center = parent.Location?.coords || [0, 0];
      this.Parent = parent;

      if (data.subitems) {
        this.Subitems = data.subitems.map((s) => new Subitem(this, s));
      }
    }
  }

  public SetCenter(coords: number[]): void {
    this.Center = coords;
  }

  get Bounds(): number[][] {
    return [
      [this.Center[0] - this.Size, this.Center[1] - this.Size],
      [this.Center[0] + this.Size, this.Center[1] + this.Size],
    ];
  }
}

export { Submap, SubmapData, Subitem, SubitemData };
