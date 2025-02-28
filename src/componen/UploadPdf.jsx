import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import { FaFilePdf, FaTrashAlt, FaUpload, FaFileUpload } from 'react-icons/fa';
import MyNavbar from '../map/Navbar';
import './Pdf.css';

export const UploadPdf = () => {
    const [pdfs, setPdfs] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Pilih file PDF...');
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('primary');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const getPdf = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_URL}/pdf`, { withCredentials: true });
            setPdfs(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch PDFs", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPdf();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Silakan pilih file PDF untuk diunggah");
            setAlertVariant("warning");
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            setIsLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_URL}/uploadpdf`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );
            setMessage(response.data.message);
            setAlertVariant("success");
            setFile(null);
            setFileName('Pilih file PDF...');
            fileInputRef.current.value = "";
            await getPdf();
            setIsLoading(false);
            navigate('/uploadpdf');
        } catch (error) {
            setMessage("Gagal mengunggah PDF");
            setAlertVariant("danger");
            setIsLoading(false);
        }
    };

    const deletePdf = async (pdfId) => {
        const userConfirmed = window.confirm('Apakah anda ingin menghapus data ini?');
        if (userConfirmed) {
            try {
                setIsLoading(true);
                await axios.delete(`${process.env.REACT_APP_URL}/deletepdf/${pdfId}`, {
                    withCredentials: true
                });
                await getPdf();
                setMessage("File berhasil dihapus");
                setAlertVariant("success");
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to delete PDF", error);
                setMessage("Gagal menghapus file");
                setAlertVariant("danger");
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <div className="footer" style={{
                marginLeft: window.innerWidth >= 768 ? "290px" : "0",
            }}>
                <Container fluid className="py-4">
                    {/* <MyNavbar /> */}
                    
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">
                                <FaFileUpload className="me-2" />
                                Upload PDF Informasi Dan Dasar Hukum
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpload}>
                                <Row className="align-items-end">
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <div className="custom-file-upload">
                                                <div className="input-group">
                                                    <Form.Control
                                                        type="text"
                                                        className="form-control"
                                                        value={fileName}
                                                        readOnly
                                                        onClick={() => fileInputRef.current.click()}
                                                    />
                                                    <div className="input-group-append">
                                                        <Button 
                                                            variant="outline-secondary" 
                                                            onClick={() => fileInputRef.current.click()}
                                                        >
                                                            <FaFilePdf className="me-1" /> Browse
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Form.Control
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-grid">
                                            <Button 
                                                type="submit" 
                                                variant="primary" 
                                                className="d-flex justify-content-center align-items-center"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <FaUpload className="me-2" />
                                                )}
                                                Upload PDF
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            
                            {message && (
                                <Alert variant={alertVariant} className="mt-3">
                                    {message}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Daftar File PDF</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Memuat data...</p>
                                </div>
                            ) : (
                                <Table striped hover responsive className="mb-0">
                                    <thead>
                                        <tr className="table-light">
                                            <th style={{ width: '5%' }}>No</th>
                                            <th style={{ width: '75%' }}>Nama File</th>
                                            <th style={{ width: '20%' }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pdfs.length > 0 ? (
                                            pdfs.map((pdf, index) => (
                                                <tr key={pdf.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="break-word">
                                                        <FaFilePdf className="text-danger me-2" />
                                                        {pdf.filename}
                                                    </td>
                                                    <td>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => deletePdf(pdf.id)}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <FaTrashAlt className="me-1" /> Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    Tidak ada file PDF yang tersedia
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </>
    );
};