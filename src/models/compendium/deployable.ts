import { Ship } from '../maps/ship';
import { CompendiumItem, CompendiumItemData } from './compendiumItem';

const DeployableTypes = [
  {
    title: 'Fighter',
    description: 'Small, fast, and maneuverable manned spacecraft designed for combat operations.',
    complements: ['Single Unit', 'Squadron', 'Wing'],
  },
  {
    title: 'Drone',
    description: 'Unmanned spacecraft that can be controlled remotely or operate autonomously.',
    complements: ['Single Unit', 'Swarm', 'Hive'],
  },
  {
    title: 'Tender',
    description: 'Small spacecraft used to transport personnel and cargo between ships.',
    complements: ['Single Unit', 'Group', 'Flight'],
  },
  {
    title: 'Other',
    description: 'Any other type of small spacecraft that does not fit into the above categories.',
    complements: ['Single Unit', 'Group', 'Flight'],
  },
];

type DeployableData = CompendiumItemData & {
  type: 'deployable';
  deployable_type: string;
  name: string;
  description: string;
  deploy_keywords: string[];
  recall_keywords: string[];
  icon: string;
  color: string;
};

class Deployable extends CompendiumItem {
  public readonly ItemType = 'deployable';
  public Name: string;
  public Description: string;
  public DeployableType: string;
  public DeployKeywords: string[];
  public RecallKeywords: string[];
  public Icon: string;
  public Color: string;

  constructor(data?: DeployableData) {
    super(data);
    this.Name = data?.name || 'New Deployable';
    this.Description = data?.description || '';
    this.DeployableType = data?.deployable_type || '';
    this.Icon = data?.icon || 'mdi-quadcopter';
    this.Color = data?.color || 'blue';
    this.DeployKeywords = data?.deploy_keywords || [];
    this.RecallKeywords = data?.recall_keywords || [];
  }

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.Description && !!this.DeployableType;
  }

  public CanDeploy(parent: Ship): boolean {
    const mString = parent.Mission?.Status.toLowerCase() + parent.Mission?.Mission.toLowerCase();
    return (
      this.DeployKeywords.some((k) => mString.includes(k)) &&
      !this.RecallKeywords.some((k) => mString.includes(k))
    );
  }

  public Save(): DeployableData {
    return {
      ...super.Save(),
      type: this.ItemType,
      name: this.Name,
      description: this.Description,
      deploy_keywords: this.DeployKeywords.filter((k) => k.length > 0),
      recall_keywords: this.RecallKeywords.filter((k) => k.length > 0),
      deployable_type: this.DeployableType,
      icon: this.Icon,
      color: this.Color,
    };
  }
}

export { Deployable, DeployableData, DeployableTypes };
