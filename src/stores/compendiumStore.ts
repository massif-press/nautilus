import { defineStore } from 'pinia';
import hulls from '../assets/compendium/hulls.json';
import submaps from '../assets/compendium/submaps.json';
import tags from '../assets/compendium/tags.json';
import authors from '../assets/test_data/authors.json';
import cargo from '../assets/test_data/cargo.json';
import { Hull, HullData } from '../models/compendium/hull';
import { Cargo, CargoData } from '../models/compendium/cargo';
import { Tag, TagData } from '../models/compendium/tag';
import { Author, AuthorData } from '../models/author';

export const useCompendiumStore = defineStore('compendium', {
  state: () => ({
    hulls: [] as Hull[],
    tags: [] as Tag[],
    submaps: [] as any[],
    authors: [] as Author[],
    cargo: [] as any[],
  }),
  getters: {
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
      let out: any[] = [];
      // let out = [...submaps].filter((item) => item.author === author_id) as any[];
      out = out.concat(
        [...state.hulls, ...state.tags].filter((item) => item.Author.ID === author_id)
      );
      return out;
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
  },
  actions: {
    load() {
      this.tags = tags.map((tag) => new Tag(tag as TagData));
      this.hulls = hulls.map((hull) => new Hull(hull as HullData));
      this.authors = authors.map((author) => new Author(author as AuthorData));
      this.submaps = submaps;
      this.cargo = cargo.map((c) => new Cargo(c as CargoData));
    },
  },
});
