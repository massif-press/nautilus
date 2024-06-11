import { defineStore } from 'pinia';
import { Ship, ShipData } from '../models/maps/ship';
import { Poi, PoiData } from '../models/maps/poi';
import crew from '../assets/test_data/crew.json';
import pois from '../assets/test_data/pois.json';
import ships from '../assets/test_data/ships.json';
import maps from '../assets/test_data/maps.json';
import { SystemMap, MapData } from '../models/maps/systemMap';
import { Crew, CrewData } from '../models/maps/crew';

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null as any,
    maps: [] as any[],
    ships: [] as any[],
    pois: [] as any[],
    crew: [] as any[],
  }),
  getters: {
    items: (state) => {
      return [...state.ships, ...state.pois];
    },
    getItemById: (state) => (id: string) => {
      return state.ships.find((ship) => ship.ID === id) || state.pois.find((poi) => poi.ID === id);
    },
    getShipById: (state) => (id: string) => {
      return state.ships.find((ship) => ship.ID === id);
    },
    getPoiById: (state) => (id: string) => {
      return state.pois.find((poi) => poi.ID === id);
    },
    getMapById: (state) => (id: string) => {
      return state.maps.find((map) => map.ID === id);
    },
    getCrewById: (state) => (id: string) => {
      return state.crew.find((crew) => crew.ID === id);
    },
    getSubmaps: (state) => (map_id: string) => {
      return [...state.ships, ...state.pois]
        .filter((item) => item.Location.map === map_id)
        .filter((item) => !!item.Submap)
        .map((item) => item.Submap);
    },
    getMapItemsByAuthor: (state) => (author_id: string) => {
      return [...state.ships, ...state.pois].filter((item) => item.Author.ID === author_id);
    },
    getTerrainByMap: (state) => (map_id: string) => {
      return state.maps.find((map) => map.ID === map_id)?.Terrain || [];
    },
    terrain: (state) => {
      return state.maps.flatMap((m) => m.Terrain);
    },
  },
  actions: {
    setMap(map) {
      this.map = map;
    },
    setMapFromId(id) {
      this.map = this.maps.find((m) => m.ID === id);
    },
    load() {
      // temporary testing data
      this.maps = maps.map((m) => new SystemMap(m as MapData));
      this.pois = pois.map((p) => new Poi(p as PoiData));
      this.ships = ships.map((s) => new Ship(s as ShipData));

      this.crew = crew.map((c) => new Crew(c as CrewData));
    },
  },
});
