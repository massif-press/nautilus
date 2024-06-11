import { useMapStore } from '../../stores/mapStore';
import { MapItem, MapItemData } from './mapitem';

type CrewData = MapItemData & {
  name: string;
  role: string;
  pronouns: string;
  background: string;
  description: string;
  assignment?: string;
  author?: string;
  details?: { title: string; body: string }[];
};

class Crew extends MapItem {
  public readonly ItemType = 'crew';

  public Name: string;
  public Role: string;
  public Description: string;
  public Pronouns: string;
  public Background: string;
  public Details: { title: string; body: string }[];

  private _assignmentId: string;

  constructor(data?: CrewData) {
    super(data);
    this.Name = data?.name || 'New Crewmember';
    this.Role = data?.role || '';
    this.Description = data?.description || '';
    this.Pronouns = data?.pronouns || 'they/them';
    this.Background = data?.background || '';
    this.Details = data?.details || [];
    this._assignmentId = data?.assignment || '';
  }

  public get Assignment(): MapItem | undefined {
    if (!this._assignmentId) return undefined;
    return useMapStore().getItemById(this._assignmentId);
  }

  public set Assignment(item: MapItem | undefined) {
    this._assignmentId = item?.ID || '';
  }

  public ClearAssignment(): void {
    this._assignmentId = '';
  }
}

export { Crew, CrewData };
