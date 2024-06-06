type crewData = {
  name: string;
  role: string;
  description: string;
  author?: string;
};

class Crew {
  public readonly Name: string;
  public Role: string;
  public Description: string;

  constructor(data: crewData) {
    this.Name = data.name;
    this.Role = data.role;
    this.Description = data.description;
  }
}

export { Crew, crewData };
