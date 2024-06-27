import { v4 as uid } from 'uuid';
import _ from 'lodash';
import { useDataStore } from '../stores/dataStore';
import { Author } from './author';
import { useUserStore } from '../stores/userStore';

type CommentData = {
  type: 'comment';
  id: string;
  itemId: string;
  commenterId: string;
  content: string;
  parentId?: string;
  createdAt: number;
};

class Comment {
  public readonly ID: string;
  public Content: string;
  public CreatedAt: Date;

  private _commenterId: string;
  private _itemId: string;
  private _parentId: string;

  constructor(data: CommentData) {
    this.ID = data.id;
    this.Content = data.content;
    this.CreatedAt = new Date(data.createdAt);
    this._itemId = data.itemId;
    this._commenterId = data.commenterId;
    this._parentId = data.parentId || '';
  }

  public get Commenter(): Author {
    return useDataStore().author(this._commenterId);
  }

  public get Item(): EditableItem {
    return useDataStore().itemById(this._itemId);
  }

  public getParent(arr: Comment[]): Comment | undefined {
    return arr.find((c) => c.ID === this._parentId);
  }

  public Save(): CommentData {
    return {
      type: 'comment',
      id: this.ID,
      itemId: this.Item.ID,
      commenterId: this.Commenter.ID,
      content: this.Content,
      parentId: this._parentId,
      createdAt: this.CreatedAt.getTime(),
    };
  }
}

type EditableItemData = {
  id: string;
  imgsrc?: string;
  author: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  // comments: CommentData[];
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested' | 'Unpublished';
  modComment?: string;
  modId?: string;
  modTouch?: number;
};

abstract class EditableItem {
  public readonly ID: string;
  public ItemType: string;
  public ImageSrc: string;

  public CreatedAt: Date;
  public UpdatedAt: Date;
  public DeletedAt?: Date;
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested' | 'Unpublished';
  public LastModId: string;
  public LastModTouch?: Date;
  public ModComment: string;
  public IsUserOwned: boolean;
  // public Comments: Comment[];

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
    this.DeletedAt = data && data.deleted_at ? new Date(data?.deleted_at) : undefined;

    this.Status = data?.status || 'Unpublished';
    this.ModComment = data?.modComment || '';
    this.LastModId = data?.modId || '';
    this.LastModTouch = data?.modTouch ? new Date(data?.modTouch) : undefined;
  }

  public get Author(): Author {
    return useDataStore().author(this._authorId);
  }

  public set Author(author: Author) {
    this._authorId = author.ID;
  }

  public get isUserOwned(): boolean {
    return this._authorId === useUserStore().user_id;
  }

  public Save(): EditableItemData {
    const out = {
      id: this.ID,
      author: useUserStore().user_id,
      created_at: this.CreatedAt.getTime(),
      updated_at: new Date().getTime(),
      deleted_at: undefined as number | undefined,
      status: (this.Status = 'Unpublished'),
      // comments: this.Comments.map((c) => c.Save()),
    };
    if (this.DeletedAt) {
      out.deleted_at = this.DeletedAt.getTime();
    }

    return out as EditableItemData;
  }
}

export { EditableItem, EditableItemData, Comment, CommentData };
