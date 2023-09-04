import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./UserLogin";
import UserRegistration from "./UserRegistration";
import FileUploader from "./FileUploader";

import "./styles/App.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route path="/FileUploader" element={<FileUploader />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
