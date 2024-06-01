import _ from 'lodash';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { iconData, locationData } from '../dataTypes';
import { Submap, SubmapData } from '../submap';
import { Tag } from '../tag';

type MapItemData = {
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
  submap?: SubmapData;
};

abstract class MapItem {
  public readonly ID: string;
  public Name: string;
  public Faction: string;
  public Owner: string;
  public Icon: iconData;
  public Location: locationData;
  protected _tags: Tag[];
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  public Submap?: Submap;

  constructor(data?: MapItemData) {
    this.ID = data?.id || _.uniqueId();
    this.Name = data?.name || '';
    this.Faction = data?.faction || '';
    this.Owner = data?.owner || '';

    this.Status = 'Approved';

    this.Icon = { icon: '', color: data?.color || 'blue' };

    this.Location = {
      map: data?.map || 'unknown',
      coords: [data?.lat || 0, data?.lon || 0],
    };

    const tags = data?.tags?.split(', ') || [];

    this._tags = tags.length
      ? useCompendiumStore().tags.filter((tag) => tags.includes(tag.ID))
      : [];

    if (data?.submap) this.Submap = new Submap(data.submap, this.Location.coords);
  }
}

export { MapItem, MapItemData };
