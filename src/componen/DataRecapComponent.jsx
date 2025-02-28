import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaTrash,FaHome,FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment/moment";
import { useSelector } from "react-redux";
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
import "./Datarecap.css"
import DashboardWidget from "./DashboardWidget";
import Footer from "./Footer";
import { Layout } from "lucide-react";

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
  const [isBacklog, setIsBacklog] = useState(false);
  const [desaKelurahan, setDesaKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [detailData, setDetailData] = useState(null);

  const [filters, setFilters] = useState({
    kecamatan: "",
    desaKelurahan: "",
    kategori: "",
    user: "", 
    statusrumah: "",
    searchName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rowsPerPage = 20;
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const { user } = useSelector((state) => state.authAdmin || {});
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires`, {
          withCredentials: true,
        });
    
        if (response.status === 200) {
          const modifiedData = response.data.map(item => {
            // Jika status rumah 'kosong', hilangkan kategori
            // if (item.statusrumah === 'Tidak Berpenghuni') {
            //   item.kategori = null;
            // }
            return item;
          });
    
          setData(modifiedData);
          console.log("Data yang diterima:", modifiedData);
          const calculatedStatistics = calculateStatistics(modifiedData);
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
      fetchData();
  }, [onStatisticsUpdate]);
  //filter rumah kosong
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires`, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        // const filteredData = response.data.filter(item => item.statusrumah !== 'Tidak Berpenghuni');
        const filteredData = response.data
        setData(filteredData);
        console.log("Data yang diterima:", filteredData);
        const calculatedStatistics = calculateStatistics(filteredData);
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
    const userConfirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (userConfirmed) {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete/${id}`, { withCredentials: true });
      alert("Data berhasil dihapus.");
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data. Silakan coba lagi.");
    }
  }
};
const deleteByDesa = async (desaKelurahan) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_URL}/questionnaires/desa/${desaKelurahan}`,{withCredentials: true});
    alert(response.data.message);
  } catch (error) {
    alert(error.response?.data?.message || "Terjadi kesalahan saat menghapus data");
  }
};
const handleDelete = async () => {
  if (!desaKelurahan) {
    alert("Pilih desaKelurahan terlebih dahulu");
    return;
  }

  try {
    await deleteByDesa(desaKelurahan);
  } catch (error) {
    console.error(error);
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
      Sekongkang: ["Talonang Baru", "Tatar", "Ai Kangkung", "Sekongkang Atas", "Tongo", "Kemuning", "Sekongkang Bawah"],
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
          setSelectedItem((prevData) => ({
            ...prevData,
            namaSurveyor: data.Admin?.username || "Data tidak tersedia",
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/user`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserOptions(response.data);
        } else {
          console.error("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  
  const handleDetailModalOpen = (item) => {
    setDetailData(item);
    setIsDetailModalOpen(true);
  };
  
  const handleDetailModalClose = () => {
    setDetailData(null);
    setIsDetailModalOpen(false);
  };
  

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
    Sekongkang: ["Talonang Baru", "Tatar", "Ai Kangkung", "Sekongkang Atas", "Tongo", "Kemuning", "Sekongkang Bawah"],
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log('Filter changed:', name, value);
    console.log('Current filters:', filters);
    
    setFilters({
      ...filters,
      [name]: value,
      ...(name === "kecamatan" && { desaKelurahan: "" }), 
    });
  };

  const handleToggleExpand = async (index, id) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(row => row !== index));
      setSelectedItem(null); 
    } else {
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


  const filteredData = data.filter(item => {
    // Ambil nilai filter gabungan
    const [kategori, statusrumah] = filters.kategoriStatusRumah
      ? filters.kategoriStatusRumah.split(" - ")
      : [null, null];
  
      const isKecamatanMatch = filters.kecamatan 
      ? item.kecamatan === filters.kecamatan || filters.kecamatan === "Semua Kecamatan"
      : true;

  const isDesaMatch = filters.desaKelurahan 
      ? item.desaKelurahan === filters.desaKelurahan
      : true;
  
    const isKategoriMatch = kategori ? item.kategori === kategori : true;
    const isStatusMatch = statusrumah ? item.statusrumah === statusrumah : true;
  
    const isUserMatch = filters.user 
      ? item.Admin?.username === filters.user 
      : true;
      const isNameMatch = filters.searchName 
      ? item.namaLengkapKK.toLowerCase().includes(filters.searchName.toLowerCase())
      : true;
  
      return isKecamatanMatch && isDesaMatch && isKategoriMatch && isStatusMatch && isUserMatch && isNameMatch;
  });
  
  // setCurrentRows(filteredData);
  

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
      kecamatan: item.kecamatan || "", 
      desaKelurahan: item.desaKelurahan || "",
      kategori: item.kategori || ""
    });
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setSelectedItem((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: value,
        ...(name === "manualTitikKoordinatRumah" ? { titikKoordinatRumah: "" } : {}),
        ...(name === "titikKoordinatRumah" ? { manualTitikKoordinatRumah: "" } : {})
      };
      if (name === "jumlahKK" && parseInt(value) > 1) {
        setIsBacklog(true);
      } else if (name === "jumlahKK" && parseInt(value) <= 1) {
        setIsBacklog(false);
      }
      if (name === "kepemilikanKamarMandiDanJamban" && value === "Tidak Ada") {
        updatedData = {
          ...updatedData,
          jumlahJamban: 0,
          jenisKloset: "Tidak Ada",
          jenisTangkiSeptik: "Tidak Ada",
          materialTangkiSeptik: "Tidak Ada",
          alasTangkiSeptik: "Tidak Ada",
          lubangPenyedotan: "Tidak Ada",
          posisiTangkiSeptik: "Tidak Ada",
          jarakTangkiSeptikDenganSumberAir: "Tidak Ada",
        };
      }
      
      // Jika status rumah "Tidak Berpenghuni", update beberapa field default
      if (name === "statusrumah" && value === "Tidak Berpenghuni") {
        updatedData = {
          ...updatedData,
          tanggallahir: null,
          jenisKelamin: "0",
          nomorKK: "0000000000000000",
          nomorKTP: "0000000000000000",
          asalKTP: "0",
          jumlahKK: "0",
          jumlahPenghuni: "0",
          pendidikanTerakhir: "0",
          pekerjaan: "0",
          fungsiBangunan: "0",
          penghasilan: "0",
          statusKepemilikanRumah: "0",
          asetRumahDiTempatLain: "0",
          statusKepemilikanTanah: "0",
          asetTanahDiTempatLain: "0",
          sumberPenerangan: "0",
          dayaListrik: "0",
          bantuanPerumahan: "0",
          modelRumah: "0",
          pondasi: "0",
          kolom: "0",
          rangkaAtap: "0",
          plafon: "0",
          balok: "0",
          sloof: "0",
          pintuJendelaKonsen: "0",
          ventilasi: "0",
          materialLantaiTerluas: "0",
          kondisiLantai: "0",
          materialDindingTerluas: "0",
          kondisiDinding: "0",
          materialPenutupAtapTerluas: "0",
          kondisiPenutupAtap: "0",
          luasRumah: "0",
          luasTanah: "0",
          buanganAirLimbahRumahTangga: "0",
          saranaPengelolaanLimbahCair: "0",
          pemiliharaanSaranaPengelolaanLimbah: "0",
          jenisTempatPembuanganAirTinja: "0",
          kepemilikanKamarMandiDanJamban: "0",
          jumlahJamban: "0",
          jenisKloset: "0",
          jenisTangkiSeptik: "0",
          materialTangkiSeptik: "0",
          alasTangkiSeptik: "0",
          lubangPenyedotan: "0",
          posisiTangkiSeptik: "0",
          jarakTangkiSeptikDenganSumberAir: "0",
          sumberAirMinum: "0"
        };
      }
  
      return updatedData;
    });
  };
  
  const handleFormSubmit = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/updatequestionnaires/${selectedItem.id}`,
        selectedItem,
        { withCredentials: true }
      );
      
      setIsModalOpen(false);
      alert("Data berhasil diperbarui.");
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating data:", error);
      
      if (error.response) {
        console.log("Server response:", error.response.data);
        alert(error.response.data.message || "Terjadi kesalahan saat memperbarui data.");
      } else {
        alert("Terjadi kesalahan jaringan atau server.");
      }
    }
  };
  
  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedItem((prevData) => ({
            ...prevData,
            titikKoordinatRumah: `${latitude}, ${longitude}`,
            manualTitikKoordinatRumah: "",
          }));
        },
        (error) => {
          setErrorMessage("Error getting coordinates: " + error.message);
          setModalOpen(true); 
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setModalOpen(true); 
    }
  };

  // const handleButtonClick = () => {
  //   document.getElementById("fileInput").click();
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  //   if (file) {
  //     handleUploadExcel(file);  // Automatically upload once a file is selected
  //   }
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleButtonClick = () => {
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
      setSelectedFile(null); // Reset setelah berhasil upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat mengunggah file."
      );
    }
  };
  
 
  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/download`,
        {
          params: { kecamatan: selectedKecamatan },
          responseType: "blob", 
          withCredentials: true,
        }
      );

      // Unduh file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "questionnaires.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengunduh data. Pastikan Anda memilih kecamatan yang benar.");
    }
  };
  const handleDetailClick = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/maps/${id}`,{
        withCredentials:true
      });
      if (response.status === 200) {
        setSelectedItem(response.data); 
        setModalOpen(true); 
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
      const response = await axios.get(`${process.env.REACT_APP_URL}/getquestionnaires/${id}`,{
        withCredentials:true
      });
      if (response.data && response.data.fotos && response.data.fotos.length > 0) {
        setPhotoUrl(`${process.env.REACT_APP_URL}/${response.data.fotos[0].foto_rumah}`,{
          withCredentials:true
        });
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
  const validateDate = (date) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[0-2])[-/]\d{4}$/;
    return datePattern.test(date);
};
  return (
   <div>
     {/* <MyNavbar /> */}
     <div
  style={{
    marginLeft: window.innerWidth >= 768 ? "200px" : "20px", 
  }}
>
  <Container fluid className="data-recap-page p-6">
    <Row className="justify-content-center"></Row>

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

  <div className="filter-item">
  <label htmlFor="searchName">Cari Nama:</label>
  <input
    type="text"
    id="searchName"
    name="searchName"
    value={filters.searchName || ""}
    onChange={handleFilterChange}
    placeholder="Masukkan nama lengkap"
  />
    <label htmlFor="kecamatan">Kecamatan:</label>
    <select
      id="kecamatan"
      name="kecamatan"
      value={filters.kecamatan}
      onChange={handleFilterChange}
    >
      <option value="">Pilih Kecamatan</option>
      <option value="Semua Kecamatan">Semua Kecamatan</option>
      {Object.keys(kecamatanOptions).map((kecamatan) => (
        <option key={kecamatan} value={kecamatan}>
          {kecamatan}
        </option>
      ))}
    </select>
  </div>
  {filters.kecamatan && filters.kecamatan !== "Semua Kecamatan" && (
    <div className="filter-item">
      <label htmlFor="desaKelurahan">Desa/Kelurahan:</label>
      <select
        id="desaKelurahan"
        name="desaKelurahan"
        value={filters.desaKelurahan}
        onChange={handleFilterChange}
      >
        <option value="">Pilih Desa/Kelurahan</option>
        {kecamatanOptions[filters.kecamatan].map((desa) => (
          <option key={desa} value={desa}>
            {desa}
          </option>
        ))}
      </select>
    </div>
  )}
  <div className="filter-item">
    <label htmlFor="kategori">Kategori:</label>
    <select
      id="kategori"
      name="kategoriStatusRumah"
      value={filters.kategoriStatusRumah}
      onChange={handleFilterChange}
    >
      <option value="">Pilih Kategori & Status Rumah</option>
      <option value="Rumah Layak Huni - Berpenghuni">Rumah Layak Huni - Berpenghuni</option>
      <option value="Rumah Layak Huni - Tidak Berpenghuni">Rumah Layak Huni - Tidak Berpenghuni</option>
      <option value="Rumah Tidak Layak Huni - Berpenghuni">Rumah Tidak Layak Huni - Berpenghuni</option>
      <option value="Rumah Tidak Layak Huni - Tidak Berpenghuni">Rumah Tidak Layak Huni - Tidak Berpenghuni</option>
    </select>
  </div>
  <div className="filter-item">
    <label htmlFor="user">User:</label>
    <select
      id="user"
      name="user"
      value={filters.user}
      onChange={handleFilterChange}
    >
      <option value="">Pilih User</option>
      {userOptions.map((user) => (
        <option key={user.id} value={user.username}>
          {user.username}
        </option>
      ))}
    </select>
  </div>
</div>

          <div className="table-wrapper">
          <Input
    type="file"
    id="fileInput"
    style={{ display: "none" }}
    onChange={(e) => setSelectedFile(e.target.files[0])}
  />
 {user && user.role === "admin" && (
  <div className="d-flex align-items-center gap-3 mt-3">
    <input
      type="file"
      id="fileInput"
      style={{ display: "none" }}
      onChange={(e) => setSelectedFile(e.target.files[0])}
    />

    <Button
      color="primary"
      onClick={() => document.getElementById("fileInput").click()}
      className="px-4 py-2 fw-bold"
      style={{
        borderRadius: "8px",
        backgroundImage: "linear-gradient(135deg, #1abc9c, #3498db)",
        color: "#fff",
        border: "none",
        minWidth: "150px",
      }}
    >
      {selectedFile ? `File: ${selectedFile.name}` : "Pilih File"}
    </Button>

    <Button
      color="success"
      onClick={handleUploadExcel}
      className="px-4 py-2 fw-bold"
      style={{
        borderRadius: "8px",
        minWidth: "120px",
      }}
      disabled={!selectedFile}
    >
      Upload
    </Button>
  </div>
)}


{user && user.role === "admin" &&
<div className="filter-item">
      <label htmlFor="kecamatan" style={{ fontWeight: "bold", marginBottom: "10px" }}>
        Pilih Kecamatan (Export Data):
      </label>
      <select
        id="kecamatan"
        value={selectedKecamatan}
        onChange={(e) => setSelectedKecamatan(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <option value="">Semua Kecamatan</option>
        <option value="Taliwang">Taliwang</option>
        <option value="Seteluk">Seteluk</option>
        <option value="Poto Tano">Poto Tano</option>
        <option value="Brang Rea">Brang Rea</option>
        <option value="Brang Ene">Brang Ene</option>
        <option value="Jereweh">Jereweh</option>
        <option value="Maluk">Maluk</option>
        <option value="Sekongkang">Sekongkang</option>
      </select>
      <Button
        color="primary"
        onClick={handleExportExcel}
        className="me-2"
        style={{
          borderRadius: "10px",
          backgroundImage: "linear-gradient(135deg, #1abc9c, #3498db)",
          color: "#fff",
          border: "none",
          width: "100%",
          padding: "10px",
        }}
      >
        Export to Excel
      </Button>
    </div>
}
<Button
  color="primary"
  className="btn-custom text-center"
  style={{
    borderRadius: "10px",
    backgroundImage: "linear-gradient(135deg, #1abc9c, #3498db)",
    color: "#fff",
    border: "none",
  }}
>
  <NavLink
    to="/questionnaire"
    className="d-flex align-items-center justify-content-center text-white"
    style={{
      textDecoration: "none",
      color: "inherit", // Pastikan teks mengikuti warna tombol
    }}
  >
    <FaPlus className="icon me-2" />
    Tambah Data
  </NavLink>
</Button>
{user && user.role === "admin" && 
  <div
  style={{
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  }}
>
  <p
    style={{
      textAlign: "center",
      color: "#2c3e50",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
   Hapus berdasarkan Desa/Kelurahan
  </p>

  <div style={{ marginBottom: "20px" }}>
    <label
      htmlFor="kecamatan"
      style={{
        display: "block",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#34495e",
      }}
    >
      Pilih Kecamatan:
    </label>
    <select
      id="kecamatan"
      value={kecamatan}
      onChange={(e) => setKecamatan(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    >
      <option value="">Pilih Kecamatan</option>
      {Object.keys(kecamatanOptions).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  </div>

  <div style={{ marginBottom: "20px" }}>
    <label
      htmlFor="desaKelurahan"
      style={{
        display: "block",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#34495e",
      }}
    >
      Pilih Desa/Kelurahan:
    </label>
    <select
      id="desaKelurahan"
      value={desaKelurahan}
      onChange={(e) => setDesaKelurahan(e.target.value)}
      disabled={!kecamatan}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: kecamatan ? "#fff" : "#f0f0f0",
      }}
    >
      <option value="">Pilih Desa/Kelurahan</option>
      {kecamatan &&
        kecamatanOptions[kecamatan].map((desa) => (
          <option key={desa} value={desa}>
            {desa}
          </option>
        ))}
    </select>
  </div>

  <button
    onClick={handleDelete}
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundImage: "linear-gradient(135deg, #1abc9c, #3498db)",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
    }}
    onMouseOver={(e) =>
      (e.target.style.backgroundImage =
        "linear-gradient(135deg, #16a085, #2980b9)")
    }
    onMouseOut={(e) =>
      (e.target.style.backgroundImage =
        "linear-gradient(135deg, #1abc9c, #3498db)")
    }
  >
    Hapus Data
  </button>
</div>
}
    {/* <DashboardWidget
  content={
    <>
      <Button color="primary" onClick={handleButtonClick} className="me-2">
        {selectedFile ? `Upload File: ${selectedFile.name}` : "Pilih dan Upload File"}
      </Button>
      <Button color="primary" onClick={handleExportExcel} className="me-2">
        Export to Excel
      </Button>
      <Button color="primary" className="btn-custom text-center">
        <NavLink
          to="/questionnaire"
          className="d-flex align-items-center justify-content-center text-white"
          style={{ textDecoration: "none" }}
        >
          <FaHome className="icon me-2" />
          Tambah Data
        </NavLink>
      </Button>
    </>
  }
/> */}

            <Table responsive className="mt-3">
              <thead>
              <tr className="table-header">
  <th>No</th>
  <th>Nomor Blok</th>
  <th>Nomor Peta</th>
  <th>Nama Lengkap KK</th>
  <th>Alamat Rumah</th>
  <th>Desa/Kelurahan</th>
  <th>Kecamatan</th>
  <th>Kategori</th>
  <th>Detail</th>
  <th>Foto</th>
  {user && user.role === "admin" && <th>Aksi</th>}
  <th>Maps</th>
</tr>
</thead>
<tbody>
  {currentRows.map((item, index) => (
    <React.Fragment key={index}>
      <tr>
        <td>{index + 1}</td>
        <td>{item.nomorUrut}</td>
        <td>{item.nomorRumahPadaPeta}</td>
        <td>{item.namaLengkapKK}</td>
        <td>{item.alamatRumah}</td>
        <td>{item.desaKelurahan}</td>
        <td>{item.kecamatan}</td>
        <td>{item.kategori}</td>
      <td>
  <FaEye
    style={{ cursor: "pointer", color: "#007bff" }}
    onClick={() => handleDetailModalOpen(item)}
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

                  {user && user.role === "admin" && (
                    <Button
                      variant="outline-danger"
                      onClick={() => deleteData(item.id)}
                      size="sm"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <FaTrash style={{ marginRight: "5px" }} /> Delete
                    </Button>
                  )}
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
                          
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              <tr>
              <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} style={{ paddingTop: "40px" }}>
  <ModalHeader toggle={() => setModalOpen(false)}>Detail Lokasi</ModalHeader>
  
  <ModalBody style={{ maxHeight: "60vh", overflowY: "auto", padding: "10px" }}>
    {selectedItem && (selectedItem.titikKoordinatRumah || selectedItem.manualTitikKoordinatRumah) ? (
      (() => {
        const koordinat = selectedItem.titikKoordinatRumah || selectedItem.manualTitikKoordinatRumah;
        const [latitude, longitude] = koordinat
          .split(',')
          .map(coord => parseFloat(coord.trim()));

        if (isNaN(latitude) || isNaN(longitude)) {
          return <p style={{ textAlign: "center" }}>Koordinat tidak valid.</p>;
        }

        return (
          <>
            <p><strong>Kecamatan:</strong> {selectedItem.kecamatan}</p>
            <p><strong>Desa/Kelurahan:</strong> {selectedItem.desaKelurahan}</p>
            <p><strong>Koordinat:</strong> {koordinat}</p>

            {/* Peta dengan tinggi lebih kecil */}
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{ height: "300px", width: "100%", marginTop: "10px" }}
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
      <p style={{ textAlign: "center" }}>Koordinat tidak tersedia</p>
    )}
  </ModalBody>

  <ModalFooter>
    <Button color="secondary" onClick={() => setModalOpen(false)}>Tutup</Button>
  </ModalFooter>
</Modal>


  </tr>
  
            </Table>
                  {/* Photo Modal */}
                  <Modal isOpen={showPhotoModal} toggle={handleClosePhotoModal} style={{ paddingTop: "40px" }}>
  <ModalHeader toggle={handleClosePhotoModal}>Foto Rumah</ModalHeader>
  <ModalBody style={{ maxHeight: "60vh", overflowY: "auto", textAlign: "center" }}>
    {photoUrl ? (
      <img 
        src={photoUrl} 
        alt="Foto Rumah" 
        className="img-fluid"
        style={{ maxWidth: "100%", height: "auto", maxHeight: "300px" }} 
      />
    ) : (
      <p>Foto tidak tersedia</p>
    )}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={handleClosePhotoModal}>Close</Button>
  </ModalFooter>
</Modal>

      <Modal isOpen={isDetailModalOpen} toggle={handleDetailModalClose}  style={{ paddingTop: "40px" }} >
  <ModalHeader 
    toggle={handleDetailModalClose} 
    style={{ paddingTop: "20px" }} // Tambahkan padding di atas
  >
    Detail Data
  </ModalHeader>
  <ModalBody style={{ maxHeight: "60vh", overflowY: "auto" }}>
    {detailData ?(
    <div>
      <p><strong>Status Rumah:</strong> {detailData.statusrumah}</p>
      <p><strong>Nomor Blok:</strong> {detailData.nomorUrut}</p>
      <p><strong>Nomor Rumah Pada Peta:</strong> {detailData.nomorRumahPadaPeta}</p>
      <p><strong>Nama Lengkap KK:</strong> {detailData.namaLengkapKK}</p>
      <p><strong>Usia:</strong> {detailData.usia} Tahun</p>
      <p><strong>Tanggal Lahir:</strong> {detailData.tanggallahir ? moment(detailData.tanggallahir).format('DD/MM/YYYY') : 'Tidak tersedia'}</p>
      <p><strong>Jenis Kelamin:</strong> {detailData.jenisKelamin}</p>
      <p><strong>Nomor KK:</strong> {detailData.nomorKK}</p>
      <p><strong>Nomor KTP:</strong> {detailData.nomorKTP}</p>
      <p><strong>Asal KTP:</strong> {detailData.asalKTP}</p>
      <p><strong>Jumlah KK:</strong> {detailData.jumlahKK}</p>
      <p><strong>Jumlah Penghuni:</strong> {detailData.jumlahPenghuni}</p>
      <p><strong>Alamat Rumah:</strong> {detailData.alamatRumah}</p>
      <p><strong>Kecamatan:</strong> {detailData.kecamatan}</p>
      <p><strong>Desa/Kelurahan:</strong> {detailData.desaKelurahan}</p>
      <p><strong>Pendidikan Terakhir:</strong> {detailData.pendidikanTerakhir}</p>
      <p><strong>Pekerjaan:</strong> {detailData.pekerjaan}</p>
      <p><strong>Fungsi Bangunan:</strong> {detailData.fungsiBangunan}</p>
      <p><strong>Penghasilan:</strong> {detailData.penghasilan}</p>
      <p><strong>Status Kepemilikan Rumah:</strong> {detailData.statusKepemilikanRumah}</p>
      <p><strong>Aset Rumah di Tempat Lain:</strong> {detailData.asetRumahDiTempatLain}</p>
      <p><strong>Status Kepemilikan Tanah:</strong> {detailData.statusKepemilikanTanah}</p>
      <p><strong>Aset Tanah di Tempat Lain:</strong> {detailData.asetTanahDiTempatLain}</p>
      <p><strong>Sumber Penerangan:</strong> {detailData.sumberPenerangan}</p>
      <p><strong>Daya Listrik:</strong> {detailData.dayaListrik}</p>
      <p><strong>Bantuan Perumahan:</strong> {detailData.bantuanPerumahan}</p>
      <p><strong>Jenis Rumah:</strong> {detailData.modelRumah}</p>
      <p><strong>Pondasi:</strong> {detailData.pondasi}</p>
      <p><strong>Kolom:</strong> {detailData.kolom}</p>
      <p><strong>Rangka Atap:</strong> {detailData.rangkaAtap}</p>
      <p><strong>Plafon:</strong> {detailData.plafon}</p>
      <p><strong>Balok:</strong> {detailData.balok}</p>
      <p><strong>Sloof:</strong> {detailData.sloof}</p>
      <p><strong>Pintu/Jendela/Konsen:</strong> {detailData.pintuJendelaKonsen}</p>
      <p><strong>Ventilasi:</strong> {detailData.ventilasi}</p>
      <p><strong>Material Lantai Terluas:</strong> {detailData.materialLantaiTerluas}</p>
      <p><strong>Kondisi Lantai:</strong> {detailData.kondisiLantai}</p>
      <p><strong>Material Dinding Terluas:</strong> {detailData.materialDindingTerluas}</p>
      <p><strong>Kondisi Dinding:</strong> {detailData.kondisiDinding}</p>
      <p><strong>Material Penutup Atap Terluas:</strong> {detailData.materialPenutupAtapTerluas}</p>
      <p><strong>Kondisi Penutup Atap:</strong> {detailData.kondisiPenutupAtap}</p>
      <p><strong>Luas Rumah:</strong> {detailData.luasRumah}</p>
      <p><strong>Luas Tanah:</strong> {detailData.luasTanah}</p>
      <p><strong>Buangan Air Limbah Rumah Tangga:</strong> {detailData.buanganAirLimbahRumahTangga}</p>
      <p><strong>Sarana Pengelolaan Limbah Cair:</strong> {detailData.saranaPengelolaanLimbahCair}</p>
      <p><strong>Pemeliharaan Sarana Pengelolaan Limbah:</strong> {detailData.pemiliharaanSaranaPengelolaanLimbah}</p>
      <p><strong>Jenis Tempat Pembuangan Air Tinja:</strong> {detailData.jenisTempatPembuanganAirTinja}</p>
      <p><strong>Kepemilikan Kamar Mandi dan Jamban:</strong> {detailData.kepemilikanKamarMandiDanJamban}</p>
      <p><strong>Jumlah Jamban:</strong> {detailData.jumlahJamban}</p>
      <p><strong>Jenis Kloset:</strong> {detailData.jenisKloset}</p>
      <p><strong>Jenis Tangki Septik:</strong> {detailData.jenisTangkiSeptik}</p>
      <p><strong>Material Tangki Septik:</strong> {detailData.materialTangkiSeptik}</p>
      <p><strong>Alas Tangki Septik:</strong> {detailData.alasTangkiSeptik}</p>
      <p><strong>Lubang Penyedotan:</strong> {detailData.lubangPenyedotan}</p>
      <p><strong>Posisi Tangki Septik:</strong> {detailData.posisiTangkiSeptik}</p>
      <p><strong>Jarak Tangki Septik dengan Sumber Air:</strong> {detailData.jarakTangkiSeptikDenganSumberAir}</p>
      <p><strong>Sumber Air Minum:</strong> {detailData.sumberAirMinum}</p>
      <p><strong>Titik Koordinat Rumah:</strong> {detailData.titikKoordinatRumah}</p>
      <p><strong>Manual Titik Koordinat Rumah:</strong> {detailData.manualTitikKoordinatRumah}</p>
      <p><strong>Tanggal Pendataan:</strong> {detailData.tanggalPendataan}</p>
      <p><strong>Nama Surveyor:</strong> {detailData.Admin?.username || "Data tidak tersedia"}</p>
      <p><strong>Skor:</strong> {detailData.score}</p>
      <p><strong>Kategori:</strong> {detailData.kategori}</p>
      <p><strong>Catatan:</strong> {detailData.catatan || "Tidak ada catatan"}</p>
    </div>
  ) : (
    <p>Data tidak tersedia</p>
  )}
</ModalBody>

  <ModalFooter>
    <Button color="secondary" onClick={handleDetailModalClose}>
      Tutup
    </Button>
  </ModalFooter>
</Modal>
             

            {selectedItem && (
        <Modal isOpen={isModalOpen} toggle={handleModalToggle} style={{ paddingTop: "40px" }}>
           <ModalHeader 
    toggle={handleModalToggle} 
    className="custom-modal-header" // Tambahkan class
  >
   Edit Data
  </ModalHeader>
          {/* <ModalHeader toggle={handleModalToggle}></ModalHeader> */}
          <ModalBody style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <FormGroup>
                <Label for="statusrumah">Status Rumah</Label>
                <Input 
                  type="select" 
                  name="statusrumah" 
                  id="statusrumah" 
                  value={selectedItem.statusrumah || ""} 
                  onChange={handleInputChange}
                >
                  <option value="">Pilih</option>
                  <option value="Tidak Berpenghuni">Tidak Berpenghuni</option>
                  <option value="Berpenghuni">Berpenghuni</option>
                </Input>
                {errors.statusrumah && <div className="error-message">{errors.statusrumah}</div>}
              </FormGroup>
        
         
          
          <FormGroup>
            <Label for="nomorUrut">1. Nomor Blok</Label>
            <Input type="number" name="nomorUrut" id="nomorUrut" value={selectedItem.nomorUrut || ""} onChange={handleInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="nomorRumahPadaPeta">2. Nomor Peta</Label>
            <Input type="number" name="nomorRumahPadaPeta" id="nomorRumahPadaPeta" value={selectedItem.nomorRumahPadaPeta || ""} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="namaLengkapKK">3. Nama Lengkap KK</Label>
            <Input type="text" name="namaLengkapKK" value={selectedItem.namaLengkapKK || ""} onChange={handleInputChange} />
          </FormGroup>
        <Label for="tanggallahir">4. Tanggal lahir</Label>
            <Input
                type="date"
                name="tanggallahir"
                id="tanggallahir"
                value={selectedItem.tanggallahir}
                onChange={handleInputChange}
                disabled={selectedItem.statusrumah === "Tidak Berpenghuni"}
                className="input-center"
                placeholder="DD/MM/YYYY"
            />
            {errors.tanggallahir && (
                <div className="error-message">{errors.tanggallahir}</div>
            )}
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
            {/* <FormGroup>
              <Label for="jumlahKK">9. Jumlah KK Dalam Rumah</Label>
              <Input type="number" name="jumlahKK" id="jumlahKK" value={selectedItem.jumlahKK || ""} onChange={handleInputChange} className="input-center" />
              {errors.jumlahKK && <div className="error-message">{errors.jumlahKK}</div>}
            </FormGroup> */}
            <FormGroup>
              <Label for="jumlahKK">9. Jumlah KK Dalam Rumah</Label>
              <Input
                type="number"
                name="jumlahKK"
                id="jumlahKK"
                value={selectedItem.jumlahKK || ""}
                onChange={handleInputChange}
                // disabled={formData.statusrumah === "Tidak Berpenghuni"}
                className="input-center"
              />
              {errors.jumlahKK && <div className="error-message">{errors.jumlahKK}</div>}

              {/* Conditionally render "Backlog" message if jumlahKK is more than 1 */}
              {isBacklog && (
                <div className="info-message">
                  Rumah ini dianggap "Backlog" karena terdapat lebih dari 1 KK.
                </div>
              )}
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
                <option value="Karyawan BUMN">Karyawan BUMN</option>
                <option value="Wirausaha">Wirausaha</option>
                <option value="Petani/Pekebun">Petani/Pekebun</option>
                <option value="Nelayan">Nelayan</option>
                <option value="Pedagang">Pedagang</option>
                <option value="Karyawan Swasta">Karyawan Swasta</option>
                <option value="Tukang/Montir">Tukang/Montir</option>
                <option value="Buruh Harian">Buruh Harian</option>
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
                <option value="0">Rp. 0</option>
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
              <Label for="modelRumah">25. Jenis Rumah</Label>
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
              <Input type="number" name="jumlahJamban" id="jumlahJamban" value={selectedItem.jumlahJamban} onChange={handleInputChange} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} className="input-center" />
              {errors.jumlahJamban && <div className="error-message">{errors.jumlahJamban}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisKloset">48. Jenis Kloset</Label>
              <Input type="select" name="jenisKloset" id="jenisKloset" value={selectedItem.jenisKloset} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Leher Angsa">Leher Angsa</option>
                <option value="Cubluk/Cemplung">Cubluk/Cemplung</option>
                <option value="Plengsengan">Plengsengan</option>
              </Input>
              {errors.jenisKloset && <div className="error-message">{errors.jenisKloset}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisTangkiSeptik">49. Jenis Tangki Septik</Label>
              <Input type="select" name="jenisTangkiSeptik" id="jenisTangkiSeptik" value={selectedItem.jenisTangkiSeptik} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Pabrikasi">Pabrikasi</option>
                <option value="Konvensional">Konvensional</option>
              </Input>
              {errors.jenisTangkiSeptik && <div className="error-message">{errors.jenisTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialTangkiSeptik">50. Material Tangki Septik</Label>
              <Input type="select" name="materialTangkiSeptik" id="materialTangkiSeptik" value={selectedItem.materialTangkiSeptik} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
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
              <Input type="select" name="alasTangkiSeptik" id="alasTangkiSeptik" value={selectedItem.alasTangkiSeptik} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Kedap">Kedap</option>
                <option value="Tidak Kedap">Tidak Kedap</option>
              </Input>
              {errors.alasTangkiSeptik && <div className="error-message">{errors.alasTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="lubangPenyedotan">52. Lubang Penyedotan</Label>
              <Input type="select" name="lubangPenyedotan" id="lubangPenyedotan" value={selectedItem.lubangPenyedotan} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.lubangPenyedotan && <div className="error-message">{errors.lubangPenyedotan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="posisiTangkiSeptik">53. Posisi Tangki Septik</Label>
              <Input type="select" name="posisiTangkiSeptik" id="posisiTangkiSeptik" value={selectedItem.posisiTangkiSeptik} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
                <option value="">Pilih</option>
                <option value="Dalam Rumah">Dalam Rumah</option>
                <option value="Luar Rumah">Luar Rumah</option>
              </Input>
              {errors.posisiTangkiSeptik && <div className="error-message">{errors.posisiTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jarakTangkiSeptikDenganSumberAir">54. Jarak Tangki Septik Dengan Sumber Air</Label>
              <Input type="select" name="jarakTangkiSeptikDenganSumberAir" id="jarakTangkiSeptikDenganSumberAir" value={selectedItem.jarakTangkiSeptikDenganSumberAir} disabled ={selectedItem.kepemilikanKamarMandiDanJamban === "Tidak Ada"} onChange={handleInputChange}>
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
            <FormGroup>
              <Label for="catatan">58. Catatan</Label>
              <Input type="text" name="catatan" id="catatan" value={selectedItem.catatan} onChange={handleInputChange} className="input-center" />
              {errors.catatan && <div className="error-message">{errors.catatan}</div>}
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
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
      <div className="pagination" style={{ display: 'inline-flex', gap: '8px' }}>
  {[...Array(totalPages)].map((_, i) => (
    <Button
      key={i + 1}
      onClick={() => handlePageChange(i + 1)}
      color={currentPage === i + 1 ? "primary" : "secondary"}
      sx={{
        minWidth: '40px',   
        height: '40px',      //
        padding: '0',       
        borderRadius: '4px',
        '&:active': {
          transform: 'none', 
        },
        '&:focus': {
          outline: 'none',
        },
      }}
    >
      {i + 1}
    </Button>
  ))}
</div>

</div>

          </div>
        </Col>
      </Row>
    </Container>
    </div>
    </div>
  );
};

export default DataRecapComponent;