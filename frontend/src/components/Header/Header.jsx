import logo from '../../assets/logo-oficial.png';
import Navbar from '../Navbar/Navbar';

function Header() {
  return (
    <header className="bg-white shadow-sm border-bottom border-primary py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <img
          src={logo}
          alt="logo-oficial-meta-saúde-integrada"
          className="img-fluid"
          style={{ maxHeight: '70px' }}
        />
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
