import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
// import Home from './pages/Home';
// import Agendamento from './pages/Agendamento';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
// import Login from './pages/Login';
// import Agenda from './pages/Agenda';
// import Consulta from './pages/Consulta';
// import Financeiro from './pages/Financeiro';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import { UsersProvider } from './Contexts/UsersContext';
import { LoginProvider } from './Contexts/LoginContext';
// import { AgendaProvider } from './Contexts/AgendaContext';
import AppRoutes from './components/AppRoutes/AppRoutes';

// function App() {
//   return (
//     <UsersProvider>
//       <BrowserRouter>
//         <LoginProvider>
//           <Header />
//           <Routes>
//             <Route index element={<Home />} />
//             <Route path="/agendamento" element={<Agendamento />} />
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/agenda"
//               element={
//                 <ProtectedRoute>
//                   <AgendaProvider>
//                     <Agenda />
//                   </AgendaProvider>
//                 </ProtectedRoute>
//               }
//             >
//               <Route
//                 path="consulta"
//                 element={
//                   <ProtectedRoute>
//                     <Consulta />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>
//           </Routes>
//           <Footer />
//         </LoginProvider>
//       </BrowserRouter>
//     </UsersProvider>
//   );
// }

function App() {
  return (
    <UsersProvider>
      <BrowserRouter>
        <LoginProvider>
          <Header />
          <AppRoutes />
          <Footer />
        </LoginProvider>
      </BrowserRouter>
    </UsersProvider>
  );
}

export default App;
