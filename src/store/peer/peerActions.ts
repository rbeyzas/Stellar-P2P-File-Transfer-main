import { PeerActionType } from './peerTypes';
import { Dispatch } from 'redux';
import { DataType, PeerConnection } from '../../helpers/peer';
import { message } from 'antd';
import {
  addConnectionList,
  removeConnectionList,
  setLoading as setConnectionLoading,
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
      conn.on('data', (data: any) => {
        console.log('data', data);
        if (data.dataType === DataType.FILE) {
          let blob = new Blob([data.file], { type: data.fileType });
          let a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = data.fileName;
          a.click();
          message.success('File received successfully');
        } else if (data.dataType === DataType.MESSAGE) {
          dispatch(
            receiveMessage(conn.peer, {
              text: data.message,
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
