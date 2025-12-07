import { TrackReference } from '@livekit/components-core';
import {
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import { ParticipantTile } from './ParticipantTile';
import './Composite.css'

export const AudioOnlyLayout = ({ tracks }: { tracks: TrackReference[] }) => {
  const participants = useParticipants();
  const room = useRoomContext();
  const remoteParticipants = participants.filter(participant => participant.identity !== room?.localParticipant?.identity);
  // console.log('remoteParticipants', remoteParticipants);
  
  // Calculate optimal grid columns based on participant count (max 100)
  const len = remoteParticipants.length;
  const participantCount = Math.min(len, 100);
  const getOptimalColumns = (count: number): number => {
    if (count === 0) return 1;
    if (count === 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    if (count <= 25) return 5;
    if (count <= 36) return 6;
    if (count <= 49) return 7;
    if (count <= 64) return 8;
    if (count <= 81) return 9;
    return 10; // For 82-100 participants
  };
  
  const gridColumns = getOptimalColumns(participantCount);
  
  return (
    <div 
      className="audio-composite"
      style={{ '--grid-columns': gridColumns } as React.CSSProperties}
    >
      {remoteParticipants.map((participant, index) => (
        <div className='p-tile' key={index}>
          <ParticipantTile key={participant?.sid} participant={participant} tracks={tracks} />
        </div>
      ))}
    </div>
  );
}