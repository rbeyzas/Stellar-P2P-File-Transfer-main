export enum TransferActionType {
  ADD_TRANSFER = 'ADD_TRANSFER',
  UPDATE_TRANSFER = 'UPDATE_TRANSFER',
  DELETE_TRANSFER = 'DELETE_TRANSFER',
  SET_SEARCH_QUERY = 'SET_SEARCH_QUERY',
  SET_FILTER_TYPE = 'SET_FILTER_TYPE',
  CLEAR_HISTORY = 'CLEAR_HISTORY',
}

export interface TransferRecord {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  direction: 'sent' | 'received';
  peerId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: number;
  progress?: number;
  error?: string;
  checksum?: string;
  path?: string; // Local file path for received files
}

export interface TransferState {
  transfers: TransferRecord[];
  searchQuery: string;
  filterType: 'all' | 'sent' | 'received';
  loading: boolean;
  error: string | null;
}

export interface AddTransferAction {
  type: TransferActionType.ADD_TRANSFER;
  payload: TransferRecord;
}

export interface UpdateTransferAction {
  type: TransferActionType.UPDATE_TRANSFER;
  payload: {
    id: string;
    updates: Partial<TransferRecord>;
  };
}

export interface DeleteTransferAction {
  type: TransferActionType.DELETE_TRANSFER;
  payload: string; // transfer id
}

export interface SetSearchQueryAction {
  type: TransferActionType.SET_SEARCH_QUERY;
  payload: string;
}

export interface SetFilterTypeAction {
  type: TransferActionType.SET_FILTER_TYPE;
  payload: 'all' | 'sent' | 'received';
}

export interface ClearHistoryAction {
  type: TransferActionType.CLEAR_HISTORY;
}

export type TransferAction =
  | AddTransferAction
  | UpdateTransferAction
  | DeleteTransferAction
  | SetSearchQueryAction
  | SetFilterTypeAction
  | ClearHistoryAction;
