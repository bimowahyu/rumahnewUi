import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNavbar from '../map/Navbar';

export const UploadFoto = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [foto, setPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nomorKTPTerm, setNomorKTPTerm] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires`);
        setQuestionnaires(response.data);
      } catch (error) {
        console.error('Error fetching questionnaire data', error);
      }
    };
    fetchQuestionnaires();
  }, []);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const startPreview = async () => {
    setIsPreviewing(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
  };

  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await fetch(dataUrl).then(res => res.blob());
    setPhoto(new File([blob], 'captured-photo.png', { type: 'image/png' }));

    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setIsPreviewing(false);
  };

  const handleUpload = async () => {
    if (!selectedQuestionnaire || !foto) return;

    const formData = new FormData();
    formData.append('questionnaireId', selectedQuestionnaire);
    formData.append('foto', foto);

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/uploadfoto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert(response.data.message);
      navigate('/recap');
    } catch (error) {
      console.error('Error uploading photo', error);
      alert('Failed to upload photo');
    }
  };

  const filteredQuestionnaires = questionnaires.filter((q) =>
    q.namaLengkapKK.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (q.nomorKTP && q.nomorKTP.toLowerCase().includes(nomorKTPTerm.toLowerCase()))
  );

  return (
    <div>
      <MyNavbar />
      <h2>Upload Foto</h2>

      {/* Input untuk mencari Nama Lengkap */}
      <label htmlFor="searchName">Cari Nama:</label>
      <input
        type="text"
        id="searchName"
        placeholder="Cari nama lengkap..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control my-2"
      />

      {/* Input untuk mencari Nomor KTP */}
      <label htmlFor="searchKTP">Cari Nomor KTP:</label>
      <input
        type="text"
        id="searchKTP"
        placeholder="Cari nomor KTP..."
        value={nomorKTPTerm}
        onChange={(e) => setNomorKTPTerm(e.target.value)}
        className="form-control my-2"
      />

      {/* Dropdown untuk memilih nama yang sudah difilter */}
      <label htmlFor="questionnaire">Pilih Nama:</label>
      <select
        id="questionnaire"
        value={selectedQuestionnaire}
        onChange={(e) => setSelectedQuestionnaire(e.target.value)}
        className="form-select"
      >
        <option value="">Pilih Nama</option>
        {filteredQuestionnaires.map((q) => (
          <option key={q.id} value={q.id}>
            {q.namaLengkapKK} - {q.nomorKTP}
          </option>
        ))}
      </select>

      {/* Upload atau Capture Foto */}
      <div className="mt-4">
        <label>Upload Foto:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="form-control my-2" />
        {isPreviewing ? (
          <div>
            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
            <button onClick={capturePhoto} className="btn btn-primary mt-2">Take Picture</button>
          </div>
        ) : (
          <button onClick={startPreview} className="btn btn-primary">
            Start Camera Preview
          </button>
        )}
      </div>

      {/* Tombol untuk mengupload foto */}
      <button onClick={handleUpload} className="btn btn-success mt-4">
        Upload Foto
      </button>
    </div>
  );
};
