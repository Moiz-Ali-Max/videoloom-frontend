import { apiFetch } from "../api-client";
import type {
  AddItemRequest,
  ItemLabelUpdate,
  PlaylistCreate,
  PlaylistDetail,
  PlaylistItem,
  PlaylistListResponse,
  PlaylistSummary,
  PlaylistUpdate,
  ReorderRequest,
} from "../types/playlists";

export const playlistsApi = {
  create: (body: PlaylistCreate) => apiFetch<PlaylistSummary>("/playlists/", { method: "POST", body }),

  list: () => apiFetch<PlaylistListResponse>("/playlists/"),

  get: (playlistId: string) => apiFetch<PlaylistDetail>(`/playlists/${playlistId}`),

  rename: (playlistId: string, body: PlaylistUpdate) =>
    apiFetch<PlaylistSummary>(`/playlists/${playlistId}`, { method: "PATCH", body }),

  remove: (playlistId: string) => apiFetch<void>(`/playlists/${playlistId}`, { method: "DELETE" }),

  addItem: (playlistId: string, body: AddItemRequest) =>
    apiFetch<PlaylistDetail>(`/playlists/${playlistId}/items`, { method: "POST", body }),

  removeItem: (playlistId: string, itemRowId: string) =>
    apiFetch<void>(`/playlists/${playlistId}/items/${itemRowId}`, { method: "DELETE" }),

  relabelItem: (playlistId: string, itemRowId: string, body: ItemLabelUpdate) =>
    apiFetch<PlaylistItem>(`/playlists/${playlistId}/items/${itemRowId}`, { method: "PATCH", body }),

  reorder: (playlistId: string, body: ReorderRequest) =>
    apiFetch<PlaylistDetail>(`/playlists/${playlistId}/order`, { method: "PUT", body }),
};
