import { v4 as uid } from 'uuid';
import _ from 'lodash';
import { useDataStore } from '../stores/dataStore';
import { Author } from './author';
import { useUserStore } from '../stores/userStore';

type EditableItemData = {
  id: string;
  imgsrc?: string;
  author: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  status:
    | 'Submitted'
    | 'Approved'
    | 'Rejected'
    | 'Changes Requested'
    | 'Unpublished'
    | 'Flagged for Deletion';
  modComment?: string;
  modId?: string;
  modTouch?: number;
};

abstract class EditableItem {
  public ID: string;
  public ItemType: string;
  public ImageSrc: string;

  public CreatedAt: Date;
  public UpdatedAt: Date;
  public DeletedAt?: Date | null;
  public Status:
    | 'Submitted'
    | 'Approved'
    | 'Rejected'
    | 'Changes Requested'
    | 'Unpublished'
    | 'Flagged for Deletion';
  public LastModId: string;
  public LastModTouch: Date | null;
  public ModComment: string;
  public IsUserOwned: boolean;

  private _authorId = '';

  constructor(data?: EditableItemData) {
    this.ID = data?.id || uid();
    if (!data) {
      this._authorId = useUserStore().user_id;
    } else this._authorId = data?.author || 'system';
    this.IsUserOwned = this._authorId === useUserStore().user_id;

    this.ImageSrc = data?.imgsrc || '';

    this.CreatedAt = new Date(data?.created_at || Date.now());
    this.UpdatedAt = new Date(data?.updated_at || Date.now());
    this.DeletedAt = data && data.deleted_at ? new Date(data?.deleted_at) : null;

    this.Status = data?.status || 'Unpublished';
    this.ModComment = data?.modComment || '';
    this.LastModId = data?.modId || '';
    this.LastModTouch = data?.modTouch ? new Date(data?.modTouch) : null;
  }

  public get Author(): Author {
    return useDataStore().author(this._authorId);
  }

  public get Reviewer(): string {
    const rev = useDataStore().author(this.LastModId);
    if (rev) return rev.Name;
    return '';
  }

  public set Author(author: Author) {
    this._authorId = author.ID;
  }

  public get isUserOwned(): boolean {
    return this._authorId === useUserStore().user_id;
  }

  public get isPublicVisible(): boolean {
    return (
      this.Status === 'Approved' ||
      this.Status === 'Submitted' ||
      this.Status === 'Unpublished' ||
      this.Status === 'Flagged for Deletion'
    );
  }

  public Delete(): void {
    this.DeletedAt = new Date();
    this.Status = 'Flagged for Deletion';
  }

  public get DeleteTime(): Date | null {
    if (!this.DeletedAt) return null;

    return new Date(this.DeletedAt.valueOf() + 1000 * 60 * 60 * 24);
  }

  public Save(): EditableItemData {
    const out = {
      id: this.ID,
      author: this._authorId,
      created_at: this.CreatedAt.getTime(),
      updated_at: new Date().getTime(),
      deleted_at: 0,
      status: this.Status,
      modComment: this.ModComment,
      modId: this.LastModId,
      imgsrc: this.ImageSrc,
    };
    if (this.LastModTouch) {
      (out as any).modTouch = this.LastModTouch.getTime();
    }
    if (this.DeletedAt) {
      (out as any).deleted_at = this.DeletedAt.getTime();
    }

    return out as EditableItemData;
  }
}

export { EditableItem, EditableItemData };
