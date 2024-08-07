import { v4 as uuid } from 'uuid';
import { iconData, locationData } from '../dataTypes';
import { MapItem } from './mapitem';
import { Ship } from './ship';
import { SystemMap } from './systemMap';
// import { Poi, PoiData } from '../poi';

type SubmapData = {
  type: 'submap';
  name: string;
  img?: string;
  show?: number;
  size?: number;

  subitems?: SubitemData[];
  labels?: LabelData[];
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
};

type LabelData = {
  type: 'label';
  id?: string;
  name: string;
  offset: number[];
  size: number;
  color: string;
  show?: number;
};

class Label {
  public readonly ItemType = 'label';
  public ID: string;
  public Name: string;
  public Location: locationData;
  public Offset: number[];
  public _size: number;
  public Color: string;
  public _show: number;

  constructor(map: Submap | SystemMap, data: LabelData) {
    this.ID = data.id || uuid();
    this.Name = data.name;
    this.Offset = data.offset;
    this._size = data.size;
    this.Color = data.color;
    this._show = Number(data.show) || 0;
    this.Location = {
      map: map.Name,
      coords: [data.offset[0], data.offset[1]],
    };
    if (map instanceof Submap)
      this.Location.coords = [map.Center[0] + data.offset[0], map.Center[1] + data.offset[1]];
  }

  public get Size(): number {
    return this._size;
  }

  public set Size(value: string) {
    if (!value) value = '1';
    if (isNaN(parseFloat(value))) {
      throw new Error('Size must be a number');
    }
    this._size = parseFloat(value);
  }

  public get Show(): number {
    return this._show;
  }

  public set Show(value: string) {
    if (!value) value = '1';
    if (isNaN(Number(value))) {
      throw new Error('Show must be a number');
    }
    this._show = Number(value);
  }

  public get Ypos(): number {
    return this.Offset[0];
  }

  public set Ypos(value: string) {
    if (!value) value = '0';
    if (isNaN(parseFloat(value))) {
      throw new Error('Ypos must be a number');
    }
    this.Offset[0] = parseFloat(value);
  }

  public get Xpos(): number {
    return this.Offset[1];
  }

  public set Xpos(value: string) {
    if (!value) value = '0';
    if (isNaN(parseFloat(value))) {
      throw new Error('Xpos must be a number');
    }
    this.Offset[1] = parseFloat(value);
  }

  public Save(): LabelData {
    return {
      type: 'label',
      id: this.ID,
      name: this.Name,
      offset: this.Offset,
      size: this.Size,
      color: this.Color,
      show: this.Show,
    };
  }
}

class Subitem {
  public readonly ItemType = 'subitem';
  public readonly Collection = 'subitem';
  public ID: string;
  public Name: string;
  public PoiType: string;
  public Location: locationData;
  public Icon: iconData;
  public Offset: number[];
  public Show: number;
  public Description: string;

  constructor(origin: Submap | Ship, data: SubitemData) {
    this.ID = data.id;
    this.Name = data.name;
    this.PoiType = data.poitype;
    this.Offset = data.offset;
    this.Icon = {
      icon: data.icon || 'mdi-rhombus-outline',
      color: data.color || 'yellow',
      show: origin.Show,
    };
    this.Show = data.show || 0;
    this.Location = {
      map: origin.Name,
      coords: [origin.Center[0] + data.offset[0], origin.Center[1] + data.offset[1]],
    };
    this.Description = data.description || '';
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

  public Subitems: Subitem[] = [];
  public Labels: Label[] = [];

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
      if (data.labels) {
        this.Labels = data.labels.map((l) => new Label(this, l));
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

  get BoundsObject(): {
    lowerLeft: { x: number; y: number };
    upperRight: { x: number; y: number };
  } {
    return {
      lowerLeft: { x: this.Center[0] - this.Size, y: this.Center[1] - this.Size },
      upperRight: { x: this.Center[0] + this.Size, y: this.Center[1] + this.Size },
    };
  }

  public Save(): SubmapData {
    return {
      type: 'submap',
      name: this.Name,
      img: this.Img,
      show: this.Show,
      size: this.Size,
      subitems: this.Subitems.map((s) => ({
        id: s.ID,
        name: s.Name,
        poitype: s.PoiType,
        offset: s.Offset,
        icon: s.Icon.icon,
        color: s.Icon.color,
        show: s.Show,
        description: s.Description,
      })),
      labels: this.Labels.map((l) => ({
        type: 'label',
        id: l.ID,
        name: l.Name,
        offset: l.Offset,
        size: l.Size,
        color: l.Color,
        show: l.Show,
      })),
    };
  }
}

export { Submap, SubmapData, Subitem, SubitemData, Label, LabelData };
