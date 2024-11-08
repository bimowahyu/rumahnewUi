import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MyNavbar from '../map/Navbar';

export const UploadFoto = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [foto, setPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleCapturePhoto = async () => {
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await fetch(dataUrl).then(res => res.blob());
    setPhoto(new File([blob], 'captured-photo.png', { type: 'image/png' }));

    video.srcObject.getTracks().forEach(track => track.stop());
    document.body.removeChild(video);
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
    q.namaLengkapKK.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <MyNavbar />
      <h2>Upload Foto</h2>

      {/* Searchable Dropdown for Questionnaire */}
      <label htmlFor="questionnaire">Pilih Nama:</label>
      <input
        type="text"
        placeholder="Cari nama..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control my-2"
      />
      <select
        id="questionnaire"
        value={selectedQuestionnaire}
        onChange={(e) => setSelectedQuestionnaire(e.target.value)}
        className="form-select"
      >
        <option value="">Pilih Nama</option>
        {filteredQuestionnaires.map((q) => (
          <option key={q.id} value={q.id}>
            {q.namaLengkapKK}
          </option>
        ))}
      </select>

      {/* Upload or Capture Photo */}
      <div className="mt-4">
        <label>Upload Foto:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="form-control my-2" />
        <button onClick={handleCapturePhoto} className="btn btn-primary">
          Capture Photo with Camera
        </button>
      </div>

      {/* Submit Photo */}
      <button onClick={handleUpload} className="btn btn-success mt-4">
        Upload Foto
      </button>
    </div>
  );
};
