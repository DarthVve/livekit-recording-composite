import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useRoomContext,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { ReactElement } from 'react';
import SpeakerLayout from './SpeakerLayout';
import useRecording from './useRecording';

export function CompositeTemplate() {
  const room = useRoomContext();
  const { remoteVideoTracks, isAudioOnly } = useRecording(room);

  // determine layout to use
  let main: ReactElement = <></>;
  if (room.state !== ConnectionState.Disconnected) {
    if (!isAudioOnly) {
      main = <SpeakerLayout tracks={remoteVideoTracks} />;
    } else {
      main = (
        <GridLayout tracks={remoteVideoTracks}>
          <ParticipantTile />
        </GridLayout>
      );
    }
  }

  return (
    <div className='roomContainer'>
      {main}
      <RoomAudioRenderer />
    </div>
  );
}
