import { defineStore } from 'pinia';
import { Ship, ShipData } from '../models/ships/ship';
import { Poi, PoiData } from '../models/poi';
import crew from '../assets/test_data/crew.json';
import cargo from '../assets/test_data/cargo.json';
import pois from '../assets/test_data/pois.json';
import ships from '../assets/test_data/ships.json';
import maps from '../assets/test_data/maps.json';
import { SystemMap, MapData } from '../models/maps/systemMap';

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
    getSubmaps: (state) => (map_id: string) => {
      console.log(map_id);
      console.log([...state.ships, ...state.pois].filter((item) => item.Location.map === map_id));
      return [...state.ships, ...state.pois]
        .filter((item) => item.Location.map === map_id)
        .filter((item) => !!item.Submap)
        .map((item) => item.Submap);
    },
  },
  actions: {
    setMap(map) {
      this.map = map;
    },
    load() {
      // temporary testing data
      this.maps = maps.map((m) => new SystemMap(m as MapData));
      this.pois = pois.map((p) => new Poi(p as PoiData));
      this.ships = ships.map((s) => new Ship(s as ShipData));

      this.crew = crew;
      this.cargo = cargo;
    },
  },
});
