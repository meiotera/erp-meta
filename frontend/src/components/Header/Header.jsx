import logo from '../../assets/logo-oficial.png';
import Navbar from '../Navbar/Navbar';

import styles from './Header.module.css';

function Header() {
  return (
    <header className={`bg-light py-3 ${styles.header} backgroundGlobal`} >
      <div className="container d-flex justify-content-center logo">
        <img src={logo} alt="logo-oficial-meta-saúde-integrada" className={`img-fluid ${styles.logo}`} />
      </div>
      <Navbar />
    </header>
  );
}

export default Header;