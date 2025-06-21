import { PeerActionType } from './peerTypes';
import { Dispatch } from 'redux';
import { DataType, PeerConnection } from '../../helpers/peer';
import { message } from 'antd';
import {
  addConnectionList,
  removeConnectionList,
  receiveMessage,
} from '../connection/connectionActions';
import download from 'js-file-download';

export const startPeerSession = (id: string) => ({
  type: PeerActionType.PEER_SESSION_START,
  id,
});

export const stopPeerSession = () => ({
  type: PeerActionType.PEER_SESSION_STOP,
});
export const setLoading = (loading: boolean) => ({
  type: PeerActionType.PEER_LOADING,
  loading,
});

export const startPeer: () => (dispatch: Dispatch) => Promise<void> = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const id = await PeerConnection.startPeerSession();
    PeerConnection.onIncomingConnection((conn) => {
      const peerId = conn.peer;
      message.info('Incoming connection: ' + peerId);
      dispatch(addConnectionList(peerId));
      PeerConnection.onConnectionDisconnected(peerId, () => {
        message.info('Connection closed: ' + peerId);
        dispatch(removeConnectionList(peerId));
      });
      PeerConnection.onConnectionReceiveData(peerId, (data) => {
        if (data.dataType === DataType.FILE) {
          message.info('Receiving file ' + data.fileName + ' from ' + peerId);
          download(data.file || '', data.fileName || 'fileName', data.fileType);
        } else if (data.dataType === DataType.MESSAGE) {
          dispatch(
            receiveMessage(peerId, {
              text: data.message || '',
              sender: 'peer',
              timestamp: Date.now(),
            }),
          );
        }
      });
    });
    dispatch(startPeerSession(id));
    dispatch(setLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setLoading(false));
  }
};
