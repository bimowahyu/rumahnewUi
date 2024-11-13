import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNavbar from '../map/Navbar';

export const UploadPdf = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fungsi untuk menangani perubahan file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Fungsi untuk mengunggah file
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a PDF file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_URL}/uploadpdf`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }, withCredentials: true,
                }
            );
            setMessage(response.data.message);
            navigate('/recap');
        } catch (error) {
            setMessage("Failed to upload PDF");
        }
    };

    return (
        <div>
            <MyNavbar />
            <h2>Upload PDF</h2>
            <form onSubmit={handleUpload}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload PDF</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
