import _ from 'lodash';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { iconData, locationData } from '../dataTypes';
import { Submap, SubmapData } from './submap';
import { Tag } from '../compendium/tag';
import { Author } from '../author';
import { EditableItem, EditableItemData } from '../editableItem';
import { Crew } from './crew';
import { useMapStore } from '../../stores/mapStore';

type MapItemData = EditableItemData & {
  id: string;
  name: string;
  faction: string;
  owner: string;
  map: string;
  lat: number;
  lon: number;
  icon?: string;
  color?: string;
  tags?: string;

  submaps?: SubmapData[];
  crew_ids?: string[];
};

abstract class MapItem extends EditableItem {
  public readonly Collection = 'map';

  public Name: string;
  public Faction: string;
  public Owner: string;
  public Icon: iconData;
  public Location: locationData;
  protected _tags: Tag[];

  public Submaps: Submap[];

  constructor(data?: MapItemData) {
    super(data);
    this.Name = data?.name || '';
    this.Faction = data?.faction || '';
    this.Owner = data?.owner || '';

    this.Icon = { icon: '', color: data?.color || 'blue' };

    this.Location = {
      map: data?.map || 'unknown',
      coords: [data?.lat || 0, data?.lon || 0],
    };

    const tags = data?.tags?.split(', ') || [];

    this._tags = tags.length
      ? (useCompendiumStore().tags.filter((tag) => tags.includes(tag.ID)) as Tag[])
      : [];

    if (data?.submaps) this.Submaps = data.submaps.map((s) => new Submap(s, this));
    else this.Submaps = [];
  }

  public get ItemTags(): Tag[] {
    return this._tags;
  }

  public set ItemTags(tags: Tag[]) {
    this._tags = tags;
  }

  public get Crew(): Crew[] {
    return useMapStore().crew.filter((c) => c.Assignment && c.Assignment.ID === this.ID);
  }
}

export { MapItem, MapItemData };
