type TagData = {
  id: string;
  name: string;
  description: string;
  appliesTo: string;
};

class Tag {
  public readonly ItemType = 'tag';

  public readonly ID: string;
  public Name: string;
  public Description: string;
  public AppliesTo: string[];
  public Effect: string;

  constructor(data: TagData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description || '';
    this.AppliesTo = data.appliesTo ? data.appliesTo.split(', ') : [];
  }
}

export { Tag, TagData };
