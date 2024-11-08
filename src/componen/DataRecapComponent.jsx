import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaTrash,FaHome } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
} from "reactstrap";
import {NavLink, useNavigate } from "react-router-dom";
import { FaLocationArrow } from "react-icons/fa";
// import "../styles/DataRecapComponent.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MyNavbar from "../map/Navbar";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const DataRecapComponent = ({ onStatisticsUpdate }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [desaOptions, setDesaOptions] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [username, setUsername] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [filters, setFilters] = useState({
    kecamatan: "",
    desaKelurahan: "",
    kategori: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rowsPerPage = 10;
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires`, {
          withCredentials: true 
        });
  
        if (response.status === 200) {
          setData(response.data);
          console.log("Data yang diterima:", response.data);
  
          const calculatedStatistics = calculateStatistics(response.data);
          if (onStatisticsUpdate) {
            onStatisticsUpdate(calculatedStatistics);
          }
        } else {
          console.error("Error fetching data: ", response.statusText);
          setError("Terjadi kesalahan saat memuat data.");
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Terjadi kesalahan saat memuat data.");
      }
    };
  
    fetchData();
  }, [onStatisticsUpdate]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setData(response.data);
        console.log("Data yang diterima:", response.data);

        // If there's an onStatisticsUpdate callback, calculate and pass the statistics
        const calculatedStatistics = calculateStatistics(response.data);
        if (onStatisticsUpdate) {
          onStatisticsUpdate(calculatedStatistics);
        }
      } else {
        console.error("Error fetching data:", response.statusText);
        setError("Terjadi kesalahan saat memuat data.");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Terjadi kesalahan saat memuat data.");
    }
  };

  // Call fetchData when component mounts
  useEffect(() => {
    fetchData();
  }, [onStatisticsUpdate]);

  // Delete data function
  const deleteData = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete/${id}`, { withCredentials: true });
      alert("Data berhasil dihapus.");

      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  
  useEffect(() => {
    const kecamatanDesa = {
      Taliwang: ["Menala", "Dalam", "Sampir", "Kuang", "Bugis", "Arab Kenangan", "Telaga Bertong", "Tamekan", "Seloto", "Lamunga", "Batu Putih", "Banjar", "Sermong", "Labuhan Kertasari", "Labuhan Lalar", "Lalar Liang"],
      Seteluk: ["Seteluk Tengah", "Seteluk Atas", "Seran", "Rempe", "Tapir", "Air Suning", "Kelanir", "Lamusung", "Desa Loka", "Meraran"],
      PotoTano: ["Poto Tano", "Kokarlian", "Tambak Sari", "Tebo", "Senayan", "Kiantar", "Tuananga", "Mantar"],
      BrangRea: ["Lamuntet", "Rarak Ronges", "Bangkat Monteh", "Moteng", "Tepas Sepakat", "Tepas", "Sapugara Bree", "Seminar Salit", "Desa Beru"],
      BrangEne: ["Lampok", "Mujahidin", "Kalimantong", "Manemeng", "Mataiyang", "Mura"],
      Jereweh: ["Dasan Anyar", "Goa", "Beru", "Belo"],
      Maluk: ["Benete", "Bukit Damai", "Mantun", "Pasir Putih", "Maluk"],
      Sekongkang: ["Talonang", "Tatar", "Ai Kangkung", "Sekongkang Atas", "Tongo", "Kemuning", "Sekongkang Bawah"],
    };

    if (selectedItem && selectedItem.kecamatan) {
      setDesaOptions(kecamatanDesa[selectedItem.kecamatan.replace(/\s/g, "")] || []);
    } else {
      setDesaOptions([]);
    }
  }, [selectedItem]);
  useEffect(() => {
    const fetchSurveyorName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/me`, {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          // Gunakan setSelectedItem untuk memperbarui nilai namaSurveyor
          setSelectedItem((prevData) => ({
            ...prevData,
            namaSurveyor: data.surveyor?.username || "Data tidak tersedia",
          }));
        } else {
          console.error("Gagal mengambil nama surveyor:", response.statusText);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error mengambil nama surveyor:", error);
        navigate("/login");
      }
    };
    fetchSurveyorName();
  }, []);
  
  

  const calculateStatistics = (data) => {
    const stats = {
      totalRumahLayakHuni: 0,
      totalRumahTidakLayakHuni: 0,
      byKecamatan: {},
    };

    data.forEach((item) => {
      if (item.kategori === "Rumah Layak Huni") {
        stats.totalRumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.totalRumahTidakLayakHuni += 1;
      }

      if (!stats.byKecamatan[item.kecamatan]) {
        stats.byKecamatan[item.kecamatan] = {
          rumahLayakHuni: 0,
          rumahTidakLayakHuni: 0,
        };
      }

      if (item.kategori === "Rumah Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahTidakLayakHuni += 1;
      }
    });

    return stats;
  };

  const kecamatanOptions = {
    Taliwang: ["Menala", "Dalam", "Sampir", "Kuang", "Bugis", "Arab Kenangan", "Telaga Bertong", "Tamekan", "Seloto", "Lamunga", "Batu Putih", "Banjar", "Sermong", "Labuhan Kertasari", "Labuhan Lalar", "Lalar Liang"],
    Seteluk: ["Seteluk Tengah", "Seteluk Atas", "Seran", "Rempe", "Tapir", "Air Suning", "Kelanir", "Lamusung", "Desa Loka", "Meraran"],
    PotoTano: ["Poto Tano", "Kokarlian", "Tambak Sari", "Tebo", "Senayan", "Kiantar", "Tuananga", "Mantar"],
    BrangRea: ["Lamuntet", "Rarak Ronges", "Bangkat Monteh", "Moteng", "Tepas Sepakat", "Tepas", "Sapugara Bree", "Seminar Salit", "Desa Beru"],
    BrangEne: ["Lampok", "Mujahidin", "Kalimantong", "Manemeng", "Mataiyang", "Mura"],
    Jereweh: ["Dasan Anyar", "Goa", "Beru", "Belo"],
    Maluk: ["Benete", "Bukit Damai", "Mantun", "Pasir Putih", "Maluk"],
    Sekongkang: ["Talonang", "Tatar", "Ai Kangkung", "Sekongkang Atas", "Tongo", "Kemuning", "Sekongkang Bawah"],
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "kecamatan") {
      setFilters({
        ...filters,
        kecamatan: value,
        desaKelurahan: "",
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };
  

  const handleToggleExpand = async (index, id) => {
    if (expandedRows.includes(index)) {
      // Jika sudah terbuka, tutup baris
      setExpandedRows(expandedRows.filter(row => row !== index));
      setSelectedItem(null); // Reset selected item saat ditutup
    } else {
      // Ambil detail berdasarkan ID
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/maps/${id}`);
        const result = await response.json();
        setSelectedItem(result);
        setExpandedRows([...expandedRows, index]);
      } catch (error) {
        console.error("Error fetching detail data:", error);
      }
    }
  };

  const filteredData = data.filter(
    (item) =>
      (filters.kecamatan === "" || filters.kecamatan === "Semua Kecamatan" || item.kecamatan.includes(filters.kecamatan)) &&
      (filters.desaKelurahan ? item.desaKelurahan.includes(filters.desaKelurahan) : true) &&
      (filters.kategori === "" || item.kategori === filters.kategori)
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleEditClick = (item) => {
    setSelectedItem({
      ...item,
      kecamatan: item.kecamatan || "", // Set nilai default
      desaKelurahan: item.desaKelurahan || "",
      kategori: item.kategori || ""
    });
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedItem({ ...selectedItem, [name]: value });
  // };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedItem(prevItem => ({
  //     ...prevItem,
  //     [name]: value
  //   }));
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevData) => ({
      ...prevData,
      [name]: value,
      // Kosongkan titikKoordinatRumah jika manualTitikKoordinatRumah diisi, dan sebaliknya
      ...(name === "manualTitikKoordinatRumah" ? { titikKoordinatRumah: "" } : {}),
      ...(name === "titikKoordinatRumah" ? { manualTitikKoordinatRumah: "" } : {}),
    }));
  };
  const handleFormSubmit = async () => {
    try {
        await axios.put(`${process.env.REACT_APP_URL}/updatequestionnaires/${selectedItem.id}`, selectedItem, {
        withCredentials: true,
        
      });
      setIsModalOpen(false);
      alert("Data berhasil diperbarui.");
      window.location.reload(); // Refresh to get updated data
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  // const handleGetCoordinates = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setSelectedItem((prevData) => ({
  //           ...prevData,
  //           titikKoordinatRumah: `${latitude}, ${longitude}`,
  //           manualTitikKoordinatRumah: "", // Kosongkan input manual jika koordinat otomatis diisi
  //         }));
  //       },
  //       (error) => {
  //         setErrorMessage("Error getting coordinates: " + error.message);
  //         setModalOpen(true); // Tampilkan modal error
  //       }
  //     );
  //   } else {
  //     setErrorMessage("Geolocation is not supported by this browser.");
  //     setModalOpen(true); // Tampilkan modal error
  //   }
  // };
  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedItem((prevData) => ({
            ...prevData,
            titikKoordinatRumah: `${latitude}, ${longitude}`,
            manualTitikKoordinatRumah: "", // Kosongkan input manual jika koordinat otomatis diisi
          }));
        },
        (error) => {
          setErrorMessage("Error getting coordinates: " + error.message);
          setModalOpen(true); // Tampilkan modal error
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setModalOpen(true); // Tampilkan modal error
    }
  };
  //upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Fungsi untuk membuka dialog pemilihan file
  const handleChooseFile = () => {
    document.getElementById("fileInput").click();
  };
  const handleUploadExcel = async () => {
    if (!selectedFile) {
      alert("Silakan pilih file untuk diunggah.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${process.env.REACT_APP_URL}/uploadexcel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("File berhasil diunggah!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    
    }
  };
  
  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/download`, {
        responseType: "blob", // Pastikan respons dalam bentuk Blob untuk file
        withCredentials: true,
      });
  
      // Buat URL sementara untuk file unduhan
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "questionnaires.xlsx"); // Nama file unduhan
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    alert("Hanya admin yang dapat unduh data.");
    }
  };
  const handleDetailClick = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/maps/${id}`);
      if (response.status === 200) {
        setSelectedItem(response.data); // Setel data detail termasuk koordinat
        setModalOpen(true); // Tampilkan modal dengan detail data
      } else {
        console.error("Failed to fetch detail data:", response.statusText);
        setErrorMessage("Gagal mengambil data detail.");
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
      setErrorMessage("Terjadi kesalahan saat mengambil data detail.");
      setModalOpen(true);
    }
  };


  //foto 
  const handleFotoClick = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires/${id}`);
      if (response.data && response.data.fotos && response.data.fotos.length > 0) {
        // Use the path directly as returned from the backend
        setPhotoUrl(`${process.env.REACT_APP_URL}/${response.data.fotos[0].foto_rumah}`);
        setShowPhotoModal(true);
      } else {
        alert('No photo available for this entry.');
      }
    } catch (error) {
      console.error('Error fetching photo', error);
    }
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setPhotoUrl('');
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/me`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setUsername(response.data.username);
        } else {
          // Jika status bukan 200, berarti sesi telah habis, maka redirect ke login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Jika terjadi error (misalnya session expired), redirect ke login
        navigate("/login");
      }
    };
  
    fetchUser();
  }, [navigate]);

  return (
   
    <Container fluid className="data-recap-page p-4">
       <MyNavbar />
      <Row className="justify-content-center">
      </Row>
      {error && (
        <Row className="justify-content-center">
          <Col md="auto">
            <Alert color="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <div className="filters mb-3">
            <label>
              Kecamatan:
              <select name="kecamatan" value={filters.kecamatan} onChange={handleFilterChange}>
                <option value="">Pilih Kecamatan</option>
                <option value="Semua Kecamatan">Semua Kecamatan</option>
                {Object.keys(kecamatanOptions).map((kecamatan) => (
                  <option key={kecamatan} value={kecamatan}>
                    {kecamatan}
                  </option>
                ))}
              </select>
            </label>
            {filters.kecamatan && filters.kecamatan !== "Semua Kecamatan" && (
              <label>
                Desa/Kelurahan:
                <select name="desaKelurahan" value={filters.desaKelurahan} onChange={handleFilterChange}>
                  <option value="">Pilih Desa/Kelurahan</option>
                  {kecamatanOptions[filters.kecamatan].map((desa) => (
                    <option key={desa} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Kategori:
              <select name="kategori" value={filters.kategori} onChange={handleFilterChange}>
                <option value="">Pilih Kategori</option>
                <option value="Rumah Layak Huni">Rumah Layak Huni</option>
                <option value="Rumah Tidak Layak Huni">Rumah Tidak Layak Huni</option>
              </select>
            </label>
          </div>
          <div className="table-wrapper">
          <Input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Tombol untuk membuka dialog pemilihan file */}
      <Button color="primary" onClick={handleChooseFile} className="me-2">
        Pilih File
      </Button>

      {/* Tampilkan nama file yang dipilih */}
      {selectedFile && <p>File yang dipilih: {selectedFile.name}</p>}

      {/* Tombol untuk mengunggah file */}
      <Button color="primary" onClick={handleUploadExcel} className="me-2">
        Upload Excel
      </Button>
            <Button color="primary" onClick={handleExportExcel} className="me-2">Export to Excel</Button>
            <Button color="primary" className="btn-custom">
              <NavLink to="/questionnaire" className="d-flex align-items-center text-white">
                <FaHome className="icon me-2" />
                Tambah Data
              </NavLink>
            </Button>
            <Table responsive className="mt-3">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nomor Data</th>
                  <th>Nama Lengkap KK</th>
                  <th>Alamat Rumah</th>
                  <th>Desa/Kelurahan</th>
                  <th>Kecamatan</th>
                  <th>Kategori</th>
                  <th>Detail</th>
                  <th>Foto</th>
                  <th>Aksi</th>
                  <th>Maps</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.nomorUrut}</td>
                      <td>{item.namaLengkapKK}</td>
                      <td>{item.alamatRumah}</td>
                      <td>{item.desaKelurahan}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.kategori}</td>
                      <td>
          <FaEye
            onClick={() => handleToggleExpand(index)}
            style={{ cursor: "pointer", color: "#007bff" }}
          />
        </td>
        <td>
                <FaEye style={{ cursor: "pointer" }} onClick={() => handleFotoClick(item.id)} />
              </td>
        <td>
          <div className="d-flex justify-content-between">
            <Button
              variant="outline-primary"
              onClick={() => handleEditClick(item)}
              size="sm"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <FaEdit style={{ marginRight: "5px" }} /> Edit
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => deleteData(item.id)}
              size="sm"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <FaTrash style={{ marginRight: "5px" }} /> Delete
            </Button>
          </div>
        </td>
        <td>
          <FaEye
            onClick={() => handleDetailClick(item.id)}
            style={{ cursor: "pointer" }}
          />
        </td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr>
                        <td colSpan="10">
                          <div className="detail-content">
                          <p>Status Rumah: {item.statusrumah}</p>
                            <p>Nomor Urut: {item.nomorUrut}</p>
                            <p>Nomor Rumah Pada Peta: {item.nomorRumahPadaPeta}</p>
                            <p>Nama Lengkap KK: {item.namaLengkapKK}</p>
                            <p>Usia: {item.usia}</p>
                            <p>Jenis Kelamin: {item.jenisKelamin}</p>
                            <p>Nomor KK: {item.nomorKK}</p>
                            <p>Nomor KTP: {item.nomorKTP}</p>
                            <p>Asal KTP: {item.asalKTP}</p>
                            <p>Jumlah KK: {item.jumlahKK}</p>
                            <p>Jumlah Penghuni: {item.jumlahPenghuni}</p>
                            <p>Alamat Rumah: {item.alamatRumah}</p>
                            <p>Kecamatan: {item.kecamatan}</p>
                            <p>Desa/Kelurahan: {item.desaKelurahan}</p>
                            <p>Pendidikan Terakhir: {item.pendidikanTerakhir}</p>
                            <p>Pekerjaan: {item.pekerjaan}</p>
                            <p>Fungsi Bangunan: {item.fungsiBangunan}</p>
                            <p>Penghasilan: {item.penghasilan}</p>
                            <p>Status Kepemilikan Rumah: {item.statusKepemilikanRumah}</p>
                            <p>Aset Rumah di Tempat Lain: {item.asetRumahDiTempatLain}</p>
                            <p>Status Kepemilikan Tanah: {item.statusKepemilikanTanah}</p>
                            <p>Aset Tanah di Tempat Lain: {item.asetTanahDiTempatLain}</p>
                            <p>Sumber Penerangan: {item.sumberPenerangan}</p>
                            <p>Daya Listrik: {item.dayaListrik}</p>
                            <p>Bantuan Perumahan: {item.bantuanPerumahan}</p>
                            <p>Model Rumah: {item.modelRumah}</p>
                            <p>Pondasi: {item.pondasi}</p>
                            <p>Kolom: {item.kolom}</p>
                            <p>Rangka Atap: {item.rangkaAtap}</p>
                            <p>Plafon: {item.plafon}</p>
                            <p>Balok: {item.balok}</p>
                            <p>Sloof: {item.sloof}</p>
                            <p>Pintu/Jendela/Konsen: {item.pintuJendelaKonsen}</p>
                            <p>Ventilasi: {item.ventilasi}</p>
                            <p>Material Lantai Terluas: {item.materialLantaiTerluas}</p>
                            <p>Kondisi Lantai: {item.kondisiLantai}</p>
                            <p>Material Dinding Terluas: {item.materialDindingTerluas}</p>
                            <p>Kondisi Dinding: {item.kondisiDinding}</p>
                            <p>Material Penutup Atap Terluas: {item.materialPenutupAtapTerluas}</p>
                            <p>Kondisi Penutup Atap: {item.kondisiPenutupAtap}</p>
                            <p>Luas Rumah: {item.luasRumah}</p>
                            <p>Luas Tanah: {item.luasTanah}</p>
                            <p>Buangan Air Limbah Rumah Tangga: {item.buanganAirLimbahRumahTangga}</p>
                            <p>Sarana Pengelolaan Limbah Cair: {item.saranaPengelolaanLimbahCair}</p>
                            <p>Pemeliharaan Sarana Pengelolaan Limbah: {item.pemeliharaanSaranaPengelolaanLimbah}</p>
                            <p>Jenis Tempat Pembuangan Air Tinja: {item.jenisTempatPembuanganAirTinja}</p>
                            <p>Kepemilikan Kamar Mandi dan Jamban: {item.kepemilikanKamarMandiDanJamban}</p>
                            <p>Jumlah Jamban: {item.jumlahJamban}</p>
                            <p>Jenis Kloset: {item.jenisKloset}</p>
                            <p>Jenis Tangki Septik: {item.jenisTangkiSeptik}</p>
                            <p>Material Tangki Septik: {item.materialTangkiSeptik}</p>
                            <p>Alas Tangki Septik: {item.alasTangkiSeptik}</p>
                            <p>Lubang Penyedotan: {item.lubangPenyedotan}</p>
                            <p>Posisi Tangki Septik: {item.posisiTangkiSeptik}</p>
                            <p>Jarak Tangki Septik dengan Sumber Air: {item.jarakTangkiSeptikDenganSumberAir}</p>
                            <p>Sumber Air Minum: {item.sumberAirMinum}</p>
                            
                            <p>Titik Koordinat Rumah: {item.titikKoordinatRumah}</p>
                            <p>Manual Titik Koordinat Rumah: {item.manualTitikKoordinatRumah}</p>
                            <p>Tanggal Pendataan: {item.tanggalPendataan}</p>
                            <p>Nama Surveyor: {item.surveyor?.username || "Data tidak tersedia"}</p>
                            <p>Skor: {item.score}</p>
                            <p>Kategori: {item.kategori}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tr>
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
            <ModalHeader toggle={() => setModalOpen(false)}>Detail Lokasi</ModalHeader>
            <ModalBody>
  {selectedItem && (selectedItem.titikKoordinatRumah || selectedItem.manualTitikKoordinatRumah) ? (
    (() => {
      // Pilih koordinat yang ingin digunakan
      const koordinat = selectedItem.titikKoordinatRumah || selectedItem.manualTitikKoordinatRumah;
      const [latitude, longitude] = koordinat
        .split(',')
        .map(coord => parseFloat(coord.trim()));
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return <p>Koordinat tidak valid.</p>;
      }

      return (
        <>
          <p><strong>Kecamatan:</strong> {selectedItem.kecamatan}</p>
          <p><strong>Desa/Kelurahan:</strong> {selectedItem.desaKelurahan}</p>
          <p><strong>Koordinat:</strong> {koordinat}</p>

          {/* Tampilkan MapContainer dengan koordinat yang sudah dipisah */}
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
              <Popup>
                Koordinat: {latitude}, {longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </>
      );
    })()
  ) : (
    <p>Koordinat tidak tersedia</p>
  )}
</ModalBody>


            <ModalFooter>
              <Button color="secondary" onClick={() => setModalOpen(false)}>Tutup</Button>
            </ModalFooter>
        </Modal>

  </tr>
  
            </Table>
                  {/* Photo Modal */}
      <Modal isOpen={showPhotoModal} toggle={handleClosePhotoModal}>
        <ModalHeader toggle={handleClosePhotoModal}>Foto Rumah</ModalHeader>
        <ModalBody>
          {photoUrl ? (
            <img src={photoUrl} alt="Foto Rumah" className="img-fluid" />
          ) : (
            <p>Foto tidak tersedia</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClosePhotoModal}>Close</Button>
        </ModalFooter>
      </Modal>

             

            {selectedItem && (
        <Modal isOpen={isModalOpen} toggle={handleModalToggle}>
          <ModalHeader toggle={handleModalToggle}>Edit Data</ModalHeader>
          <ModalBody>
          <FormGroup>
              <Label for="statusrumah">Status Rumah</Label>
              <Input type="select" name="sumberAirMinum" id="sumberAirMinum" value={selectedItem.sumberAirMinum} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="kosong">Kosong</option>
                <option value="Berpenghuni">Berpenghuni</option>
              </Input>
              {errors.sumberAirMinum && <div className="error-message">{errors.sumberAirMinum}</div>}
            </FormGroup>
        <Form>
          <FormGroup>
            <Label for="namaLengkapKK">Nama Lengkap KK</Label>
            <Input type="text" name="namaLengkapKK" value={selectedItem.namaLengkapKK || ""} onChange={handleInputChange} />
          </FormGroup>
          
          <FormGroup>
            <Label for="alamatRumah">Alamat Rumah</Label>
            <Input type="text" name="alamatRumah" value={selectedItem.alamatRumah || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="desaKelurahan">Desa/Kelurahan</Label>
            <Input type="text" name="desaKelurahan" value={selectedItem.desaKelurahan || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="kategori">Kategori</Label>
            <Input type="select" name="kategori" value={selectedItem.kategori || ""} onChange={handleInputChange}>
              <option value="Rumah Layak Huni">Rumah Layak Huni</option>
              <option value="Rumah Tidak Layak Huni">Rumah Tidak Layak Huni</option>
            </Input>
          </FormGroup>

          {/* Additional Form Fields */}
          <FormGroup>
            <Label for="nomorUrut">1. Nomor Data</Label>
            <Input type="number" name="nomorUrut" id="nomorUrut" value={selectedItem.nomorUrut || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="nomorRumahPadaPeta">2. Nomor Peta</Label>
            <Input type="number" name="nomorRumahPadaPeta" id="nomorRumahPadaPeta" value={selectedItem.nomorRumahPadaPeta || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="usia">4. Usia (Tahun)</Label>
            <Input type="number" name="usia" id="usia" value={selectedItem.usia || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="jenisKelamin">5. Jenis Kelamin</Label>
            <Input type="select" name="jenisKelamin" id="jenisKelamin" value={selectedItem.jenisKelamin || ""} onChange={handleInputChange}>
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </Input>
          </FormGroup>
          <FormGroup>
              <Label for="nomorKK">6. Nomor KK</Label>
              <Input type="text" name="nomorKK" id="nomorKK" value={selectedItem.nomorKK || ""} onChange={handleInputChange} />
              {errors.nomorKK && <div className="invalid-feedback">{errors.nomorKK}</div>}
            </FormGroup>
          {/* Continue adding the rest of your additional form fields in a similar manner */}
        </Form>
        <FormGroup>
              <Label for="nomorKTP">7. Nomor KTP</Label>
              <Input type="text" name="nomorKTP" id="nomorKTP" value={selectedItem.nomorKTP || ""} onChange={handleInputChange} className={`input-center ${errors.nomorKTP ? "is-invalid" : ""}`} />
              {errors.nomorKTP && <div className="invalid-feedback">{errors.nomorKTP}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="asalKTP">8. Asal KTP</Label>
              <Input type="select" name="asalKTP" id="asalKTP" value={selectedItem.asalKTP} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="KSB">KSB</option>
                <option value="Luar KSB">Luar KSB</option>
              </Input>
              {errors.asalKTP && <div className="error-message">{errors.asalKTP}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="jumlahKK">9. Jumlah KK Dalam Rumah</Label>
              <Input type="number" name="jumlahKK" id="jumlahKK" value={selectedItem.jumlahKK || ""} onChange={handleInputChange} className="input-center" />
              {errors.jumlahKK && <div className="error-message">{errors.jumlahKK}</div>}
            </FormGroup>
             	

            <FormGroup>
              <Label for="jumlahPenghuni">10. Jumlah Penghuni</Label>
              <Input type="number" name="jumlahPenghuni" id="jumlahPenghuni" value={selectedItem.jumlahPenghuni || ""} onChange={handleInputChange} className="input-center" />
              {errors.jumlahPenghuni && <div className="error-message">{errors.jumlahPenghuni}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="alamatRumah">11. Alamat Rumah (RT/RW/Dusun/Lingkungan)</Label>
              <Input type="text" name="alamatRumah" id="alamatRumah" value={selectedItem.alamatRumah} onChange={handleInputChange} className="input-center" />
              {errors.alamatRumah && <div className="error-message">{errors.alamatRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kecamatan">12. Kecamatan</Label>
              <Input type="select" name="kecamatan" id="kecamatan" value={selectedItem.kecamatan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Taliwang">Taliwang</option>
                <option value="Seteluk">Seteluk</option>
                <option value="Poto Tano">Poto Tano</option>
                <option value="Brang Rea">Brang Rea</option>
                <option value="Brang Ene">Brang Ene</option>
                <option value="Jereweh">Jereweh</option>
                <option value="Maluk">Maluk</option>
                <option value="Sekongkang">Sekongkang</option>
              </Input>
              {errors.kecamatan && <div className="error-message">{errors.kecamatan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="desaKelurahan">13. Desa/Kelurahan</Label>
              <Input type="select" name="desaKelurahan" id="desaKelurahan" value={selectedItem.desaKelurahan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                {desaOptions.map((desa, index) => (
                  <option key={index} value={desa}>
                    {desa}
                  </option>
                ))}
              </Input>
              {errors.desaKelurahan && <div className="error-message">{errors.desaKelurahan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pendidikanTerakhir">14. Pendidikan Terakhir</Label>
              <Input type="select" name="pendidikanTerakhir" id="pendidikanTerakhir" value={selectedItem.pendidikanTerakhir} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Tidak Punya Ijazah">Tidak Punya Ijazah</option>
                <option value="SD/Sederajat">SD/Sederajat</option>
                <option value="SMP/Sederajat">SMP/Sederajat</option>
                <option value="SMA/Sederajat">SMA/Sederajat</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D3">D3</option>
                <option value="D4/S1">D4/S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </Input>
              {errors.pendidikanTerakhir && <div className="error-message">{errors.pendidikanTerakhir}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pekerjaan">15. Pekerjaan</Label>
              <Input type="select" name="pekerjaan" id="pekerjaan" value={selectedItem.pekerjaan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Tidak Bekerja">Tidak Bekerja</option>
                <option value="Pensiunan">Pensiunan</option>
                <option value="Petani/Pekebun">Petani/Pekebun</option>
                <option value="Nelayan">Nelayan</option>
                <option value="Pedagang">Pedagang</option>
                <option value="Karyawan Swasta">Karyawan Swasta</option>
                <option value="Tukang/Montir">Tukang/Montir</option>
                <option value="Buruh">Buruh</option>
                <option value="Honorer">Honorer</option>
                <option value="TNI/POLRI">TNI/POLRI</option>
                <option value="ASN">ASN</option>
                <option value="Kepala Desa">Kepala Desa</option>
                <option value="Perangkat Desa/Kelurahan">Perangkat Desa</option>
                <option value="BPD">BPD</option>
                <option value="DPRD">DPRD</option>
                <option value="Bupati">Bupati</option>
                <option value="Wakil Bupati">Wakil Bupati</option>
              </Input>
              {errors.pekerjaan && <div className="error-message">{errors.pekerjaan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="fungsiBangunan">16. Fungsi Bangunan</Label>
              <Input type="select" name="fungsiBangunan" id="fungsiBangunan" value={selectedItem.fungsiBangunan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Rumah Tinggal/Hunian">Rumah Tinggal/Hunian</option>
                <option value="Rumah Toko (RUKO)">Rumah Toko (RUKO)</option>
              </Input>
              {errors.fungsiBangunan && <div className="error-message">{errors.fungsiBangunan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="penghasilan">17. Penghasilan/Bulan</Label>
              <Input type="select" name="penghasilan" id="penghasilan" value={selectedItem.penghasilan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="4300000">Rp. 4.300.000</option>
                <option value="4000000">Rp. 4.000.000</option>
                <option value="3700000">Rp. 3.700.000</option>
                <option value="3400000">Rp. 3.400.000</option>
                <option value="3100000">Rp. 3.100.000</option>
                <option value="2800000">Rp. 2.800.000</option>
                <option value="2500000">Rp. 2.500.000</option>
                <option value="2200000">Rp. 2.200.000</option>
                <option value="1800000">Rp. 1.800.000</option>
                <option value="1500000">Rp. 1.500.000</option>
                <option value="1200000">Rp. 1.200.000</option>
                <option value="1000000">Rp. 1.000.000</option>
                <option value="900000">Rp. 900.000</option>
                <option value="600000">Rp. 600.000</option>
              </Input>
              {errors.penghasilan && <div className="error-message">{errors.penghasilan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="statusKepemilikanRumah">18. Status Kepemilikan Rumah</Label>
              <Input type="select" name="statusKepemilikanRumah" id="statusKepemilikanRumah" value={selectedItem.statusKepemilikanRumah} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Bukan Milik Sendiri">Bukan Milik Sendiri</option>
                <option value="Kontrak/Sewa">Kontrak/Sewa</option>
              </Input>
              {errors.statusKepemilikanRumah && <div className="error-message">{errors.statusKepemilikanRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="asetRumahDiTempatLain">19. Aset Rumah di Tempat lain</Label>
              <Input type="select" name="asetRumahDiTempatLain" id="asetRumahDiTempatLain" value={selectedItem.asetRumahDiTempatLain} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.asetRumahDiTempatLain && <div className="error-message">{errors.asetRumahDiTempatLain}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="statusKepemilikanTanah">20. Status Kepemilikan Tanah</Label>
              <Input type="select" name="statusKepemilikanTanah" id="statusKepemilikanTanah" value={selectedItem.statusKepemilikanTanah} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Bukan Milik Sendiri">Bukan Milik Sendiri</option>
                <option value="Tanah Negara">Tanah Negara</option>
              </Input>
              {errors.statusKepemilikanTanah && <div className="error-message">{errors.statusKepemilikanTanah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="asetTanahDiTempatLain">21. Aset Tanah di Tempat Lain</Label>
              <Input type="select" name="asetTanahDiTempatLain" id="asetTanahDiTempatLain" value={selectedItem.asetTanahDiTempatLain} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.asetTanahDiTempatLain && <div className="error-message">{errors.asetTanahDiTempatLain}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sumberPenerangan">22. Sumber Penerangan</Label>
              <Input type="select" name="sumberPenerangan" id="sumberPenerangan" value={selectedItem.sumberPenerangan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="PLN dengan Meteran">PLN dengan Meteran</option>
                <option value="PLN tanpa Meteran">PLN tanpa Meteran</option>
                <option value="Listrik Non PLN">Listrik Non PLN</option>
                <option value="Bukan Listrik">Bukan Listrik</option>
              </Input>
              {errors.sumberPenerangan && <div className="error-message">{errors.sumberPenerangan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="dayaListrik">23. Daya Listrik</Label>
              <Input type="select" name="dayaListrik" id="dayaListrik" value={selectedItem.dayaListrik} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="450">450 VA</option>
                <option value="900">900 VA</option>
                <option value="1300">1300 VA</option>
                <option value="2200">2200 VA</option>
                <option value="3500">3500 VA</option>
              </Input>
              {errors.dayaListrik && <div className="error-message">{errors.dayaListrik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="bantuanPerumahan">24. Bantuan Perumahan</Label>
              <Input type="select" name="bantuanPerumahan" id="bantuanPerumahan" value={selectedItem.bantuanPerumahan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Pernah, >10 Tahun">Ya. &gt;10 Tahun</option>
                <option value="Pernah, <10 Tahun">Ya. &lt;10 Tahun</option>
                <option value="Tidak Pernah">Tidak Pernah</option>
              </Input>
              {errors.bantuanPerumahan && <div className="error-message">{errors.bantuanPerumahan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="modelRumah">25. Model Rumah</Label>
              <Input type="select" name="modelRumah" id="modelRumah" value={selectedItem.modelRumah} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Permanen">Permanen</option>
                <option value="Semi Permanen">Semi Permanen</option>
                <option value="Panggung">Panggung</option>
              </Input>
              {errors.modelRumah && <div className="error-message">{errors.modelRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pondasi">26. Pondasi</Label>
              <Input type="select" name="pondasi" id="pondasi" value={selectedItem.pondasi} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.pondasi && <div className="error-message">{errors.pondasi}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kolom">27. Kolom</Label>
              <Input type="select" name="kolom" id="kolom" value={selectedItem.kolom} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kolom && <div className="error-message">{errors.kolom}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="rangkaAtap">28. Rangka Atap</Label>
              <Input type="select" name="rangkaAtap" id="rangkaAtap" value={selectedItem.rangkaAtap} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.rangkaAtap && <div className="error-message">{errors.rangkaAtap}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="plafon">29. Plafon</Label>
              <Input type="select" name="plafon" id="plafon" value={selectedItem.plafon} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.plafon && <div className="error-message">{errors.plafon}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="balok">30. Balok</Label>
              <Input type="select" name="balok" id="balok" value={selectedItem.balok} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.balok && <div className="error-message">{errors.balok}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sloof">31. Sloof</Label>
              <Input type="select" name="sloof" id="sloof" value={selectedItem.sloof} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.sloof && <div className="error-message">{errors.sloof}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pintuJendelaKonsen">32. Pintu, Jendela, Konsen</Label>
              <Input type="select" name="pintuJendelaKonsen" id="pintuJendelaKonsen" value={selectedItem.pintuJendelaKonsen} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.pintuJendelaKonsen && <div className="error-message">{errors.pintuJendelaKonsen}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="ventilasi">33. Ventilasi</Label>
              <Input type="select" name="ventilasi" id="ventilasi" value={selectedItem.ventilasi} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.ventilasi && <div className="error-message">{errors.ventilasi}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialLantaiTerluas">34. Material Lantai Terluas</Label>
              <Input type="select" name="materialLantaiTerluas" id="materialLantaiTerluas" value={selectedItem.materialLantaiTerluas} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Marmer/Granit">Marmer/Granit</option>
                <option value="Keramik">Keramik</option>
                <option value="Rabat ">Rabat </option>
                <option value="Papan Kayu">Papan Kayu</option>
                <option value="Bambu">Bambu</option>
                <option value="Tanah">Tanah</option>
                <option value="Lainnya">lainnya</option>
              </Input>
              {errors.materialLantaiTerluas && <div className="error-message">{errors.materialLantaiTerluas}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kondisiLantai">35. Kondisi Lantai</Label>
              <Input type="select" name="kondisiLantai" id="kondisiLantai" value={selectedItem.kondisiLantai} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiLantai && <div className="error-message">{errors.kondisiLantai}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialDindingTerluas">36. Material Dinding Terluas</Label>
              <Input type="select" name="materialDindingTerluas" id="materialDindingTerluas" value={selectedItem.materialDindingTerluas} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Tembok Plesteran">Tembok Plesteran</option>
                <option value="Tembok Belum Plesteran">Tembok Belum Plesteran</option>
                <option value="Papan Kayu">Papan Kayu</option>
                <option value="Kalsiplank">Kalsiplank</option>
                <option value="Spandek">Spandek</option>
                <option value="Bedek/Anyaman Bambu">Bedek/Anyaman Bambu</option>
                <option value="Lainnya">Lainnya</option>
              </Input>
              {errors.materialDindingTerluas && <div className="error-message">{errors.materialDindingTerluas}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kondisiDinding">37. Kondisi Dinding</Label>
              <Input type="select" name="kondisiDinding" id="kondisiDinding" value={selectedItem.kondisiDinding} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiDinding && <div className="error-message">{errors.kondisiDinding}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialPenutupAtapTerluas">38. Material Penutup Atap Terluas</Label>
              <Input type="select" name="materialPenutupAtapTerluas" id="materialPenutupAtapTerluas" value={selectedItem.materialPenutupAtapTerluas} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Genteng Kramik">Genteng Kramik</option>
                <option value="Genteng Biasa">Genteng Biasa</option>
                <option value="Multiroof">Multiroof</option>
                <option value="Spandek">Spandek</option>
                <option value="Seng">Seng</option>
                <option value="Asbes">Asbes</option>
                <option value="Daun-daunan">Daun-daunan</option>
                <option value="Lainnya">Lainnya</option>
              </Input>
              {errors.materialPenutupAtapTerluas && <div className="error-message">{errors.materialPenutupAtapTerluas}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kondisiPenutupAtap">39. Kondisi Penutup Atap</Label>
              <Input type="select" name="kondisiPenutupAtap" id="kondisiPenutupAtap" value={selectedItem.kondisiPenutupAtap} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiPenutupAtap && <div className="error-message">{errors.kondisiPenutupAtap}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="luasRumah">40. Luas Rumah (m²)</Label>
              <Input type="number" name="luasRumah" id="luasRumah" value={selectedItem.luasRumah} onChange={handleInputChange} className="input-center" />
              {errors.luasRumah && <div className="error-message">{errors.luasRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="luasTanah">41. Luas Tanah (m²)</Label>
              <Input type="number" name="luasTanah" id="luasTanah" value={selectedItem.luasTanah} onChange={handleInputChange} className="input-center" />
              {errors.luasTanah && <div className="error-message">{errors.luasTanah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="buanganAirLimbahRumahTangga">42. Buangan Air Limbah Rumah Tangga</Label>
              <Input type="select" name="buanganAirLimbahRumahTangga" id="buanganAirLimbahRumahTangga" value={selectedItem.buanganAirLimbahRumahTangga} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Jaringan Perpipaan">Jaringan Perpipaan</option>
                <option value="Diresapkan">Diresapkan</option>
                <option value="Buang Bebas">Buang Bebas</option>
              </Input>
              {errors.buanganAirLimbahRumahTangga && <div className="error-message">{errors.buanganAirLimbahRumahTangga}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="saranaPengelolaanLimbahCair">43. Sarana Pengelolaan Limbah Cair Rumah Tangga</Label>
              <Input type="select" name="saranaPengelolaanLimbahCair" id="saranaPengelolaanLimbahCair" value={selectedItem.saranaPengelolaanLimbahCair} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Berfungsi Baik">Berfungsi Baik</option>
                <option value="Tidak Berfungsi">Tidak Berfungsi</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
              </Input>
              {errors.saranaPengelolaanLimbahCair && <div className="error-message">{errors.saranaPengelolaanLimbahCair}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pemiliharaanSaranaPengelolaanLimbah">44. Pemeliharaan Sarana Pengelolaan Limbah Cair Rumah Tangga</Label>
              <Input type="select" name="pemiliharaanSaranaPengelolaanLimbah" id="pemiliharaanSaranaPengelolaanLimbah" value={selectedItem.pemiliharaanSaranaPengelolaanLimbah} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Terpelihara">Terpelihara</option>
                <option value="Tidak Terpelihara">Tidak Terpelihara</option>
              </Input>
              {errors.pemiliharaanSaranaPengelolaanLimbah && <div className="error-message">{errors.pemiliharaanSaranaPengelolaanLimbah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisTempatPembuanganAirTinja">45. Jenis Tempat Pembuangan Air Tinja</Label>
              <Input type="select" name="jenisTempatPembuanganAirTinja" id="jenisTempatPembuanganAirTinja" value={selectedItem.jenisTempatPembuanganAirTinja} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Tangki Septik">Tangki Septik</option>
                <option value="Kolam/Sawah/Sungai">Kolam/Sawah/Sungai</option>
                <option value="Lubang Tanah">Lubang Tanah</option>
                <option value="Pantai/Tanah Lapangan/Kebun">Pantai/Tanah Lapangan/Kebun</option>
                <option value="IPAL">IPAL</option>
              </Input>
              {errors.jenisTempatPembuanganAirTinja && <div className="error-message">{errors.jenisTempatPembuanganAirTinja}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kepemilikanKamarMandiDanJamban">46. Kepemilikan Kamar Mandi Dan Jamban</Label>
              <Input type="select" name="kepemilikanKamarMandiDanJamban" id="kepemilikanKamarMandiDanJamban" value={selectedItem.kepemilikanKamarMandiDanJamban} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Sendiri">Sendiri</option>
                <option value="Bersama/MCK Komunal">Bersama/MCK Komunal</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.kepemilikanKamarMandiDanJamban && <div className="error-message">{errors.kepemilikanKamarMandiDanJamban}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jumlahJamban">47. Jumlah Jamban</Label>
              <Input type="number" name="jumlahJamban" id="jumlahJamban" value={selectedItem.jumlahJamban} onChange={handleInputChange} className="input-center" />
              {errors.jumlahJamban && <div className="error-message">{errors.jumlahJamban}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisKloset">48. Jenis Kloset</Label>
              <Input type="select" name="jenisKloset" id="jenisKloset" value={selectedItem.jenisKloset} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Leher Angsa">Leher Angsa</option>
                <option value="Cubluk/Cemplung">Cubluk/Cemplung</option>
                <option value="Plengsengan">Plengsengan</option>
              </Input>
              {errors.jenisKloset && <div className="error-message">{errors.jenisKloset}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisTangkiSeptik">49. Jenis Tangki Septik</Label>
              <Input type="select" name="jenisTangkiSeptik" id="jenisTangkiSeptik" value={selectedItem.jenisTangkiSeptik} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Pabrikasi">Pabrikasi</option>
                <option value="Konvensional">Konvensional</option>
              </Input>
              {errors.jenisTangkiSeptik && <div className="error-message">{errors.jenisTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialTangkiSeptik">50. Material Tangki Septik</Label>
              <Input type="select" name="materialTangkiSeptik" id="materialTangkiSeptik" value={selectedItem.materialTangkiSeptik} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Fiber">Fiber</option>
                <option value="Dinding Beton">Dinding Beton</option>
                <option value="Batu Bata">Batu Bata</option>
                <option value="Tanah">Tanah</option>
              </Input>
              {errors.materialTangkiSeptik && <div className="error-message">{errors.materialTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="alasTangkiSeptik">51. Alas Tangki Septik</Label>
              <Input type="select" name="alasTangkiSeptik" id="alasTangkiSeptik" value={selectedItem.alasTangkiSeptik} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Kedap">Kedap</option>
                <option value="Tidak Kedap">Tidak Kedap</option>
              </Input>
              {errors.alasTangkiSeptik && <div className="error-message">{errors.alasTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="lubangPenyedotan">52. Lubang Penyedotan</Label>
              <Input type="select" name="lubangPenyedotan" id="lubangPenyedotan" value={selectedItem.lubangPenyedotan} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.lubangPenyedotan && <div className="error-message">{errors.lubangPenyedotan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="posisiTangkiSeptik">53. Posisi Tangki Septik</Label>
              <Input type="select" name="posisiTangkiSeptik" id="posisiTangkiSeptik" value={selectedItem.posisiTangkiSeptik} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Dalam Rumah">Dalam Rumah</option>
                <option value="Luar Rumah">Luar Rumah</option>
              </Input>
              {errors.posisiTangkiSeptik && <div className="error-message">{errors.posisiTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jarakTangkiSeptikDenganSumberAir">54. Jarak Tangki Septik Dengan Sumber Air</Label>
              <Input type="select" name="jarakTangkiSeptikDenganSumberAir" id="jarakTangkiSeptikDenganSumberAir" value={selectedItem.jarakTangkiSeptikDenganSumberAir} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="9">&lt; 10 meter</option>
                <option value="11">&gt; 10 meter</option>
              </Input>
              {errors.jarakTangkiSeptikDenganSumberAir && <div className="error-message">{errors.jarakTangkiSeptikDenganSumberAir}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sumberAirMinum">55. Sumber Air Minum</Label>
              <Input type="select" name="sumberAirMinum" id="sumberAirMinum" value={selectedItem.sumberAirMinum} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="PDAM">PDAM</option>
                <option value="SPAMDES">SPAMDES</option>
                <option value="Mata Air">Mata Air</option>
                <option value="Air Hujan">Air Hujan</option>
                <option value="Sumur/Sumur Bor">Sumur/Sumur Bor</option>
                <option value="Air Kemasan/Isi Ulang">Air Kemasan/Isi Ulang</option>
              </Input>
              {errors.sumberAirMinum && <div className="error-message">{errors.sumberAirMinum}</div>}
            </FormGroup>
           

            <FormGroup>
              <Label for="titikKoordinatRumah">56. Titik Koordinat Rumah</Label>
              <Input type="text" name="titikKoordinatRumah" id="titikKoordinatRumah" value={selectedItem.titikKoordinatRumah || ""} onChange={handleInputChange} invalid={!!errors.titikKoordinatRumah} className="input-center" readOnly />
              <Button color="primary" onClick={handleGetCoordinates} className="btn-get-coordinates">
                <FaLocationArrow /> Ambil Koordinat
              </Button>
            </FormGroup>

            <FormGroup>
              <Label for="manualTitikKoordinatRumah">Atau Masukkan Koordinat Manual</Label>
              <Input
                type="text"
                name="manualTitikKoordinatRumah"
                id="manualTitikKoordinatRumah"
                value={selectedItem.manualTitikKoordinatRumah || ""}
                onChange={handleInputChange}
                invalid={!!errors.manualTitikKoordinatRumah}
                className="input-center"
              />
            </FormGroup>

            <FormGroup>
              <Label for="tanggalPendataan">57. Tanggal Pendataan</Label>
              <Input type="date" name="tanggalPendataan" id="tanggalPendataan" value={selectedItem.tanggalPendataan} onChange={handleInputChange} className="input-center" />
              {errors.tanggalPendataan && <div className="error-message">{errors.tanggalPendataan}</div>}
            </FormGroup>

            {/* <FormGroup>
              <Label for="namaSurveyor">58. Nama Surveyor</Label>
              <Input type="text" name="namaSurveyor" id="namaSurveyor" value={selectedItem.namaSurveyor} readOnly />
              {errors.namaSurveyor && <div className="error-message">{errors.namaSurveyor}</div>}
            </FormGroup> */}

            {/* <FormGroup>
              <Label for="kategori">Kategori Rumah</Label>
              <Input type="text" name="kategori" id="kategori" value={selectedItem.kategori} readOnly className="input-center" />
            </FormGroup>

            <FormGroup>
              <Label for="score">Skor</Label>
              <Input type="number" name="score" id="score" value={selectedItem.score} readOnly className="input-center" />
            </FormGroup> */}
      </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleFormSubmit}>Simpan</Button>{' '}
            <Button color="secondary" onClick={handleModalToggle}>Batal</Button>
          </ModalFooter>
        </Modal>
      )}
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <Button key={i + 1} onClick={() => handlePageChange(i + 1)} color={currentPage === i + 1 ? "primary" : "secondary"}>
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DataRecapComponent;