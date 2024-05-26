// frontend/src/Downloader.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Downloader.css';

function Downloader() {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [videoId, setVideoId] = useState('');

    const downloadVideo = async () => {
        setError('');
        if (!url) {
            setError('Please enter a YouTube URL');
            return;
        }

        try {
            const response = await axios.get('https://youtube-downloader-python-backend.onrender.com/download', {
                params: { url },
                responseType: 'blob'
            });

            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }

            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', 'video.mp4');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError('Error downloading video: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleUrlChange = (e) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);

        const videoIdMatch = inputUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (videoIdMatch) {
            setVideoId(videoIdMatch[1]);
        } else {
            setVideoId('');
        }
    };

    return (
        <div className="downloader">
            <h1 className="title">YouTube Video Downloader</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter YouTube URL"
                    className="input-url"
                />
                <button onClick={downloadVideo} className="download-button">Download</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {videoId && (
                <div className="video-preview">
                    <h2>Video Preview</h2>
                    <div className="video-container">
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Downloader;
