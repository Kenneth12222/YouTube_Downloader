// frontend/src/Downloader.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Downloader.css';

const Downloader = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [videoThumbnail, setVideoThumbnail] = useState(null);

    useEffect(() => {
        if (url) {
            fetchVideoThumbnail();
        } else {
            setVideoThumbnail(null);
        }
    }, [url]);

    const fetchVideoThumbnail = async () => {
        try {
            const response = await axios.get('http://localhost:5000/video_info', {
                params: { url }
            });

            if (!response || !response.data || !response.data.thumbnail) {
                throw new Error('Thumbnail not found');
            }

            setVideoThumbnail(response.data.thumbnail);
        } catch (error) {
            setVideoThumbnail(null);
            console.error('Error fetching video thumbnail:', error.message);
        }
    };

    const downloadVideo = async () => {
        setError('');
        if (!url) {
            setError('Please enter a YouTube URL');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/download', {
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

    return (
        <div className="container">
            <h1 className="heading">YouTube Video Downloader</h1>
            <div className="formContainer">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter YouTube URL"
                    className="input"
                />
                <button onClick={downloadVideo} className="button">Download</button>
            </div>
            {videoThumbnail && (
                <div className="thumbnailContainer">
                    <img src={videoThumbnail} alt="Video Thumbnail" className="thumbnail" />
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Downloader;
