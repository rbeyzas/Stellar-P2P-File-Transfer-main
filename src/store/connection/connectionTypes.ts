export enum ConnectionActionType {
  CONNECTION_INPUT_CHANGE = 'CONNECTION_INPUT_CHANGE',
  CONNECTION_CONNECT_LOADING = 'CONNECTION_CONNECT_LOADING',
  CONNECTION_LIST_ADD = 'CONNECTION_LIST_ADD',
  CONNECTION_LIST_REMOVE = 'CONNECTION_LIST_REMOVE',
  CONNECTION_ITEM_SELECT = 'CONNECTION_ITEM_SELECT',
  SEND_MESSAGE = 'SEND_MESSAGE',
  RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
}

export interface Message {
  text: string;
  sender: 'me' | 'peer';
  timestamp: number;
}

export interface ConnectionState {
  readonly id?: string;
  readonly loading: boolean;
  readonly list: string[];
  readonly selectedId?: string;
  readonly messages: { [peerId: string]: Message[] };
}
