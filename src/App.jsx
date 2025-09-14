import "./App.css";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Preferences from "./pages/Preferences.jsx";

import Dashboard from "./pages/Dashboard";
// import { Login } from "./pages/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IntegrationTabs from "./pages/IntegrationsTab";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path ="/preferences" element={<Preferences/>}/>
        <Route path ="/addhandle" element={<IntegrationTabs/>}/>
        {/* <Route path="/login" element={<Login />}/> */}
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}
