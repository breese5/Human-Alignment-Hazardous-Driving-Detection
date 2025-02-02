import { useState } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import Questions from "../Questions/Questions";

const Survey: React.FC = () => {
    const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
    const [videoId, setVideoId] = useState('');

    const handleVideoComplete = () => {
        setVideoPlaying(false);
    }

    const handleFormSubmitted = () => {
        setVideoPlaying(true);
    }

    const handleVideoId = (videoId: string) => {
        setVideoId(videoId);
    }

    if (videoPlaying) {
        return (
            <VideoPlayer onVideoComplete={handleVideoComplete} passVideoId={handleVideoId} />
        )
    } else {
        return (
            <Questions onFormSumbitted={handleFormSubmitted} videoId={videoId} />
        )
    }
};

export default Survey;