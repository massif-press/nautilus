import { locationData } from '../dataTypes';
import { EditableItemData } from '../editableItem';
import { Submap, SubmapData } from './submap';
import { SystemMap } from './systemMap';

type TerrainData = EditableItemData & {
  type: 'terrain';
  name: string;
  terrain_type: string;
  center: number[];
  submap: SubmapData;
  description: string;
};

class Terrain {
  public readonly Collection = 'terrain';
  public readonly ID: string;
  public Name: string;
  public TerrainType: string;
  public Center: number[];
  public Submap: Submap;
  public Description: string;
  public MapID: string;

  constructor(map: SystemMap, data: TerrainData) {
    this.ID = data.id;
    this.TerrainType = data.type;
    this.MapID = map.ID;
    this.Name = data.name;
    this.Center = data.center;
    this.Submap = new Submap(data.submap, this.Center);
    this.Description = data.description;
  }

  public get Location(): locationData {
    return { map: this.MapID, coords: this.Center };
  }
}

export { Terrain, TerrainData };
