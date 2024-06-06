import { locationData } from '../dataTypes';
import { Submap, SubmapData } from './submap';
import { SystemMap } from './systemMap';

type TerrainData = {
  id: string;
  name: string;
  center: number[];
  submap: SubmapData;
  description: string;
};

class Terrain {
  public readonly Collection = 'terrain';
  public readonly ID: string;
  public Name: string;
  public Center: number[];
  public Submap: Submap;
  public Description: string;
  public MapID: string;

  constructor(map: SystemMap, data: TerrainData) {
    this.ID = data.id;
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
