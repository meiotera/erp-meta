import styles from './Specialties.module.css';

function Specialties({ especialidade, icon }) {
  return (
    <div className={`p-2 m-1 ${styles.cardSpecialties}`}>
      <div className="card-body text-center">
        <i className={`${styles.bi} ${icon}`}></i>
        <h5 className="card-title">{especialidade}</h5>
      </div>
    </div>
  );
}

export default Specialties;
