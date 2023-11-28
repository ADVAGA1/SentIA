"use client";

import { ChangeEvent, useState } from 'react';

export default function AudioCreate() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];

        console.log(selectedFile);

        if (selectedFile) setFile(selectedFile);
    }

    const handleUpload = async () => {
        if (file == null) return;

        const formData = new FormData();
        formData.append('audioFile', file as File);

        try {
            await fetch('http://127.0.0.1:5000/api/audio/upload', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}
