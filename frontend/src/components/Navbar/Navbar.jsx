import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LoginContext } from '../../Contexts/LoginContext';

import styles from './Navbar.module.css';

function Navbar() {
  const { isAuthenticated, logout } = useContext(LoginContext);
  const isUserAuthenticated = isAuthenticated(); // Evita chamadas desnecessárias

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <ul className={styles.navbarNav}>
          {isUserAuthenticated ? (
            <>
              <li className={styles.navItem}>
                <NavLink to="/agenda" className={styles.navLink}>
                  Agenda
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink to="/historico" className={styles.navLink}>
                  Histórico
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink onClick={logout} className={styles.logoutButton}>
                  Sair
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <NavLink to="/" className={styles.navLink}>
                  Home
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink to="/agendamento" className={styles.navLink}>
                  Agendamento
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink to="/login" className={styles.loginButton}>
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
