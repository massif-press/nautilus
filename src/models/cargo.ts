type cargoData = {
  name: string;
  description: string;
  quantity: number;
  value: number;
};

class Cargo {
  public readonly Name: string;
  public Description: string;
  public Quantity: number;
  public Value: number;

  constructor(data: cargoData) {
    this.Name = data.name;
    this.Description = data.description;
    this.Quantity = data.quantity;
    this.Value = data.value;
  }
}

export { Cargo, cargoData };
