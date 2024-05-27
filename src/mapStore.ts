import { defineStore } from 'pinia';
import { Ship, ShipData } from './models/ship';
import { Poi, PoiData } from './models/poi';
import crew from './assets/test_data/crew.json';
import cargo from './assets/test_data/cargo.json';
import pois from './assets/test_data/pois.json';
import ships from './assets/test_data/ships.json';
import maps from './assets/test_data/maps.json';

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null as any,
    maps: [] as any[],
    ships: [] as any[],
    pois: [] as any[],
    crew: [] as any[],
    cargo: [] as any[],
  }),
  getters: {
    getShipById: (state) => (id: string) => {
      return state.ships.find((ship) => ship.ID === id);
    },
    getPoiById: (state) => (id: string) => {
      return state.pois.find((poi) => poi.ID === id);
    },
    getMapById: (state) => (id: string) => {
      return state.maps.find((map) => map.ID === id);
    },
  },
  actions: {
    setMap(map) {
      this.map = map;
    },
    load() {
      // temporary testing data
      this.maps = maps;
      this.pois = pois.map((p) => new Poi(p as PoiData));
      this.ships = ships.map((s) => new Ship(s as ShipData));

      this.crew = crew;
      this.cargo = cargo;
    },
  },
});
