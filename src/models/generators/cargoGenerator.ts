import _ from 'lodash';
import { Ship } from '../../models/maps/ship';
import { Cargo } from '../../models/compendium/cargo';
import { useDataStore } from '../../stores/dataStore';

const sizeMap = {
  platform: {
    slots: 12,
    capacity: [100000, 1000000],
  },
  massive: {
    slots: 6,
    capacity: [10000, 100000],
  },
  large: {
    slots: 4,
    capacity: [1000, 10000],
  },
  medium: {
    slots: 2,
    capacity: [100, 1000],
  },
  small: {
    slots: 1,
    capacity: [10, 100],
  },
  tiny: {
    slots: 0,
    capacity: 0,
  },
};

const getCargoItems = (type: string, size: string): { item: Cargo; quantity: string }[] => {
  let out = [] as { item: Cargo; quantity: string }[];

  let slots = _.random(1, sizeMap[size].slots);
  const cargo = useDataStore().cargo.filter((c) => c.CargoType === type);

  for (let i = 0; i < slots; i++) {
    out.push({
      item: _.sample(cargo),
      quantity: `${_.random(
        sizeMap[size].capacity[0],
        sizeMap[size].capacity[1]
      ).toString()} Units`,
    });
  }
  return out;
};

const generateCargoManifest = (ship: Ship): { item: Cargo; quantity: string }[] => {
  let out = [] as { item: Cargo; quantity: string }[];
  if (!ship.Hull || !ship.Tags.length || ship.Hull.Size.id === 'tiny') return out;
  ship.Tags.forEach((tag) => {
    switch (tag.ID) {
      case 'tag-bulkcargo':
        out = out.concat(getCargoItems('Bulk', ship.Hull.Size.id));
        break;
      case 'tag-containercargo':
        out = out.concat(getCargoItems('Containerized', ship.Hull.Size.id));
        break;
      case 'tag-breakcargo':
        out = out.concat(getCargoItems('Break Bulk', ship.Hull.Size.id));
        break;
      case 'tag-volatilecargo':
        out = out.concat(getCargoItems('Volatile', ship.Hull.Size.id));
        break;
      case 'tag-passenger':
        out = out.concat(getCargoItems('Passenger', ship.Hull.Size.id));
        break;
      case 'tag-heavylift':
        out = out.concat(getCargoItems('Heavy Lift', ship.Hull.Size.id));
        break;
    }
  });
  return out;
};

export { generateCargoManifest };
