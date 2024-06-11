import { MapItem } from './maps/mapitem';
import { useMapStore } from '../stores/mapStore';
import { useCompendiumStore } from '../stores/compendiumStore';

type AuthorData = {
  id: string;
  name: string;
  discord?: string;
  created_at: number;
  last_update: number;
};

class Author {
  public readonly ID: string;
  public Name: string;
  public Discord: string;
  public CreatedAt: Date;
  public LastUpdate: Date;

  constructor(data: AuthorData) {
    this.ID = data.id;
    this.Name = data.name;
    this.Discord = data.discord || '';
    this.CreatedAt = data.created_at ? new Date(data.created_at) : new Date();
    this.LastUpdate = data.last_update ? new Date(data.last_update) : new Date();
  }

  public get MapItems(): MapItem[] {
    return useMapStore().getMapItemsByAuthor(this.ID);
  }

  public get CompendiumItems(): any[] {
    return useCompendiumStore().getItemsByAuthor(this.ID);
  }
}

export { Author, AuthorData };
