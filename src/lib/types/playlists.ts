export type PlaylistItemType = "transcription" | "dubbing" | "clip";

export interface PlaylistCreate {
  name: string;
}

export interface PlaylistUpdate {
  name: string;
}

export interface AddItemRequest {
  item_type: PlaylistItemType;
  item_id: string;
  label?: string | null;
}

export interface ItemLabelUpdate {
  label?: string | null;
}

export interface ReorderRequest {
  item_ids: string[];
}

export interface PlaylistSummary {
  id: string;
  name: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface PlaylistListResponse {
  playlists: PlaylistSummary[];
}

export interface PlaylistItem {
  id: string; // playlist_item row id — used for reorder/relabel/remove
  item_type: PlaylistItemType;
  item_id: string;
  label: string | null;
  position: number;
  title: string | null;
  status: string | null;
  exists: boolean; // false when the referenced item was deleted
}

export interface PlaylistDetail {
  id: string;
  name: string;
  items: PlaylistItem[];
  created_at: string;
  updated_at: string;
}
