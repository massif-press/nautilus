import _ from 'lodash';
import { MapItemData, MapItem } from './mapitem';
import { Tag } from '../compendium/tag';

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
  type: 'poi';
  size: string;
  show?: number;
  poitype: string;
  description: string;
  details?: { title: string; body: string }[];
};

class Poi extends MapItem {
  public readonly ItemType = 'poi';

  public Size: string;
  public Description: string;
  public PoiType: string;
  public Details: { title: string; body: string }[];

  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  constructor(data?: PoiData) {
    super(data);
    this.Size = data?.size || '';
    this.Description = data?.description || '';
    this.PoiType = data?.poitype || '';

    const sizeClass = poiSizeClasses.find((s) => s.id === this.Size);
    this.Icon.show = sizeClass?.show || 1;

    this.Details = data?.details || [];

    this.Icon.icon = data?.icon || 'mdi-rhombus-outline';
    this.Icon.show = data?.show || 1;
    this.Icon.size = data?.size || 24;
    this.Icon.color = data?.color || 'green';
  }

  public get Title(): string {
    return this.Name;
  }

  public get Tags(): Tag[] {
    return this.ItemTags;
  }

  public get Subtitle(): string {
    return `${this.Owner} ${this.PoiType}`;
  }

  public get SizeValue(): number {
    return poiSizeClasses.find((s) => s.id === this.Size)?.value || 1;
  }

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.PoiType && !!this.Location.map && !!this.Owner;
  }

  public get IsDownwell(): boolean {
    return this.Tags.some((t) => t.ID === 'tag-downwell');
  }

  public Save(): PoiData {
    return {
      ...super.Save(),
      type: this.ItemType,
      size: this.Size,
      poitype: this.PoiType,
      description: this.Description,
      details: this.Details,
    };
  }
}

export { Poi, PoiData, poiSizeClasses };
