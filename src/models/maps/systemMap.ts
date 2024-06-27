import { TerrainData, Terrain } from './terrain';

type MapData = {
  type: 'map';
  id: string;
  name: string;
  subtitle: string;
  control: string;
  description: string;
  terrain: TerrainData[];
};

class SystemMap {
  public readonly Collection = 'map';
  public readonly ID: string;
  public Name: string;
  public Subtitle: string;
  public Control: string;
  public Description: string;
  public Terrain: Terrain[];

  constructor(data: MapData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Subtitle = data.subtitle;
    this.Control = data.control;
    this.Description = data.description;
    this.Terrain = data.terrain.map((t) => new Terrain(this, t));
  }
}

export { SystemMap, MapData };
