import _ from 'lodash';
import { iconData, locationData } from '../dataTypes';
import { cargoData, Cargo } from '../cargo';
import { crewData, Crew } from '../crew';
import { itemHistoryData, ItemHistory } from '../itemHistory';
import { missionData, Mission } from '../mission';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { Hull } from './hull';
import { Tag } from '../tag';
import { Submap, SubmapData } from '../submap';
import { MapItem, MapItemData } from '../maps/mapitem';

type ShipData = MapItemData & {
  prefix: string;
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

  subitems?: SubitemShipData[];
};

type SubitemShipData = {
  id: string;
  name: string;
  prefix: string;
  hull: string;
  offset: number[];
  size?: string;
  icon?: string;
  color?: string;
  description?: string;
};

class Ship extends MapItem {
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
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  public Subitems: Ship[];

  public Submap?: any;

  constructor(data?: ShipData) {
    super(data);
    this.Prefix = data?.prefix || '';
    this.Description = data?.description || '';
    this.HomePort = data?.homeport || '';

    if (data) {
      const hull = useCompendiumStore().hull(data.hull);
      if (!hull) {
        throw new Error(`Hull ${data.hull} not found in compendium`);
      }
      this.Hull = hull;
    }

    this.Icon.icon = data?.icon || 'cc:ship';
    this.Icon.show = this.Hull.Size.show || 1;
    if (!this.Icon.size) this.Icon.size = 24;

    this.Details = data?.details || [];
    this.Crew = data && data.crew ? data.crew.map((c) => new Crew(c)) : [];
    this.Cargo = data && data.cargo ? data.cargo.map((c) => new Cargo(c)) : [];

    this.Mission = new Mission({
      status: data?.status || 'unknown',
      destination_id: data?.destination || 'unknown',
      mission_type: data?.mission || 'unknown',
    });

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

    if (data?.subitems) {
      this.Subitems = data.subitems.map((s) => Ship.GenerateSubitem(this, s) as Ship);
    }
  }

  public get Title(): string {
    if (!this.Prefix) return `${this.Hull.Code} ${this.Name}`;
    return `${this.Prefix}-${this.Hull.Code} ${this.Name}`;
  }

  public get Subtitle(): string {
    return `${this.Owner} ${this.Hull.Class}`;
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

  public static GenerateSubitem(parent: Ship, data: SubitemShipData): Ship {
    const subitemData: ShipData = {
      id: data.id,
      name: data.name,
      prefix: data.prefix,
      hull: data.hull,
      faction: parent.Faction,
      owner: parent.Owner,
      description: data.description || '',
      icon: data.icon || 'cc:ship',
      map: parent.Location.map,
      lat: parent.Location.coords[0] + data.offset[0],
      lon: parent.Location.coords[1] + data.offset[1],
      homeport: parent.HomePort,
    };

    return new Ship(subitemData);
  }
}

export { Ship, ShipData };
