import { ConnectionActionType, Message } from './connectionTypes';
import { Dispatch } from 'redux';
import { DataType, PeerConnection } from '../../helpers/peer';
import { message } from 'antd';
import download from 'js-file-download';

export const changeConnectionInput = (id: string) => ({
  type: ConnectionActionType.CONNECTION_INPUT_CHANGE,
  id,
});

export const setLoading = (loading: boolean) => ({
  type: ConnectionActionType.CONNECTION_CONNECT_LOADING,
  loading,
});
export const addConnectionList = (id: string) => ({
  type: ConnectionActionType.CONNECTION_LIST_ADD,
  id,
});

export const removeConnectionList = (id: string) => ({
  type: ConnectionActionType.CONNECTION_LIST_REMOVE,
  id,
});

export const selectItem = (id: string) => ({
  type: ConnectionActionType.CONNECTION_ITEM_SELECT,
  id,
});

export const sendMessage = (peerId: string, message: Message) => ({
  type: ConnectionActionType.SEND_MESSAGE,
  peerId,
  message,
});

export const receiveMessage = (peerId: string, message: Message) => ({
  type: ConnectionActionType.RECEIVE_MESSAGE,
  peerId,
  message,
});

export const connectPeer: (id: string) => (dispatch: Dispatch) => Promise<void> =
  (id: string) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await PeerConnection.connectPeer(id);
      PeerConnection.onConnectionDisconnected(id, () => {
        message.info('Connection closed: ' + id);
        dispatch(removeConnectionList(id));
      });
      PeerConnection.onConnectionReceiveData(id, (data) => {
        if (data.dataType === DataType.FILE) {
          message.info('Receiving file ' + data.fileName + ' from ' + id);
          download(data.file || '', data.fileName || 'fileName', data.fileType);
        } else if (data.dataType === DataType.MESSAGE) {
          dispatch(
            receiveMessage(id, {
              text: data.message || '',
              sender: 'peer',
              timestamp: Date.now(),
            }),
          );
        }
      });
      dispatch(addConnectionList(id));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
      console.log(err);
    }
  };
