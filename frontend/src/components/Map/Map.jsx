import style from './Map.module.css';

function Map() {
  return (
    <>
      <address className='d-flex flex-column flex-md-row justify-content-around'>
        <h6>Endereço:</h6>
        <p>Rua: Francisco Eudes, 26</p>
        <p>Bairro: Nova Betânea</p>
        <p>Cidade: Mossoró</p>
        <p>Localização: Shopping Pedro Frederico Mall</p>
      </address>
      <div className={`${style.mapContainer}`}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.3437666627652!2d-37.357155245692724!3d-5.183742023022708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ba06c1717a766b%3A0x33041bfd2423cd6a!2sR.%20Francisco%20Eudes%2C%2026%20-%20Nova%20Bet%C3%A2nia%2C%20Mossor%C3%B3%20-%20RN%2C%2059607-430!5e0!3m2!1spt-BR!2sbr!4v1739548761060!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}

export default Map;