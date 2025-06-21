import { TransferActionType, TransferRecord } from './transferTypes';
import { Dispatch } from 'redux';

// Action Creators
export const addTransfer = (transfer: TransferRecord) => ({
  type: TransferActionType.ADD_TRANSFER,
  payload: transfer,
});

export const updateTransfer = (id: string, updates: Partial<TransferRecord>) => ({
  type: TransferActionType.UPDATE_TRANSFER,
  payload: { id, updates },
});

export const deleteTransfer = (id: string) => ({
  type: TransferActionType.DELETE_TRANSFER,
  payload: id,
});

export const setSearchQuery = (query: string) => ({
  type: TransferActionType.SET_SEARCH_QUERY,
  payload: query,
});

export const setFilterType = (filterType: 'all' | 'sent' | 'received') => ({
  type: TransferActionType.SET_FILTER_TYPE,
  payload: filterType,
});

export const clearHistory = () => ({
  type: TransferActionType.CLEAR_HISTORY,
});

// Thunk Actions
export const createTransferRecord = (
  fileName: string,
  fileSize: number,
  fileType: string,
  direction: 'sent' | 'received',
  peerId: string,
) => {
  const transfer: TransferRecord = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fileName,
    fileSize,
    fileType,
    direction,
    peerId,
    status: 'pending',
    timestamp: Date.now(),
    progress: 0,
  };

  return addTransfer(transfer);
};

export const completeTransfer = (id: string, checksum?: string, path?: string) => {
  return updateTransfer(id, {
    status: 'completed',
    progress: 100,
    checksum,
    path,
  });
};

export const failTransfer = (id: string, error: string) => {
  return updateTransfer(id, {
    status: 'failed',
    error,
  });
};

export const updateTransferProgress = (id: string, progress: number) => {
  return updateTransfer(id, { progress });
};

export const cancelTransfer = (id: string) => {
  return updateTransfer(id, {
    status: 'cancelled',
  });
};

// Search and Filter Actions
export const searchTransfers = (query: string) => (dispatch: Dispatch) => {
  dispatch(setSearchQuery(query));
};

export const filterTransfers =
  (filterType: 'all' | 'sent' | 'received') => (dispatch: Dispatch) => {
    dispatch(setFilterType(filterType));
  };

export const clearTransferHistory = () => (dispatch: Dispatch) => {
  dispatch(clearHistory());
};
