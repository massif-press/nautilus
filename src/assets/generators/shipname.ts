import _ from 'lodash';

import mechnames from './data/mechnames.txt?raw';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

class ShipNameGenerator {
  public static generate(faction: string): string {
    switch (faction.toLowerCase()) {
      case 'union':
        return this.unionName();
      case 'ipsn':
        return this.ipsnName();
      default:
        return this.randomName();
    }
  }

  private static unionName(): string {
    return 'nyi';
  }

  private static ipsnName(): string {
    return 'nyi';
  }

  private static randomName(): string {
    return 'nyi';
  }

  public static droneName(typekey?: string): string {
    return `DN-${typekey || 'UTIL'}:${_.sample(alphabet).toUpperCase()}${
      Math.floor(Math.random() * 1000) + 1
    }`;
  }

  public static fighterName(
    faction: string,
    options?: { mothership?: string; index?: number }
  ): string {
    switch (faction.toLowerCase()) {
      case 'union':
        return `${_.sample(alphabet).toUpperCase()}-${options?.index || 1}`;
      case 'ipsn':
        return `${options?.mothership || 'FREE'}-${options?.index || 1}`;
      default:
        return 'nyi';
    }
  }

  public static mechName(): string {
    return _.sample((mechnames as unknown as string).split('\n'));
  }

  public static utilityName(): string {
    return 'nyi';
  }
}
