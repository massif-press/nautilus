import _ from 'lodash';
import { useCompendiumStore } from '../stores/compendiumStore';
import { Author } from './author';
import { useUserStore } from '../stores/userStore';

type Reaction = {
  reacterId: string;
  reaction:
    | 'like'
    | 'dislike'
    | 'love'
    | 'haha'
    | 'wow'
    | 'sad'
    | 'angry'
    | 'question'
    | 'exclamation';
};

type CommentData = {
  id: string;
  commenterId: string;
  content: string;
  reactions: Reaction[];
};

class Comment {
  public readonly ID: string;
  public CommenterID: string;
  public Content: string;
  public Reactions: Reaction[];
  public CreatedAt: Date;
  public Status: 'Approved' | 'Rejected' | '';

  constructor(data: CommentData) {
    this.ID = data.id;
    this.CommenterID = data.commenterId;
    this.Content = data.content;
    this.Reactions = data.reactions;
  }

  public Accept() {
    this.Status = 'Approved';
  }

  public Reject() {
    this.Status = 'Rejected';
  }

  public React(userId: string, reaction: Reaction['reaction']) {
    this.Reactions.push({ reacterId: userId, reaction });
  }

  public get Commenter(): Author {
    return useCompendiumStore().author(this.CommenterID);
  }
}

type EditableItemData = {
  id: string;
  author: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested';
};

abstract class EditableItem {
  public readonly ID: string;
  protected ItemType: string;

  public CreatedAt: Date;
  public UpdatedAt: Date;
  public DeletedAt: Date;
  public Status: 'Submitted' | 'Approved' | 'Rejected' | 'Changes Requested' | 'Unpublished';
  public IsUserOwned: boolean;
  public Comments: Comment[];

  private _authorId = '';

  constructor(data?: EditableItemData) {
    this.ID = data?.id || _.uniqueId();
    this._authorId = data?.author || 'system';
    this.IsUserOwned = this._authorId === useUserStore().user_id;

    this.CreatedAt = new Date(data?.created_at || Date.now());
    this.UpdatedAt = new Date(data?.updated_at || Date.now());
    this.DeletedAt = new Date(data?.deleted_at || Date.now());

    this.Status = data?.status || 'Unpublished';
  }

  public get Author(): Author {
    return useCompendiumStore().author(this._authorId);
  }
}

export { EditableItem, EditableItemData, Comment, CommentData, Reaction };
