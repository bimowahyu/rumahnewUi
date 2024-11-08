import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaLocationArrow } from "react-icons/fa";
import axios from "axios";
import MyNavbar from "../map/Navbar";
import "./QuestionnaireForm.css";

const QuestionnaireForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk data formulir
  const [formData, setFormData] = useState({
    statusrumah: "",
    nomorUrut: "",
    nomorRumahPadaPeta: "",
    namaLengkapKK: "",
    usia: "",
    jenisKelamin: "",
    nomorKK: "",
    nomorKTP: "",
    asalKTP: "",
    jumlahKK: "",
    jumlahPenghuni: "",
    alamatRumah: "",
    kecamatan: "",
    desaKelurahan: "",
    pendidikanTerakhir: "",
    pekerjaan: "",
    fungsiBangunan: "",
    penghasilan: "",
    statusKepemilikanRumah: "",
    asetRumahDiTempatLain: "",
    statusKepemilikanTanah: "",
    asetTanahDiTempatLain: "",
    sumberPenerangan: "",
    dayaListrik: "",
    bantuanPerumahan: "",
    modelRumah: "",
    pondasi: "",
    kolom: "",
    rangkaAtap: "",
    plafon: "",
    balok: "",
    sloof: "",
    pintuJendelaKonsen: "",
    ventilasi: "",
    materialLantaiTerluas: "",
    kondisiLantai: "",
    materialDindingTerluas: "",
    kondisiDinding: "",
    materialPenutupAtapTerluas: "",
    kondisiPenutupAtap: "",
    luasRumah: "",
    luasTanah: "",
    buanganAirLimbahRumahTangga: "",
    saranaPengelolaanLimbahCair: "",
    pemiliharaanSaranaPengelolaanLimbah: "",
    jenisTempatPembuanganAirTinja: "",
    kepemilikanKamarMandiDanJamban: "",
    jumlahJamban: "",
    jenisKloset: "",
    jenisTangkiSeptik: "",
    materialTangkiSeptik: "",
    alasTangkiSeptik: "",
    lubangPenyedotan: "",
    posisiTangkiSeptik: "",
    jarakTangkiSeptikDenganSumberAir: "",
    sumberAirMinum: "",
    titikKoordinatRumah: "",
    manualTitikKoordinatRumah: "",
    tanggalPendataan: "",
    namaSurveyor: "", // Otomatisasi nama surveyor
    kategori: "", // Otomatisasi kategori
    score: 0, // Otomatisasi score
  });

  const [errors, setErrors] = useState({});
  const [desaOptions, setDesaOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // useEffect(() => {
  //   console.log("ID yang diterima:", id); 
  //   if (id) {
  //     axios
  //       .get(`${process.env.REACT_APP_URL}/getquestionnaires/${id}`, { withCredentials: true })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           const questionnaireData = {
  //             ...response.data,
  //             kategori: response.data.kategori || "",
  //             score: response.data.score || 0,
  //           };
  //           setFormData(questionnaireData);
  //         } else {
  //           console.error("Gagal mengambil data:", response.statusText);
  //         }
  //       })
  //       .catch((error) => console.error("Error mengambil data:", error));
  //   }
  // }, [id]);
  
  

  useEffect(() => {
    const fetchSurveyorName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/me`, {
          withCredentials: true, 
        });
  
        if (response.status === 200) {
          setFormData((prevData) => ({
            ...prevData,
            namaSurveyor: response.data.username,
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
  }, [navigate]);
  

  // Update opsi desa berdasarkan kecamatan yang dipilih
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

    setDesaOptions(kecamatanDesa[formData.kecamatan.replace(/\s/g, "")] || []);
  }, [formData.kecamatan]);

  // Validasi form
  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "statusrumah",
      "nomorUrut",
      "nomorRumahPadaPeta",
      "namaLengkapKK",
      "usia",
      "jenisKelamin",
      "nomorKK",
      "nomorKTP",
      "asalKTP",
      "jumlahKK",
      "jumlahPenghuni",
      "alamatRumah",
      "kecamatan",
      "desaKelurahan",
      "pendidikanTerakhir",
      "pekerjaan",
      "fungsiBangunan",
      "penghasilan",
      "statusKepemilikanRumah",
      "asetRumahDiTempatLain",
      "statusKepemilikanTanah",
      "asetTanahDiTempatLain",
      "sumberPenerangan",
      "dayaListrik",
      "bantuanPerumahan",
      "modelRumah",
      "pondasi",
      "kolom",
      "rangkaAtap",
      "plafon",
      "balok",
      "sloof",
      "pintuJendelaKonsen",
      "ventilasi",
      "materialLantaiTerluas",
      "kondisiLantai",
      "materialDindingTerluas",
      "kondisiDinding",
      "materialPenutupAtapTerluas",
      "kondisiPenutupAtap",
      "luasRumah",
      "luasTanah",
      "buanganAirLimbahRumahTangga",
      "saranaPengelolaanLimbahCair",
      "pemiliharaanSaranaPengelolaanLimbah",
      "jenisTempatPembuanganAirTinja",
      "kepemilikanKamarMandiDanJamban",
      "jumlahJamban",
      "jenisKloset",
      "jenisTangkiSeptik",
      "materialTangkiSeptik",
      "alasTangkiSeptik",
      "lubangPenyedotan",
      "posisiTangkiSeptik",
      "jarakTangkiSeptikDenganSumberAir",
      "sumberAirMinum",
      "tanggalPendataan",
      "namaSurveyor",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1").toUpperCase()} tidak boleh kosong.`;
      }
    });

    // Validasi khusus untuk Nomor KK dan Nomor KTP
    if (formData.nomorKK && formData.nomorKK.length !== 16) {
      newErrors.nomorKK = "Nomor KK harus terdiri dari 16 digit";
    }
    if (formData.nomorKTP && formData.nomorKTP.length !== 16) {
      newErrors.nomorKTP = "Nomor KTP harus terdiri dari 16 digit";
    }

    // Validasi untuk Titik Koordinat Rumah dan Manual Titik Koordinat Rumah
    if (!formData.titikKoordinatRumah && !formData.manualTitikKoordinatRumah) {
      newErrors.titikKoordinatRumah = "Titik Koordinat Rumah atau Manual Titik Koordinat Rumah harus diisi";
    } else if (formData.titikKoordinatRumah && formData.manualTitikKoordinatRumah) {
      newErrors.titikKoordinatRumah = "Hanya satu dari Titik Koordinat Rumah atau Manual Titik Koordinat Rumah yang boleh diisi";
    }

    // Validasi untuk Tanggal Pendataan
    if (formData.tanggalPendataan && new Date(formData.tanggalPendataan) > new Date()) {
      newErrors.tanggalPendataan = "Tanggal Pendataan tidak boleh lebih dari tanggal hari ini";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi untuk menangani perubahan input
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  
  //   // Update formData dengan nilai baru
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData ((prevData) => ({
      ...prevData,
      [name]: value,
      // Kosongkan titikKoordinatRumah jika manualTitikKoordinatRumah diisi, dan sebaliknya
      ...(name === "manualTitikKoordinatRumah" ? { titikKoordinatRumah: "" } : {}),
      ...(name === "titikKoordinatRumah" ? { manualTitikKoordinatRumah: "" } : {}),
    }));
  
  
    // Validasi untuk nomorKK dan nomorKTP agar 16 digit
    if (name === "nomorKK" || name === "nomorKTP") {
      if (value.length !== 16) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name === "nomorKK" ? "Nomor KK" : "Nomor KTP"} harus terdiri dari 16 digit`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Jawaban Tidak Boleh Kosong",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  
    // Jika status rumah adalah "kosong", isi field tertentu dengan "-"
    if (name === "statusrumah" && value === "kosong") {
      setFormData((prevData) => ({
        ...prevData,
        usia: "0",
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
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Validasi form
    if (!validateForm()) {
      console.log(errorMessage);
      return;
    }

    // Validasi koordinat
    const hasCoordinates = formData.titikKoordinatRumah || formData.manualTitikKoordinatRumah;
    if (!hasCoordinates) {
      console.log("Either 'titikKoordinatRumah' atau 'manualTitikKoordinatRumah' harus diisi.");
      setErrorMessage("Either 'Titik Koordinat Rumah' atau 'Manual Titik Koordinat Rumah' harus diisi.");
      setModalOpen(true); // Tampilkan modal error
      return;
    }

    try {
      // Tentukan metode berdasarkan apakah `id` ada atau tidak
      const method = id ? "PATCH" : "POST";
      const BASE_URL = process.env.REACT_APP_URL
      const url = id ? `${BASE_URL}/updatequestionnaires/${id}` : `${BASE_URL}/createquestionnaires`;
      
      // Kirim data tanpa `kategori` dan `score`
      const { kategori, score, ...dataToSend } = formData;
    
      const response = await axios({
        method,
        url,
        data: dataToSend,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Pastikan session cookie terkirim
      });
    
      if (response.status === 200 || response.status === 201) {
        console.log("Data berhasil dikirim:", response.data);
        setSuccessMessage("Data Berhasil Tersimpan"); // Set pesan sukses
        setModalOpen(true); // Tampilkan modal sukses
        
        // Reset form data setelah berhasil menyimpan, kecuali namaSurveyor
        setFormData({
          statusrumah:"",
          nomorUrut: "",
          nomorRumahPadaPeta: "",
          namaLengkapKK: "",
          usia: "",
          jenisKelamin: "",
          nomorKK: "",
          nomorKTP: "",
          asalKTP: "",
          jumlahKK: "",
          jumlahPenghuni: "",
          alamatRumah: "",
          kecamatan: "",
          desaKelurahan: "",
          pendidikanTerakhir: "",
          pekerjaan: "",
          fungsiBangunan: "",
          penghasilan: "",
          statusKepemilikanRumah: "",
          asetRumahDiTempatLain: "",
          statusKepemilikanTanah: "",
          asetTanahDiTempatLain: "",
          sumberPenerangan: "",
          dayaListrik: "",
          bantuanPerumahan: "",
          modelRumah: "",
          pondasi: "",
          kolom: "",
          rangkaAtap: "",
          plafon: "",
          balok: "",
          sloof: "",
          pintuJendelaKonsen: "",
          ventilasi: "",
          materialLantaiTerluas: "",
          kondisiLantai: "",
          materialDindingTerluas: "",
          kondisiDinding: "",
          materialPenutupAtapTerluas: "",
          kondisiPenutupAtap: "",
          luasRumah: "",
          luasTanah: "",
          buanganAirLimbahRumahTangga: "",
          saranaPengelolaanLimbahCair: "",
          pemiliharaanSaranaPengelolaanLimbah: "",
          jenisTempatPembuanganAirTinja: "",
          kepemilikanKamarMandiDanJamban: "",
          jumlahJamban: "",
          jenisKloset: "",
          jenisTangkiSeptik: "",
          materialTangkiSeptik: "",
          alasTangkiSeptik: "",
          lubangPenyedotan: "",
          posisiTangkiSeptik: "",
          jarakTangkiSeptikDenganSumberAir: "",
          sumberAirMinum: "",
          titikKoordinatRumah: "",
          manualTitikKoordinatRumah: "",
          tanggalPendataan: "",
          namaSurveyor: formData.namaSurveyor, // Nama surveyor tidak di-reset
          kategori: "", // Reset kategori
          score: 0, // Reset score
        });
    
        setErrorMessage(""); // Kosongkan pesan error
      } else {
        console.error("Gagal mengirim data:", response.statusText);
        setErrorMessage("Gagal mengirim data. Silakan coba lagi.");
        setModalOpen(true); // Tampilkan modal error
      }
    } catch (error) {
      // Tangani kesalahan dari server dengan rincian pesan error
      if (error.response && error.response.data && error.response.data.errors) {
        console.error("Detail error dari server:", JSON.stringify(error.response.data.errors, null, 2));
        const detailedErrors = error.response.data.errors
          .map((err) => `Field: ${err.field}, Message: ${err.message}`)
          .join("\n");
    
        setErrorMessage(`Error dari server:\n${detailedErrors}`);
      } else {
        console.error("Error mengirim data:", error.message);
        setErrorMessage("Gagal mengirim data. Silakan coba lagi.");
      }
    
      // Kosongkan pesan sukses dan tampilkan modal error
      setSuccessMessage("");
      setModalOpen(true);
    }
  }    

  // Toggle modal
  const toggleModal = () => setModalOpen(!modalOpen);

  // Get coordinates using Geolocation API
  const handleGetCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
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

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="12" md="10">
        <MyNavbar />
          <Form onSubmit={handleSubmit}>
            <h3>Formulir Pendataan:</h3>
            <FormGroup>
              <Label for="statusrumah">Status Rumah</Label>
              <Input type="select" name="statusrumah" id="statusrumah" value={formData.statusrumah} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="kosong">Kosong</option>
                <option value="Berpenghuni">Berpenghuni</option>
                
              </Input>
              {errors.sumberAirMinum && <div className="error-message">{errors.sumberAirMinum}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="nomorUrut">1. Nomor Data</Label>
              <Input type="number" name="nomorUrut" id="nomorUrut" value={formData.nomorUrut || ""} onChange={handleChange} className="input-center" />
              {errors.nomorUrut && <div className="error-message">{errors.nomorUrut}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="nomorRumahPadaPeta">2. Nomor Peta</Label>
              <Input type="number" name="nomorRumahPadaPeta" id="nomorRumahPadaPeta" value={formData.nomorRumahPadaPeta || ""} onChange={handleChange} className="input-center" />
              {errors.nomorRumahPadaPeta && <div className="error-message">{errors.nomorRumahPadaPeta}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="namaLengkapKK">3. Nama Lengkap KK</Label>
              <Input type="text" name="namaLengkapKK" id="namaLengkapKK" value={formData.namaLengkapKK} onChange={handleChange} className="input-center" />
              {errors.namaLengkapKK && <div className="error-message">{errors.namaLengkapKK}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="usia">4. Usia (Tahun)</Label>
              <Input type="number" name="usia" id="usia" value={formData.usia} onChange={handleChange} className="input-center" />
              {errors.usia && <div className="error-message">{errors.usia}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisKelamin">5. Jenis Kelamin</Label>
              <Input type="select" name="jenisKelamin" id="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Input>
              {errors.jenisKelamin && <div className="error-message">{errors.jenisKelamin}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="nomorKK">6. Nomor KK</Label>
              <Input type="text" name="nomorKK" id="nomorKK" value={formData.nomorKK || ""} onChange={handleChange} className={`input-center ${errors.nomorKK ? "is-invalid" : ""}`} />
              {errors.nomorKK && <div className="invalid-feedback">{errors.nomorKK}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="nomorKTP">7. Nomor KTP</Label>
              <Input type="text" name="nomorKTP" id="nomorKTP" value={formData.nomorKTP || ""} onChange={handleChange} className={`input-center ${errors.nomorKTP ? "is-invalid" : ""}`} />
              {errors.nomorKTP && <div className="invalid-feedback">{errors.nomorKTP}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="asalKTP">8. Asal KTP</Label>
              <Input type="select" name="asalKTP" id="asalKTP" value={formData.asalKTP} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="KSB">KSB</option>
                <option value="Luar KSB">Luar KSB</option>
              </Input>
              {errors.asalKTP && <div className="error-message">{errors.asalKTP}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jumlahKK">9. Jumlah KK Dalam Rumah</Label>
              <Input type="number" name="jumlahKK" id="jumlahKK" value={formData.jumlahKK || ""} onChange={handleChange} className="input-center" />
              {errors.jumlahKK && <div className="error-message">{errors.jumlahKK}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jumlahPenghuni">10. Jumlah Penghuni</Label>
              <Input type="number" name="jumlahPenghuni" id="jumlahPenghuni" value={formData.jumlahPenghuni || ""} onChange={handleChange} className="input-center" />
              {errors.jumlahPenghuni && <div className="error-message">{errors.jumlahPenghuni}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="alamatRumah">11. Alamat Rumah (RT/RW/Dusun/Lingkungan)</Label>
              <Input type="text" name="alamatRumah" id="alamatRumah" value={formData.alamatRumah} onChange={handleChange} className="input-center" />
              {errors.alamatRumah && <div className="error-message">{errors.alamatRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kecamatan">12. Kecamatan</Label>
              <Input type="select" name="kecamatan" id="kecamatan" value={formData.kecamatan} onChange={handleChange}>
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
              <Input type="select" name="desaKelurahan" id="desaKelurahan" value={formData.desaKelurahan} onChange={handleChange}>
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
              <Input type="select" name="pendidikanTerakhir" id="pendidikanTerakhir" value={formData.pendidikanTerakhir} onChange={handleChange}>
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
              <Input type="select" name="pekerjaan" id="pekerjaan" value={formData.pekerjaan} onChange={handleChange}>
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
              <Input type="select" name="fungsiBangunan" id="fungsiBangunan" value={formData.fungsiBangunan} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Rumah Tinggal/Hunian">Rumah Tinggal/Hunian</option>
                <option value="Rumah Toko (RUKO)">Rumah Toko (RUKO)</option>
              </Input>
              {errors.fungsiBangunan && <div className="error-message">{errors.fungsiBangunan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="penghasilan">17. Penghasilan/Bulan</Label>
              <Input type="select" name="penghasilan" id="penghasilan" value={formData.penghasilan} onChange={handleChange}>
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
              <Input type="select" name="statusKepemilikanRumah" id="statusKepemilikanRumah" value={formData.statusKepemilikanRumah} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Bukan Milik Sendiri">Bukan Milik Sendiri</option>
                <option value="Kontrak/Sewa">Kontrak/Sewa</option>
              </Input>
              {errors.statusKepemilikanRumah && <div className="error-message">{errors.statusKepemilikanRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="asetRumahDiTempatLain">19. Aset Rumah di Tempat lain</Label>
              <Input type="select" name="asetRumahDiTempatLain" id="asetRumahDiTempatLain" value={formData.asetRumahDiTempatLain} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.asetRumahDiTempatLain && <div className="error-message">{errors.asetRumahDiTempatLain}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="statusKepemilikanTanah">20. Status Kepemilikan Tanah</Label>
              <Input type="select" name="statusKepemilikanTanah" id="statusKepemilikanTanah" value={formData.statusKepemilikanTanah} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Bukan Milik Sendiri">Bukan Milik Sendiri</option>
                <option value="Tanah Negara">Tanah Negara</option>
              </Input>
              {errors.statusKepemilikanTanah && <div className="error-message">{errors.statusKepemilikanTanah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="asetTanahDiTempatLain">21. Aset Tanah di Tempat Lain</Label>
              <Input type="select" name="asetTanahDiTempatLain" id="asetTanahDiTempatLain" value={formData.asetTanahDiTempatLain} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.asetTanahDiTempatLain && <div className="error-message">{errors.asetTanahDiTempatLain}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sumberPenerangan">22. Sumber Penerangan</Label>
              <Input type="select" name="sumberPenerangan" id="sumberPenerangan" value={formData.sumberPenerangan} onChange={handleChange}>
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
              <Input type="select" name="dayaListrik" id="dayaListrik" value={formData.dayaListrik} onChange={handleChange}>
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
              <Input type="select" name="bantuanPerumahan" id="bantuanPerumahan" value={formData.bantuanPerumahan} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Pernah, >10 Tahun">Ya. &gt;10 Tahun</option>
                <option value="Pernah, <10 Tahun">Ya. &lt;10 Tahun</option>
                <option value="Tidak Pernah">Tidak Pernah</option>
              </Input>
              {errors.bantuanPerumahan && <div className="error-message">{errors.bantuanPerumahan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="modelRumah">25. Model Rumah</Label>
              <Input type="select" name="modelRumah" id="modelRumah" value={formData.modelRumah} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Permanen">Permanen</option>
                <option value="Semi Permanen">Semi Permanen</option>
                <option value="Panggung">Panggung</option>
              </Input>
              {errors.modelRumah && <div className="error-message">{errors.modelRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pondasi">26. Pondasi</Label>
              <Input type="select" name="pondasi" id="pondasi" value={formData.pondasi} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.pondasi && <div className="error-message">{errors.pondasi}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="kolom">27. Kolom</Label>
              <Input type="select" name="kolom" id="kolom" value={formData.kolom} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kolom && <div className="error-message">{errors.kolom}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="rangkaAtap">28. Rangka Atap</Label>
              <Input type="select" name="rangkaAtap" id="rangkaAtap" value={formData.rangkaAtap} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.rangkaAtap && <div className="error-message">{errors.rangkaAtap}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="plafon">29. Plafon</Label>
              <Input type="select" name="plafon" id="plafon" value={formData.plafon} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.plafon && <div className="error-message">{errors.plafon}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="balok">30. Balok</Label>
              <Input type="select" name="balok" id="balok" value={formData.balok} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.balok && <div className="error-message">{errors.balok}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sloof">31. Sloof</Label>
              <Input type="select" name="sloof" id="sloof" value={formData.sloof} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.sloof && <div className="error-message">{errors.sloof}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pintuJendelaKonsen">32. Pintu, Jendela, Konsen</Label>
              <Input type="select" name="pintuJendelaKonsen" id="pintuJendelaKonsen" value={formData.pintuJendelaKonsen} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.pintuJendelaKonsen && <div className="error-message">{errors.pintuJendelaKonsen}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="ventilasi">33. Ventilasi</Label>
              <Input type="select" name="ventilasi" id="ventilasi" value={formData.ventilasi} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.ventilasi && <div className="error-message">{errors.ventilasi}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialLantaiTerluas">34. Material Lantai Terluas</Label>
              <Input type="select" name="materialLantaiTerluas" id="materialLantaiTerluas" value={formData.materialLantaiTerluas} onChange={handleChange}>
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
              <Input type="select" name="kondisiLantai" id="kondisiLantai" value={formData.kondisiLantai} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiLantai && <div className="error-message">{errors.kondisiLantai}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialDindingTerluas">36. Material Dinding Terluas</Label>
              <Input type="select" name="materialDindingTerluas" id="materialDindingTerluas" value={formData.materialDindingTerluas} onChange={handleChange}>
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
              <Input type="select" name="kondisiDinding" id="kondisiDinding" value={formData.kondisiDinding} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiDinding && <div className="error-message">{errors.kondisiDinding}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialPenutupAtapTerluas">38. Material Penutup Atap Terluas</Label>
              <Input type="select" name="materialPenutupAtapTerluas" id="materialPenutupAtapTerluas" value={formData.materialPenutupAtapTerluas} onChange={handleChange}>
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
              <Input type="select" name="kondisiPenutupAtap" id="kondisiPenutupAtap" value={formData.kondisiPenutupAtap} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </Input>
              {errors.kondisiPenutupAtap && <div className="error-message">{errors.kondisiPenutupAtap}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="luasRumah">40. Luas Rumah (m²)</Label>
              <Input type="number" name="luasRumah" id="luasRumah" value={formData.luasRumah} onChange={handleChange} className="input-center" />
              {errors.luasRumah && <div className="error-message">{errors.luasRumah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="luasTanah">41. Luas Tanah (m²)</Label>
              <Input type="number" name="luasTanah" id="luasTanah" value={formData.luasTanah} onChange={handleChange} className="input-center" />
              {errors.luasTanah && <div className="error-message">{errors.luasTanah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="buanganAirLimbahRumahTangga">42. Buangan Air Limbah Rumah Tangga</Label>
              <Input type="select" name="buanganAirLimbahRumahTangga" id="buanganAirLimbahRumahTangga" value={formData.buanganAirLimbahRumahTangga} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Jaringan Perpipaan">Jaringan Perpipaan</option>
                <option value="Diresapkan">Diresapkan</option>
                <option value="Buang Bebas">Buang Bebas</option>
              </Input>
              {errors.buanganAirLimbahRumahTangga && <div className="error-message">{errors.buanganAirLimbahRumahTangga}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="saranaPengelolaanLimbahCair">43. Sarana Pengelolaan Limbah Cair Rumah Tangga</Label>
              <Input type="select" name="saranaPengelolaanLimbahCair" id="saranaPengelolaanLimbahCair" value={formData.saranaPengelolaanLimbahCair} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Berfungsi Baik">Berfungsi Baik</option>
                <option value="Tidak Berfungsi">Tidak Berfungsi</option>
                <option value="Tidak Tersedia">Tidak Tersedia</option>
              </Input>
              {errors.saranaPengelolaanLimbahCair && <div className="error-message">{errors.saranaPengelolaanLimbahCair}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="pemiliharaanSaranaPengelolaanLimbah">44. Pemeliharaan Sarana Pengelolaan Limbah Cair Rumah Tangga</Label>
              <Input type="select" name="pemiliharaanSaranaPengelolaanLimbah" id="pemiliharaanSaranaPengelolaanLimbah" value={formData.pemiliharaanSaranaPengelolaanLimbah} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Terpelihara">Terpelihara</option>
                <option value="Tidak Terpelihara">Tidak Terpelihara</option>
              </Input>
              {errors.pemiliharaanSaranaPengelolaanLimbah && <div className="error-message">{errors.pemiliharaanSaranaPengelolaanLimbah}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisTempatPembuanganAirTinja">45. Jenis Tempat Pembuangan Air Tinja</Label>
              <Input type="select" name="jenisTempatPembuanganAirTinja" id="jenisTempatPembuanganAirTinja" value={formData.jenisTempatPembuanganAirTinja} onChange={handleChange}>
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
              <Input type="select" name="kepemilikanKamarMandiDanJamban" id="kepemilikanKamarMandiDanJamban" value={formData.kepemilikanKamarMandiDanJamban} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Sendiri">Sendiri</option>
                <option value="Bersama/MCK Komunal">Bersama/MCK Komunal</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.kepemilikanKamarMandiDanJamban && <div className="error-message">{errors.kepemilikanKamarMandiDanJamban}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jumlahJamban">47. Jumlah Jamban</Label>
              <Input type="number" name="jumlahJamban" id="jumlahJamban" value={formData.jumlahJamban} onChange={handleChange} className="input-center" />
              {errors.jumlahJamban && <div className="error-message">{errors.jumlahJamban}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisKloset">48. Jenis Kloset</Label>
              <Input type="select" name="jenisKloset" id="jenisKloset" value={formData.jenisKloset} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Leher Angsa">Leher Angsa</option>
                <option value="Cubluk/Cemplung">Cubluk/Cemplung</option>
                <option value="Plengsengan">Plengsengan</option>
              </Input>
              {errors.jenisKloset && <div className="error-message">{errors.jenisKloset}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jenisTangkiSeptik">49. Jenis Tangki Septik</Label>
              <Input type="select" name="jenisTangkiSeptik" id="jenisTangkiSeptik" value={formData.jenisTangkiSeptik} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Pabrikasi">Pabrikasi</option>
                <option value="Konvensional">Konvensional</option>
              </Input>
              {errors.jenisTangkiSeptik && <div className="error-message">{errors.jenisTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="materialTangkiSeptik">50. Material Tangki Septik</Label>
              <Input type="select" name="materialTangkiSeptik" id="materialTangkiSeptik" value={formData.materialTangkiSeptik} onChange={handleChange}>
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
              <Input type="select" name="alasTangkiSeptik" id="alasTangkiSeptik" value={formData.alasTangkiSeptik} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Kedap">Kedap</option>
                <option value="Tidak Kedap">Tidak Kedap</option>
              </Input>
              {errors.alasTangkiSeptik && <div className="error-message">{errors.alasTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="lubangPenyedotan">52. Lubang Penyedotan</Label>
              <Input type="select" name="lubangPenyedotan" id="lubangPenyedotan" value={formData.lubangPenyedotan} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </Input>
              {errors.lubangPenyedotan && <div className="error-message">{errors.lubangPenyedotan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="posisiTangkiSeptik">53. Posisi Tangki Septik</Label>
              <Input type="select" name="posisiTangkiSeptik" id="posisiTangkiSeptik" value={formData.posisiTangkiSeptik} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Dalam Rumah">Dalam Rumah</option>
                <option value="Luar Rumah">Luar Rumah</option>
              </Input>
              {errors.posisiTangkiSeptik && <div className="error-message">{errors.posisiTangkiSeptik}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="jarakTangkiSeptikDenganSumberAir">54. Jarak Tangki Septik Dengan Sumber Air</Label>
              <Input type="select" name="jarakTangkiSeptikDenganSumberAir" id="jarakTangkiSeptikDenganSumberAir" value={formData.jarakTangkiSeptikDenganSumberAir} onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="9">&lt; 10 meter</option>
                <option value="11">&gt; 10 meter</option>
              </Input>
              {errors.jarakTangkiSeptikDenganSumberAir && <div className="error-message">{errors.jarakTangkiSeptikDenganSumberAir}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="sumberAirMinum">55. Sumber Air Minum</Label>
              <Input type="select" name="sumberAirMinum" id="sumberAirMinum" value={formData.sumberAirMinum} onChange={handleChange}>
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
              <Input type="text" name="titikKoordinatRumah" id="titikKoordinatRumah" value={formData.titikKoordinatRumah || ""} onChange={handleChange} invalid={!!errors.titikKoordinatRumah} className="input-center" readOnly />
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
                value={formData.manualTitikKoordinatRumah || ""}
                onChange={handleChange}
                invalid={!!errors.manualTitikKoordinatRumah}
                className="input-center"
              />
            </FormGroup>

            <FormGroup>
              <Label for="tanggalPendataan">57. Tanggal Pendataan</Label>
              <Input type="date" name="tanggalPendataan" id="tanggalPendataan" value={formData.tanggalPendataan} onChange={handleChange} className="input-center" />
              {errors.tanggalPendataan && <div className="error-message">{errors.tanggalPendataan}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="namaSurveyor">58. Nama Surveyor</Label>
              <Input type="text" name="namaSurveyor" id="namaSurveyor" value={formData.namaSurveyor} readOnly />
              {errors.namaSurveyor && <div className="error-message">{errors.namaSurveyor}</div>}
            </FormGroup>

            {/* <FormGroup>
              <Label for="kategori">Kategori Rumah</Label>
              <Input type="text" name="kategori" id="kategori" value={formData.kategori} readOnly className="input-center" />
            </FormGroup> */}

            <FormGroup>
              <Label for="score">Skor</Label>
              <Input type="number" name="score" id="score" value={formData.score} readOnly className="input-center" />
            </FormGroup>

            <Button className="btn-primary" type="submit">
              Simpan
            </Button>

            <Button className="btn-secondary" type="button" onClick={() => navigate("/recap")} style={{ marginLeft: "10px" }}>
              Lihat Rekap
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{errorMessage ? "Error" : "Sukses"}</ModalHeader>
        <ModalBody>{errorMessage || successMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default QuestionnaireForm;
