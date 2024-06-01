import { defineStore } from 'pinia';
import hulls from '../assets/compendium/hulls.json';
import shipwrights from '../assets/compendium/shipwrights.json';
import tags from '../assets/compendium/tags.json';
import { Hull } from '../models/ships/hull';
import { Shipwright } from '../models/ships/shipwright';
import { Tag } from '../models/tag';

export const useCompendiumStore = defineStore('compendium', {
  state: () => ({
    hulls: [] as Hull[],
    shipwrights: [] as Shipwright[],
    tags: [] as Tag[],
  }),
  getters: {
    hull: (state) => (id: string) => {
      return state.hulls.find((hull) => hull.ID === id);
    },
    shipwright: (state) => (id: string) => {
      return state.shipwrights.find((shipwright) => shipwright.ID === id);
    },
    tag: (state) => (id: string) => {
      return state.tags.find((tag) => tag.ID === id);
    },
  },
  actions: {
    load() {
      this.tags = tags.map((tag) => new Tag(tag));
      this.shipwrights = shipwrights.map((shipwright) => new Shipwright(shipwright));
      this.hulls = hulls.map((hull) => new Hull(hull));
    },
  },
});
