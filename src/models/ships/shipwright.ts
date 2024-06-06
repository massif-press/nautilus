type ShipwrightData = {
  id: string;
  name: string;
  description: string;
  author?: string;
};

class Shipwright {
  public readonly ItemType = 'shipwright';

  public readonly ID: string;
  public Name: string;
  public Description: string;

  constructor(data: ShipwrightData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Description = data.description || '';
  }
}

export { Shipwright, ShipwrightData };
