import { locationData } from '../dataTypes';
import { EditableItem, EditableItemData } from '../editableItem';
import { SystemMap } from './systemMap';

type TerrainData = EditableItemData & {
  type: 'terrain';
  name: string;
  terrain_type: string;
  center: number[];
  svg: string;
  size: number;
  description: string;
};

class Terrain extends EditableItem {
  public readonly Collection = 'terrain';
  public readonly ID: string;
  public Name: string;
  public ItemType: string = 'terrain';
  public TerrainType: string;
  public Svg: string;
  public Center: number[];
  private _size: number;
  public Description: string;
  public MapID: string;

  constructor(map: SystemMap, data?: TerrainData) {
    super(data);
    this.TerrainType = data?.type || 'terrain';
    this.MapID = map.ID;
    this.Name = data?.name || 'New Terrain';
    this.Svg = data?.svg || 'planet.svg';
    this.Center = data?.center || [0, 0];
    this._size = data?.size || 1;
    this.Description = data?.description || '';
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

  public get Ypos(): number {
    return this.Center[0];
  }

  public set Ypos(value: string) {
    if (!value) value = '0';
    if (isNaN(parseFloat(value))) {
      throw new Error('Ypos must be a number');
    }
    this.Center[0] = parseFloat(value);
  }

  public get Xpos(): number {
    return this.Center[1];
  }

  public set Xpos(value: string) {
    if (!value) value = '0';
    if (isNaN(parseFloat(value))) {
      throw new Error('Xpos must be a number');
    }
    this.Center[1] = parseFloat(value);
  }

  public get Location(): locationData {
    return { map: this.MapID, coords: this.Center };
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

  public Save(): TerrainData {
    return {
      ...super.Save(),
      type: 'terrain',
      name: this.Name,
      terrain_type: this.TerrainType,
      center: this.Center,
      svg: this.Svg,
      size: this.Size,
      description: this.Description,
    };
  }
}

export { Terrain, TerrainData };
