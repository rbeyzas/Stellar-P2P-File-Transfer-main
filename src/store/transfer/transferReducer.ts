import { TransferActionType, TransferState, TransferAction } from './transferTypes';

const initialState: TransferState = {
  transfers: [],
  searchQuery: '',
  filterType: 'all',
  loading: false,
  error: null,
};

const transferReducer = (state = initialState, action: TransferAction): TransferState => {
  switch (action.type) {
    case TransferActionType.ADD_TRANSFER:
      return {
        ...state,
        transfers: [action.payload, ...state.transfers],
      };

    case TransferActionType.UPDATE_TRANSFER:
      return {
        ...state,
        transfers: state.transfers.map((transfer) =>
          transfer.id === action.payload.id ? { ...transfer, ...action.payload.updates } : transfer,
        ),
      };

    case TransferActionType.DELETE_TRANSFER:
      return {
        ...state,
        transfers: state.transfers.filter((transfer) => transfer.id !== action.payload),
      };

    case TransferActionType.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case TransferActionType.SET_FILTER_TYPE:
      return {
        ...state,
        filterType: action.payload,
      };

    case TransferActionType.CLEAR_HISTORY:
      return {
        ...state,
        transfers: [],
      };

    default:
      return state;
  }
};

export default transferReducer;
