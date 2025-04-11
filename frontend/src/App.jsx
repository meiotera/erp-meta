import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { UsersProvider } from './Contexts/UsersContext';
import { LoginProvider } from './Contexts/LoginContext';
// import { AgendaProvider } from './Contexts/AgendaContext';
import AppRoutes from './components/AppRoutes/AppRoutes';
import SectionMain from './components/SectionMain/SectionMain';

function App() {
  return (
    <UsersProvider>
      <BrowserRouter>
        <LoginProvider>
          <Header />
          <SectionMain>
            <AppRoutes />
          </SectionMain>
          <Footer />
        </LoginProvider>
      </BrowserRouter>
    </UsersProvider>
  );
}

export default App;
