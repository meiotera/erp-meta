import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import Home from "./pages/Home"
import Agendamento from './pages/Agendamento';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { UsersProvider } from './Contexts/UsersContext';

function App() {
  return (
    <UsersProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/agendamento' element={<Agendamento />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </UsersProvider>

  )
}

export default App
