import React from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

function Player({ file, videoUrl }) {
    return (
        <div>
            <MediaPlayer
                // aspectRatio="16/9"
                className="max-w-5xl w-[64rem]"
                title={file.title}
                src={videoUrl}
            >
                <MediaProvider />
                <DefaultVideoLayout
                    // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>
        </div>
    );
}

export default Player;
