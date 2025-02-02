import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoData, VideoPlayerProps } from '../../utils/interfaces';
import { Spinner } from 'react-bootstrap';
import { useWebGazer } from '../../hooks/useWebGazer';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onVideoComplete, passVideoId }) => {
    const { startWebGazer, stopWebGazer, isInitialized } = useWebGazer();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleVideoFinished = useCallback(() => {
        if (isInitialized) {
            stopWebGazer();
        }
        onVideoComplete?.();
    }, [isInitialized, stopWebGazer, onVideoComplete]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const timeLeft = videoRef.current.duration - videoRef.current.currentTime;
            if (timeLeft <= 0.05 && isInitialized) {
                stopWebGazer();
            }
        }
    };

    const fetchRandomVideo = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch('https://human-alignment-hazardous-driving.onrender.com/api/videos/random');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: VideoData = await response.json();
            console.log('Received video data:', data);

            if (!data.url) {
                throw new Error('No video URL in response');
            }

            setVideoUrl(data.url);

            if (data.videoId) {
                // Remove .mp4 from ID
                const videoId = data.videoId.slice(0, data.videoId.length - 4);
                passVideoId(videoId);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            console.error('Error fetching video:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBeginWebGazer = async () => {
        if (isInitialized) {
            return;
        }
        try {
            await startWebGazer();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to start WebGazer';
            console.error('Error starting WebGazer:', errorMessage);
        }
    };

    useEffect(() => {
        fetchRandomVideo();

        return () => {
            if (isInitialized) {
                stopWebGazer();
            }
        };
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner
                    animation="border"
                    variant="dark"
                    style={{ width: '5rem', height: '5rem' }}
                />
            </div>
        );
    }

    return (
        <div className="video-container">
            {videoUrl && (
                <video
                    ref={videoRef}
                    width="100%"
                    muted
                    autoPlay
                    onEnded={handleVideoFinished}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handleBeginWebGazer}
                    style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default VideoPlayer;