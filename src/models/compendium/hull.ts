import { useDataStore } from '../../stores/dataStore';
import { Submap, SubmapData } from '../maps/submap';
import { CompendiumItem, CompendiumItemData } from './compendiumItem';
import { Tag } from './tag';

const sizes = [
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

type HullData = CompendiumItemData & {
  type: 'hull';
  name: string;
  code: string;
  size: string;
  shipwright: string;
  class: string;
  description?: string;
  tags?: string;
  submaps?: SubmapData[];
};

class Hull extends CompendiumItem {
  public readonly ItemType = 'hull';

  public Name: string;
  public Code: string;
  public Shipwright: string;
  public Size: { id: string; name: string; code: string; show: number; value: number };
  public Class: string;
  public Description: string;
  public Tags: Tag[];

  public Submaps: Submap[];

  constructor(data?: HullData) {
    super(data);
    this.Name = data?.name || 'New Hull';
    this.Code = data?.code || '';
    this.Shipwright = data?.shipwright || '';
    this.Size = sizes.find((s) => s.id === data?.size) || sizes[0];
    this.Class = data?.class || '';
    this.Description = data?.description || '';

    const tags = data?.tags?.split(', ') || [];

    this.Tags = tags.length
      ? (useDataStore().tags.filter((tag) => tags.includes(tag.ID)) as Tag[])
      : ([] as Tag[]);

    if (data?.submaps) this.Submaps = data.submaps.map((s) => new Submap(s, [0, 0]));
    else this.Submaps = [];
  }

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.Code && !!this.Shipwright && !!this.Class;
  }

  public get PreventDelete(): boolean {
    return useDataStore().ships.some((s) => s.Hull && s.Hull.ID === this.ID);
  }

  public Save(): HullData {
    return {
      ...super.Save(),
      type: this.ItemType,
      name: this.Name,
      code: this.Code,
      shipwright: this.Shipwright,
      size: this.Size.id,
      class: this.Class,
      description: this.Description,
      tags: this.Tags.map((t) => t.ID).join(', '),
      submaps: this.Submaps.map((s) => s.Save()),
    };
  }
}

export { Hull, HullData, sizes as HullSizes };
