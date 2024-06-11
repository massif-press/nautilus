import { CompendiumItem, CompendiumItemData } from './compendiumItem';

type TagData = CompendiumItemData & {
  name: string;
  description: string;
  appliesTo: string;
  implemented: boolean;
  implementation_detail?: string;
};

class Tag extends CompendiumItem {
  public readonly ItemType = 'tag';

  public readonly ID: string;
  public Name: string;
  public Description: string;
  public AppliesTo: string[];
  public Implemented: boolean;
  public ImplementationDetails: string;

  constructor(data?: TagData) {
    super(data);
    this.Name = data?.name || '';
    this.Description = data?.description || '';
    this.AppliesTo = data?.appliesTo ? data.appliesTo.split(', ') : [];
    this.Implemented = data?.implemented || false;
    this.ImplementationDetails = data?.implementation_detail || '';
  }
}

export { Tag, TagData };
