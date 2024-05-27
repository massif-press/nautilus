import _ from 'lodash';
import { iconData, locationData } from './dataTypes';
import { cargoData, Cargo } from './cargo';
import { crewData, Crew } from './crew';
import { itemHistoryData, ItemHistory } from './itemHistory';
import { missionData, Mission } from './mission';

const shipSizeClasses = [
  {
    id: 'platform',
    name: 'Mobile Platform',
    code: 'MSP',
    show: 1,
    value: 12,
    description:
      'Enormous spacefaring structures, station-sized craft that are used as mobile bases or platforms for large-scale operations. Typically too large to use blink gates.',
  },
  {
    id: 'massive',
    name: 'Massive',
    code: 'VL',
    show: 1,
    value: 6,
    description:
      'The largest class of spacecraft that can navigate blink gates, these ships are typically too large to dock at everything but the largest stations or specially-equipped docks. They are often used as flagships or interstellar transports for large groups of people or cargo.',
  },
  {
    id: 'large',
    name: 'Large',
    code: 'LG',
    show: 1,
    value: 4,
    description: 'Large capital line ships, cargo haulers, and other vessels.',
  },
  {
    id: 'medium',
    name: 'Medium',
    code: 'MD',
    show: 1,
    value: 2,
    description:
      'The most common ship size. Includes many classes of military, industrial, research, logistics vessels. Also includes most commercial freighters and passenger liners. The largest ships that can land on most planets.',
  },
  {
    id: 'small',
    name: 'Small',
    code: 'SM',
    show: 2,
    value: -3,
    description:
      'Small personal or limited-crew vessels. Includes pleasure craft, shuttles, and small utility ships.',
  },
  {
    id: 'tiny',
    name: 'Very Small',
    code: 'XS',
    show: 4,
    value: 0,
    description:
      'Drones, probes, and other very small craft. Typically used for short-range missions or as support craft for larger ships. Often too small to carry a crew.',
  },
];

const shipRoles = [
  {
    id: 'role_military',
    name: 'Military',
    code: 'M',
    description: 'Ships designed for military use, including combat, patrol, and support roles.',
  },
  {
    id: 'role_industrial',
    name: 'Industrial',
    code: 'I',
    description:
      'Ships designed for industrial use, including mining, refining, and manufacturing.',
  },
  {
    id: 'role_research',
    name: 'Research',
    code: 'R',
    description: 'Ships designed for scientific research, exploration, and discovery.',
  },
  {
    id: 'role_logistics',
    name: 'Logistics',
    code: 'L',
    description: 'Ships designed for transport, cargo, and supply roles.',
  },
  {
    id: 'role_commercial',
    name: 'Commercial',
    code: 'C',
    description: 'Ships designed for commercial use, including passenger liners and freighters.',
  },
  {
    id: 'role_pleasure',
    name: 'Pleasure',
    code: 'P',
    description:
      'Ships designed for personal or recreational use, including yachts and pleasure craft.',
  },
];

type ShipData = {
  id: string;
  name: string;
  prefix: string;
  faction: string;
  owner: string;
  size: string;
  role: string;

  icon?: string;
  map: string;
  lat: number;
  lon: number;
  status?: string;
  mission?: string;
  destination?: string;

  manufacturer: string;
  homeport: string;
  hull: string;
  hulltype: string;
  description: string;

  details?: { title: string; body: string }[];

  speed_rating?: number;
  length?: number;
  crew_capacity?: number;
  cargo_capacity?: number;

  history?: itemHistoryData[];
  crew?: crewData[];
  cargo?: cargoData[];

  tags?: string[];
};

class Ship {
  public readonly ItemType = 'ship';
  public readonly Collection = 'ship';

  public readonly ID: string;
  public Name: string;
  public Prefix: string;
  public Size: string;
  public Role: string;
  public Description: string;
  public Manufacturer: string;
  public HomePort: string;
  public Hull: string;
  public HullType: string;
  public SpeedRating: number;
  public Length: number;
  public CrewCapacity: number;
  public CargoCapacity: number;
  public Faction: string;
  public Owner: string;
  public Icon: iconData;
  public Location: locationData;
  public Details: { title: string; body: string }[];
  public History: ItemHistory[];
  public Crew: Crew[];
  public Cargo: Cargo[];
  public Mission: Mission;
  public Tags: string[];
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  constructor(data?: ShipData) {
    this.ID = data?.id || _.uniqueId('ship_');
    this.Name = data?.name || '';
    this.Prefix = data?.prefix || '';
    this.Size = data?.size || '';
    this.Role = data?.role || '';
    this.Description = data?.description || '';
    this.Manufacturer = data?.manufacturer || '';
    this.HomePort = data?.homeport || '';
    this.Hull = data?.hull || '';
    this.HullType = data?.hulltype || '';
    this.SpeedRating = data?.speed_rating || 1;
    this.Length = data?.length || 1;
    this.CrewCapacity = data?.crew_capacity || 1;
    this.CargoCapacity = data?.cargo_capacity || 1;
    this.Faction = data?.faction || '';
    this.Owner = data?.owner || '';

    this.Status = 'Approved';

    // this.Icon = { icon: data?.icon || 'mdi-delta', color: 'blue' };
    this.Icon = { icon: 'cc:ship', color: 'blue' };
    const sizeClass = shipSizeClasses.find((s) => s.id === this.Size);
    this.Icon.show = sizeClass?.show || 1;

    this.Location = {
      map: data?.map || 'unknown',
      coords: [data?.lat || 0, data?.lon || 0],
    };

    this.Details = data?.details || [];
    this.History = data && data.history ? data.history.map((h) => new ItemHistory(h)) : [];
    this.Crew = data && data.crew ? data.crew.map((c) => new Crew(c)) : [];
    this.Cargo = data && data.cargo ? data.cargo.map((c) => new Cargo(c)) : [];

    this.Mission = new Mission({
      status: data?.status || 'unknown',
      destination_id: data?.destination || 'unknown',
      mission_type: data?.mission || 'unknown',
    });

    this.Tags = data?.tags || [];

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
    return `${this.Prefix} ${this.Name}`;
  }

  public get SizeValue(): number {
    return shipSizeClasses.find((s) => s.id === this.Size)?.value || 1;
  }

  private getHeading(y1, x1, y2, x2) {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const angle = Math.atan2(deltaY, deltaX);
    return angle;
  }
}

export { Ship, ShipData, shipSizeClasses, shipRoles };
