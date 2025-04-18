import HeadingH2 from '../HeadingH2/HeadingH2';
import SocialLink from '../SocialLink/SocialLink';

import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <HeadingH2>Siga-nos nas redes sociais</HeadingH2>
      <div className={styles.footerContent}>
        <div className={styles.socialLinks}>
          <SocialLink />
        </div>
        <address className={styles.address}>
          <h6>Endereço:</h6>
          <p>Rua: Francisco Eudes, 26</p>
          <p>Bairro: Nova Betânea</p>
          <p>Cidade: Mossoró</p>
          <p>Localização: Shopping Pedro Frederico Mall</p>
        </address>
      </div>
    </footer>
  );
}

export default Footer;
