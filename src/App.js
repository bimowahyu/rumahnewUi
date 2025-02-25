import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./componen/Footer";
import Home from "./componen/Home";
import Login from "./componen/Login";
import DataRusun from "./componen/DataRusun";
import InformasiDasarHukum from "./componen/InformasiDasarHukum";
import Register from "./componen/Register";
import PetaPerumahan from "./componen/PetaPerumahan";

import { DataRecapPages } from "./pages/DataRecapPages";
import { QuestionnaireFormPages } from "./pages/QuestionnaireFormPages";
import { AdminDashboardPages } from "./pages/AdminDashboardPages";
import { SurveyorDashboardPages } from "./pages/SurveyorDashboardPages";
import { UploadFotoPages } from "./pages/UploadFotoPages";
import { UploadPdfPages } from "./pages/UploadPdfPages";
import { MapsPages } from "./pages/MapsPages";
import ResetPassword from "./componen/ResetPassword";
// import UserList from "./componen/UserList";
import { UserListPages } from "./pages/UserListPages";
import QuestionnaireForm from "./componen/QuestionnaireForm";

function App () {
return (
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/data-rusun" element={<DataRusun />} />
        <Route path="/peta-perumahan" element={<PetaPerumahan />} />
        <Route path="/informasi-dasar-hukum" element={<InformasiDasarHukum />} />

        <Route path="/admin/dashboard" element={<AdminDashboardPages />} />
        <Route path="/surveyor/dashboard" element={<SurveyorDashboardPages />} />
        <Route path="/questionnaire" element={<QuestionnaireForm />} />
        <Route path="/recap" element={<DataRecapPages />} />
        <Route path="/questionnaire/:id" element={<QuestionnaireFormPages />} />
        <Route path="/upload" element={<UploadFotoPages />} />
        <Route path="/uploadpdf" element={<UploadPdfPages />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/userlist" element={<UserListPages />}/>
        <Route path="/maps" element={<MapsPages />}/>
  </Routes>
  {/* <Footer /> */}
  <Routes>
    
  </Routes>
  </BrowserRouter>
)
}

export default App;