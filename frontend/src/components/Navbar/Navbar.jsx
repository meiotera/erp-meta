import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LoginContext } from '../../Contexts/LoginContext';

import styles from './Navbar.module.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Ícones do menu

function Navbar() {
  const { isAuthenticated, logout } = useContext(LoginContext);
  const isUserAuthenticated = isAuthenticated();
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <button className={styles.menuIcon} onClick={toggleMenu}>
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>

        <ul
          className={`${styles.navbarNav} ${menuAberto ? styles.active : ''}`}
        >
          {isUserAuthenticated ? (
            <>
              <li className={styles.navItem}>
                <NavLink
                  to="/agenda"
                  className={styles.navLink}
                  onClick={fecharMenu}
                >
                  Agenda
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/historico"
                  className={styles.navLink}
                  onClick={fecharMenu}
                >
                  Histórico
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/configuracao"
                  className={styles.navLink}
                  onClick={fecharMenu}
                >
                  Painel
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <span
                  onClick={() => {
                    logout();
                    fecharMenu();
                  }}
                  className={styles.logoutButton}
                >
                  Sair
                </span>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <NavLink to="/" className={styles.navLink} onClick={fecharMenu}>
                  Home
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/agendamento"
                  className={styles.navLink}
                  onClick={fecharMenu}
                >
                  Agendamento
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.loginButton} ${styles.active}`
                      : styles.loginButton
                  }
                  onClick={fecharMenu}
                >
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
