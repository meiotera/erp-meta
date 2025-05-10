import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import { UsersProvider, UsersContext } from './Contexts/UsersContext';
import { LoginProvider } from './Contexts/LoginContext';

import AppRoutes from './components/AppRoutes/AppRoutes';
import SectionMain from './components/SectionMain/SectionMain';
import Modal from './components/Modal/Modal';

function AppContent() {
  const { showSuccessModal, setShowSuccessModal, successModalMessage } =
    useContext(UsersContext);

  return (
    <BrowserRouter>
      <LoginProvider>
        <Header />
        <SectionMain>
          <AppRoutes />
        </SectionMain>
        <Footer />

        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: '#28a745', marginTop: '0' }}>Sucesso!</h2>
            <p>{successModalMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="btnSuccess"
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                marginTop: '15px',
              }}
            >
              OK
            </button>
          </div>
        </Modal>
      </LoginProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <UsersProvider>
      <AppContent />
    </UsersProvider>
  );
}

export default App;
