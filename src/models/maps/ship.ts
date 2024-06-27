import _ from 'lodash';
import { iconData, locationData } from '../dataTypes';
import { missionData, Mission } from '../mission';
import { useDataStore } from '../../stores/dataStore';
import { Tag } from '../compendium/tag';
import { MapItem, MapItemData } from './mapitem';
import { Hull } from '../compendium/hull';
import { Cargo } from '../compendium/cargo';
import { generateCargoManifest } from '../generators/cargoGenerator';
import { Deployable } from '../compendium/deployable';
import { Subitem, SubitemData } from './submap';

type ShipData = MapItemData & {
  type: 'ship';
  prefix: string;
  map: string;
  lat: number;
  lon: number;
  mission_status?: string;
  mission?: string;
  destination?: string;

  homeport: string;
  hull: string;
  description: string;

  details?: { title: string; body: string }[];

  deployables?: { item: string; name: string; complement: string; status: string }[];
};

class Ship extends MapItem {
  public readonly ItemType = 'ship';

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
  public Mission: Mission;
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';

  public Subitems: Subitem[];

  public CargoManifest: { item: Cargo; quantity: string }[] = [];
  public Deployables: { item: Deployable; name: string; complement: string; status: string }[] = [];

  constructor(data?: ShipData) {
    super(data);
    this.Name = data?.name || 'New Ship';
    this.Prefix = data?.prefix || '';
    this.Description = data?.description || '';
    this.HomePort = data?.homeport || '';

    if (data) {
      const hull = useDataStore().hull(data.hull);
      if (!hull) {
        throw new Error(`Hull ${data.hull} not found in compendium`);
      }
      this.Hull = hull as Hull;

      if (this.Hull.Submaps) {
        this.Submaps = [...this.Hull.Submaps];
        this.Submaps.forEach((s) => s.SetCenter(this.Location.coords));
      }
    }

    this.Icon.icon = data?.icon || 'cc:ship';
    this.Icon.show = this.Hull?.Size.show || 1;
    if (!this.Icon.size) this.Icon.size = 24;

    this.Details = data?.details || [];

    this.Mission = new Mission({
      status: data?.mission_status || 'unknown',
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

    if (data?.deployables) {
      this.Deployables = data.deployables.map((d) => {
        const item = useDataStore().getDeployableById(d.item);
        if (!item) {
          throw new Error(`Deployable ${d.item} not found in compendium`);
        }
        return {
          item: item as Deployable,
          name: d.name,
          complement: d.complement,
          status: d.status,
        };
      });
    }

    if (this.Deployables.length > 0) this.deployUnits();

    this.CargoManifest = generateCargoManifest(this);
  }

  public get Title(): string {
    if (!this.Hull) return this.Name;
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
    if (!this.Hull) return this.ItemTags;
    return this.ItemTags.concat(this.Hull.Tags);
  }

  public get HasCargoCapacity() {
    return this.Tags.some((x) => x.Enables === 'cargo');
  }

  public get HasDeployableCapacity() {
    return this.Tags.some((x) => x.Enables === 'deployables');
  }

  public get IsLander() {
    return this.Tags.some((x) => x.ID === 'tag-lander');
  }

  public get IsSolidState() {
    return this.Tags.some((x) => x.ID === 'tag-solidstate');
  }

  public get Show() {
    return this.Hull.Size.show || 1;
  }

  public get Center(): number[] {
    return this.Location.coords;
  }

  public get IsSaveReady(): boolean {
    return (
      !!this.Hull.ID &&
      !!this.Location.map &&
      !!this.Faction &&
      !!this.Owner &&
      !!this.HomePort &&
      !!this.Prefix &&
      !!this.Name
    );
  }

  private getHeading(y1, x1, y2, x2) {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const angle = Math.atan2(deltaY, deltaX);
    return angle;
  }

  private deployUnits() {
    this.Deployables.forEach((d) => {
      if (d.item.CanDeploy(this)) {
        d.status = 'Deployed';
        Ship.GenerateSubitem(this, {
          id: `${this.ID}_${d.item.ID}`,
          name: `${d.item.Name} (${this.Title})`,
          type: d.item.DeployableType,
          offset: [_.random(-0.1, 0.1), _.random(-0.1, 0.1)],
          description: d.item.Description,
          icon: d.item.Icon,
          color: d.item.Color,
        });
      }
    });
  }

  public static GenerateSubitem(parent: Ship, data: any): Subitem {
    const subitemData: SubitemData = {
      id: data.id,
      name: data.name,
      poitype: data.type,
      icon: data.icon || 'mdi-triangle',
      color: data.color || 'blue',
      map: parent.Location.map,
      offset: data.offset,
    } as SubitemData;

    return new Subitem(parent, subitemData);
  }

  public Save(): ShipData {
    return {
      ...super.Save(),
      type: this.ItemType,
      prefix: this.Prefix,
      hull: this.Hull.ID,
      homeport: this.HomePort,
      description: this.Description,
      details: this.Details,
      mission_status: this.Mission.Status,
      mission: this.Mission.Mission,
      destination: this.Mission.Destination?.ID,
      deployables: this.Deployables.map((d) => {
        return { item: d.item.ID, name: d.name, complement: d.complement, status: d.status };
      }),
    };
  }
}

export { Ship, ShipData };
