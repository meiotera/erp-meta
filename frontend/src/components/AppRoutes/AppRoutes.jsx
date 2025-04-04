import React, { useCallback, useContext, useState, useEffect } from 'react';
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
import Painel from '../../pages/Painel';
import Perfil from '../Perfil/Perfil';
import Usuarios from '../Usuarios/Usuarios';
import Relatorios from '../Relatorios/Relatorios';

const AppRoutes = () => {
  const { isAuthenticated, funcionario } = useContext(LoginContext);

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route index element={<Home />} />
      <Route path="/agendamento" element={<Agendamento />} />
      {/* Se não estiver autenticado pode acessar a página login */}
      <Route
        path="/login"
        element={!funcionario ? <Login /> : <Navigate to="/agenda" />}
      />

      {/* Rotas protegidas */}
      {funcionario && ( // Check if funcionario is not null
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
            path="/agenda/consulta"
            element={
              <ProtectedRoute>
                <AgendaProvider>
                  <Consulta />
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
            path="/configuracao"
            element={
              <ProtectedRoute>
                <AgendaProvider>
                  <Painel />
                </AgendaProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="perfil" replace />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
        </>
      )}
      {/* Redirecionamento padrão para usuários não autenticados */}
      {!funcionario && <Route path="*" element={<Login />} />}
    </Routes>
  );
};

export default AppRoutes;
