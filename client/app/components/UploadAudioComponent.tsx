"use client";

import { ChangeEvent, useState } from 'react';

export default function AudioCreate() {
    const [file, setFile] = useState<File | null>(null);
    const [label, setLabel] = useState<string>("");
    const [clientID, setClientID] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) setFile(selectedFile);
    }

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    }

    const handleClientIDChange = (event: ChangeEvent<HTMLInputElement>) => {
        setClientID(event.target.value);
    }

    const handleUpload = async () => {
        if (file == null || label == "" || clientID == "") return;

        const formData = new FormData();
        formData.append('audioFile', file as File);
        formData.append('label', label);
        formData.append('clientID', clientID);

        try {
            await fetch('http://127.0.0.1:5000/api/audio/upload', {
                method: 'POST',
                body: formData,
            });

            window.location.replace("/dashboard");
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Label
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Label" onChange={handleLabelChange} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Client id
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="client_id" type="number" placeholder="Client id" onChange={handleClientIDChange} />
                </div>
                <div className='mb-6'>
                    <input type="file" accept="audio/*" onChange={handleFileChange} />
                </div>
            </form>
            <button className="bg-green-700 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={handleUpload}>
                Upload
            </button>
        </div>
    )
}
