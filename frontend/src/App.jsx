import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import Home from "./pages/Home"
import Agendamento from './pages/Agendamento';
import Header from './components/Header/Header';

function App() {

  return (
    <React.Fragment>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/agendamento' element={<Agendamento />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  )
}

export default App
