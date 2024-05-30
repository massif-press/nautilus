import _ from 'lodash';
import { cargoData, Cargo } from './cargo';
import { crewData, Crew } from './crew';
import { iconData, locationData } from './dataTypes';
import { itemHistoryData, ItemHistory } from './itemHistory';

const poiSizeClasses = [
  {
    id: 'huge',
    name: 'Major',
    code: 'MSP',
    description:
      'The largest and most significant points of interest. These are typically large space stations, major gates, or other significant locations that are important to the region. They are typically large enough to have multiple districts or regions, and may have multiple smaller locations within them or very nearby.',
    show: 1,
    value: 5,
  },
  {
    id: 'large',
    name: 'Standard',
    code: 'VL',
    description:
      'The most common size of point of interest. These include most orbital installations, intra-system gates, and system infrastructure, but are not large enough to have multiple districts or regions.',
    show: 1,
    value: 3,
  },
  {
    id: 'small',
    name: 'Minor',
    code: 'LG',
    description:
      'Small points of interest, such as small outposts, orbital platforms, and automated infrastructure.',
    show: 2,
    value: 1,
  },
];

const poiRoles = [
  {
    id: 'role_military',
    name: 'Military',
    code: 'M',
    description:
      'Points of interest that are primarily military in nature, including bases, outposts, and defense installations.',
  },
  {
    id: 'role_industrial',
    name: 'Industrial',
    code: 'I',
    description:
      'Points of interest that are primarily industrial in nature, including mining operations, refineries, and manufacturing plants.',
  },
  {
    id: 'role_research',
    name: 'Research',
    code: 'R',
    description:
      'Points of interest that are primarily research in nature, including labs, observatories, and research stations.',
  },
  {
    id: 'role_infrastructure',
    name: 'Infrastructure',
    code: 'L',
    description:
      'Points of interest that are primarily logistics in nature, including cargo hubs, storage facilities, and trade depots.',
  },
  {
    id: 'role_civilian',
    name: 'Civilian',
    code: 'C',
    description:
      'Points of interest that are primarily civilian in nature, including residential districts, commercial hubs, and entertainment centers.',
  },
];

type PoiData = {
  id: string;
  name: string;
  faction: string;
  owner: string;
  size: string;
  role: string;

  icon?: string;
  map: string;
  lat: number;
  lon: number;
  color?: string;
  show?: number;

  // crew_capacity: number;
  // inhabitant_capacity: number;

  poitype: string;
  description: string;

  history?: itemHistoryData[];
  crew?: crewData[];
  cargo?: cargoData[];

  tags?: string[];

  submap?: any;
};

class Poi {
  public readonly ItemType = 'poi';
  public readonly Collection = 'poi';

  public readonly ID: string;
  public Name: string;
  public Size: string;
  public Role: string;
  public Description: string;
  public PoiType: string;
  // public CrewCapacity: number;
  // public InhabitantCapacity: number;
  public Faction: string;
  public Owner: string;
  public Icon: iconData;
  public Location: locationData;
  public History: ItemHistory[];
  public Crew: Crew[];
  public Cargo: Cargo[];
  public Tags: string[];
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  public Submap?: any;

  constructor(data?: PoiData) {
    this.ID = data?.id || _.uniqueId('poi_');
    this.Name = data?.name || '';
    this.Size = data?.size || '';
    this.Role = data?.role || '';
    this.Description = data?.description || '';

    this.Faction = data?.faction || '';
    this.Owner = data?.owner || '';
    this.PoiType = data?.poitype || '';

    this.Status = 'Approved';

    this.Icon = { icon: data?.icon || 'mdi-rhombus-outline', color: 'green' };
    const sizeClass = poiSizeClasses.find((s) => s.id === this.Size);
    this.Icon.show = sizeClass?.show || 1;

    this.Location = {
      map: data?.map || 'unknown',
      coords: [data?.lat || 0, data?.lon || 0],
    };

    if (data?.submap) this.Submap = data.submap;

    this.History = data && data.history ? data.history.map((h) => new ItemHistory(h)) : [];
    this.Crew = data && data.crew ? data.crew.map((c) => new Crew(c)) : [];
    this.Cargo = data && data.cargo ? data.cargo.map((c) => new Cargo(c)) : [];
    this.Tags = data?.tags || [];

    if (!this.Icon.size) this.Icon.size = 24;
    if (!this.Icon.show) this.Icon.show = 1;

    if (data?.show) this.Icon.show = data.show;
    if (data?.color) this.Icon.color = data.color;
  }

  public get Title(): string {
    return this.Name;
  }

  public get SizeValue(): number {
    return poiSizeClasses.find((s) => s.id === this.Size)?.value || 1;
  }
}

export { Poi, PoiData, poiSizeClasses, poiRoles };
