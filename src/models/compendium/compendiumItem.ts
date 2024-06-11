import { EditableItem, EditableItemData } from '../editableItem';

type CompendiumItemData = EditableItemData & {};

abstract class CompendiumItem extends EditableItem {
  public readonly Collection = 'compendium';

  constructor(data?: any) {
    super(data);
  }
}

export { CompendiumItem, CompendiumItemData };
