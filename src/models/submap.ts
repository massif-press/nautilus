type SubmapData = {
  img: string;
  show: number;
  size: number;
};

class Submap {
  public Img: string;
  public Show: number;
  public Center: number[];
  public Size: number;

  constructor(params: SubmapData, center: number[] = [0, 0]) {
    this.Img = params.img;
    this.Show = params.show;
    this.Center = center;
    this.Size = params.size;
  }

  get Bounds(): number[][] {
    return [
      [this.Center[0] - this.Size, this.Center[1] - this.Size],
      [this.Center[0] + this.Size, this.Center[1] + this.Size],
    ];
  }
}

export { Submap, SubmapData };
