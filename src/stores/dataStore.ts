import { defineStore } from 'pinia';
import { Hull, HullData } from '../models/compendium/hull';
import { Cargo, CargoData } from '../models/compendium/cargo';
import { Tag, TagData } from '../models/compendium/tag';
import { Author, AuthorData } from '../models/author';
import { EditableItem, EditableItemData } from '../models/editableItem';
import { Ship, ShipData } from '../models/maps/ship';
import { Poi, PoiData } from '../models/maps/poi';
import { SystemMap, MapData } from '../models/maps/systemMap';
import { Crew, CrewData } from '../models/maps/crew';

import { GetAll, MergeItem, RemoveItem, SetItem } from '../storage';

//test import data
import testData from '../assets/test_data/data.json';

import { Deployable } from '../models/compendium/deployable';
import { loadS3Data } from '../s3';

export const useDataStore = defineStore('data', {
  state: () => ({
    last_update: 0,
    local_update: 0,
    expires: 0,
    hulls: [] as Array<Hull>,
    tags: [] as Array<Tag>,
    submaps: [] as Array<any>,
    authors: [] as Array<Author>,
    cargo: [] as Array<Cargo>,
    deployables: [] as Array<Deployable>,
    map: null as any,
    maps: [] as any[],
    ships: [] as any[],
    pois: [] as any[],
    crew: [] as any[],
    loaded: false,
  }),
  getters: {
    items: (state) => {
      return (state.hulls as any[])
        .concat(state.tags as any[])
        .concat(state.cargo as any[])
        .concat(state.ships)
        .concat(state.pois) as EditableItem[];
    },
    itemById: (state) => (id: string) => {
      return state.submaps.find((item) => item.ID === id);
    },
    hull: (state) => (id: string) => {
      return state.hulls.find((hull) => hull.ID === id);
    },
    tag: (state) => (id: string) => {
      return state.tags.find((tag) => tag.ID === id);
    },
    author:
      (state) =>
      (id: string): Author => {
        const a = state.authors.find((author) => author.ID === id);
        if (a) return a as Author;
        return new Author({
          id: 'unknown',
          name: 'Unknown User',
          discord: '',
          created_at: Date.now(),
          last_update: Date.now(),
        });
      },
    getItemsByAuthor: (state) => (author_id: string) => {
      let out = (state.hulls as any[])
        .concat(state.tags as any[])
        .concat(state.cargo as any[]) as EditableItem[];

      return out.filter((item) => item.Author.ID === author_id);
    },
    getCargoById: (state) => (id: string) => {
      return state.cargo.find((c) => c.ID === id);
    },
    getHullById: (state) => (id: string) => {
      return state.hulls.find((hull) => hull.ID === id);
    },
    getTagById: (state) => (id: string) => {
      return state.tags.find((tag) => tag.ID === id);
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
    getDeployableById: (state) => (id: string) => {
      return state.deployables.find((d) => d.ID === id);
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
    async load() {
      const expires = localStorage.getItem('nautilus_data_expiry') || 0;
      const localLastUpdate = localStorage.getItem('nautilus_data_last_update') || 0;

      let remoteLoad = Date.now() > Number(expires);
      if (remoteLoad) {
        console.log('Remote data expired', (Date.now() - Number(expires)) / 1000 / 60, 'minutes');
        if (localLastUpdate) {
          remoteLoad = (Date.now() - Number(localLastUpdate)) / 1000 / 60 > 5;
          if (remoteLoad)
            console.log(
              'Local refresh limit expired',
              (Date.now() - Number(localLastUpdate)) / 1000 / 60,
              'minutes'
            );
        }
      }

      if (remoteLoad) {
        console.log('Loading remote data...');

        const remoteData = await loadS3Data();
        remoteData.data.forEach((item) => {
          MergeItem(item as any);
        });

        this.last_update = remoteData.last_update;
        this.local_update = Date.now();
        this.expires = remoteData.expires;

        localStorage.setItem('nautilus_data_expiry', this.expires.toString());
        localStorage.setItem('nautilus_data_last_update', this.local_update.toString());
      }

      console.log('Building compendium...');
      const data = await GetAll();

      this.tags = data.filter((item) => item.type === 'tag').map((tag) => new Tag(tag as TagData));
      this.hulls = data
        .filter((item) => item.type === 'hull')
        .map((hull) => new Hull(hull as HullData));
      this.submaps = data.filter((item) => item.type === 'submap');
      this.cargo = data
        .filter((item) => item.type === 'cargo')
        .map((c) => new Cargo(c as CargoData));
      this.deployables = data
        .filter((item) => item.type === 'deployable')
        .map((d) => new Deployable(d)) as Deployable[];

      this.maps = data
        .filter((item) => item.type === 'map')
        .map((m) => new SystemMap(m as MapData));
      this.pois = data.filter((item) => item.type === 'poi').map((p) => new Poi(p as PoiData));
      this.ships = data.filter((item) => item.type === 'ship').map((s) => new Ship(s as ShipData));

      this.crew = data.filter((item) => item.type === 'crew').map((c) => new Crew(c as CrewData));

      this.authors = data
        .filter((item) => item.type === 'author')
        .map((author) => new Author(author as AuthorData));

      this.loaded = true;
    },
    setMap(map) {
      this.map = map;
    },
    setMapFromId(id) {
      this.map = this.maps.find((m) => m.ID === id);
    },
    saveItem(item: EditableItem) {
      const saveData = item.Save();

      SetItem(saveData);
      if (!this.items.find((i) => i.ID === item.ID)) {
        switch (item.ItemType) {
          case 'hull':
            this.hull.push(item);
            break;
          case 'cargo':
            this.cargo.push(item);
            break;
          case 'tag':
            this.tags.push(item);
            break;
          case 'ship':
            this.ships.push(item);
            break;
          case 'poi':
            this.pois.push(item);
            break;
          case 'crew':
            this.crew.push(item);
            break;
          case 'deployable':
            this.deployables.push(item);
            break;
          default:
            break;
        }
      }
    },
    deleteItem(item: EditableItem) {
      RemoveItem(item.ID);

      switch (item.ItemType) {
        case 'hull':
          this.hulls = this.hulls.filter((h) => h.ID !== item.ID);
          break;
        case 'cargo':
          this.cargo = this.cargo.filter((c) => c.ID !== item.ID);
          break;
        case 'tag':
          this.tags = this.tags.filter((t) => t.ID !== item.ID);
          break;
        case 'ship':
          this.ships = this.ships.filter((s) => s.ID !== item.ID);
          break;
        case 'poi':
          this.pois = this.pois.filter((p) => p.ID !== item.ID);
          break;
        case 'crew':
          this.crew = this.crew.filter((c) => c.ID !== item.ID);
          break;
        case 'deployable':
          this.deployables = this.deployables.filter((d) => d.ID !== item.ID);
          break;
        default:
          break;
      }
    },
    async exportAll() {
      const data = await GetAll();
      return JSON.stringify(data, null, 2);
    },
    async importAll(data: any[]) {
      data.forEach((item) => SetItem(item));
      this.load();
    },
  },
});
