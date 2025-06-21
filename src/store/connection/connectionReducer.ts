import { Reducer } from 'redux';
import { ConnectionActionType, ConnectionState, Message } from './connectionTypes';

export const initialState: ConnectionState = {
  id: undefined,
  loading: false,
  list: [],
  selectedId: undefined,
  messages: {},
};

export const ConnectionReducer: Reducer<ConnectionState> = (state = initialState, action: any) => {
  switch (action.type) {
    case ConnectionActionType.CONNECTION_INPUT_CHANGE:
      const { id } = action;
      return { ...state, id };
    case ConnectionActionType.CONNECTION_CONNECT_LOADING:
      const { loading } = action;
      return { ...state, loading };
    case ConnectionActionType.CONNECTION_LIST_ADD:
      let newList = [...state.list, action.id];
      if (newList.length === 1) {
        return { ...state, list: newList, selectedId: action.id };
      }
      return { ...state, list: [...state.list, action.id] };
    case ConnectionActionType.CONNECTION_LIST_REMOVE:
      let newListRemove = [...state.list].filter((e) => e !== action.id);
      if (state.selectedId && !newListRemove.includes(state.selectedId)) {
        if (newListRemove.length === 0) {
          return { ...state, list: newListRemove, selectedId: undefined };
        } else {
          return { ...state, list: newListRemove, selectedId: newListRemove[0] };
        }
      }
      return { ...state, list: newListRemove };
    case ConnectionActionType.CONNECTION_ITEM_SELECT:
      return { ...state, selectedId: action.id };

    case ConnectionActionType.RECEIVE_MESSAGE:
    case ConnectionActionType.SEND_MESSAGE: {
      const { peerId, message } = action;
      const peerMessages = state.messages[peerId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [peerId]: [...peerMessages, message],
        },
      };
    }

    default:
      return state;
  }
};
