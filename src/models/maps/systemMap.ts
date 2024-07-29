import { EditableItem, EditableItemData } from '../editableItem';
import { TerrainData, Terrain } from './terrain';
import { Author } from '../author';
import { useDataStore } from '../../stores/dataStore';
import { useUserStore } from '../../stores/userStore';
import { LabelData, Label } from './submap';

type MapData = EditableItemData & {
  type: 'map';
  name: string;
  subtitle: string;
  control: string;
  color: string;
  description: string;
  isPublic: boolean;
  terrain: TerrainData[];
  labels?: LabelData[];

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
  public IsPublic: boolean;
  public Terrain: Terrain[];
  public Labels: Label[] = [];

  private _updatedBy: string;

  constructor(data?: MapData) {
    super(data);
    this.Name = data?.name || 'New Map';
    this.Subtitle = data?.subtitle || '';
    this.Control = data?.control || '';
    this.Description = data?.description || '';
    this.Color = data?.color || '#991E2A';
    this.IsPublic = data?.isPublic || false;
    this.Terrain = data?.terrain.map((t) => new Terrain(this, t)) || [];
    this.Labels = data?.labels?.map((l) => new Label(this, l)) || [];

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
      isPublic: this.IsPublic,
      description: this.Description,
      updated_by: useUserStore().user_id,
      terrain: this.Terrain.map((t) => t.Save()),
      labels: this.Labels.map((l) => l.Save()),
    };
  }
}

export { SystemMap, MapData };
