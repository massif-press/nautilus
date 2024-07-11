import { EditableItem, EditableItemData } from '../editableItem';
import { TerrainData, Terrain } from './terrain';
import { Author } from '../author';
import { useDataStore } from '../../stores/dataStore';
import { useUserStore } from '../../stores/userStore';

type MapData = EditableItemData & {
  type: 'map';
  name: string;
  subtitle: string;
  control: string;
  color: string;
  description: string;
  terrain: TerrainData[];
  updated_by?: string;
};

class SystemMap extends EditableItem {
  public readonly Collection = 'map';
  public readonly ID: string;
  public Name: string;
  public Subtitle: string;
  public Control: string;
  public Description: string;
  public Color: string;
  public Terrain: Terrain[];

  private _updatedBy: string;

  constructor(data?: MapData) {
    super(data);
    this.Name = data?.name || 'New Map';
    this.Subtitle = data?.subtitle || '';
    this.Control = data?.control || '';
    this.Description = data?.description || '';
    this.Color = data?.color || '#991E2A';
    this.Terrain = data?.terrain.map((t) => new Terrain(this, t)) || [];

    this._updatedBy = data?.updated_by || '';
  }

  public get UpdatedBy(): Author {
    return useDataStore().author(this._updatedBy);
  }

  public Save(): MapData {
    return {
      ...super.Save(),
      type: 'map',
      name: this.Name,
      subtitle: this.Subtitle,
      control: this.Control,
      color: this.Color,
      description: this.Description,
      updated_by: useUserStore().user_id,
      terrain: this.Terrain.map((t) => t.Save()),
    };
  }
}

export { SystemMap, MapData };
