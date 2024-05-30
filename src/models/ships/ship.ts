import _ from 'lodash';
import { iconData, locationData } from '../dataTypes';
import { cargoData, Cargo } from '../cargo';
import { crewData, Crew } from '../crew';
import { itemHistoryData, ItemHistory } from '../itemHistory';
import { missionData, Mission } from '../mission';
import { useCompendiumStore } from '../../compendiumStore';
import { Hull } from './hull';
import { Tag } from '../tag';

type ShipData = {
  id: string;
  name: string;
  prefix: string;
  faction: string;
  owner: string;

  icon?: string;
  map: string;
  lat: number;
  lon: number;
  status?: string;
  mission?: string;
  destination?: string;

  homeport: string;
  hull: string;
  description: string;

  details?: { title: string; body: string }[];

  crew?: crewData[];
  cargo?: cargoData[];

  tags?: string;
};

class Ship {
  public readonly ItemType = 'ship';
  public readonly Collection = 'ship';

  public readonly ID: string;
  public Name: string;
  public Prefix: string;
  public Hull: Hull;
  public Description: string;
  public HomePort: string;
  public Faction: string;
  public Owner: string;
  public Icon: iconData;
  public Location: locationData;
  public Details: { title: string; body: string }[];
  public Crew: Crew[];
  public Cargo: Cargo[];
  public Mission: Mission;
  private _tags: Tag[];
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  constructor(data?: ShipData) {
    this.ID = data?.id || _.uniqueId('ship_');
    this.Name = data?.name || '';
    this.Prefix = data?.prefix || '';
    this.Description = data?.description || '';
    this.HomePort = data?.homeport || '';
    this.Faction = data?.faction || '';
    this.Owner = data?.owner || '';

    if (data) {
      const hull = useCompendiumStore().hull(data.hull);
      if (!hull) {
        throw new Error(`Hull ${data.hull} not found in compendium`);
      }
      this.Hull = hull;
    }

    this.Status = 'Approved';

    // this.Icon = { icon: data?.icon || 'mdi-delta', color: 'blue' };
    this.Icon = { icon: 'cc:ship', color: 'blue' };
    this.Icon.show = this.Hull.Size.show || 1;

    this.Location = {
      map: data?.map || 'unknown',
      coords: [data?.lat || 0, data?.lon || 0],
    };

    this.Details = data?.details || [];
    this.Crew = data && data.crew ? data.crew.map((c) => new Crew(c)) : [];
    this.Cargo = data && data.cargo ? data.cargo.map((c) => new Cargo(c)) : [];

    this.Mission = new Mission({
      status: data?.status || 'unknown',
      destination_id: data?.destination || 'unknown',
      mission_type: data?.mission || 'unknown',
    });

    const tags = data?.tags?.split(', ') || [];

    this._tags = tags.length
      ? useCompendiumStore().tags.filter((tag) => tags.includes(tag.ID))
      : [];

    if (!this.Icon.size) this.Icon.size = 24;
    if (!this.Icon.show) this.Icon.show = 1;

    if (this.Mission.Destination) {
      this.Location.heading = this.getHeading(
        this.Location.coords[1],
        this.Location.coords[0],
        this.Mission.Destination.Location.coords[1],
        this.Mission.Destination.Location.coords[0]
      );
      this.Location.line = [this.Location.coords, this.Mission.Destination.Location.coords];
    } else {
      this.Location.heading = Math.random() * 360;
    }
  }

  public get Title(): string {
    if (!this.Prefix) return `${this.Hull.Code} ${this.Name}`;
    return `${this.Prefix}-${this.Hull.Code} ${this.Name}`;
  }

  public get SizeValue(): number {
    return this.Hull.Size.value || 1;
  }

  public get Tags(): Tag[] {
    return this._tags.concat(this.Hull.Tags);
  }

  private getHeading(y1, x1, y2, x2) {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const angle = Math.atan2(deltaY, deltaX);
    return angle;
  }
}

export { Ship, ShipData };
