import _ from 'lodash';
import { cargoData, Cargo } from './cargo';
import { crewData, Crew } from './crew';
import { itemHistoryData, ItemHistory } from './itemHistory';
import { MapItem, MapItemData } from './maps/mapitem';

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

type PoiData = MapItemData & {
  size: string;
  show?: number;
  poitype: string;
  description: string;

  crew?: crewData[];
  cargo?: cargoData[];

  subitems?: SubitemPoiData[];
};

type SubitemPoiData = {
  id: string;
  name: string;
  poitype: string;
  offset: number[];
  size?: string;
  icon?: string;
  color?: string;
  show?: number;
  description?: string;
};

class Poi extends MapItem {
  public readonly ItemType = 'poi';
  public readonly Collection = 'poi';

  public Size: string;
  public Description: string;
  public PoiType: string;

  public History: ItemHistory[];
  public Crew: Crew[];
  public Cargo: Cargo[];

  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  public Subitems: Poi[];

  constructor(data?: PoiData) {
    super(data);
    this.Size = data?.size || '';
    this.Description = data?.description || '';
    this.PoiType = data?.poitype || '';

    const sizeClass = poiSizeClasses.find((s) => s.id === this.Size);
    this.Icon.show = sizeClass?.show || 1;

    this.Crew = data && data.crew ? data.crew.map((c) => new Crew(c)) : [];
    this.Cargo = data && data.cargo ? data.cargo.map((c) => new Cargo(c)) : [];

    if (!this.Icon.size) this.Icon.size = 24;
    if (!this.Icon.show) this.Icon.show = 1;

    if (data?.icon) this.Icon.icon = data.icon || 'mdi-rhombus-outline';
    if (data?.show) this.Icon.show = data.show || 1;
    this.Icon.color = data?.color || 'green';

    if (data?.subitems) {
      this.Subitems = data.subitems.map((s) => Poi.GenerateSubitem(this, s) as Poi);
    }
  }

  public get Title(): string {
    return this.Name;
  }

  public get Subtitle(): string {
    return `${this.Owner} ${this.PoiType}`;
  }

  public get SizeValue(): number {
    return poiSizeClasses.find((s) => s.id === this.Size)?.value || 1;
  }

  public static GenerateSubitem(parent: Poi, data: SubitemPoiData): Poi {
    const subitemData: PoiData = {
      id: data.id,
      name: data.name,
      faction: parent.Faction,
      owner: parent.Owner,
      size: data.size || 'tiny',
      icon: data.icon || 'mdi-rhombus-outline',
      map: parent.Location.map,
      lat: parent.Location.coords[0] + data.offset[0],
      lon: parent.Location.coords[1] + data.offset[1],
      color: data.color || 'yellow',
      show: data.show || (parent.Icon.show || 7) + 1,
      poitype: data.poitype,
      description: data.description || '',
    };

    return new Poi(subitemData);
  }
}

export { Poi, PoiData, poiSizeClasses };
