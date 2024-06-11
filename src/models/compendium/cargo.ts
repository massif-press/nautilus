import { CompendiumItem, CompendiumItemData } from './compendiumItem';

const CargoTypes = [
  {
    title: 'Bulk',
    description:
      'Commodities that are shipped in large quantities, generally liquids and granular solids.',
  },
  {
    title: 'Containerized',
    description:
      'Goods that are shipped in standardized containers, generally requiring special handling.',
  },
  {
    title: 'Break Bulk',
    description: 'Goods that are shipped in smaller quantities, not in standardized containers.',
  },
  {
    title: 'Volatile',
    description: 'Dangerous and sensitive materials that require special handling.',
  },
  {
    title: 'Oversized',
    description:
      'Goods that are larger than standard shipping containers, requiring special facilities.',
  },
  {
    title: 'Passenger',
    description:
      'Non-crew persons, requiring hab modules, cryogenic facilities, or other special accommodations.',
  },
  {
    title: 'Heavy Lift',
    description:
      'Individual, non-standardized items that are too large or heavy to be loaded by normal means.',
  },
  {
    title: 'Other',
    description: 'Goods that do not fit into any other category.',
  },
];

type CargoData = CompendiumItemData & {
  name: string;
  description: string;
  cargo_type: string;
  author: string;
};

class Cargo extends CompendiumItem {
  public readonly ItemType = 'cargo';
  public Name: string;
  public Description: string;
  public CargoType: string;

  constructor(data?: CargoData) {
    super(data);
    this.Name = data?.name || 'New Cargo Item';
    this.Description = data?.description || '';
    this.CargoType = data?.cargo_type || '';
  }
}

export { Cargo, CargoData, CargoTypes };
