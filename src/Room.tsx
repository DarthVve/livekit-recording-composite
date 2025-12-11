import {
  RoomAudioRenderer,
  useRoomContext,
  useVisualStableUpdate,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { ReactElement } from 'react';
import useRecording from './useRecording';
import { AudioOnlyLayout, VideoOnlyLayout } from './CompositeLayouts';

export function CompositeTemplate() {
  const room = useRoomContext();
  const { remoteVideoTracks, isAudioOnly } = useRecording(room);
  const sortedTracks = useVisualStableUpdate(remoteVideoTracks, 1);
  const mainTrack = sortedTracks.shift();
  const remainingTracks = useVisualStableUpdate(sortedTracks, 3);
  
  // determine layout to use
  let main: ReactElement = <></>;
  if (room.state !== ConnectionState.Disconnected) {
    if (mainTrack) {
      main = <VideoOnlyLayout mainTrack={mainTrack} remainingTracks={remainingTracks!} />
    } else {
      main = (
        <AudioOnlyLayout tracks={remoteVideoTracks} />
      );
    }

    if (isAudioOnly) {
      main = <AudioOnlyLayout tracks={remoteVideoTracks} />
    }
  }

  return (
    <div className='roomContainer'>
      {main}
      <RoomAudioRenderer />
    </div>
  );
}
