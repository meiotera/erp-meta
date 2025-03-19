import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '../../Contexts/LoginContext';

import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, logout } = useContext(LoginContext);
  const isUserAuthenticated = isAuthenticated(); // Evita chamadas desnecessárias

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarNav}>
        {/* Se o usuário estiver autenticado, mostra as rotas privadas */}
        {isUserAuthenticated ? (
          <>
            <li className={styles.navItem}>
              <NavLink to={'/agenda'} className={styles.navLink}>
                Agenda
              </NavLink>
            </li>

            {/* Botão de Logout */}
            <li className={styles.navItem}>
              <NavLink className={styles.navLink} onClick={logout}>
                Sair
              </NavLink>
            </li>
          </>
        ) : (
          /* Se o usuário NÃO estiver autenticado, mostra apenas Login */
          <>
            <li className={styles.navItem}>
              <NavLink to={'/'} className={styles.navLink}>
                Home
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'/agendamento'} className={styles.navLink}>
                Agendamento
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'/login'} className={styles.navLink}>
                Login
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
