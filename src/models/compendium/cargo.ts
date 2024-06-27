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
    title: 'Passenger',
    description:
      'Non-crew passengers that require hab modules, cryogenic facilities, or other special accommodations.',
  },
  {
    title: 'Heavy Lift',
    description:
      'Individual, non-standardized items that are too large or heavy to be loaded by normal means.',
  },
];

type CargoData = CompendiumItemData & {
  type: 'cargo';
  name: string;
  description: string;
  cargo_type: string;
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

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.Description && !!this.CargoType;
  }

  public Save(): CargoData {
    return {
      ...super.Save(),
      type: this.ItemType,
      name: this.Name,
      description: this.Description,
      cargo_type: this.CargoType,
    };
  }
}

export { Cargo, CargoData, CargoTypes };
