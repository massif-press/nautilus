import { CompendiumItem, CompendiumItemData } from './compendiumItem';

type TagData = CompendiumItemData & {
  type: 'tag';
  name: string;
  description: string;
  notes?: string;
  appliesTo: string;
  implemented: boolean;
  implementation_detail?: string;
  enables?: string;
};

class Tag extends CompendiumItem {
  public readonly ItemType = 'tag';

  public Name: string;
  public Description: string;
  public AppliesTo: string[];
  public Enables?: string;
  public Notes?: string;
  public Implemented: boolean;
  public ImplementationDetails: string;

  constructor(data?: TagData) {
    super(data);
    this.Name = data?.name || '';
    this.Description = data?.description || '';
    this.AppliesTo = data?.appliesTo ? data.appliesTo.split(', ') : [];
    this.Implemented = data?.implemented || false;
    this.ImplementationDetails = data?.implementation_detail || '';

    this.Enables = data?.enables || '';
    this.Notes = data?.notes || '';
  }

  public get IsSaveReady(): boolean {
    return !!this.Name && !!this.Description && !!this.AppliesTo;
  }

  public Save(): TagData {
    return {
      ...super.Save(),
      type: this.ItemType,
      name: this.Name,
      description: this.Description,
      appliesTo: this.AppliesTo.join(', '),
      implemented: this.Implemented,
      enables: this.Enables,
      implementation_detail: this.ImplementationDetails,
    };
  }
}

export { Tag, TagData };
