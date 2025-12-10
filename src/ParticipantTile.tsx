import { Microphone, MicrophoneSlash } from "@phosphor-icons/react";
import { useIsSpeaking, Participant, useIsMuted, Track, RemoteParticipant, VideoTrack } from "vg-x07df/livekit";
import { hasVideoTrack } from "vg-x07df/utils";
import { ParticipantMetadata, useParticipantMetadata } from "vg-x07df";
import { TrackReference } from "@livekit/components-core";
import './Composite.css';

interface ParticipantTileProps {
    participant: Participant;
    tracks?: TrackReference[];
    mainTrack?: TrackReference;
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({
    participant,
    tracks,
}) => {
    const metadata = useParticipantMetadata(participant as RemoteParticipant);
    const isSpeaking = useIsSpeaking(participant);
    const isMuted = useIsMuted({ participant, source: Track.Source.Microphone });
    const hasVideo = hasVideoTrack(participant);
    // console.log('participant', participant, metadata);
    const participantVideoTrack = tracks?.find(
        track => track?.participant?.sid === participant?.sid
    );

    if (!participant) {
        return (
            <div className="participant-tile participant-tile-loading">
                <div className="participant-tile-avatar-loading">
                    <span className="participant-tile-loading-text">?</span>
                </div>
                <p className="participant-tile-loading-label">Loading...</p>
            </div>
        );
    }

    return (
        <div
            className={`participant-tile ${hasVideo ? 'participant-tile-with-video' : 'participant-tile-no-video'
                } ${!hasVideo ? 'participant-tile-padding-medium' : ''} ${isSpeaking
                    ? "participant-tile-speaking"
                    : "participant-tile-not-speaking"
                }`}
        >
            {/* Mic icon */}
            <div className="participant-tile-mic-container">
                {isMuted ? (
                    <div className="participant-tile-mic-icon">
                        <MicrophoneSlash size={12} color="#525866" />
                    </div>
                ) : (
                    <div className="participant-tile-mic-icon">
                        <Microphone size={12} color="#525866" />
                    </div>
                )}
            </div>

            {hasVideo && participantVideoTrack && (
                <>
                    <div className="participant-tile-video-container">
                        <VideoTrack
                            trackRef={participantVideoTrack}
                            className="participant-tile-video"
                        />
                    </div>
                    <div className="participant-tile-video-overlay" />
                    <div className="participant-tile-name participant-tile-name-medium participant-tile-name-overlay">
                        {getDisplayName(metadata!, participant)}
                    </div>
                </>
            )}

            {!hasVideo && (
                <>
                    {metadata?.profilePhoto ? (
                        <img
                            src={metadata.profilePhoto}
                            alt={getDisplayName(metadata, participant)}
                            className="participant-tile-avatar participant-tile-avatar-medium participant-tile-avatar-border-medium participant-tile-avatar-image"
                        />
                    ) : (
                        <div
                            className="participant-tile-avatar participant-tile-avatar-medium participant-tile-initials-medium participant-tile-initials-container"
                        >
                            {getInitials(metadata!, participant)}
                        </div>
                    )}
                    <div className="participant-tile-name participant-tile-name-medium">
                        {getDisplayName(metadata!, participant)}
                    </div>
                </>
            )}
        </div>
    );
}

export const ParticipantTileWide: React.FC<ParticipantTileProps> = ({
    participant,
    mainTrack,
}) => {
    const metadata = useParticipantMetadata(participant as RemoteParticipant);
    const isSpeaking = useIsSpeaking(participant);
    const hasVideo = hasVideoTrack(participant);

    if (!participant) {
        return (
            <div className="participant-tile participant-tile-loading">
                <div className="participant-tile-avatar-loading">
                    <span className="participant-tile-loading-text">?</span>
                </div>
                <p className="participant-tile-loading-label">Loading...</p>
            </div>
        );
    }

    return (
        <div
            style={{ borderRadius: '0' }}
            className={`participant-tile ${hasVideo ? 'participant-tile-with-video' : 'participant-tile-no-video'
                } ${!hasVideo ? 'participant-tile-padding-medium' : ''} ${isSpeaking ? 'participant-tile-speaking'  : "participant-tile-not-speaking"
}`}
        >
            {hasVideo && mainTrack && (
                <>
                    <VideoTrack
                        trackRef={mainTrack}
                        className="participant-tile-video"
                        style={{ borderRadius: '0' }}
                    />
                    {!mainTrack && <div className="participant-tile-video-overlay" style={{ borderRadius: '0' }} />}
                    <div className="participant-tile-name participant-tile-name-medium participant-tile-name-overlay">
                        {getDisplayName(metadata!, participant)}
                    </div>
                </>
            )}

            {!hasVideo && (
                <>
                    {metadata?.profilePhoto ? (
                        <img
                            src={metadata.profilePhoto}
                            alt={getDisplayName(metadata, participant)}
                            className="participant-tile-avatar participant-tile-avatar-medium participant-tile-avatar-border-medium participant-tile-avatar-image"
                        />
                    ) : (
                        <div
                            className="participant-tile-avatar participant-tile-avatar-medium participant-tile-initials-medium participant-tile-initials-container"
                        >
                            {getInitials(metadata!, participant)}
                        </div>
                    )}
                    <div className="participant-tile-name participant-tile-name-medium">
                        {getDisplayName(metadata!, participant)}
                    </div>
                </>
            )}
        </div>
    );
}

// Static test data fallback for names when metadata is not available
const getDisplayName = (metadata: ParticipantMetadata, participant: Participant) => {
    if (metadata?.firstName && metadata?.lastName) {
        return `${metadata.firstName} ${metadata.lastName}`;
    }

    const fallbackName = participant?.name || participant?.identity || 'Unknown User';
    console.log('getDisplayName - metadata:', metadata, 'fallback:', fallbackName);
    return fallbackName;
};

const getInitials = (metadata: ParticipantMetadata, participant: Participant) => {
    const displayName = getDisplayName(metadata, participant);
    if (metadata?.firstName && metadata?.lastName) {
        const initials = `${metadata.firstName} ${metadata.lastName}`
            .split(" ")
            .map((n) => n?.[0])
            .filter(Boolean)
            .join("")
            .toUpperCase()
            .slice(0, 2);
        console.log('getInitials - from metadata:', initials);
        return initials;
    }

    const initials = displayName
        ?.split(" ")
        .map((n) => n?.[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2) || '??';
    console.log('getInitials - from fallback:', initials);
    return initials;
};