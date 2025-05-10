import logo from '../../assets/logo-oficial.png';
import Navbar from '../Navbar/Navbar';

import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img
          src={logo}
          alt="logo-oficial-meta-saúde-integrada"
          className={styles.logo}
        />
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
