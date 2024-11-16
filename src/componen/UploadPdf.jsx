import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import MyNavbar from '../map/Navbar';

export const UploadPdf = () => {
    const [pdfs, setPdfs] = useState([]);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

 
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

 
    const getPdf = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/pdf`, { withCredentials: true });
            setPdfs(response.data.data);
        } catch (error) {
            console.error("Failed to fetch PDFs", error);
        }
    };

  
    useEffect(() => {
        getPdf();
    }, []);
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
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );
            setMessage(response.data.message);
            setFile(null);  
            fileInputRef.current.value = ""; // Clear the file input
            getPdf(); // Assuming this function fetches the uploaded PDFs
            navigate('/uploadpdf');
        } catch (error) {
            setMessage("Failed to upload PDF");
        }
    };

    // Fungsi untuk menghapus PDF
    const deletePdf = async (pdfId) => {
        const userConfirmed = window.confirm('Apakah anda ingin menghapus data ini?');
        if (userConfirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_URL}/deletepdf/${pdfId}`, {
                    withCredentials: true
                });
                getPdf();
            } catch (error) {
                console.error("Failed to delete PDF", error);
            }
        }
    };

    return (
        <div>
            <MyNavbar />
            <div>
            <p>Upload PDF Informasi Dan Dasar Hukum</p>
            </div>
            
            <form onSubmit={handleUpload}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef}/>
                <button type="submit">Upload PDF</button>
            </form>
            {message && <p>{message}</p>}
            
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama File</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.map((pdf, index) => (
                        <tr key={pdf.id}>
                            <td>{index + 1}</td>
                            <td>{pdf.filename}</td>
                            <td>
                                <Button variant="warning" onClick={() => deletePdf(pdf.id)}>
                                    Hapus
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};


