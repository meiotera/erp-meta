import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import { LoginContext } from '../../Contexts/LoginContext';
import Home from '../../pages/Home';
import Agendamento from '../../pages/Agendamento';
import Login from '../../pages/Login';
import { AgendaProvider } from '../../Contexts/AgendaContext';
import Agenda from '../../pages/Agenda';
import Consulta from '../../pages/Consulta';
import Historico from '../../pages/Historico';

const AppRoutes = () => {
  const { isAuthenticated } = useContext(LoginContext);

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route index element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      {/* Se não estiver autenticado pode acessar a página login */}
      <Route
        path="/login"
        element={!isAuthenticated() ? <Login /> : <Navigate to="/agenda" />}
      />

      {/* Rotas protegidas */}
      {isAuthenticated() && (
        <>
          <Route
            path="/agenda"
            element={
              <ProtectedRoute>
                <AgendaProvider>
                  <Agenda />
                </AgendaProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/historico"
            element={
              <ProtectedRoute>
                <AgendaProvider>
                  <Historico />
                </AgendaProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda/consulta"
            element={
              <ProtectedRoute>
                <AgendaProvider>
                  <Consulta />
                </AgendaProvider>
              </ProtectedRoute>
            }
          />
        </>
      )}
      {/* Redirecionamento padrão para usuários não autenticados */}
      {!isAuthenticated() && <Route path="*" element={<Login />} />}
    </Routes>
  );
};

export default AppRoutes;
