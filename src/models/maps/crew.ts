import { useDataStore } from '../../stores/dataStore';
import { MapItem, MapItemData } from './mapitem';

type CrewData = MapItemData & {
  type: 'crew';
  name: string;
  role: string;
  pronouns: string;
  background: string;
  description: string;
  nhp?: boolean;
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
  public IsNhp: boolean;
  public Details: { title: string; body: string }[];

  private _assignmentId: string;

  constructor(data?: CrewData) {
    super(data);
    this.Name = data?.name || 'New Crewmember';
    this.Role = data?.role || '';
    this.Description = data?.description || '';
    this.IsNhp = data?.nhp || false;
    this.Pronouns = data?.pronouns || 'they/them';
    this.Background = data?.background || '';
    this.Details = data?.details || [];
    this._assignmentId = data?.assignment || '';

    this.Icon.icon = 'mdi-account';
  }

  public get Subtitle(): string {
    if (this.Assignment)
      return `${this.Role}, ${(this.Assignment as any).Title || this.Assignment.Name}`;
    return this.Role;
  }

  public get Assignment(): MapItem | undefined {
    if (!this._assignmentId) return undefined;
    return useDataStore().getItemById(this._assignmentId);
  }

  public set Assignment(item: MapItem | undefined) {
    this._assignmentId = item?.ID || '';
  }

  public ClearAssignment(): void {
    this._assignmentId = '';
  }

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.Role && !!this.Pronouns && !!this.Background;
  }

  public get CanAdd(): boolean {
    return this.Status === 'Approved' || this.Status === 'Submitted';
  }

  public Save(): CrewData {
    return {
      ...super.Save(),
      type: this.ItemType,
      name: this.Name,
      role: this.Role,
      pronouns: this.Pronouns,
      nhp: this.IsNhp,
      description: this.Description,
      background: this.Background,
      details: this.Details,
      assignment: this._assignmentId,
    };
  }
}

export { Crew, CrewData };
