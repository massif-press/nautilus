import { MapItem } from './maps/mapitem';
import { useDataStore } from '../stores/dataStore';

type AuthorData = {
  type: 'user';
  id: string;
  username: string;
  show_discord?: boolean;
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
    this.Name = data.username;
    if (data.show_discord) this.Discord = data.discord || '';
    this.CreatedAt = data.created_at ? new Date(data.created_at) : new Date();
    this.LastUpdate = data.last_update ? new Date(data.last_update) : new Date();
  }

  public get MapItems(): MapItem[] {
    return useDataStore()
      .getMapItemsByAuthor(this.ID)
      .filter((x) => x.isPublicVisible);
  }

  public get CompendiumItems(): any[] {
    return useDataStore()
      .getItemsByAuthor(this.ID)
      .filter((x) => x.isPublicVisible);
  }
}

export { Author, AuthorData };
